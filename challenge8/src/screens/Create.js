import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Button, TextInput, Dialog, Portal } from 'react-native-paper';

import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('db.challengeEightDb'); // returns Database object

const Create = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [number, setNumber] = useState('1');
  const [email, setEmail] = useState('');
  const [services, setServices] = useState('');
  const [classification, setClassification] = useState('Software Factory'); //Software Consulting, Custom Software Development, Software Factory
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = (classificationData) => {
    setClassification(classificationData);
    setVisible(false);
  };

  const fetchData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM companies',
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

  const insertCompany = (companyData) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO companies (Name, Url, Number, Email, Services, Classification) values (?, ?, ?, ?, ?, ?)',
        [name, url, parseInt(number), email, services, classification],
        (txObj, resultSet) => {
          setData(
            data.concat({
              Name: name,
              Url: url,
              Number: parseInt(number),
              Email: email,
              Services: services,
              Classification: classification,
            })
          );
          navigation.navigate('Main');
        },
        (txObj, error) => console.log('Error', error)
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text>Add a Company</Text>
      <TextInput
        label="Name"
        value={name}
        onChangeText={(name) => setName(name)}
      />
      <TextInput label="Url" value={url} onChangeText={(url) => setUrl(url)} />
      <TextInput
        label="Number"
        value={number}
        onChangeText={(number) => setNumber(number)}
        keyboardType="numeric"
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={(email) => setEmail(email)}
      />
      <TextInput
        label="Services"
        value={services}
        onChangeText={(services) => setServices(services)}
        multiline
      />
      <Button mode="outlined" onPress={() => showDialog()}>
        Select Classification
      </Button>
      <Portal>
        <Dialog visible={visible} onDismiss={() => hideDialog('')}>
          <Dialog.Title>Choose a Classification</Dialog.Title>
          <Dialog.Actions style={{ flexDirection: 'column' }}>
            <Button
              mode="outlined"
              onPress={() => hideDialog('Software Consulting')}
            >
              Software Consulting
            </Button>
            <Button
              mode="outlined"
              onPress={() => hideDialog('Custom Software Development')}
            >
              Custom Software Development
            </Button>
            <Button
              mode="outlined"
              onPress={() => hideDialog('Software Factory')}
            >
              Software Factory
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Button mode="contained" onPress={() => insertCompany()}>
        Submit
      </Button>
    </View>
  );
};
export default Create;

const styles = StyleSheet.create({
  container: {
    paddingTop: '1%',
    height: '100%',
    paddingHorizontal: '5%',
    justifyContent: 'space-evenly',
    flex: 1,
  },
});
