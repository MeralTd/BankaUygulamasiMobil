import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import MSSQL from 'react-native-mssql';

let config = {
  server: '192.168.217.2', //ip address of the mssql database
  username: 'saadmin', //username to login to the database
  password: '1234', //password to login to the database
  database: 'Banka', //the name of the database to connect to
  port: 1546, //OPTIONAL, port of the database on the server
};

export default class a extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TC: '',
      Sifre: '',
      onLogin: false,
    };
  }
  onLogin() {
    if (this.state.TC === '' && this.state.Sifre === '') {
      Alert.alert('Error', 'Username or password not null.');
    } else {
      if (!this.state.onLogin) {
        this.setState({onLogin: true});
        MSSQL.connect(config)
          .then(() => {
            let query =
              "SELECT TOP 1 * FROM Musteriler WHERE TC='" +
              +this.state.TC.replace(/'/g, '') +
              "' COLLATE SQL_Latin1_General_CP1_CS_AS AND Sifre='" +
              +this.state.Sifre.replace(/'/g, '') +
              "' COLLATE SQL_Latin1_General_CP1_CS_AS";
            MSSQL.executeQuery(query)
              .then(rows => {
                if (rows.length > 0) {
                  this.setState({onLogin: false});
                  this.setState({TC: ''});
                  this.setState({Sifre: ''});
                  Alert.alert('başarılı');
                  this.props.navigation.navigate('HomeScreen');
                  MSSQL.close();
                } else {
                  Alert.alert(
                    'Login False',
                    'Username or password not correct.',
                  );
                  this.setState({onLogin: false});
                  MSSQL.close();
                }
              })
              .catch(error => {
                Alert.alert(
                  'Query error!',
                  'Querry: ' + query + '\r\nError: ' + JSON.stringify(error),
                );
                this.setState({onLogin: false});
              });
          })
          .catch(error => {
            Alert.alert('Connect error!', JSON.stringify(error));
            this.setState({onLogin: false});
            this.setState({TC: ''});
            this.setState({Sifre: ''});
          });
      }
    }
  }
  render() {
    return (
      <View style={styles.formContainer}>
        <View style={styles.formcontainer}>
          <TextInput
            style={styles.forminput}
            autoCapitalize="none"
            onSubmitEditing={() => this.passwordInput.focus()}
            autoCorrect={false}
            returnKeyType="next"
            placeholder="User"
            onChangeText={TC => this.setState({TC})}
            value={this.state.TC}
            maxLength={20}
            placeholderTextColor="rgba(0,0,255,0.3)"
          />
          <TextInput
            style={styles.forminput}
            returnKeyType="go"
            ref={input => (this.passwordInput = input)}
            autoCapitalize="none"
            placeholder="Password"
            maxLength={20}
            onChangeText={Sifre => this.setState({Sifre})}
            value={this.state.Sifre}
            placeholderTextColor="rgba(0,0,255,0.3)"
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.formbuttonContainer}
            onPress={() => this.onLogin()}>
            <Text style={styles.formbuttonText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.formbuttonContainer}
            onPress={() => this.props.navigation.navigate('SignupScreen')}>
            <Text style={styles.formbuttonText}>KAYIT OL</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6d0094',
    padding: 20,
  },
  loginContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  logo: {
    position: 'absolute',
    width: 300,
    height: 100,
  },
  title: {
    color: '#FFF',
    marginTop: 120,
    width: 180,
    textAlign: 'center',
    opacity: 0.9,
  },
  formcontainer: {
    padding: 20,
  },
  forminput: {
    height: 40,
    backgroundColor: 'rgba(225,225,225,0.2)',
    marginBottom: 10,
    padding: 10,
    color: '#fff',
  },
  formbuttonContainer: {
    paddingVertical: 15,
  },
  formbuttonText: {
    color: '#FF5733',
    textAlign: 'center',
    fontWeight: '700',
  },
});
