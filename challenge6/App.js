import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { TicProvider } from './context/TicContext';

import HomeScreen from './screens/HomeScreen';
import OptionsScreen from './screens/OptionsScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <TicProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Options" component={OptionsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TicProvider>
  );
}

export default App;
