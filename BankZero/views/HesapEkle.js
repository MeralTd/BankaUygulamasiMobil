/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React,{ Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Alert
}from 'react-native';
import MSSQL from 'react-native-mssql';
import MyButton from './/button';

let config = {
  server: '192.168.217.2', //ip address of the mssql database
  username: 'meral', //username to login to the database
  password: '7777', //password to login to the database
  database: 'Banka', //the name of the database to connect to
  port: 1546, //OPTIONAL, port of the database on the server
};


let TC= 0

export default class App extends Component<{}>{
    constructor(props){
        super(props);
        this.listHesap = this.listHesap.bind(this);
        this.addItem = this.addItem.bind(this);
        this.HesapOluştur = this.HesapOluştur.bind(this);
        this.removeItem = this.removeItem.bind(this);
        const{navigate} = this.props.navigation;
        const{navigation} = this.props;
        TC=navigation.getParam('TC','')
        this.listHesap(TC) 
    } 

    state = {
        Bakiye:0,
        HesapNo:'',
        EkNumara: 1001,
        listHesap:false,
        onExecute:false,
        Hesaplar: [],
    }

    listHesap=(tc)=>{
        //Hesapları Veritabanından çekip hesaplar Dictionary'sine atar  
        if(!this.state.listHesap){
            MSSQL.connect(config) 
            .then(()=>{ 
                let query = "SELECT HesapNo, EkNumara, Bakiye FROM Hesaplar WHERE MusteriTc ="+ tc+" And HesapDurum = 'True'" 
                MSSQL.executeQuery(query) 
                .then(rows=>{
                    if(rows.length>0){
                       for (var i = 0; i < rows.length; i++) {
                            var row = rows[i];
                            //veri tabanındaki her hesap hesaplar listesine eklenir
                              this.state.Hesaplar.push({ 
                                HesapNo: row.HesapNo,
                                EkNumara: row.EkNumara,
                                Bakiye: row.Bakiye
                              })
                              this.setState({
                                //son hesap bilgileri state'te tutulur
                                HesapNo:row.HesapNo,
                                EkNumara:row.EkNumara
                              })
                        }  
                        this.setState({listHesap: true})
                        MSSQL.close();
                    }else{
                        this.setState({listHesap: false})
                        Alert.alert('Herhangi Bir Hesabınız Bulunmamakta yeni hesap açmak için bakiyeyi girip HESAP OLUŞTUR butonuna basınız. ')
                        MSSQL.close();  
                    }
                })
                .catch(error=>{
                    Alert.alert('Listeleme Hatası','Sql Bağlaması')
                    this.setState({listHesap: false})
                });
            })
            .catch(error=>{
                this.setState({listHesap: false})
                Alert.alert('Hata!',JSON.stringify(error))
            });
        }
       } 
    addItem=()=>{
        //hesap eklenceği zaman var olan bir hesap no varsa ekno artar
        //yoksa yeni hesapno oluşturup hesap ekler
        if(this.state.HesapNo =='')
        {
            var RandomNumber = Math.floor(Math.random() * 99999) + 10000;
            this.setState({
                HesapNo : RandomNumber,
            })
           
        }else{
            this.state.EkNumara+=1
             this.setState({
                EkNumara: this.state.EkNumara,
            })
            
        }
        //hesap oluşturma sql sorgusuna gider 
        this.HesapOluştur()
    }
    HesapOluştur=()=>{   
        //hesabı veritabanına ekler
        MSSQL.connect(config)
        .then(()=>{
            if (!this.state.onExecute) {
                this.setState({onExecute:true})
                let query = "INSERT INTO Hesaplar (MusteriTC,HesapNo,Bakiye,EkNumara,HesapDurum,Kanal) VALUES ('"+TC+"','"+this.state.HesapNo+"','"+this.state.Bakiye+"','"+this.state.EkNumara+"','True','Mobil')";
                MSSQL.executeUpdate(query) 
                    .then(()=>{
                       this.state.Hesaplar.push({ 
                            HesapNo: this.state.HesapNo,
                            EkNumara: this.state.EkNumara,
                            Bakiye: this.state.Bakiye
                        })
                        this.setState({onExecute:false,})
                        MSSQL.close(); 

                    })
                    .catch(error=>{
                        Alert.alert('Query error!','Querry: '+query+'\r\nError: '+JSON.stringify(error))
                        this.setState({onExecute:false})
                        MSSQL.close();
                    });
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
    removeItem=(EkNumara,Bakiye)=>{
        if(Bakiye == 0){
            MSSQL.connect(config)
            .then(()=>{
                if (!this.state.HesapKapat) {
                    this.setState({HesapKapat:true})
                    let query = "UPDATE Hesaplar SET HesapDurum = 'False' WHERE MusteriTc ="+TC+" And EkNumara = "+EkNumara;
                    MSSQL.executeUpdate(query) 
                        .then(()=>{
                            for (var i = 0; i < this.state.Hesaplar.length; i++) {
                                var row = this.state.Hesaplar[i];
                                //veri tabanındaki her hesap hesaplar listesine eklenir
                                if(row.EkNumara==EkNumara ){
                                    this.state.Hesaplar.splice(i,1)
                                    console.log('Kapatıldı',+row.EkNumara)
                                }
                            } 
                            Alert.alert('UYARI','Hesabınız Kapatıldı.')
                            this.setState({HesapKapat:false})
                            MSSQL.close();
                        })
                        .catch(error=>{
                            Alert.alert('Query error!','Querry: '+query+'\r\nError: '+JSON.stringify(error))
                            this.setState({HesapKapat:false})
                            MSSQL.close();
                        });
                }else{
                    Alert.alert('Silme Hatası','Veri tabanına bağlanamadı .')
                    this.setState({HesapKapat:false})
                    MSSQL.close();
                }
            })  
            .catch(error=>{ 
                this.setState({HesapKapat: false})
                Alert.alert('Hata!',JSON.stringify(error))
            });   
        }else{
            Alert.alert('UYARI','Hesabınızda Bakiye Bulunmakta Lütfen Hesabınızdaki Tüm Parayı Çektikten Sonra Deneyiniz.')
        }
                
    }

    validateMiktar=(text)=>{
        //!!!!!!!!virgüllü deger girşine izin verilmelli
        this.setState({Bakiye:text.replace(/[^0-9]/g,'')});
        if(text != '')
         {this.setState({validateTc: true})}
        else
         {this.setState({validateTc: false}) }
    } 
    
    render=()=>{ 
    let hesaplar = this.state.Hesaplar.map(hesap => {
      return (
                <ScrollView key={hesap.EkNumara}  >
                <View style={{ height:100, flexDirection:'row', backgroundColor:'#f4f4f4', margin:8 ,borderRadius: 16, justifyContent:'center', alignItems:'center',borderColor:'black',borderWidth:1 }}>
                     <View style={{ flex:2, paddingLeft:10}}>
                        <Text style={{color:'red', fontSize:16}}>
                        Hesap: 
                        </Text>
                        <Text style={{color:'black', fontSize:16}}>
                        {hesap.HesapNo} - {hesap.EkNumara}
                        </Text>
                        <Text style={{color:'red', fontSize:16}}>
                        Bakiye: 
                        </Text>
                        <Text style={{color:'black', fontSize:16}}> 
                        {parseFloat(hesap.Bakiye).toFixed(2)} TL
                        </Text> 
                    </View>
                    <View style={{ flex:1}}>
                        <MyButton onPress={this.removeItem.bind(this,hesap.EkNumara,hesap.Bakiye)} text={'Hesabı Kapat'} ></MyButton>
                    </View>
                </View> 
                </ScrollView>
                );
    });

        return( 
        <View style={{flex:1,marginTop: Platform.Os == 'android' ? 21 : 0}}>

        <View style={{height: 100 ,flexDirection:'row',padding:8}}>

            <View style={{ flex: 2 , marginRight: 8 , justifyContent: 'center'}}>
            <TextInput
            value={this.setState.Bakiye} 
            placeholder={'Yeni Hesap Miktarı'} 
            onChangeText={(Bakiye) => this.validateMiktar(Bakiye)}
            keyboardType= 'numeric'
            maxLength={8}
            style={{paddingLeft:10, height:40 , backgroundColor:'#f4f4f4',borderColor:'black',borderWidth:1 , borderRadius:9}}
            />
            </View>

            <View style={{ flex:1}}>
                <MyButton onPress={this.addItem} text={'Hesap Oluştur'} ></MyButton>
            </View>
        
        </View>

        <View style={{height:0.8, borderColor: 'gray',marginHorizontal:10, borderWidth:1}}/>

        <ScrollView>
            {hesaplar}
        </ScrollView>

        </View>
        
        );
        
    }
}