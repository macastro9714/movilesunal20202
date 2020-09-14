import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
//import './src/Assets/App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleResetButton = this.handleResetButton.bind(this);
    this.handleSinglePlayerButton = this.handleSinglePlayerButton.bind(this);
    this.handleMultiPlayerButton = this.handleMultiPlayerButton.bind(this);

    this.state = {
      vsPC: null,
      player_one_symbol: 'X',
      player_two_symbol: 'O',
      x_turn: true,
      board: ['', '', '', '', '', '', '', '', ''],
    };
  }

  handleCellClick(index, keep_playing) {
    // If the position is empty and the game isn't over yet
    // and the user selected between single or multiplayer
    if (
      this.state.board[index] === '' &&
      keep_playing === true &&
      this.state.vsPC !== null
    ) {
      let update_board = this.state.board;

      // If it's multiplayer, update the symbol and turn
      if (this.state.vsPC === false) {
        let symbol = this.state.x_turn
          ? this.state.player_one_symbol
          : this.state.player_two_symbol;
        let next_turn = !this.state.x_turn;
        update_board[index] = symbol;

        // Update the state
        this.setState({
          board: update_board,
          x_turn: next_turn,
        });
      }

      // If it's singleplayer
      if (this.state.vsPC === true) {
        update_board[index] = this.state.player_one_symbol;

        // Update the state
        this.setState({ board: update_board });

        let ai_index = find_best_move(update_board);
        if (ai_index !== -4)
          update_board[ai_index] = this.state.player_two_symbol;

        this.setState({ board: update_board });
      }
    }
  }

  handleResetButton() {
    this.setState({
      board: ['', '', '', '', '', '', '', '', ''],
      x_turn: true,
      vsPC: null,
    });
  }

  handleSinglePlayerButton() {
    if (this.state.vsPC === null) this.setState({ vsPC: true });
  }

  handleMultiPlayerButton() {
    if (this.state.vsPC === null) this.setState({ vsPC: false });
  }

  render() {
    let have_winner = winner(this.state.board);
    let keep_playing = have_winner === null ? true : false;

    if (have_winner !== null) alert(have_winner + ' won!');

    return (
      <View style={styles.master}>
        <View style={styles.game}>
          <View style={styles.board}>
            {this.state.board.map((cell, index) => {
              return (
                <View
                  style={styles.square}
                  key={index}
                  onTouchEnd={() => this.handleCellClick(index, keep_playing)}
                >
                  <Text>{cell}</Text>
                </View>
              );
            })}
          </View>
        </View>
        <View style={styles.sideBar}>
          <View style={styles.resetButton} onTouchEnd={this.handleResetButton}>
            <Text>Reset</Text>
          </View>
          <View style={styles.buttonLine}>
            <View
              style={
                this.state.vsPC === true
                  ? styles.activeSinglePlayerButton
                  : styles.deactiveSinglePlayerButton
              }
              onTouchEnd={this.handleSinglePlayerButton}
            >
              <Text>Single Player</Text>
            </View>
            <View
              style={
                this.state.vsPC === false
                  ? styles.activeMultiPlayerButton
                  : styles.deactiveMultiPlayerButton
              }
              onTouchEnd={this.handleMultiPlayerButton}
            >
              <Text>Multiplayer</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

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

export default App;
