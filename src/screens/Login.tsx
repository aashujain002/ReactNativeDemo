import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { RootStackNavigationProp } from '../navigation/NavTypes';

type Props = { navigation: RootStackNavigationProp<'Login'> };

const Login: React.FC<Props> = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('eve.holt@reqres.in');
    const [password, setPassword] = useState('cityslicka');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async () => {
        setLoading(true);
        setError('');
        const ok = await login(email.trim(), password);
        if (!ok) setError('Invalid credentials');
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
            />
            <View style={styles.passwordWrapper}>
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    style={[styles.input, { marginBottom: 0, flex: 1, paddingRight: 46 }]}
                />
                <TouchableOpacity
                    accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(prev => !prev)}
                >
                    <Icon name={showPassword ? 'eye-off' : 'eye'} size={22} color="#bbb" />
                </TouchableOpacity>
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
            </TouchableOpacity>
            <Text style={styles.hint}>Use reqres.in test credentials above.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#1c1c1e' },
    title: { fontSize: 28, fontWeight: '700', color: 'white', marginBottom: 32, textAlign: 'center' },
    input: { backgroundColor: '#2c2c2e', color: 'white', padding: 14, borderRadius: 8, marginBottom: 16 },
    passwordWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2c2c2e', borderRadius: 8, marginBottom: 16 },
    eyeButton: { position: 'absolute', right: 12, padding: 8 },
    button: { backgroundColor: '#3478f6', padding: 16, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
    error: { color: 'tomato', marginBottom: 12 },
    hint: { color: '#999', marginTop: 24, textAlign: 'center', fontSize: 12 }
});

export default Login;