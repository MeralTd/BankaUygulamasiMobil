import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  Picker,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MSSQL from 'react-native-mssql';

let config = {
  server: '192.168.217.2', //ip address of the mssql database
  username: 'meral', //username to login to the database
  password: '7777', //password to login to the database
  database: 'Banka', //the name of the database to connect to
  port: 1546, //OPTIONAL, port of the database on the server
};
class a extends Component {
  static navigationOptions = {header: null};

  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      onExecute: false,
      ad: '',
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    MSSQL.connect(config);
    let query = "INSERT INTO Deneme (ad) VALUES ('" + this.state.ad + "')";
    this.setState({onExecute: true});
    MSSQL.executeUpdate(query)
      .then(() => {
        Alert.alert('Success', 'Register account success.');
        this.setState({onExecute:false});
        this.setState({ad: ''});
        MSSQL.close();
        this.adInput.focus();
      })
      .catch(error => {
        Alert.alert('Query error!','Querry: '+query+'\r\nError: '+JSON.stringify(error))
        this.setState({onExecute: false});
        MSSQL.close();
      });
  }

  render() {
    return (
      <LinearGradient
        style={styles.container}
        colors={[ '#6d0094', '#8000FF','#6536FF']}
        start={{x: 0.6, y: 0.0}}
        end={{x: 1.0, y: 0.6}}>
        <View style={styles.formContainer}>
          <View style={styles.formcontainer}>
            <TextInput
              style={styles.forminput}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next" ref={(input)=> this.adInput = input}
              placeholder='ad' 
              onChangeText={(ad) => this.setState({ad})}
              value={this.state.ad}
              maxLength={20}
              placeholderTextColor='rgba(225,225,225,0.7)'/>

            <TouchableOpacity style={styles.formbuttonContainer} onPress={this.onSubmit}>
                <Text style={styles.formbuttonText}>Register</Text>
            </TouchableOpacity> 
                  </View>
              </View> 
          </LinearGradient>
      );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#6d0094',
      padding: 20
  },
  formcontainer: {
      padding: 20
  },
  forminput:{
      height: 40,
      backgroundColor: 'rgba(225,225,225,0.2)',
      marginBottom: 10,
      padding: 10,
      color: '#fff'
  },
  formbuttonContainer:{
      paddingVertical: 15
  },
  formbuttonText:{
      color: '#ff2323',
      textAlign: 'center',
      fontWeight: '700'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export default a;
