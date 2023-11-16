import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {H1} from 'tamagui';
import Google_icon from '../../assets/google_icon';
import {FirebaseService} from '../services/firebase';
import messaging from '@react-native-firebase/messaging';
import {StorageService} from '../services/local_storage';
import {Colors} from '../services/colors';

export const LoginScreen = ({navigation}) => {
  const signIn = async () => {
    await FirebaseService.googleSignIn().then(user => {
      navigation.navigate('Home');
    });
  };

  return (
    <View style={style.bg}>
      <H1 style={style.header}>Wake Up!</H1>
      <TouchableOpacity onPress={signIn}>
        <View style={style.googleButton}>
          <Google_icon></Google_icon>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  bg: {
    height: '100%',
    backgroundColor: Colors.bgColor,
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    marginTop: 200,
    color: Colors.primaryColor,
  },
  googleButton: {
    marginTop: 100,
    borderStyle: 'solid',
    borderColor: 'white',
    borderRadius: 20,
    borderWidth: 2,
    padding: 10,
  },
});
