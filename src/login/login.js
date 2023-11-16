import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import Google_icon from '../../assets/google_icon';
import {FirebaseService} from '../services/firebase';
import {Colors} from '../services/colors';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../services/metrics';

export const LoginScreen = ({navigation}) => {
  const signIn = async () => {
    await FirebaseService.googleSignIn().then(user => {
      navigation.navigate('Home');
    });
  };

  return (
    <View style={style.bg}>
      <Text style={style.header}>Wake Up!</Text>
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
    marginTop: verticalScale(200),
    color: Colors.primaryColor,
    fontSize: moderateScale(32),
  },
  googleButton: {
    marginTop: verticalScale(100),
    borderStyle: 'solid',
    borderColor: 'white',
    borderRadius: moderateScale(20),
    borderWidth: 2,
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(20),
  },
});
