import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  ListRenderItem,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { words } from '@/data/words';

import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import PollyCard from '@/components/PollyCard';

type Word = {
  id: string;
  name: string;
  translation: string;
  description: string;
  image: string;
};

const LEVEL_SIZE = 5;

export default function HomeScreen() {
  const [visibleWords, setVisibleWords] = useState<Word[]>([]);
  const [learnedWords, setLearnedWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const loadState = async () => {
        const stored = await AsyncStorage.getItem('learnedWords');
        const learned = stored ? JSON.parse(stored) : [];

        setLearnedWords(learned);
        const filteredWords = words.filter(
          (word) => !learned.find((w) => w.id === word.id)
        );

        setVisibleWords(filteredWords.slice(0, LEVEL_SIZE));
        setCurrentIndex(LEVEL_SIZE);
      };

      loadState();
    }, [])
  );

  const loadMoreWords = () => {
    const nextBatch = words
      .filter((word) => !learnedWords.find((w) => w.id === word.id))
      .slice(currentIndex, currentIndex + LEVEL_SIZE);

    setVisibleWords((prev) => [...prev, ...nextBatch]);
    setCurrentIndex((prev) => prev + LEVEL_SIZE);
  };

  const markAsLearned = async (id: string) => {
    const word = visibleWords.find((w) => w.id === id);
    if (!word) return;

    const updatedLearned = [...learnedWords, word];
    await AsyncStorage.setItem('learnedWords', JSON.stringify(updatedLearned));
    setLearnedWords(updatedLearned);
    setVisibleWords((prev) => prev.filter((w) => w.id !== id));
  };

  const renderItem: ListRenderItem<Word> = ({ item }) => (
    <PollyCard
      key={item.id}
      id={item.id}
      spanish={item.translation}
      english={item.name}
      description={item.description}
      onLearned={() => markAsLearned(item.id)}
    />
  );

  return (
    <FlatList
      data={visibleWords}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      onEndReached={loadMoreWords}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={
        <>
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Palabras por aprender</ThemedText>
            <HelloWave />
          </ThemedView>
        </>
      }
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 16,
  },
  reactLogo: {
    height: 78,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'relative',
    marginVertical: 10,
    alignSelf: 'center',
  },
  listContent: {
    padding: 16,
  },
});
