import React, { useState, useContext } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Button as PrimitiveButton,
} from 'react-native';
import {
  Provider,
  Button,
  Paragraph,
  Dialog,
  Card,
  TextInput,
} from 'react-native-paper';

import TicContext from '../context/TicContext';

const OptionsScreen = ({ navigation }) => {
  const {
    soundActive,
    victoryMessage,
    playerType,
    setSoundActive,
    setVictoryMessage,
    setPlayerType,
  } = useContext(TicContext);

  const handleSinglePlayerButton = () => {
    setPlayerType('single');
  };

  const handleMultiPlayerButton = () => {
    setPlayerType('multi');
  };

  return (
    <Provider>
      <View style={{ flexDirection: 'column' }}>
        <Card style={{ height: '92%' }}>
          <Dialog visible>
            <Dialog.Title>Select Play Mode</Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                Select single player to play against the machine, and
                multiplayer to play with someone besides you!
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Button
                onPress={() => setPlayerType('single')}
                style={playerType === 'single' ? styles.activePlayerButton : {}}
              >
                Single Player
              </Button>
              <Button
                onPress={() => setPlayerType('multi')}
                style={playerType === 'multi' ? styles.activePlayerButton : {}}
              >
                Multi Player
              </Button>
              <Text />
              <Button
                onPress={() => setSoundActive(!soundActive)}
                style={soundActive ? styles.activeSoundButton : {}}
              >
                Sound Active
              </Button>
              <Text />
              <TextInput
                label="Winning Message"
                value={victoryMessage}
                onChangeText={(text) => setVictoryMessage(text)}
                style={{ maxHeight: 100, width: 250 }}
              />
            </Dialog.Actions>
          </Dialog>
        </Card>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{
            height: '8%',
            alignItems: 'center',
            paddingTop: 10,
            backgroundColor: '#2080e4',
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 20,
            }}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  activePlayerButton: {
    backgroundColor: '#2080e4',
    width: 200,
  },
  activeSoundButton: {
    backgroundColor: '#aa4',
    width: 200,
  },
});

export default OptionsScreen;
