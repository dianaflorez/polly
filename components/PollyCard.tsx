import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  Button,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import { Word } from '@/types/wordTypes';

type PollyCardProps = {
  id: string;
  spanish: string;
  english: string;
  description?: string;
  onLearned?: () => void;

  word: Word;
  onRemove?: () => void;
  mode: 'main' | 'explore';
};

export default function PollyCard({
  id,
  spanish,
  english,
  description,
  onLearned,
  mode,
  word,
  onRemove,
}: PollyCardProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const disappearAnim = useRef(new Animated.Value(1)).current;
  const [flipped, setFlipped] = useState(false);
  const [isGone, setIsGone] = useState(false);

  // console.log('\nPollyCard-------');
  // console.log('PollyCard', { id, spanish, english, description });
  // console.log('PollyCard', { flipped, isGone });
  // console.log('PollyCard', { rotateAnim, disappearAnim });
  // console.log('PollyCard', { onLearned });
  // console.log('PollyCard', { rotateAnim, disappearAnim });

  const flipCard = () => {
    Animated.spring(rotateAnim, {
      toValue: flipped ? 0 : 180,
      useNativeDriver: true,
    }).start(() => setFlipped(!flipped));
  };

  const frontInterpolate = rotateAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = rotateAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const handleLearned = async () => {
    if (!onLearned) return;

    // Esperar animación antes de desaparecer
    await new Promise(resolve => {
      Animated.timing(disappearAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        resolve(true);
      });
    });

    setIsGone(true);
    onLearned(); // Llamar callback cuando ya se haya animado
  };

  if (isGone) return null;

  return (
    <TouchableWithoutFeedback onPress={flipCard}>
      <Animated.View
        style={[
          styles.cardContainer,
          {
            opacity: disappearAnim,
            transform: [{ scale: disappearAnim }],
          },
        ]}>
        {/* Front */}
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ rotateY: frontInterpolate }],
              zIndex: flipped ? 0 : 1,
            },
          ]}>
          <Text style={styles.word}>{id} {spanish}</Text>
        </Animated.View>

        {/* Back */}
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            {
              transform: [{ rotateY: backInterpolate }],
              zIndex: flipped ? 1 : 0,
            },
          ]}>
          <Text style={styles.word}>{id} { english}</Text>
          {description && <Text style={styles.desc}>{description}</Text>}

          {onLearned && (
            <Pressable style={styles.learnedButton} onPress={handleLearned}>
              <Text style={styles.buttonText}>Aprendida</Text>
            </Pressable>
          )}
          {mode === 'main' && (
            <Button title="Aprendida" onPress={handleLearned} />
          )}

          {mode === 'explore' && (
            // <Button title="Quitar" onPress={onRemove} />
            // <Pressable style={styles.removeButton} onPress={onRemove}>
            //   <Text style={styles.buttonText}>Quitar</Text>
            // </Pressable>
            <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={onRemove}>
              <Text style={styles.buttonText}>Quitar</Text>
            </Pressable>
          )}
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: 170,
    marginVertical: 12,
    marginBottom: 28,

  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    padding: 18,
    elevation: 4,
    marginBottom: 128,
  },
  cardBack: {
    backgroundColor: '#cde',
  },
  word: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  learnedButton: {
    position: 'absolute',
    bottom: -30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#28a745',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    bottom: -30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'pink',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    // fontWeight: 'bold',
    fontWeight: '600',
    fontSize: 16,
  },
  button: {
    backgroundColor: 'red',
    backgroundImage: 'linear-gradient(to right,rgb(195, 65, 65),rgb(50, 10, 10))', // solo si usas `react-native-linear-gradient`
    borderRadius: 11,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -30,
  },
  pressed: {
    opacity: 0.75,
  },
});
