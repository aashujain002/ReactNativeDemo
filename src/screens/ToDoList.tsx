import { RootStackNavigationProp } from '../navigation/NavTypes';
import React, { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type Props = { navigation: RootStackNavigationProp<'ToDoList'> };

export default function ToDoList({ navigation }: Props) {

    const [todo, setTodo] = useState('');
    const [todos, setTodos] = useState<string[]>([]);

    const addTodo = () => {
        if (todo.trim() === '') return;
        setTodos([...todos, todo]);
        setTodo('');
    };

    const deleteTodo = (index: number) => {
        const updatedTodos = todos.filter((_, i) => i !== index);
        setTodos(updatedTodos);
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={todo}
                            onChangeText={setTodo}
                            placeholder="Enter a task"
                            style={styles.input}
                        />
                        <Button title="Add" onPress={addTodo} />
                    </View>

                    <FlatList
                        data={todos}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <View style={styles.todoItem}>
                                <Text style={styles.todoText}>{item}</Text>
                                <TouchableOpacity onPress={() => deleteTodo(index)}>
                                    <Text style={styles.deleteText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#4a4a4a',
    },
    textNav: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 50,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    input: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 10,
        marginRight: 8,
    },
    todoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        marginBottom: 8,
        backgroundColor: '#fff',
        borderRadius: 6,
        elevation: 1,
    },
    todoText: {
        fontSize: 16,
    },
    deleteText: {
        color: 'red',
        fontWeight: 'bold',
    },
});