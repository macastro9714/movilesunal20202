import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { DataTable, Button } from 'react-native-paper';

import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('db.challengeEightDb'); // returns Database object

const Main = ({ navigation }) => {
  const [data, setData] = useState(null);

  const fetchData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM companies`,
        null,
        (txObj, { rows: { _array } }) => setData(_array),
        (txObj, error) => console.log('Error ', error)
      );
    });
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS companies (id INTEGER PRIMARY KEY, Name TEXT NOT NULL, Url TEXT NOT NULL, Number INT NOT NULL, Email TEXT NOT NULL, Services TEXT NOT NULL, Classification TEXT NOT NULL)'
      );
    });
    fetchData();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={() => navigation.navigate('Search')}>
          Search Companies
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Create')}>
          Add a Company
        </Button>
      </View>
    </View>
  );
};
export default Main;

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    height: '100%',
  },
  buttonContainer: {
    paddingBottom: '5%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
