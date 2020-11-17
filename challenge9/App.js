import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import {
  Button,
  Paragraph,
  Dialog,
  Portal,
  Provider as PaperProvider,
  RadioButton,
  DataTable,
} from 'react-native-paper';

const App = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [term, setTerm] = useState('restaurant');
  const [data, setData] = useState([]);
  const [radius, setRadius] = useState(500);

  const [visible, setVisible] = useState(false);

  const showDialog = () => {
    setData([]);
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const requestSearch = () => {
    setVisible(false);
    location
      ? axios
          .get(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=${radius}&type=${term}&key=AIzaSyCteq6LQY2hhYDndiaXevxY1dRHfhikFOM`
          )
          .then(function (response) {
            setData(response.data.results);
            console.log(response.data.results);
          })
      : null;
  };

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        {location ? (
          <MapView
            style={styles.mapStyle}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.09,
              longitudeDelta: 0.04,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title={'You'}
              description={'Your Location'}
              pinColor={'blue'}
            />
            {data
              ? data.map((marker, index) => (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: marker.geometry.location.lat,
                      longitude: marker.geometry.location.lng,
                    }}
                    title={marker.name}
                  />
                ))
              : null}
          </MapView>
        ) : (
          <Text>{text}</Text>
        )}
        <Button
          style={{ position: 'absolute', top: 50 }}
          mode="contained"
          onPress={showDialog}
        >
          Search
        </Button>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Search</Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                Select the type at the left, and the radius length at the right
              </Paragraph>
              <DataTable>
                <DataTable.Row>
                  <DataTable.Cell>Restaurant</DataTable.Cell>
                  <DataTable.Cell numeric>
                    <RadioButton
                      value="restaurant"
                      status={term === 'restaurant' ? 'checked' : 'unchecked'}
                      onPress={() => setTerm('restaurant')}
                    />
                  </DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>Hospital</DataTable.Cell>
                  <DataTable.Cell numeric>
                    <RadioButton
                      value="hospital"
                      status={term === 'hospital' ? 'checked' : 'unchecked'}
                      onPress={() => setTerm('hospital')}
                    />
                  </DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>Movies</DataTable.Cell>
                  <DataTable.Cell numeric>
                    <RadioButton
                      value="movie_theater"
                      status={
                        term === 'movie_theater' ? 'checked' : 'unchecked'
                      }
                      onPress={() => setTerm('movie_theater')}
                    />
                  </DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <Button onPress={() => setRadius(500)}>0.5km</Button>
                  <Button onPress={() => setRadius(1000)}>1.0km</Button>
                  <Button onPress={() => setRadius(1500)}>1.5km</Button>
                </DataTable.Row>
              </DataTable>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => requestSearch()}>Search</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default App;
