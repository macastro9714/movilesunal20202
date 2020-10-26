import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Portal, Dialog, Button } from 'react-native-paper';

import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('db.challengeEightDb'); // returns Database object

const Update = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [number, setNumber] = useState('1');
  const [email, setEmail] = useState('');
  const [services, setServices] = useState('');
  const [classification, setClassification] = useState('Software Factory'); //Software Consulting, Custom Software Development, Software Factory
  const [visible, setVisible] = useState(false);

  const companyData = route.params.companyData;

  useEffect(() => {
    setName(companyData.Name);
    setUrl(companyData.Url);
    setNumber(companyData.Number.toString());
    setEmail(companyData.Email);
    setServices(companyData.Services);
    setClassification(companyData.Classification);
  }, []);

  const showDialog = () => setVisible(true);

  const hideDialog = (classificationData) => {
    setClassification(classificationData);
    setVisible(false);
  };

  const updateCompany = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE companies SET Name = '${name}' , Url = '${url}', Number = ${parseInt(
          number
        )}, Email = '${email}', Services = '${services}', Classification = '${classification}' WHERE id = ${
          companyData.id
        }`,
        null,
        null,
        (txObj, error) => console.log('Error ', error)
      );
    });
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <Text>Modify a Company</Text>
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
      <Button mode="contained" onPress={() => updateCompany()}>
        Update
      </Button>
    </View>
  );
};
export default Update;

const styles = StyleSheet.create({
  container: {
    paddingTop: '1%',
    height: '100%',
    paddingHorizontal: '5%',
    justifyContent: 'space-evenly',
    flex: 1,
  },
});
