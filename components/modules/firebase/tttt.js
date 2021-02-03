import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Clipboard, Alert } from 'react-native';
import firebase from 'react-native-firebase';

const messaging = firebase.messaging();
const notifications = firebase.notifications();

export default class App extends Component {
  state = {
    deviceToken: null
  };

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.listenerRemovingFunctions && this.listenerRemovingFunctions.forEach(remove => remove());
  }

  componentDidUpdate() {
    Clipboard.setString(this.state.deviceToken);
  }

  init = async () => {
    const enabled = await messaging.hasPermission();
    if (enabled) {
      this.initFcm();
    } else {
      try {
        await messaging.requestPermission();
        this.initFcm();
      } catch (e) {
        console.log(e);
      }
    }
  };

  initFcm = async () => {
    const deviceToken = await messaging.getToken();
    this.setState({ deviceToken });
    this.listenerRemovingFunctions = [
      messaging.onTokenRefresh(this.onFcmTokenRefresh),
      notifications.onNotification(this.handleNotification('onNotification')),
      notifications.onNotificationOpened(this.handleNotification('onNotificationOpened')),
      notifications.onNotificationDisplayed(this.handleNotification('onNotificationDisplayed')),
      messaging.onMessage(this.onMessage)
    ];
    const notificationOpen = await notifications.getInitialNotification();
    if (notificationOpen) {
      this.handleNotification('initial')(notificationOpen);
    }
    const channel = new firebase.notifications.Android.Channel(
      'local',
      'local notification',
      firebase.notifications.Android.Importance.Max
    );
    await notifications.android.createChannel(channel);
  };

  onFcmTokenRefresh = (deviceToken) => {
    this.setState({ deviceToken });
  };

  onMessage = (message) => {
    Alert.alert('MESSAGE', JSON.stringify(message));
    this.setState({ notificationType: 'message' });
  };

  handleNotification = (type) => {
    return (notification) => {
      console.log(type, notification);
      if (type === 'onNotification') {
        if (Platform.OS === 'android') {
          const localNotification = notification
            .android.setChannelId('local')
            .android.setSmallIcon('ic_stat_ic_notification')
            .android.setColor('#1A73E8')
            .android.setPriority(firebase.notifications.Android.Priority.High);
          notifications
            .displayNotification(localNotification);
        } else if (Platform.OS === 'ios') {
          notifications
            .displayNotification(notification);
        }
      }
      Alert.alert('NOTIFICATION', type);
      this.setState({ notificationType: type });
    };
  };

  render() {
    const { deviceToken, notificationType } = this.state;
    return (
      <View style={styles.container}>
        {deviceToken && <Text>LISTENING...</Text>}
        {notificationType && <Text>{notificationType}</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
});