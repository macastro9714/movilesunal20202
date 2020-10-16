import React from 'react';
import {
  createNavigationContainer,
  NavigationContainer,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import timer from './timer';
import { GeneralOptionsProvider } from './src/contexts/GeneralOptionsContext';

import Main from './src/screens/Main';
import JoinGame from './src/screens/JoinGame';
import Game from './src/screens/Game';
import Settings from './src/screens/Settings';

const Stack = createStackNavigator();

console.ignoredYellowBox = ['Setting a timer'];

export default function App() {
  return (
    <PaperProvider>
      <GeneralOptionsProvider>
        <NavigationContainer>
          <Stack.Navigator
            inittialRoute='Main'
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name='Main' component={Main} />
            <Stack.Screen name='JoinGame' component={JoinGame} />
            <Stack.Screen name='Game' component={Game} />
            <Stack.Screen name='Settings' component={Settings} />
          </Stack.Navigator>
        </NavigationContainer>
      </GeneralOptionsProvider>
    </PaperProvider>
  );
}
