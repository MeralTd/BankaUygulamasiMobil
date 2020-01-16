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
    this.BakiyeEkle = this.BakiyeEkle.bind(this);
    const {navigate} = this.props.navigation;
    const {navigation} = this.props;
    TC = navigation.getParam('TC', '');
    this.state = {
        HgsNo:'',
        Bakiye:0,
        HesapNo:'',
        EkHesap:'',
        BakiyeEkle: false,
    };
  }

  BakiyeEkle(){
    if (this.state.HesapNo===''&& this.state.EkHesap ==='' && this.state.HgsNo==='' && this.state.Bakiye===0) {
      Alert.alert('HATA','Değerlerin hiçbiri boş geçilemez')
    } else {
      if (!this.state.BakiyeEkle) {
          this.setState({BakiyeEkle:true})
          MSSQL.connect(config)
          .then(()=>{
              let query ="SELECT Bakiye FROM Hesaplar WHERE MusteriTc='"+TC+"' And HesapDurum='True' And HesapNo='"+this.state.HesapNo+"' And Bakiye>='"+this.state.Bakiye+"' And EkNumara='"+this.state.EkHesap+"'";
              MSSQL.executeQuery(query)
              .then(rows=>{
                  if(rows.length>0){
                      for (var i = 0; i < rows.length; i++) {
                          var row = rows[i];
                          g_bakiye=Number((row.Bakiye).toFixed(2))-Number((this.state.Bakiye))
                      }
                      let query2="SELECT Tutar FROM Hgs WHERE HgsHesap='"+ this.state.HgsNo+"'  AND MusteriTc ='"+ TC+"'"
                      MSSQL.executeQuery(query2)
                      .then(rows=>{
                          if(rows.length>0){
                              for (var i = 0; i < rows.length; i++) {
                                  var row2 = rows[i];
                                  a_bakiye= Number((row2.Bakiye).toFixed(2))+Number((this.state.Bakiye))
                              }
                              let query3 = "UPDATE Hesaplar SET Bakiye='"+g_bakiye.toFixed(2)+"' WHERE MusteriTc ='"+TC+"' And EkNumara ='"+this.state.EkHesap+"' And HesapNo='"+this.state.HesapNo+"'";
                              MSSQL.executeUpdate(query3) 
                              .then(()=>{
                                let query4 = "UPDATE Hgs SET Tutar='"+a_bakiye.toFixed(2)+"' WHERE  MusteriTc ='"+TC+"' And HgsHesap='"+this.state.HgsNo+"'";
                                MSSQL.executeUpdate(query4) 
                                .then(()=>{
                                        Alert.alert('Başarılı','Bakiye Ekleme İşlemi Gerçekleşmiştir.')
                                        this.props.navigation.navigate('menu',{TC:TC})
                                        MSSQL.close();
                                   
                                })
                                .catch(error=>{
                                    Alert.alert(''+query4+'\r\nHata: '+JSON.stringify(error))
                                    MSSQL.close();
                                    this.setState({onHavale:false})
                                });
                            })
                              .catch(error=>{
                                  Alert.alert(''+query3+'\r\nHata: '+JSON.stringify(error))
                                  MSSQL.close();
                                  this.setState({BakiyeEkle:false})
                              });
                          }
                          else{
                              Alert.alert(''+query3+'\r\nHata: '+JSON.stringify(error))
                                  MSSQL.close();
                                  this.setState({BakiyeEkle:false})
                          }
                      })
                      .catch(error=>{
                          console.log(query2)
                          Alert.alert('Böyle bir kullanıcı bulunamadı. Gönderilecek hesap bilgilerini kontrol ediniz.')
                          MSSQL.close();
                          this.setState({BakiyeEkle:false})
                      });
                    }
                  else{
                      Alert.alert('HATA','Böyle bir hesabınız bulunmamaktadır. Lütfen girdileri kontrol ediniz.')
                      this.setState({BakiyeEkle:false})
                      MSSQL.close();
                    }
                
              })
              
                  
              })
              .catch(error=>{
                  console.log(query)
                  Alert.alert('Böyle bir hesabınız bulunmamaktadır. Bilgilerinin kontrol ediniz.')
                  this.setState({BakiyeEkle:false})
  
              });   
              
              
      }
    }
    }
render(){  
    return(
        <View style={styles.container}>
            <TextInput
            style = {styles.forminput}
            placeholder={'Hesap No'}
            autoCapitalize="none"
            value={this.state.HesapNo}
            onChangeText={(HesapNo) => this.setState({HesapNo})}

            />
            <TextInput
            style = {styles.forminput}
            placeholder={'Ek Hesap No'}
            autoCapitalize="none"
            value={this.state.EkHesap}
            onChangeText={(EkHesap) => this.setState({EkHesap})}

            />
            <TextInput
            style = {styles.forminput}
            placeholder={'HGS Hesap No'}
            autoCapitalize="none"
            value={this.state.HgsNo}
            onChangeText={(HgsNo) => this.setState({HgsNo})}

            />
            <TextInput
            style = {styles.forminput}
            placeholder={'Bakiye'}
            autoCapitalize="none"
            value={this.state.Bakiye}
            onChangeText={(Bakiye) => this.setState({Bakiye})}

            />
            <TouchableOpacity style={styles.button} onPress={() => { this.BakiyeEkle()}}>
                <Text  style={styles.buttonText}>HGS BAKİYE YÜKLE</Text>
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