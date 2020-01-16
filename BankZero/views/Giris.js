import React, { Component } from 'react';
import { View, Image, StyleSheet,TouchableOpacity,Text,TextInput,Alert } from 'react-native';
import MSSQL from 'react-native-mssql';

let config = {
    server: '192.168.217.2', //ip address of the mssql database
    username: 'meral', //username to login to the database
    password: '7777', //password to login to the database
    database: 'Banka', //the name of the database to connect to
    port: 1546, //OPTIONAL, port of the database on the server
  };

export default class a extends Component{
    constructor(props) {
        super(props)
        this.state={
            TC:'',
            Sifre:'',
            onLogin:false
        }
    }
    
    validateTc=(text)=>{
        this.setState({TC:text.replace(/[^0-9]/g,'')});
        if(text != '')
         this.setState({validateTc: true})
        else
        this.setState({validateTc: false}) 
    }

    onLogin() { 
        if (this.state.TC===''&& this.state.Sifre ==='') {
            Alert.alert('HATA','TC veya şifre boş geçilemez')
        } else {
            if (!this.state.onLogin) {
                this.setState({onLogin:true})
                MSSQL.connect(config)
                .then(()=>{
                    let query = "SELECT TOP 1 * FROM Musteriler WHERE TC='"
                    + this.state.TC.replace(/'/g,'')+"' COLLATE SQL_Latin1_General_CP1_CS_AS AND Sifre='"
                    + this.state.Sifre.replace(/'/g,'')+"' COLLATE SQL_Latin1_General_CP1_CS_AS"
                    MSSQL.executeQuery(query)
                    .then(rows=>{
                        if(rows.length>0){
                            let tc=this.state.TC;
                            this.setState({onLogin:false})
                            this.setState({TC:''})
                            this.setState({Sifre:''})
                            this.props.navigation.navigate('menu',{TC: tc})
                            MSSQL.close();
                        }else{
                            Alert.alert('HATA','Yanlış TC veya şifre girdiniz. Lütfen kontrol ediniz.')
                            this.setState({onLogin:false})
                            MSSQL.close();
                        }
                        })
                    .catch(error=>{
                        Alert.alert('Veritabanı bağlantısı sağlanamadı.'+query+'\r\nHata: '+JSON.stringify(error))
                        this.setState({onLogin:false})
                    });
                })
                .catch(error=>{
                    Alert.alert('Hata!',JSON.stringify(error))
                    this.setState({onLogin:false})
                    this.setState({TC:''})
                    this.setState({Sifre:''})
                    router.navigate('Config')
                });
            }
        }
    }
    render() {
        return (
                <View style={styles.container}>
                    <View style={styles.logoContiner}>
                        <Image style={styles.logo} source={require('../codezero.png')} />
                    </View>
                    <TextInput style = {styles.forminput} 
                                autoCapitalize="none" 
                                onSubmitEditing={() => this.passwordInput.focus()} 
                                autoCorrect={false} 
                                returnKeyType="next" 
                                placeholder='TC' 
                                onChangeText={(TC) => this.validateTc(TC)}
                                value={this.state.TC}
                                maxLength={11}
                                placeholderTextColor='#737A7A'/>

                    <TextInput style = {styles.forminput}   
                                returnKeyType="go" ref={(input)=> this.passwordInput = input}
                                autoCapitalize="none"  
                                placeholder='Şifre' 
                                maxLength={8}
                                onChangeText={(Sifre) => this.setState({Sifre})}
                                value={this.state.Sifre}
                                placeholderTextColor='#737A7A' 
                                secureTextEntry/>
                    <TouchableOpacity style={styles.button} onPress={()=>this.onLogin()}>
                        <Text  style={styles.buttonText}>GİRİŞ YAP</Text>
                    </TouchableOpacity> 
                </View> 
        );
    }
  }

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#F3F7F9',
    padding: 20,
    paddingTop: 100
},
loginContainer:{
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center'
},
title:{
    color: "#FFF",
    marginTop: 100,
    width: 180,
    textAlign: 'center',
    opacity: 0.9
},
formcontainer: {
    padding: 20
},
forminput:{
    height: 40,
    backgroundColor: '#DFEEEF',
    marginTop: 50,
    padding: 10,
    color: '#000505',
    fontSize:18
},
formbuttonContainer:{
    paddingVertical: 15,
    
},
formbuttonText:{
    color: '#FF5733',
    textAlign: 'center',
    fontWeight: '700'
},
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
 }
});