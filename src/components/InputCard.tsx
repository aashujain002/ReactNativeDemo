import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
} from 'react-native';

const InputCard = () => {
    const [name, setName] = useState('');
    const [submittedName, setSubmittedName] = useState('');

    const handleSubmit = () => {
        setSubmittedName(name.trim());
    };

    return (
        <View style={styles.card}>
            <Text style={styles.label}>Enter your name:</Text>
            <TextInput
                style={styles.input}
                placeholder="Your name"
                value={name}
                onChangeText={setName}
            />

            <Button title="Submit" onPress={handleSubmit} />

            {submittedName ? (
                <Text style={styles.greeting}>Hello, {submittedName}!</Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '94%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        margin: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderColor: '#aaa',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
        fontSize: 16,
    },
    greeting: {
        fontSize: 20,
        marginTop: 20,
        color: 'green',
        fontWeight: 'bold',
    },
});

export default InputCard;