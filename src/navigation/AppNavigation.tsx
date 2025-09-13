import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './NavTypes';
import * as React from 'react';
import { DarkModeToggle } from '../components/DarkModeToggle';
import { Button } from 'react-native';
import FetchUserList from '../screens/FetchUserList';
import GridScreen from '../screens/GridScreen';
import Home from '../screens/Home';
import InputScreen from '../screens/InputScreen';
import NewsReader from '../screens/NewsReader';
import WeatherDashboard from '../screens/WeatherDashboard';
import ProductList from '../screens/ProductList';
import ProductCategorySelect from '../screens/ProductCategorySelect';
import ExpenseTracker from '../screens/ExpenseTracker';
import ToDoList from '../screens/ToDoList';
import { MyDarkTheme, MyLightTheme } from '../style/theme';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Login from '../screens/Login';

const Stack = createNativeStackNavigator<RootStackParamList>();

function InnerNavigator() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const { token, loading } = useAuth();
  if (loading) return null;
  return (
    <NavigationContainer theme={isDarkMode ? MyDarkTheme : MyLightTheme}>
      <Stack.Navigator>
        {!token ? (
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Home" component={Home} options={{
              headerRight: () => {
                const { logout } = useAuth();
                return <Button title="Logout" onPress={logout} />;
              }
            }} />
            <Stack.Screen name="Details" component={InputScreen} />
            <Stack.Screen name="NewsReader" component={NewsReader} />
            <Stack.Screen name="Weather" component={WeatherDashboard} />
            <Stack.Screen name="ProductList" component={ProductList} />
            <Stack.Screen name="ProductCategorySelect" component={ProductCategorySelect} options={{ title: 'Categories' }} />
            <Stack.Screen name="ExpenseTracker" component={ExpenseTracker} options={{ title: 'Expenses' }} />
            <Stack.Screen name="ToDoList" component={ToDoList} />
            <Stack.Screen name="Grid" component={GridScreen} />
            <Stack.Screen name="FetchUserList" component={FetchUserList} />
            <Stack.Screen name="ThemeToggle">
              {() => <DarkModeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function AppNavigation() {
  return (
    <AuthProvider>
      <InnerNavigator />
    </AuthProvider>
  );
}