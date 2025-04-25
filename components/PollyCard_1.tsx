// PollyCard.tsx
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';

export default function PollyCard({ spanish, english, description, image, onLearned }) {
  return (
    <View style={styles.card}>
      <Text style={styles.word}>{english}</Text>
      <Text style={styles.translation}>{spanish}</Text>
      <Text style={styles.description}>{description}</Text>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : null}
      <Pressable style={styles.button} onPress={onLearned}>
        <Text style={styles.buttonText}>Aprendida</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    marginBottom: 8,
  },
  word: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  translation: {
    fontSize: 18,
    color: '#444',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  image: {
    width: '100%',
    height: 120,
    marginTop: 10,
    borderRadius: 8,
  },
  button: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
