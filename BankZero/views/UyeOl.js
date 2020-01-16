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
import SharedPreferences from 'react-native-shared-preferences';
import LinearGradient from 'react-native-linear-gradient';
import MSSQL from 'react-native-mssql';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import * as EmailValidator from 'email-validator';

let config = {
  server: '192.168.217.2', //ip address of the mssql database
  username: 'meral', //username to login to the databasere
  password: '7777', //password to login to the database
  database: 'Banka', //the name of the database to connect to
  port: 1546, //OPTIONAL, port of the database on the server
};
class SignupScreen extends Component {
  static navigationOptions = {header: null};

  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      id: navigation.getParam('id', ''),
      isModalVisible: false,
      onExecute: false,
      TC: '',
      Ad: '',
      Soyad: '',
      Cinsiyet: '',
      DogumTarihi: '',
      Telefon: '',
      EMail: '',
      Adres: '',
      Sifre: '',
      Kanal: 'Mobil',
      validateText: false,
      validatedogumtarihi: false,
      isDateTimePickerVisible: false,
      validateNumber: false,
      validateEmail: false,
      maxDate: new Date(),
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = () => {
    let day = new Date().getDate(); //Current Day
    let nextMonth = new Date().getMonth(); //Next Month
    let year = new Date().getFullYear(); //Current Year
    this.setState({
      maxDate: new Date(year - 18, nextMonth, day),
    });
  };

  onSubmit() {
    MSSQL.connect(config).then(() => {
      if (!this.state.onExecute) {
        this.setState({onExecute: true});
        let query =
          "INSERT INTO Musteriler (TC,Ad,Soyad,Cinsiyet,DogumTarihi,Telefon,EMail,Adres,Sifre,Kanal) VALUES ('" +
          this.state.TC +
          "','" +
          this.state.Ad +
          "', '" +
          this.state.Soyad +
          "', '" +
          this.state.Cinsiyet +
          "', '" +
          this.state.DogumTarihi +
          "','" +
          this.state.Telefon +
          "','" +
          this.state.EMail +
          "','" +
          this.state.Adres +
          "','" +
          this.state.Sifre +
          "','" +
          this.state.Kanal +
          "')";
        MSSQL.executeUpdate(query)
          .then(() => {
            Alert.alert('İşlem Tamam', 'Kaydınız Başarıyla Gerçekleşmiştir');
            this.setState({onExecute: false});
            this.setState({TC: ''});
            this.setState({Ad: ''});
            this.setState({Soyad: ''});
            this.setState({Cinsiyet: ''});
            this.setState({DogumTarihi: ''});
            this.setState({Telefon: ''});
            this.setState({EMail: ''});
            this.setState({Adres: ''});
            this.setState({Sifre: ''});
            this.setState({Kanal: ''});
            MSSQL.close();
            this.TCInput.focus();
          })
          .catch(error => {
            Alert.alert(
              'Query error!',
              'Querry: ' + query + '\r\nError: ' + JSON.stringify(error),
            );
            this.setState({onExecute: false});
            MSSQL.close();
          });
      } else {
        Alert.alert('Login False', 'Password is not correct.');
        this.setState({onExecute: false});
        MSSQL.close();
      }
    });
  }

  handlePicker = datetime => {
    this.state.DogumTarihi = moment(datetime).format();
    this.setState({
      isDateTimePickerVisible: false,
      validatedogumtarihi: true,
      choosenDate: moment(datetime).format('DD.MM.YYYY'),
    });
  };

  hidePicker = () => {
    this.setState({isDateTimePickerVisible: false});
  };
  showPicker = () => {
    this.setState({isDateTimePickerVisible: true});
  };

  validateEmail = (text) => {
    if (text != '' && EmailValidator.validate(text)) {
      this.setState({ validateEmail: true, mailError: "" })
    }
    else {
      this.setState({ validateEmail: false, mailError: "!" })
    }
  }

