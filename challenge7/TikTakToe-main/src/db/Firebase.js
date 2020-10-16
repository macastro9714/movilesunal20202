import * as firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyCzIg7ckmDE3Q7zRKm2EgrCWjGgKX8CN04',
  authDomain: 'tictactoe-unal2020-2.firebaseapp.com',
  databaseURL: 'https://tictactoe-unal2020-2.firebaseio.com/',
  projectId: 'tictactoe-unal2020-2',
  storageBucket: 'tictactoe-unal2020-2.appspot.com',
};

export default !firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app();
