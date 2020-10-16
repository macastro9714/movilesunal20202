import React, { useState, useContext } from 'react';
import { Appbar } from 'react-native-paper';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
} from 'react-native';
import { Button as Bt, RadioButton, Dialog, Portal } from 'react-native-paper';
import Constants from 'expo-constants';

import GeneralOptionsContext from '../contexts/GeneralOptionsContext';

const Settings = () => {
  const {
    audio,
    difficulty,
    victoryMessage,
    changeAudio,
    changeDifficulty,
    changeVictoryMessage,
    changeReset,
  } = useContext(GeneralOptionsContext);

  const [difficultyVisible, setDifficultyVisible] = useState(false);
  const [changeMessageVisible, setChangeMessageVisible] = useState(false);

  const showDifficultyDialog = () => {
    setDifficultyVisible(true);
  };
  const hideDifficultyDialog = () => {
    changeReset();
    setDifficultyVisible(false);
  };

  const showChangeMessageDialog = () => {
    setChangeMessageVisible(true);
  };
  const hideChangeMessageDialog = () => setChangeMessageVisible(false);

  return (
    <View style={styles.container}>
      <Text style={styles.settings}>Settings</Text>
      <View style={{ ...styles.option, ...styles.audioOption }}>
        <View>
          <Text style={styles.optionText}>Audio</Text>
          <Text style={styles.subOptionText}>Turn the sound on or off</Text>
        </View>
        <Switch value={audio} onValueChange={(value) => changeAudio(value)} />
      </View>
      <TouchableOpacity style={styles.option} onPress={showChangeMessageDialog}>
        <Text style={styles.optionText}>Victory message </Text>
        <Text style={styles.subOptionText}>{victoryMessage}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={showDifficultyDialog}>
        <Text style={styles.optionText}>Difficulty level</Text>
        <Text style={styles.subOptionText}>{difficulty}</Text>
      </TouchableOpacity>
      <Portal>
        <Dialog visible={difficultyVisible} onDismiss={hideDifficultyDialog}>
          <Dialog.Title>Choose Difficulty</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(value) => {
                changeDifficulty(value);
              }}
              value={difficulty}
            >
              <RadioButton.Item label='Easy' value={'Easy'} />
              <RadioButton.Item label='Medium' value={'Medium'} />
              <RadioButton.Item label='Hard' value={'Hard'} />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Bt onPress={hideDifficultyDialog}>Done</Bt>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog
          visible={changeMessageVisible}
          onDismiss={hideChangeMessageDialog}
        >
          <Dialog.Title>Change Message</Dialog.Title>
          <Dialog.Content>
            <TextInput
              style={{
                fontSize: 30,
                backgroundColor: '#eee',
                borderRadius: 10,
                padding: 5,
              }}
              value={victoryMessage}
              onChange={(e) => changeVictoryMessage(e.nativeEvent.text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Bt onPress={hideChangeMessageDialog}>Done</Bt>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};
export default Settings;

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
