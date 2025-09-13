import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ProductCard from '../components/ProductCard';
import { RootStackNavigationProp } from '../navigation/NavTypes';
import { useFocusEffect, useRoute } from '@react-navigation/native';
type Props = { navigation: RootStackNavigationProp<'ProductList'> };

interface Product { id: number; title: string; price: number; thumbnail: string; category: string; }

const PAGE_SIZE = 20;

const ProductList: React.FC<Props> = ({ navigation }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [hasMore, setHasMore] = useState(true);
    const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

    const buildUrl = (nextPage: number, activeSearch: string, activeCategory: string) => {
        const skip = nextPage * PAGE_SIZE;
        if (activeCategory) {
            return `https://dummyjson.com/products/category/${encodeURIComponent(activeCategory)}?limit=${PAGE_SIZE}&skip=${skip}`;
        }
        if (activeSearch) {
            return `https://dummyjson.com/products/search?q=${encodeURIComponent(activeSearch)}&limit=${PAGE_SIZE}&skip=${skip}`;
        }
        return `https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${skip}`;
    };

    const fetchPage = async (nextPage: number, overwrite = false, activeSearch = search, activeCategory = selectedCategory) => {
        if (loading) return;
        setLoading(true);
        setError('');
        try {
            const url = buildUrl(nextPage, activeSearch, activeCategory);
            const res = await fetch(url);
            const json = await res.json();
            const newItems: Product[] = json.products || [];
            const skip = nextPage * PAGE_SIZE;
            setHasMore(skip + newItems.length < (json.total ?? 0));
            setProducts(prev => overwrite ? newItems : [...prev, ...newItems]);
            setPage(nextPage);
        } catch (e: any) {
            setError(e.message || 'Failed to load products');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // initial load
    useEffect(() => {
        fetchPage(0, true);
    }, []);

    // Mutually exclusive: when search changes, clear category and hit search endpoint (debounced)
    useEffect(() => {
    if (selectedCategory) return;
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => {
            fetchPage(0, true, search, '');
        }, 400);
        return () => {
            if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        };
    }, [search, selectedCategory]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPage(0, true);
    };

    const onEndReached = () => {
        if (hasMore && !loading) fetchPage(page + 1);
    };

    const onSearchChange = (text: string) => {
        
        if (selectedCategory) setSelectedCategory('');
        setSearch(text);
    };

    const onOpenCategorySelect = () => {
        navigation.navigate('ProductCategorySelect', {
            onSelect: (cat: string) => {
                
                setSearch('');
                setSelectedCategory(cat);
                
                fetchPage(0, true, '', cat);
                navigation.goBack();
            }
        } as any);
    };

    const keyExtractor = (item: Product) => String(item.id);

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search products..."
                placeholderTextColor="#999"
                value={search}
                onChangeText={onSearchChange}
                style={styles.search}
                autoCorrect={false}
            />
            <View style={styles.filterBar}>
                {selectedCategory ? (
                    <TouchableOpacity style={styles.selectedBadge} onPress={() => { setSelectedCategory(''); fetchPage(0, true, search, ''); }}>
                        <Text style={styles.selectedBadgeText}>{selectedCategory}</Text>
                        <Icon name="close" size={14} color="#fff" />
                    </TouchableOpacity>
                ) : <Text style={styles.placeholderFilter}>All Categories</Text>}
                <TouchableOpacity onPress={onOpenCategorySelect} style={styles.filterButton}>
                    <Icon name="filter" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {loading && products.length === 0 ? (
                <View style={{ flex:1, alignItems:'center', justifyContent:'center', marginTop:40 }}>
                    <ActivityIndicator />
                </View>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={keyExtractor}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    renderItem={({ item }) => (
                        <ProductCard title={item.title} price={item.price} thumbnail={item.thumbnail} />
                    )}
                    contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 4 }}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.4}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    ListFooterComponent={loading && products.length > 0 ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null}
                    initialNumToRender={10}
                    windowSize={10}
                    removeClippedSubviews
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121821', paddingTop: 12 },
    search: { backgroundColor: '#1f2530', color: 'white', marginHorizontal: 12, borderRadius: 10, padding: 12, marginBottom: 10 },
    row: { justifyContent: 'space-between', paddingHorizontal: 4 },
    filterBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 12, marginBottom: 8 },
    filterButton: { backgroundColor: '#3478f6', padding: 10, borderRadius: 10 },
    placeholderFilter: { color: '#bfc8d6', fontSize: 12, textTransform: 'capitalize' },
    selectedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#3478f6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
    selectedBadgeText: { color: 'white', fontSize: 12, textTransform: 'capitalize', marginRight: 4 },
    error: { color: 'tomato', textAlign: 'center', marginVertical: 8 }
});

export default ProductList;