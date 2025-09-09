import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface NewsArticleCardProps {
  title: string;
  description: string;
  urlToImage?: string;
  publishedAt: string;
}

const NewsArticleCard: React.FC<NewsArticleCardProps> = ({ title, description, urlToImage, publishedAt }) => (
  <View style={styles.card}>
    {urlToImage ? (
      <Image source={{ uri: urlToImage }} style={styles.image} />
    ) : null}
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.date}>{new Date(publishedAt).toLocaleString()}</Text>
    <Text style={styles.description}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: '#333',
  },
});

export default NewsArticleCard;
