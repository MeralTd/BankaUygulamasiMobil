import React, {Component} from 'react';
import { View, Image, StyleSheet,TouchableOpacity,Text,TextInput,Alert } from 'react-native';
export default class Anasayfa extends Component{
    render() {
        return (
                <View style={styles.container}>
                    <View style={styles.logoContiner}>
                        <Image style={styles.logo} source={require('../codezero.png')} />
                    </View>
                    <Text style={styles.welcome}>Mobil Bankacılık İşlemlerine</Text>
                    <Text style={styles.welcome}>Hoşgeldiniz</Text>
                    <TouchableOpacity style={styles.button} onPress={()=>this.props.navigation.navigate('Login')}>
                        <Text  style={styles.buttonText}>GİRİŞ YAP</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity style={styles.button} onPress={()=>this.props.navigation.navigate('SignUp')}>
                        <Text  style={styles.buttonText}>KAYIT OL</Text>
                    </TouchableOpacity>
                </View> 
        );
    }
}
const styles = StyleSheet.create({
container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    paddingTop: 100,
    backgroundColor:'#F3F7F9'
    },
button: {
    width: 325,
    borderColor: '#9EA2B0',
    borderWidth: 1,
    height: 50,
    padding: 10,
    borderRadius: 24,
    marginTop: 80,
    backgroundColor: '#26406C',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    //shadowColor: '#129793',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 5,
    shadowOpacity: 0.8,
},
buttonText: {
    color: '#FEFEFE',
    fontSize: 20,
},
welcome: {
    fontSize: 21,
    color: '#DD5045',
    letterSpacing: 4,
  },
logoContiner: {
    height: 100,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginTop:50
},
logo: {
    
    width: 400,
    height: 300,
    resizeMode: 'contain',
  },
});