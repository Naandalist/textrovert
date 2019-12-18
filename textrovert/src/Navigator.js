import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'

import HomeScreen from './Screens/HomeScreen'
//import ProfileScreen from './Screens/ProfileScreen'
import ChatScreen from './Screens/ChatScreen'
import LoginScreen from './Screens/LoginScreen'
import RegisterScreen from './Screens/RegisterScreen'
import LoadingScreen from './Screens/LodingScreen'
import AddContactScreen from './Screens/AddContactScreen'
import SettingScreen from './Screens/SettingScreen'
import MapScreen from './Screens/MapScreen'

import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer','componentWillReceiveProps has been renamed', 'Setting DrawerLayoutAndroid drawerPosition', 'ComponentWillMount has been renamed']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
  if (message.indexOf('componentWillReceiveProps has been renamed') <= -1) {
    _console.warn(message);
  }
  if (message.indexOf('Setting DrawerLayoutAndroid drawerPosition') <= -1) {
    _console.warn(message);
  }
  if (message.indexOf('ComponentWillMount has been renamed') <= -1) {
    _console.warn(message);
  }
};



const AppNavigator = createStackNavigator({
    Home: {
        screen: HomeScreen
    },
    Chat: {
        screen: ChatScreen
    },
    AddContact: {
        screen: AddContactScreen
    },
    Login: {
        screen: LoginScreen
    },
    Register: {
        screen: RegisterScreen
    },
    Loading: {
        screen: LoadingScreen
    },
    Setting: {
        screen: SettingScreen
    },
    Map:{
        screen: MapScreen
    }
}, {
    initialRouteName: 'Loading',
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
}
)

const Navigator = createAppContainer(AppNavigator)

export default Navigator