import React, { useState, useEffect } from 'react';
import {
  Provider,
  Button,
  Menu,
  Divider,
  Paragraph,
  Dialog,
  Portal,
  IconButton,
  Colors,
} from 'react-native-paper';
import { StyleSheet, BackHandler } from 'react-native';
import { View } from 'react-native';

const Header = ({ onReset, onSettingsSelect }) => {
  const [visible, setVisible] = useState(false);
  const [visibleQuit, setVisibleQuit] = useState(false);
  const [visibleMode, setVisibleMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const showDialog = () => setVisibleQuit(true);

  const hideDialog = () => setVisibleQuit(false);

  const showDialogMode = () => setVisibleMode(true);

  const hideDialogMode = () => setVisibleMode(false);

  return (
    <View>
      {/* <Appbar style={styles.bottom}>
  <Appbar.Action icon="autorenew" onPress={() => onReset()}>
    New Game
  </Appbar.Action>

  <Appbar.Action icon="settings" onPress={() => onSettingsSelect()} />
  <Appbar.Action icon="exit-to-app" onPress={() => BackHandler.exitApp()} />
</Appbar>  */}
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Button onPress={openMenu}>Show menu</Button>}
        style={{ marginTop: 40, marginLeft: 140 }}
      >
        <Menu.Item onPress={() => onSettingsSelect()} title="Settings" />
        <Menu.Item onPress={() => onReset()} title="Reset" />
        <Divider />
        <Menu.Item onPress={() => BackHandler.exitApp()} title="Quit" />
        <Portal>
          <Dialog visible={visibleQuit} onDismiss={hideDialog}>
            <Dialog.Title>Exit</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Are you sure you want to exit?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => BackHandler.exitApp()}>Accept</Button>
              <Button onPress={hideDialog}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </Menu>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  bottom: {
    flex: 1,
    justifyContent: 'space-around',
  },
});
