import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Text, RefreshControl, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewsArticleCard from '../components/NewsArticleCard';
import { RootStackNavigationProp } from '../navigation/NavTypes';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const API_KEY = 'd07ef6479655452182d6408f51f4e122'; // Replace with your NewsAPI key
const PAGE_SIZE = 10;
const CACHE_KEY = 'cached_articles';
const CACHE_TIME_KEY = 'cached_articles_time';
const CACHE_TTL = 60 * 5; // 5 minutes

type Props = { navigation: RootStackNavigationProp<'NewsReader'> };

const NewsReader: React.FC<Props> = ({ navigation }) => {
    const [articles, setArticles] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [hasMore, setHasMore] = useState(true);

    // Load cached articles on mount
    useEffect(() => {
        const loadCache = async () => {
            try {
                const cached = await AsyncStorage.getItem(CACHE_KEY);
                const cachedTime = await AsyncStorage.getItem(CACHE_TIME_KEY);
                if (cached && cachedTime) {
                    const now = Math.floor(Date.now() / 1000);
                    if (now - parseInt(cachedTime) < CACHE_TTL) {
                        setArticles(JSON.parse(cached));
                        setHasMore(true);
                        return;
                    }
                }
                fetchArticles(1, true);
            } catch (e) {
                fetchArticles(1, true);
            }
        };
        loadCache();
    }, []);

    // Fetch articles from API
    const fetchArticles = async (pageNum: number, overwrite = false) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`https://newsapi.org/v2/top-headlines?country=us&pageSize=${PAGE_SIZE}&page=${pageNum}&apiKey=${API_KEY}`);
            const data = await res.json();
            if (data.status !== 'ok') throw new Error(data.message || 'Failed to fetch');
            const newArticles = overwrite ? data.articles : [...articles, ...data.articles];
            setArticles(newArticles);
            setHasMore(data.articles.length === PAGE_SIZE);
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(newArticles));
            await AsyncStorage.setItem(CACHE_TIME_KEY, Math.floor(Date.now() / 1000).toString());
        } catch (e: any) {
            setError(e.message || 'Error fetching articles');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Pagination: load more
    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchArticles(nextPage);
        }
    };

    // Pull-to-refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setPage(1);
        fetchArticles(1, true);
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    {loading && articles.length === 0 ? (
                        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 40 }} />
                    ) : error ? (
                        <Text style={styles.error}>{error}</Text>
                    ) : (
                        <FlatList
                            data={articles}
                            keyExtractor={(item, idx) => item.url + idx}
                            renderItem={({ item }) => (
                                <NewsArticleCard
                                    title={item.title}
                                    description={item.description}
                                    urlToImage={item.urlToImage}
                                    publishedAt={item.publishedAt}
                                />
                            )}
                            onEndReached={loadMore}
                            onEndReachedThreshold={0.5}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                            ListFooterComponent={loading && articles.length > 0 ? <ActivityIndicator size="small" color="#007bff" /> : null}
                        />
                    )}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
});

export default NewsReader;
