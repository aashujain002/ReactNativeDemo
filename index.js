import { AppRegistry } from 'react-native';
import AppNavigation from './src/navigation/AppNavigation'; // or wherever your main App component is
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => AppNavigation);