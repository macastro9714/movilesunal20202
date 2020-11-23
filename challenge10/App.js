import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, ScrollView } from 'react-native';
import {
  Button,
  DataTable,
  Searchbar,
  Dialog,
  Portal,
  Provider as PaperProvider,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectedName, setSelectedName] = useState('');

  const showDialog = (dataName) => {
    setSelectedName(dataName);
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  const fetchData = (searchQuery) => {
    axios
      .get(
        `https://www.datos.gov.co/resource/nyug-ff48.json?empresa=${searchQuery}`
      )
      .then(function (response) {
        setData(response.data);
      });
  };

  useEffect(() => {
    searchQuery === ''
      ? axios
          .get(`https://www.datos.gov.co/resource/nyug-ff48.json`)
          .then(function (response) {
            setData(response.data);
            console.log(response.data);
          })
      : fetchData(searchQuery);
  }, [searchQuery]);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
  };

  const renderCompanies = () => {
    return (
      data &&
      data.map((data) => (
        <View key={data.nit + '' + data.empresa}>
          <DataTable.Row onPress={() => showDialog(data.empresa)}>
            <DataTable.Cell>{data.empresa}</DataTable.Cell>
            <DataTable.Cell numeric>{data.nit}</DataTable.Cell>
          </DataTable.Row>
          <Portal>
            <Dialog
              visible={visible && data.empresa === selectedName ? true : false}
              onDismiss={hideDialog}
            >
              <Dialog.Title>{data.empresa}</Dialog.Title>
              <Dialog.Content>
                <Text>Correo: {data.correo}</Text>
                <Text>Dirección: {data.direccion}</Text>
                <Text>Municipio: {data.municipio}</Text>
                <Text>NIT: {data.nit}</Text>
                <Text>Representante: {data.representante}</Text>
                <Text>Sector: {data.sector}</Text>
                <Text>Telefono(s): {data.telefono}</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog}>Done</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      ))
    );
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
        {(data.length > 0 && searchQuery === '') ||
        (data.length === 1 && searchQuery !== '') ? (
          <ScrollView>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title numeric>NIT</DataTable.Title>
              </DataTable.Header>
              {renderCompanies()}
            </DataTable>
          </ScrollView>
        ) : (
          <ActivityIndicator
            size="large"
            animating={true}
            color={Colors.red800}
          />
        )}
      </View>
    </PaperProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    height: '100%',
  },
});
