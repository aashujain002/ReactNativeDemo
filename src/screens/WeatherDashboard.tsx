import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, PermissionsAndroid, Platform, RefreshControl, ScrollView } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackNavigationProp } from '../navigation/NavTypes';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';

type Props = { navigation: RootStackNavigationProp<'Weather'> };

const OPEN_WEATHER_KEY = 'a9d933f236fbff597a472d636478f953'; // <-- replace with key
const CACHE_KEY = 'weather_cache_v1';
const CACHE_TIME_KEY = 'weather_cache_time_v1';
const CACHE_TTL = 60 * 15; // 15 minutes seconds

interface WeatherData {
    name: string;
    weather: { description: string; icon: string }[];
    main: { temp: number; humidity: number };
}

const SkeletonRow = () => (
    <View style={styles.skeletonRow}>
        <View style={styles.skeletonBlock} />
    </View>
);

const WeatherDashboard: React.FC<Props> = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const requestPermission = async () => {
        try {
            const result = await request(
                Platform.select({
                    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                    default: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                })
            );

            if (result === RESULTS.GRANTED) {
                console.log('Location permission granted');
                return true;
            } else {
                console.log('Location permission denied:', result);
                return false;
            }
        } catch (error) {
            console.warn('Permission error:', error);
            return false;
        }
    };

    const fetchWeather = async (force = false) => {
        setError('');
        try {
            // Check cache if not forcing
            if (!force) {
                const cached = await AsyncStorage.getItem(CACHE_KEY);
                const cachedTime = await AsyncStorage.getItem(CACHE_TIME_KEY);
                if (cached && cachedTime) {
                    const now = Math.floor(Date.now() / 1000);
                    if (now - parseInt(cachedTime, 10) < CACHE_TTL) {
                        setWeather(JSON.parse(cached));
                        setLoading(false);
                        return;
                    }
                }
            }

            const hasPerm = await requestPermission();
            if (!hasPerm) {
                throw new Error('Location permission denied');
            }

            // Get location
            const position = await new Promise<{ coords: { latitude: number; longitude: number } }>((resolve, reject) => {
                Geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
            });

            const { latitude, longitude } = position.coords;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPEN_WEATHER_KEY}`;
            const res = await fetch(url);
            const data: WeatherData | any = await res.json();
            if (data.cod && data.cod !== 200) throw new Error(data.message || 'Failed to fetch weather');
            setWeather(data);
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
            await AsyncStorage.setItem(CACHE_TIME_KEY, Math.floor(Date.now() / 1000).toString());
        } catch (e: any) {
            setError(e.message || 'Error fetching weather');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchWeather(true);
    }, []);

    const renderSkeleton = () => (
        <View style={{ padding: 20 }}>
            {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonRow key={i} />
            ))}
        </View>
    );

    return (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {loading && !weather ? (
                renderSkeleton()
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : weather ? (
                <View style={styles.content}>
                    <Text style={styles.city}>{weather.name}</Text>
                    <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
                    <Text style={styles.desc}>{weather.weather[0].description}</Text>
                    <Text style={styles.humidity}>Humidity: {weather.main.humidity}%</Text>
                    <Text style={styles.updated}>Updated: {new Date().toLocaleTimeString()}</Text>
                </View>
            ) : null}
            {loading && weather && <ActivityIndicator style={{ marginTop: 12 }} />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121826' },
    content: { alignItems: 'center', padding: 30 },
    city: { fontSize: 26, fontWeight: '600', color: 'white', marginBottom: 8 },
    temp: { fontSize: 56, fontWeight: '700', color: 'white' },
    desc: { fontSize: 18, textTransform: 'capitalize', color: '#9fb3c8', marginVertical: 8 },
    humidity: { fontSize: 16, color: '#9fb3c8', marginTop: 4 },
    updated: { fontSize: 12, color: '#5f6b7a', marginTop: 20 },
    error: { color: 'tomato', textAlign: 'center', marginTop: 60, fontSize: 16 },
    skeletonRow: { marginBottom: 18 },
    skeletonBlock: { height: 28, backgroundColor: '#2a3240', borderRadius: 8, opacity: 0.6 },
});

export default WeatherDashboard;