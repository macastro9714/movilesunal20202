import React, { useState, useEffect } from 'react';

const GeneralOptionsContext = React.createContext({
  audio: true,
  difficulty: 0,
  victoryMessage: 'You won!',
  reset: 'false',
  gameId: '',
  player: 'O',
});

export const GeneralOptionsProvider = ({ children }) => {
  const [audio, setAudio] = useState(true);
  const [difficulty, setDifficulty] = useState('Easy');
  const [victoryMessage, setVictoryMessage] = useState('You won!');
  const [reset, setReset] = useState(false);
  const [gameId, setGameId] = useState('');
  const [player, setPlayer] = useState('O');

  const changeAudio = (value) => {
    setAudio(value);
  };

  const changeDifficulty = (value) => {
    setDifficulty(value);
  };

  const changeVictoryMessage = (value) => {
    setVictoryMessage(value);
  };

  const changeReset = () => {
    setReset(!reset);
  };

  const changeGameId = (value) => {
    setGameId(value);
  };

  const changePlayer = (value) => {
    setPlayer(value);
  };

  return (
    <GeneralOptionsContext.Provider
      value={{
        audio,
        changeAudio,
        difficulty,
        reset,
        gameId,
        player,
        changeDifficulty,
        victoryMessage,
        changeVictoryMessage,
        changeReset,
        changeGameId,
        changePlayer,
      }}
    >
      {children}
    </GeneralOptionsContext.Provider>
  );
};

export default GeneralOptionsContext;
