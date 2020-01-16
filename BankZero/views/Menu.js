import React, { Component } from 'react';
import { View, Image, StyleSheet,TouchableOpacity,Text,TextInput,Alert } from 'react-native';

   
    let tc=0;
export default class b extends Component{
    constructor(props){
    super(props);
    const{navigate} = this.props.navigation;
    const{navigation} = this.props;
    tc=navigation.getParam('TC','')  
}  
    render(){
        return(
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={()=>this.props.navigation.navigate('hesapekle',{TC:tc})}>
                <Text  style={styles.buttonText}>{this.props.TC}</Text>
                  <Text  style={styles.buttonText} >HESAP İŞLEMLERİ</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={()=>this.props.navigation.navigate('HavaleIslem',{TC:tc})}>
                <Text  style={styles.buttonText}>{this.props.TC}</Text>
                  <Text  style={styles.buttonText} >HAVALE İŞLEMİ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>this.props.navigation.navigate('BakiyeEkle',{TC:tc})}>
                <Text  style={styles.buttonText}>{this.props.TC}</Text>
                  <Text  style={styles.buttonText} >HESABA BAKİYE EKLE </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>this.props.navigation.navigate('BakiyeCek',{TC:tc})}>
                <Text  style={styles.buttonText}>{this.props.TC}</Text>
                  <Text  style={styles.buttonText} >HESABA BAKİYE ÇEK</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>this.props.navigation.navigate('Virman',{TC:tc})}>
                <Text  style={styles.buttonText}>{this.props.TC}</Text>
                  <Text  style={styles.buttonText} >VİRMAN İŞLEMLERİ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>this.props.navigation.navigate('HGSislem',{TC:tc})}>
                <Text  style={styles.buttonText}>{this.props.TC}</Text>
                  <Text  style={styles.buttonText} >HGS İŞLEMLERİ</Text>
                </TouchableOpacity>
        </View> 
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F7F9',
        padding: 20
    },
    loginContainer:{
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo: {
        position: 'absolute',
        width: 300,
        height: 100
    },
    title:{
        color: "#FFF",
        marginTop: 120,
        width: 180,
        textAlign: 'center',
        opacity: 0.9
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
        paddingVertical: 15,
        
        
    },
    formbuttonText:{
        color: 'blue',
        textAlign: 'center',
        fontWeight: '700'
    },
    button: {
        width: 370,
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
          width: 1,
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
