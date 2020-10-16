import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
const circle = require('../../assets/circle.png');
const x = require('../../assets/x.png');

const Button = ({ index, value, handleTouch }) => {
  return (
    <View
      key={index}
      style={styles.button}
      onTouchStart={() => handleTouch(index)}
    >
      <Image
        source={value ? (value == 'O' ? circle : x) : null}
        style={styles.image}
        resizeMode="center"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: '80%',
    width: '80%',
  },
  button: {
    width: '27%',
    height: 110,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2080e4',
    borderColor: '#0cf',
    borderWidth: 1,
  },
});

export default Button;
