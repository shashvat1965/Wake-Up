/**
 * @format
 */

import {AppRegistry, PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {TriggerType} from '@notifee/react-native';
import App from './src/App';
import {name as appName} from './app.json';

const onAppBoot = async () => {
  await messaging().registerDeviceForRemoteMessages();
  await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  ]);
};
export async function createScheduledNotification(timestamp, name) {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  console.log(timestamp);

  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: timestamp,
  };

  await notifee.createTriggerNotification(
    {
      title: 'Wake Up!',
      body: `It's time to wake up ${name}!`,
      android: {
        channelId: 'default',
      },
    },
    trigger,
  );
}

onAppBoot();

messaging().onMessage(async remoteMessage => {
  console.log(remoteMessage.data.timestamp);
  await createScheduledNotification(
    remoteMessage.data.timestamp,
    remoteMessage.data.name,
  );
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(remoteMessage.data.timestamp);
  await createScheduledNotification(
    remoteMessage.data.timestamp,
    remoteMessage.data.name,
  );
});
AppRegistry.registerComponent(appName, () => App);
