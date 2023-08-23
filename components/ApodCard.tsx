import React from 'react';
import { View, Text, Image } from 'react-native';

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
    <View>
      <Text>{date}</Text>
      <Text>{title}</Text>
      <Image source={{ uri: url }} style={{ width: '100%', height: 200 }} />
      <Text>{explanation}</Text>
      <Text>{isFavorite ? 'Favorite' : 'Not Favorite'}</Text>
    </View>
  );
}