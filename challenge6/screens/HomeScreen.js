import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  Button as PrimitiveButton,
  TouchableOpacity,
  Alert,
} from 'react-native';
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

import { Audio } from 'expo-av';

import TicContext from '../context/TicContext';

const soundObject = new Audio.Sound();

const playSound = async () => {
  await soundObject.loadAsync(require('./sound.mp3'));
};

const soundPlay = async () => {
  await soundObject.playAsync();
  setTimeout(async () => {
    await soundObject.unloadAsync();
    await soundObject.loadAsync(require('./sound.mp3'));
  }, 500);
};

playSound();

let have_winner;
let keep_playing;

const HomeScreen = ({ navigation }) => {
  const {
    soundActive,
    victoryMessage,
    playerType,
    setSoundActive,
    setVictoryMessage,
    setPlayerType,
  } = useContext(TicContext);

  const [vsPC, setVsPC] = useState(true);
  const [player_one_symbol, setPlayer_one_symbol] = useState('X');
  const [player_two_symbol, setPlayer_two_symbol] = useState('O');
  const [x_turn, setX_turn] = useState(true);
  const [board, setBoard] = useState(['', '', '', '', '', '', '', '', '']);
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

  const handleCellClick = async (index, keep_playing) => {
    // If the position is empty and the game isn't over yet
    // and the user selected between single or multiplayer
    if (
      board[index] === '' &&
      keep_playing === true &&
      vsPC !== null &&
      loading === false
    ) {
      soundActive ? soundPlay() : null;
      let update_board = board;

      // If it's multiplayer, update the symbol and turn
      if (!vsPC) {
        let symbol = x_turn ? player_one_symbol : player_two_symbol;
        let next_turn = !x_turn;
        update_board[index] = symbol;
        // Update the state
        setBoard(update_board);
        setX_turn(next_turn);
      }

      // If it's singleplayer
      if (vsPC) {
        update_board[index] = player_one_symbol;
        // Update the state
        setLoading(true);
        let ai_index = await find_best_move(update_board);
        if (ai_index !== -4) update_board[ai_index] = player_two_symbol;
        setBoard(update_board);
        setTimeout(async () => {
          setLoading(false);
        }, 200);
      }
    }
  };

  const handleResetButton = () => {
    setBoard(['', '', '', '', '', '', '', '', '']);
    setX_turn(true), setVisible(false);
    playerType === 'single' ? setVsPC(true) : setVsPC(false);
  };

  const handleSinglePlayerButton = () => {
    setVisible(false);
    setVisibleMode(false);
    setPlayerType('single');
  };

  const handleMultiPlayerButton = () => {
    setVisible(false);
    setVisibleMode(false);
    setPlayerType('multi');
  };

  useEffect(() => {
    playerType === 'single' ? setVsPC(true) : setVsPC(false);
    have_winner = winner(board);
    keep_playing = !have_winner ? true : false;
    if (have_winner !== null && visible === false && loading === false)
      Alert.alert(have_winner + ' won!', victoryMessage);
  });

  return (
    <Provider>
      <View style={styles.master}>
        <View style={styles.game}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={<Button onPress={openMenu}>Show menu</Button>}
              style={{ marginTop: -40 }}
            >
              <Menu.Item onPress={showDialogMode} title="Mode" />
              <Portal>
                <Dialog visible={visibleMode} onDismiss={hideDialogMode}>
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
                    <Button onPress={handleSinglePlayerButton}>
                      Single Player
                    </Button>
                    <Button onPress={handleMultiPlayerButton}>
                      Multi Player
                    </Button>
                    <Button onPress={hideDialogMode}>Cancel</Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
              <Divider />
              <Menu.Item onPress={handleResetButton} title="Reset" />
              <Divider />
              <Menu.Item onPress={showDialog} title="Quit" />
              <Portal>
                <Dialog visible={visibleQuit} onDismiss={hideDialog}>
                  <Dialog.Title>Exit</Dialog.Title>
                  <Dialog.Content>
                    <Paragraph>Are you sure you want to exit?</Paragraph>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={() => BackHandler.exitApp()}>
                      Accept
                    </Button>
                    <Button onPress={hideDialog}>Cancel</Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
            </Menu>
            <IconButton
              icon="settings"
              onPress={() => {
                handleResetButton();
                navigation.navigate('Options');
              }}
              size={25}
            />
          </View>
          <View style={styles.board}>
            {board.map((cell, index) => {
              return (
                <TouchableOpacity
                  style={styles.square}
                  key={index}
                  onPress={() => handleCellClick(index, keep_playing)}
                >
                  <View>
                    {cell ? (
                      cell === 'X' ? (
                        <IconButton
                          icon="alpha-x-box-outline"
                          color={Colors.red500}
                          size={35}
                        />
                      ) : (
                        <IconButton
                          icon="alpha-o-box-outline"
                          color={Colors.red500}
                          size={35}
                        />
                      )
                    ) : (
                      <Button />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={styles.sideBar}></View>
      </View>
    </Provider>
  );
};

function winner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    let [a, b, c] = lines[i];
    if (
      squares[a] !== '' &&
      squares[a] === squares[b] &&
      squares[a] === squares[c] &&
      squares[b] === squares[c]
    )
      return squares[a];
  }

  return null;
}

function arrayToMat(squares) {
  let mat = [];
  let k = 0;

  for (let i = 0; i < 3; i++) {
    mat[i] = [];
    for (let j = 0; j < 3; j++) mat[i][j] = squares[k++];
  }

  return mat;
}

function hasMovesLeft(mat) {
  // If it has an empty space, keep playing
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (mat[i][j] === '') return true;
    }
  }

  return false;
}

function evaluate(mat, depth) {
  // Check every row
  for (let i = 0; i < 3; i++) {
    if (
      mat[i][0] === mat[i][1] &&
      mat[i][0] === mat[i][2] &&
      mat[i][1] === mat[i][2]
    ) {
      if (mat[i][0] === 'O') return 100 - depth;
      if (mat[i][0] === 'X') return depth - 100;
    }
  }

  // Check every col
  for (let j = 0; j < 3; j++) {
    if (
      mat[0][j] === mat[1][j] &&
      mat[0][j] === mat[2][j] &&
      mat[1][j] === mat[2][j]
    ) {
      if (mat[0][j] === 'O') return 100 - depth;
      if (mat[0][j] === 'X') return depth - 100;
    }
  }

  // Check the diagonals
  if (
    mat[0][0] === mat[1][1] &&
    mat[0][0] === mat[2][2] &&
    mat[1][1] === mat[2][2]
  ) {
    if (mat[0][0] === 'O') return 100 - depth;
    if (mat[0][0] === 'X') return depth - 100;
  }

  if (
    mat[0][2] === mat[1][1] &&
    mat[0][2] === mat[2][0] &&
    mat[1][1] === mat[2][0]
  ) {
    if (mat[0][2] === 'O') return 100 - depth;
    if (mat[0][2] === 'X') return depth - 100;
  }

  // If the game hasn't finished yet
  return 0;
}

function minmax(mat, depth, get_max) {
  if (hasMovesLeft(mat) === false) {
    return evaluate(mat, depth);
  }

  let val = evaluate(mat, depth);

  if (val !== 0) return val;

  if (get_max) {
    let best = -Infinity;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (mat[i][j] === '') {
          mat[i][j] = 'O';
          best = Math.max(best, minmax(mat, depth + 1, !get_max));
          mat[i][j] = '';
        }
      }
    }

    return best;
  } else {
    let best = Infinity;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (mat[i][j] === '') {
          mat[i][j] = 'X';
          best = Math.min(best, minmax(mat, depth + 1, !get_max));
          mat[i][j] = '';
        }
      }
    }

    return best;
  }
}

