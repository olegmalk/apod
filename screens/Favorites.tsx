import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFavorites } from '../context/favorites';
import ApodCard from '../components/card';
import { Apod } from '../types/apod';

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();

  const renderApodCard = ({ item }: { item: Apod }) => {
    return (
      <ApodCard
        apod={item}
        isFavorite={!!favorites.find(f => f.date === item.date)}
        onHeartPress={() => {
          removeFavorite(item.date);
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.date}
          renderItem={renderApodCard}
        />
      ) : (
        <Text style={styles.noFavoritesText}>You have no favorites yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  noFavoritesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
