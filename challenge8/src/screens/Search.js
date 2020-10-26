import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, ScrollView } from 'react-native';
import {
  Button,
  DataTable,
  Searchbar,
  Dialog,
  Portal,
} from 'react-native-paper';

import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('db.challengeEightDb'); // returns Database object

const Search = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('Test');
  const [visible, setVisible] = useState(false);
  const [selectedName, setSelectedName] = useState('');

  const showDialog = (dataName) => {
    setSelectedName(dataName);
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  const fetchData = (searchQuery) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM companies WHERE Name LIKE '%${searchQuery}%'`,
        null,
        (txObj, { rows: { _array } }) => setData(_array),
        (txObj, error) => console.log('Error ', error)
      );
    });
  };

  useEffect(() => {
    fetchData(searchQuery);
  }, [searchQuery]);

  const onChangeSearch = (query) => setSearchQuery(query);

  const modifyCompany = (data) => {
    hideDialog();
    navigation.navigate('Update', {
      companyData: data,
    });
  };

  const deleteCompanyAction = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM companies WHERE id = ? ',
        [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let newList = data.filter((data) => {
              if (data.id === id) return false;
              else return true;
            });
            setData(newList);
          }
        }
      );
    });
    navigation.navigate('Main');
  };

  const deleteCompany = (data) => {
    Alert.alert(
      'Do you want to delete this company?',
      'This action cannot be reversed',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => deleteCompanyAction(data.id) },
      ],
      { cancelable: false }
    );
  };

  const renderCompanies = () => {
    return (
      data &&
      data.map((data) => (
        <View key={data.id}>
          <DataTable.Row onPress={() => showDialog(data.Name)}>
            <DataTable.Cell>{data.Name}</DataTable.Cell>
            <DataTable.Cell>{data.Url}</DataTable.Cell>
            <DataTable.Cell numeric>{data.Number}</DataTable.Cell>
          </DataTable.Row>
          <Portal>
            <Dialog
              visible={visible && data.Name === selectedName ? true : false}
              onDismiss={hideDialog}
            >
              <Dialog.Title>{data.Name}</Dialog.Title>
              <Dialog.Content>
                <Text>{data.Url}</Text>
                <Text>{data.Number}</Text>
                <Text>{data.Email}</Text>
                <Text>{data.Services}</Text>
                <Text>{data.Classification}</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog}>Done</Button>
                <Button onPress={() => modifyCompany(data)}>Modify</Button>
                <Button onPress={() => deleteCompany(data)}>Delete</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      ))
    );
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <ScrollView>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Url</DataTable.Title>
            <DataTable.Title numeric>number</DataTable.Title>
          </DataTable.Header>
          {renderCompanies()}
        </DataTable>
      </ScrollView>
    </View>
  );
};
export default Search;

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    height: '100%',
  },
});
