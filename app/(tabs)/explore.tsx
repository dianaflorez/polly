import { useEffect, useState } from 'react';
import { StyleSheet, Button, Image, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PollyCard from '@/components/PollyCard';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Word } from '@/types/wordTypes'; // Ajusta la ruta según tu estructura
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function ExploreScreen() {
  const [learnedWords, setLearnedWords] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchLearnedWords = async () => {
        const stored = await AsyncStorage.getItem('learnedWords');
        if (stored) {
          const parsed: Word[] = JSON.parse(stored);
          // Mostrar del más nuevo al más antiguo
          // setLearnedWords(parsed.reverse());
          setLearnedWords(parsed);
        }
      };
      fetchLearnedWords();
    }, [])
  );
  

  // const removeWord = async (wordToRemove: Word) => {
  //   const updated = learnedWords.filter(w => w.id !== wordToRemove.id);
  //   await AsyncStorage.setItem('learnedWords', JSON.stringify(updated));
  //   setLearnedWords(updated);
  // };

  const removeWord = async (wordToRemove: Word) => {
    const updated = learnedWords.filter(w => w.id !== wordToRemove.id);
    await AsyncStorage.setItem('learnedWords', JSON.stringify(updated));
    setLearnedWords([...updated].reverse());
  };
  

  const clearLearnedWords = async () => {
    await AsyncStorage.removeItem('learnedWords');
    setLearnedWords([]); // o como se llame tu estado
  };
  

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#ACE', dark: '#234' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explorar Aprendidas</ThemedText>
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <Button title="Vaciar palabras aprendidas" onPress={clearLearnedWords} />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        
        {learnedWords.length === 0 ? (
          <Text style={styles.empty}>No has aprendido palabras aún.</Text>
        ) : (
          learnedWords.map(word => (
            <PollyCard
              key={word.id}
              id={word.id}
              spanish={word.translation}
              english={word.name}
              word={word}
  
              onRemove={() => removeWord(word)}
              mode="explore"
            />
          ))
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 78,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  clearButton: {
    backgroundColor: '#cc0000',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  clearText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  empty: {
    marginTop: 40,
    fontSize: 16,
    color: '#777',
  },
});
