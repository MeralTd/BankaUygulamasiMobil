import Home from './views/Menu';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import LoginScreen from './views/Giris';
import SignUpScreen from './views/UyeOl';
import Anasayfa from './views/Anasayfa';
import Hesapekle from './views/HesapEkle';
import HavaleIslem from './views/HavaleIslem';
import BakiyeEkle from './views/BakiyeEkle';
import BakiyeCek from './views/BakiyeCek';
import HGSislem from './views/HGSislem.js';
import Virman from './views/Virman';
import HgsSatıs from './views/HgsSatıs';
import HGSBakiyeEkle from './views/HGSBakiyeEkle';
import HGSBakiyeSorgu from './views/HGSBakiyeSorgu';

const AppNavigator = createStackNavigator(
  {
    menu: {
      screen: Home,
      navigationOptions: {
        header: null,
      },
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        header: null,
      },
    },
    SignUp: {
      screen: SignUpScreen,
    },
    AnaMenu: {
      screen: Anasayfa,
      navigationOptions: {
        header: null,
      },
    },
    hesapekle: {
      screen: Hesapekle,
      navigationOptions: {
        headerTitle: 'HESAP İŞLEMLERİ',
      },
    },
    HavaleIslem: {
      screen: HavaleIslem,
      navigationOptions: {
        headerTitle: 'HAVALE İŞLEMLERİ',
      },
    },
    BakiyeEkle: {
      screen: BakiyeEkle,
    },
    BakiyeCek: {
      screen: BakiyeCek,
    },
    HGSislem: {
      screen: HGSislem,
    },
    Virman: {
      screen: Virman,
    },
    HgsSatıs: {
      screen: HgsSatıs,
    },
    HGSBakiyeEkle: {
      screen: HGSBakiyeEkle,
    },
    HGSBakiyeSorgu: {
      screen: HGSBakiyeSorgu,
    },
  },
  {
    initialRouteName: 'AnaMenu',
  },
);
export default createAppContainer(AppNavigator);
