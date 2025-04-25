import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Image, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { words } from '@/data/words';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
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
  const [currentLevel, setCurrentLevel] = useState(0);
  const [visibleWords, setVisibleWords] = useState<Word[]>([]);
  const [allLearnedWords, setAllLearnedWords] = useState<Word[]>([]);
  
  // 🔁 Cargar datos al iniciar
  useFocusEffect(
    useCallback(() => {
      const loadState = async () => {
        const storedLearned = await AsyncStorage.getItem('learnedWords');
        const learned = storedLearned ? JSON.parse(storedLearned) : [];
  
        console.log('Palabras aprendidas: \n', learned);
  
        const level = Math.floor(learned.length / LEVEL_SIZE);
        setCurrentLevel(level);
        setAllLearnedWords(learned);
  
        const start = level * LEVEL_SIZE;
        const end = start + LEVEL_SIZE;
  
        const currentLevelWords = words
          .slice(start, end)
          .filter(
            (word) => !learned.find((w) => w.id === word.id)
          )
          .slice(0, LEVEL_SIZE);
          console.log('>>>>>>>\nPalabras to show:', currentLevelWords);
  
        setVisibleWords(currentLevelWords);
      };
  
      loadState();
    }, [])
  );
  

  // ✅ Marcar palabra como aprendida
  const markAsLearned = async (index: number) => {

    const word = visibleWords[index];
    console.log('Palabra aprendidaaaaaaa CLICK:', word);
    const updatedLearned = [...allLearnedWords, word];
    await AsyncStorage.setItem('learnedWords', JSON.stringify(updatedLearned));
    setAllLearnedWords(updatedLearned);

    const newWords = [...visibleWords];
    newWords.splice(index, 1);

    // Si quedan más palabras en el nivel actual
    const levelStart = currentLevel * LEVEL_SIZE;
    const levelEnd = levelStart + LEVEL_SIZE;

    const remaining = words.slice(levelStart, levelEnd).filter(
      (w) => !updatedLearned.find((lw) => lw.id === w.id)
    );
    

    if (remaining.length > 0) {
      const next = remaining[0];
      const alreadyVisible = newWords.find(w => w.id === next.id);
      if (!alreadyVisible) {
        newWords.push(next);
      }
      setVisibleWords(newWords);

    } else {
      // ✅ Pasar al siguiente nivel
      const nextLevel = currentLevel + 1;
      setCurrentLevel(nextLevel);

      const start = nextLevel * LEVEL_SIZE;
      const end = start + LEVEL_SIZE;
      const nextLevelWords = words.slice(start, end).slice(0, LEVEL_SIZE);

      setVisibleWords(nextLevelWords);
    }

  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Nivel {currentLevel}</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        {visibleWords.map((word, index) => (
          <PollyCard
            key={word.id}
            id={word.id}
            spanish={word.translation}
            english={word.name}
            description={word.description}
            //image={word.image}
            onLearned={() => markAsLearned(index)}
          />
        ))}
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
});