function find_best_move(squares) {
  let mat = arrayToMat(squares);
  let val,
    row = -1,
    col = -1,
    best = -Infinity;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (mat[i][j] === '') {
        mat[i][j] = 'O';
        val = minmax(mat, 0, false);
        mat[i][j] = '';

        if (val > best) {
          best = val;
          row = i;
          col = j;
        }
      }
    }
  }
  return 3 * row + col;
}

const styles = StyleSheet.create({
  master: {
    overflow: 'hidden',
  },
  sideBar: {
    //alignSelf: 'flex-start',
    width: '100%',
    justifyContent: 'center',
    paddingTop: '20%',
    alignItems: 'center',
  },
  game: {
    //alignSelf: 'flex-end',
    width: '100%',
    alignItems: 'center',
    paddingTop: '40%',
  },
  board: {
    paddingTop: '5%',
    width: 210,
    height: 210,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  square: {
    width: 70,
    height: 70,
    borderColor: 'black',
    borderWidth: 2,
    fontSize: 2,
    textAlign: 'center',
  },
  resetButton: {
    width: 80,
    height: 40,
    fontSize: 2,
    backgroundColor: '#21e44f',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    textShadowColor: 'grey',
    color: 'white',
  },
  buttonLine: {
    paddingTop: 10,
  },
  activeSinglePlayerButton: {
    marginTop: 3,
    padding: 3,
    width: 100,
    height: 25,
    fontSize: 2,
    backgroundColor: '#2080e4',
    color: 'white',
    textShadowColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
  },
  deactiveSinglePlayerButton: {
    marginTop: 3,
    padding: 3,
    width: 100,
    height: 25,
    fontSize: 2,
    backgroundColor: 'grey',
    color: 'gray',
    textShadowColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
  },
  activeMultiPlayerButton: {
    marginTop: 3,
    padding: 3,
    width: 100,
    height: 25,
    fontSize: 2,
    backgroundColor: '#2080e4',
    color: 'white',
    textShadowColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
  },
  deactiveMultiPlayerButton: {
    marginTop: 3,
    padding: 3,
    width: 100,
    height: 25,
    fontSize: 2,
    backgroundColor: 'grey',
    color: 'grey',
    textShadowColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default HomeScreen;