  validateNumber = (text) => {
    this.state.Telefon = text.replace(/[^0-9]/g, '');
    if (text !== '' && this.state.Telefon.length == 11) {
      this.setState({ validateNumber: true, phoneError: "" });
    }
    else
      this.setState({ validateNumber: false, phoneError: "!" })
  }
  validateText = (text) => {
    this.state.Cinsiyet = text.replace(/[0-9&+,:;=?@#|'~₺{}<>./^*()%!-]/g, '');
    this.state.Ad = text.replace(/[0-9&+,:;=?@#|'~₺{}<>./^*()%!-]/g, '');
    this.state.Soyad = text.replace(/[0-9&+,:;=?@#|'~₺{}<>./^*()%!-]/g, '');

    if (text != '') {
      this.setState({
        validateText: true,
      })
    }
    else {
      this.setState({
        validateText: false,
      })
    }
  }
  
  render() {
    return (
      <LinearGradient
        style={styles.container}
        colors={['#F3F7F9', '#F3F7F9', '#F3F7F9']}
        start={{x: 0.6, y: 0.0}}
        end={{x: 1.0, y: 0.6}}>
        <View style={styles.formContainer}>
          <View style={styles.formcontainer}>
            <TextInput
              style={styles.forminput}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              ref={input => (this.TCInput = input)}
              onSubmitEditing={() => this.AdInput.focus()}
              placeholder="TC"
              onChangeText={TC => this.setState({TC})}
              value={this.state.TC}
              keyboardType="numeric"
              maxLength={11}
              placeholderTextColor="#737A7A"
            />

            <TextInput
              style={styles.forminput}
              autoCapitalize="none"
              returnKeyType="next"
              ref={input => (this.AdInput = input)}
              onSubmitEditing={() => this.SoyadInput.focus()}
              autoCorrect={false}
              placeholder="Ad"
              onChangeText={Ad => this.setState({Ad})}
              value={this.state.Ad}
              maxLength={20}
              placeholderTextColor="#737A7A"
              onChangeText={(text) => this.validateText(text)}

            />

            <TextInput
              style={styles.forminput}
              autoCapitalize="none"
              returnKeyType="next"
              ref={input => (this.SoyadInput = input)}
              onSubmitEditing={() => this.CinsiyetInput.focus()}
              autoCorrect={false}
              placeholder="Soyad"
              onChangeText={Soyad => this.setState({Soyad})}
              value={this.state.Soyad}
              maxLength={20}
              placeholderTextColor="#737A7A"
              onChangeText={(text) => this.validateText(text)}
            />

            <TextInput
              style={styles.forminput}
              returnKeyType="next"
              ref={input => (this.CinsiyetInput = input)}
              onSubmitEditing={() => this.DogumTarihiInput.focus()}
              autoCapitalize="none"
              placeholder="Cinsiyet"
              maxLength={20}
              onChangeText={Cinsiyet => this.setState({Cinsiyet})}
              value={this.state.Cinsiyet}
              placeholderTextColor="#737A7A"
              onChangeText={(text) => this.validateText(text)}
            />
            <TouchableOpacity
              style={styles.forminput}
              onPress={this.showPicker}>
              <Text style={{ color: 'gray', fontSize: 15, }}>Doğum Tarihi Seçiniz:  <Text style={{ color: "black" }}>{this.state.choosenDate}</Text></Text>
            </TouchableOpacity>
            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this.handlePicker}
              onCancel={this.hidePicker}
              mode={'date'}
              datePickerModeAndroid={'calendar'}
              maximumDate={this.state.maxDate}
            />

            <TextInput
              style={styles.forminput}
              returnKeyType="next"
              ref={input => (this.TelefonInput = input)}
              onSubmitEditing={() => this.EMailInput.focus()}
              autoCapitalize="none"
              placeholder="Telefon"
              maxLength={11}
              onChangeText={Telefon => this.setState({Telefon})}
              value={this.state.Telefon}
              placeholderTextColor="#737A7A"
              onChangeText={(text) => this.validateNumber(text)}
            />

            <TextInput
              style={styles.forminput}
              returnKeyType="next"
              ref={input => (this.EMailInput = input)}
              onSubmitEditing={() => this.AdresInput.focus()}
              autoCapitalize="none"
              placeholder="EMail"
              maxLength={20}
              onChangeText={EMail => this.setState({EMail})}
              value={this.state.EMail}
              placeholderTextColor="#737A7A"
              onChangeText={(text) => {
                this.state.EMail = text;
                this.validateEmail(text)
              }}            />

            <TextInput
              style={styles.forminput}
              returnKeyType="next"
              ref={input => (this.AdresInput = input)}
              onSubmitEditing={() => this.SifreInput.focus()}
              autoCapitalize="none"
              placeholder="Adres"
              maxLength={20}
              onChangeText={Adres => this.setState({Adres})}
              value={this.state.Adres}
              placeholderTextColor="#737A7A"
            />

            <TextInput
              style={styles.forminput}
              returnKeyType="next"
              ref={input => (this.SifreInput = input)}
              autoCapitalize="none"
              placeholder="Şifre"
              maxLength={20}
              onChangeText={Sifre => this.setState({Sifre})}
              value={this.state.Sifre}
              placeholderTextColor="#737A7A"
              secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={this.onSubmit}>
              <Text style={styles.buttonText}>ÜYE OL</Text>
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
    backgroundColor: '#F3F7F9',
    padding: 20,
  },
  formcontainer: {
    padding: 20,
  },
  forminput: {
    height: 40,
    backgroundColor: '#DFEEEF',
    marginBottom: 10,
    padding: 10,
    color: '#000505',
    fontSize: 18,
  },
  formbuttonContainer: {
    paddingVertical: 15,
  },
  formbuttonText: {
    color: '#ff2323',
    textAlign: 'center',
    fontWeight: '700',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  button: {
    width: 325,
    borderColor: '#9EA2B0',
    borderWidth: 1,
    height: 50,
    padding: 10,
    borderRadius: 24,
    marginTop: 50,
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
});

export default SignupScreen;
