import React, { useState, memo } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

// ✅ Child component wrapped with React.memo
const MemoizedChild = memo(({ text }: { text: string }) => {
    console.log('Child re-rendered'); // Helps verify if re-rendered
    return (
        <View style={styles.child}>
            <Text style={styles.childText}>Child Component Text: {text}</Text>
        </View>
    );
});

export const MemoizedComponent = () => {
    const [count, setCount] = useState(0);
    const [text, setText] = useState('');

    const increment = () => setCount((prev) => prev + 1);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Memoized Component Example</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Counter:</Text>
                <Text style={styles.value}>{count}</Text>
                <Button title="Increment" onPress={increment} />
            </View>

            <TextInput
                style={styles.input}
                placeholder="Enter text"
                value={text}
                onChangeText={setText}
            />

            {/* Passing only 'text' as prop */}
            <MemoizedChild text={text} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 3,
        margin: 10,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10,
    },
    label: {
        fontSize: 16,
    },
    value: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 6,
        padding: 10,
        marginBottom: 20,
    },
    child: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
    },
    childText: {
        fontSize: 16,
    },
});