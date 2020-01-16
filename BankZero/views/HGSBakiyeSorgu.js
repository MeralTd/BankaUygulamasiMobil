import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert} from 'react-native';
import MSSQL from 'react-native-mssql';

let config = {
    server: '192.168.217.2', //ip address of the mssql database
    username: 'meral', //username to login to the database
    password: '7777', //password to login to the database
    database: 'Banka', //the name of the database to connect to
    port: 1546, //OPTIONAL, port of the database on the server
  };
  
let TC = 0;
let miktar=0;
let tarih=''
export default class BakiyeEkleIslem extends Component {
  constructor(props) {
    super(props);
    this.HgsSorgu = this.HgsSorgu.bind(this);
    const {navigate} = this.props.navigation;
    const {navigation} = this.props;
    TC = navigation.getParam('TC', '');
    this.state = {
        HgsNo:'',
        Bakiye:0,
        HgsSorgu: false,
    };
  }
  
  HgsSorgu=()=>{   
    MSSQL.connect(config)
    .then(()=>{
        
        if (!this.state.onExecute) {
            this.setState({onExecute:true})

            let query="SELECT Tutar FROM Hgs WHERE HgsHesap='"+ this.state.HgsNo+"'  AND MusteriTc ='"+ TC+"'"
            MSSQL.executeQuery(query)
            .then(rows=>{
                if(rows.length>0){
                    for (var i = 0; i < rows.length; i++) {
                         var row = rows[i];
                        miktar = row.Tutar
                    }
                }
            Alert.alert('Bakiyeniz', parseFloat(miktar).toFixed(2));
            })
            
        }else{
            Alert.alert('Oluşturma Hatası','sql bağlanamadı.')
            this.setState({onExecute:false})
            MSSQL.close();
        }
    })  
    .catch(error=>{
        this.setState({onExecute: false})
        Alert.alert('Hata!',JSON.stringify(error))
    });
}


render(){ 
    return(
        <View style={styles.container}>
            <TextInput
            style = {styles.forminput}
            placeholder={'HGS Hesap No'}
            autoCapitalize="none"
            value={this.state.HgsNo}
            onChangeText={(HgsNo) => this.setState({HgsNo})}

            /> 
            <TouchableOpacity style={styles.button} onPress={() => { this.HgsSorgu()}}>
                <Text  style={styles.buttonText}>BAKİYE SORGULA</Text>
            </TouchableOpacity>  
        </View>
        
    );
}
}

const styles = StyleSheet.create({
button: {
    width: 370,
    borderColor: '#9EA2B0',
    height: 50,
    padding: 20,
    borderRadius: 20,
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
    shadowRadius: 1,
    shadowOpacity: 0.3,
    
},
buttonText: {
    color: '#FEFEFE',
    fontSize: 20,
},
container: {
    flex: 1,
    backgroundColor: '#F3F7F9',
    padding: 20,
    paddingTop: 30
},
forminput:{
    height: 40,
    backgroundColor: '#DFEEEF',
    marginTop: 50,
    padding: 10,
    color: '#000505',
    fontSize:18
}
})