import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RootStackNavigationProp } from '../navigation/NavTypes';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavTypes';

type Props = { navigation: RootStackNavigationProp<'ProductCategorySelect'> };

const ProductCategorySelect: React.FC<Props> = ({ navigation }) => {
  const route = useRoute<RouteProp<RootStackParamList, 'ProductCategorySelect'>>();
  const callback = route.params?.onSelect;
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('https://dummyjson.com/products/category-list');
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSelect = (cat: string) => {
    if (callback) {
      callback(cat);
    } else {
      navigation.navigate('ProductList', { selected: cat } as any);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (error) return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={c => c}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => onSelect(item)}>
            <Text style={styles.text}>{item}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121821', paddingVertical: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121821' },
  error: { color: 'tomato' },
  item: { paddingVertical: 14, paddingHorizontal: 20 },
  text: { color: 'white', fontSize: 15, textTransform: 'capitalize' },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: '#2a313d', marginHorizontal: 20 }
});

export default ProductCategorySelect;