import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {LoginScreen} from './login/login';
import {TamaguiProvider} from 'tamagui';
import config from '../tamagui.config';
import {useEffect} from 'react';
import {Stack} from './services/navigation';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {HomeScreen} from './home/home';
import {GroupScreen} from './group/group';

export default function App() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '561912756674-v4gqj72pchd4rm05226n1puq3dqflh5d.apps.googleusercontent.com',
    });
  }, []);

  return (
    <TamaguiProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{headerShown: false}}
          r>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name={'Group'} component={GroupScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TamaguiProvider>
  );
}

const style = StyleSheet.create({
  bg: {
    height: '100%',
    backgroundColor: 'black',
  },
});
