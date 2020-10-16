import React, { useState, useEffect } from 'react';

const TicContext = React.createContext({
  soundActive: true,
  victoryMessage: 'you won!',
  playerType: 'single',
});

export const TicProvider = ({ children }) => {
  const [soundActive, setSoundActive] = useState(true);
  const [victoryMessage, setVictoryMessage] = useState('you won!');
  const [playerType, setPlayerType] = useState('single');

  useEffect(() => {
    console.log('context initialized');
  }, []);

  return (
    <TicContext.Provider
      value={{
        soundActive,
        victoryMessage,
        playerType,
        setPlayerType,
        setSoundActive,
        setVictoryMessage,
      }}
    >
      {children}
    </TicContext.Provider>
  );
};

export default TicContext;
