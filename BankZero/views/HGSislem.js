import React, { Component } from 'react';
import axios from 'axios';
import {Text, View, TouchableOpacity, ScrollView, TextInput,StyleSheet,Alert} from 'react-native';
let tc=0;
export default class HgsOdemeAboneBilgi extends Component {
  constructor(props){
    super(props);
    const{navigate} = this.props.navigation;
    const{navigation} = this.props;
    tc=navigation.getParam('TC','')  
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.header}></View>
          <View style={styles.header}></View>
          <View style={styles.body}>
          <View style={styles.contContainer}>
              <View style={styles.buttonStyleHesap}>
                <Text style={styles.buttonColorMenu}>HGS İşlemlerine Hoşgeldiniz</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonStyleMenu} onPress={()=>this.props.navigation.navigate('HgsSatıs',{TC:tc})}>
                <Text style={styles.buttonColorMenu}> HGS SATIŞ </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonStyleMenu} onPress={()=>this.props.navigation.navigate('HGSBakiyeSorgu',{TC:tc})}>
                <Text style={styles.buttonColorMenu}> HGS BAKİYE SORGULAMA </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonStyleMenu} onPress={()=>this.props.navigation.navigate('HGSBakiyeEkle',{TC:tc})}>
                <Text style={styles.buttonColorMenu}> HGS BAKİYE EKLEME </Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
      },
      header: {
        flex: 0.3,
        backgroundColor: "#F8F8F8",
        padding: 30,
        alignItems: 'center',
      },
      body: {
        flex: 0.4,
        alignItems: 'center',
      },
      buttonContainer: {
        width: '85%',
        justifyContent: "center",
      },
      buttonStyleHesap: {
        backgroundColor: "#056a8e",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        padding: 30,
        margin: 10,
        flexDirection: "row"
      },
      buttonColorMenu: {
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'Bahnschrift',
        fontSize: 14
      },
      buttonStyleAbone: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
        borderRadius: 5,
        padding: 6,
        margin: 5,
        flexDirection: "row",
        borderWidth: 0.8,
        borderColor: "#c5002F",
      },
      buttonStyleMenu: {
        backgroundColor: "#056a8e",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        padding: 15,
        margin: 5,
        flexDirection: "row"
      },
      hesapBilgiContainer: {
        flex: 17,
        backgroundColor: "white",
        padding: 5,
        margin: 10,
        borderWidth: 0.4,
        borderRadius: 5,
        borderColor: "#c5002f",
        fontFamily: 'Bahnschrift',
      },
      hesapText: {
        marginTop: 5,
        fontSize: 14,
        fontFamily: 'Bahnschrift',
      },
      buttonStyleKurum: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        padding: 12,
        margin: 5,
        flexDirection: "row",
        borderWidth: 0.8,
        borderColor: "black",
      },
      buttonColor: {
        fontFamily: 'Bahnschrift',
      },
      buttonStyle: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        padding: 12,
        margin: 5,
        flexDirection: "row",
        borderWidth: 0.8,
        borderColor: "#c5002F",
      },
      contContainer:{
        justifyContent: "flex-start",
        alignItems: "flex-start",
        borderRadius: 5,
        padding: 30,
        margin: 30,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#056a8e",
        fontFamily: 'Bahnschrift',
      },
      hesapNo: {
        fontWeight: "bold",
        fontSize: 16,
        fontFamily: 'Bahnschrift',
      },
      infoColor: {
        fontFamily: 'Bahnschrift',
        color: '#c5002F'
      },
      buttonStyleOnayEkrani: {
        justifyContent: "center",
        alignItems: "flex-start",
        borderRadius: 5,
        padding: 12,
        margin: 5,
        flexDirection: "row",
        borderWidth: 0.8,
        borderColor: "#c5002F",
      },
      hesapBilgiContainerFO: {
        flex: 17,
        padding: 5,
        margin: 6,
        borderWidth: 0.8,
        borderRadius: 5,
        borderColor: "#c5002f",
        fontFamily: 'Bahnschrift',
      },
      total: {
        fontSize: 14,
        color: "gray",
      },
      cost: {
        fontSize: 22,
        color: "#c5002F",
        fontWeight: 'bold',
      },
      bodyHome: {
        flex: 0.5,
        backgroundColor: "#F8F8F8",
        alignItems: 'center',
      },
})