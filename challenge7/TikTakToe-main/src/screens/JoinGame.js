import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';

import firebase from '../db/Firebase';
import GeneralOptionsContext from '../contexts/GeneralOptionsContext';

const db = firebase.database();

const JoinGame = ({ navigation }) => {
  const [games, setGames] = useState([]);

  const { gameID, changeGameId, changePlayer } = useContext(
    GeneralOptionsContext
  );

  useEffect(() => {
    db.ref('/games')
      .once('value')
      .then((data) => {
        setGames(data.val());
      });
  }, []);

  const handleGameSelected = (id) => {
    db.ref('/games/' + id).update({
      full: true,
    });
    changeGameId(id);
    changePlayer('X');
    navigation.push('Game');
  };

  const renderGames = () => {
    return Object.keys(games).map((game) => {
      return (
        !games[game].full &&
        !games[game].finished && (
          <TouchableOpacity
            key={game}
            style={styles.option}
            onPress={() => handleGameSelected(game)}
          >
            <Text style={styles.optionText}>{games[game].gameName}</Text>
          </TouchableOpacity>
        )
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.settings}>Welcome to TikTakToe!</Text>
      {games !== null ? renderGames() : null}
    </View>
  );
};
export default JoinGame;

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    height: '100%',
    paddingHorizontal: '5%',
  },
  audioOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  option: {
    height: '10%',
    paddingHorizontal: '5%',
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
    justifyContent: 'center',
  },
  optionText: { fontSize: 24 },
  subOptionText: {
    color: 'grey',
  },
  settings: { fontSize: 30, paddingVertical: '5%' },
});
