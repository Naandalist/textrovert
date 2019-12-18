/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react'
import {
  StatusBar,
} from 'react-native'

import { Provider } from 'react-redux'
import Store from './src/Redux/store'
import * as firebase from "firebase"
import Navigator from './src/Navigator'
import PushNotification from 'react-native-push-notification'

const config = {
  apiKey: "AIzaSyC0_e5Dfs0SA-srW47C1iVlloasA_vDcdU",
  authDomain: "bloody-chat-2019.firebaseapp.com",
  databaseURL: "https://bloody-chat-2019.firebaseio.com",
  projectId: "bloody-chat-2019",
  storageBucket: "bloody-chat-2019.appspot.com",
  messagingSenderId: "430254512135",
  appId: "1:430254512135:web:289f95dccad2772c98b2a2",
  measurementId: "G-96DPYSDVRH"
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}else{
  firebase.app()
}

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function(token) {
    console.log("TOKEN:", token);
  },
 
  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    console.log("NOTIFICATION:", notification);
 
    // process the notification
    PushNotification.localNotification({ 
      /* iOS and Android properties */
      title: notification.title, // (optional)
      message: notification.body, // (required)
      playSound: true, // (optional) default: true
      repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
      actions: '["Yes", "No"]',  // (Android only) See the doc for notification actions to know more
    })
  },
 
  // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
  senderID: "55502078067",
 
  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,
 
  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   */
  requestPermissions: true
});

const App = () => {
  return (
    <>
      <Provider store={Store}>
        <StatusBar barStyle="light-content" />
        <Navigator />
      </Provider>
    </>
    
  );
};

export default App;
