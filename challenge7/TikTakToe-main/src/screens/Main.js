import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Portal, Dialog, Button as Bt, Chip, Appbar } from 'react-native-paper';
import Constants from 'expo-constants';
import GeneralOptionsContext from '../contexts/GeneralOptionsContext';

import firebase from '../db/Firebase';

const db = firebase.database();

const Main = ({ navigation }) => {
  const [name, setName] = useState('');
  const [nameVisible, setNameVisible] = useState(false);

  const { gameID, changeGameId, changePlayer } = useContext(
    GeneralOptionsContext
  );

  const handleCreateGame = () => {
    const id = db.ref('games/').push({
      board: ['', '', '', '', '', '', '', '', ''],
      currentUser: 'O',
      finished: false,
      gameName: name,
      full: false,
    }).key;

    setName('');
    changeGameId(id);
    navigation.push('Game');
    changePlayer('O');
  };

  const handleJoinGame = () => {
    navigation.push('JoinGame');
  };

  const showNameDialog = () => {
    setNameVisible(true);
  };
  const hideNameDialog = () => {
    setNameVisible(false);
  };

  return (
    <View style={styles.container}>
      <Appbar style={{ backgroundColor: '#2080e4' }}>
        <Text style={styles.settings}>TicTacToe Unal 2020-2</Text>
      </Appbar>
      <View style={styles.containerOptions}>
        <TouchableOpacity style={styles.option} onPress={showNameDialog}>
          <Chip
            icon="plus-circle"
            selected
            selectedColor="#2080e4"
            textStyle={{ fontSize: 20 }}
            style={styles.optionText}
          >
            NEW GAME!
          </Chip>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleJoinGame}>
          <Chip
            icon="chevron-right-circle"
            selected
            selectedColor="#2080e4"
            textStyle={{ fontSize: 20 }}
            style={styles.optionText}
          >
            JOIN TO A CREATED GAME!
          </Chip>
        </TouchableOpacity>
      </View>

      <Portal>
        <Dialog
          style={{ backgroundColor: '#2080e4' }}
          visible={nameVisible}
          onDismiss={hideNameDialog}
        >
          <Dialog.Title>TITLE OF GAME:</Dialog.Title>
          <Dialog.Content>
            <TextInput
              style={{
                fontSize: 30,
                backgroundColor: '#0bf',
                borderRadius: 10,
                padding: 5,
              }}
              value={name}
              onChange={(e) => setName(e.nativeEvent.text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Bt
              onPress={() => {
                handleCreateGame();
                hideNameDialog();
              }}
            >
              Create
            </Bt>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};
export default Main;

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    height: '100%',
  },
  containerOptions: {
    height: '80%',
    paddingHorizontal: '5%',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  audioOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  option: {
    height: '10%',
    paddingHorizontal: '5%',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  optionText: { fontSize: 27 },
  subOptionText: {
    color: 'grey',
  },
  settings: { fontSize: 25, paddingVertical: '5%' },
});
