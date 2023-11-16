import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {StorageService} from './local_storage';
import {SERVER_KEY} from '@env';
import messaging from '@react-native-firebase/messaging';

export class FirebaseService {
  static async googleSignIn() {
    GoogleSignin.configure({
      webClientId:
        '561912756674-v4gqj72pchd4rm05226n1puq3dqflh5d.apps.googleusercontent.com',
    });
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signOut();
    const userInfo = await GoogleSignin.signIn().catch(error => {
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw error;
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw error;
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw error;
      } else {
        throw error;
      }
    });
    const credential = auth.GoogleAuthProvider.credential(userInfo.idToken);
    const token = await messaging().getToken();
    await auth()
      .signInWithCredential(credential)
      .then(async user => {
        const db = firestore().collection('users');
        await db
          .doc(user.user.uid)
          .get()
          .then(async doc => {
            if (!doc.exists) {
              await db
                .doc(user.user.uid)
                .set({
                  name: user.user.displayName,
                  email: user.user.email,
                  token: token,
                })
                .then(() => {
                  StorageService.setLocal('user_id', user.user.uid);
                  StorageService.setLocal('name', user.user.displayName);
                  console.log('User added!');
                })
                .catch(error => {
                  throw error;
                });
            } else {
              console.log(token);
              console.log(doc.data()['token']);
              StorageService.setLocal('user_id', user.user.uid);
              if (doc.data()['token'] !== token) {
                await db.doc(user.user.uid).update({
                  token: token,
                });
              }
              console.log('User already exists!');
            }
          });
      })
      .catch(error => {
        throw error;
      });
  }

  static async setGroupNotification(topic, timestamp, name) {
    fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'key=' + SERVER_KEY,
      },
      body: JSON.stringify({
        to: `/topics/${topic}`,
        data: {
          timestamp: timestamp.toString(),
          name: `Wake up ${name}`,
        },
      }),
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  static async joinGroup(user_id, group_id) {
    const db = firestore().collection('groups');
    return await db
      .doc(group_id)
      .update({
        members: firestore.FieldValue.arrayUnion(user_id),
      })
      .then(async () => {
        await messaging()
          .subscribeToTopic(group_id)
          .then(() => console.log('Subscribed to topic!'));
        console.log('Group joined!');
        return group_id;
      })
      .catch(error => {
        throw error;
      });
  }

  static async createGroup(user_id, name) {
    const db = firestore().collection('groups');
    return await db
      .add({
        name: name.toString(),
        members: [user_id],
      })
      .then(async doc => {
        await messaging()
          .subscribeToTopic(doc.id)
          .then(() => console.log('Subscribed to topic!'));
        console.log('Group created!');
        return doc.id;
      })
      .catch(error => {
        throw error;
      });
  }

  static async getUserFromId(user_id) {
    const db = firestore().collection('users');

    return await db
      .doc(user_id)
      .get()
      .then(doc => {
        if (doc.exists) {
          return doc.data();
        } else {
          console.log('No such document!');
        }
      })
      .catch(error => {
        throw error;
      });
  }
}
