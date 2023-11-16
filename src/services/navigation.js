import {createNavigationContainerRef} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export const navigationRef = createNavigationContainerRef();

export function navigateWithRef(name, params) {
  if (navigationRef.isReady()) {
    console.log('navigating');
    navigationRef.navigate(name, params);
  }
}

export const Stack = createNativeStackNavigator();
