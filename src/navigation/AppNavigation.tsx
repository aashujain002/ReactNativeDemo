import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { DarkModeToggle } from '../components/DarkModeToggle';
import FetchUserList from '../screens/FetchUserList';
import GridScreen from '../screens/GridScreen';
import Home from '../screens/Home';
import InputScreen from '../screens/InputScreen';
import ToDoList from '../screens/ToDoList';
import { MyDarkTheme, MyLightTheme } from '../style/theme';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  return (
    <NavigationContainer theme={isDarkMode ? MyDarkTheme : MyLightTheme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Details" component={InputScreen} />
        <Stack.Screen name="ToDoList" component={ToDoList} />
        <Stack.Screen name="Grid" component={GridScreen} />
        <Stack.Screen name="FetchUserList" component={FetchUserList} />
        <Stack.Screen name="ThemeToggle">
          {() => <DarkModeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}