import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export interface ApodCardProps {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl: string;
  isFavorite: boolean;
}

export default function ApodCard({ date, title, explanation, url, hdurl, isFavorite }: ApodCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: url }} style={styles.image} />
      <Text style={styles.explanation}>{explanation}</Text>
      <Text style={styles.favorite}>{isFavorite ? 'Favorite' : 'Not Favorite'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  title: {
    fontSize: 55,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  explanation: {
    fontSize: 16,
    marginBottom: 10,
  },
  favorite: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
