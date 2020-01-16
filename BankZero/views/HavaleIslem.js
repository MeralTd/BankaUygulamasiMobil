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

let TC= 0
let g_bakiye=0,a_bakiye=0,g_TC=0
let tarih=''

export default class HavaleIslem extends Component{
  constructor(props){
      super(props);

      const{navigate} = this.props.navigation;
      const{navigation} = this.props;
      TC=navigation.getParam('TC','')
      this.state={
          GonderilenHesap:'',
          GonderilenEkno:'',
          GonderenHesap:'',
          GonderenEkno:'',
          Bakiye:0,
          onHavale:false
      }
      
  } 
  
  validateTc=(text)=>{
      this.setState({TC:text.replace(/[^0-9]/g,'')});
      if(text != '')
        this.setState({validateTc: true})
      else
      this.setState({validateTc: false}) 
  }
    
  
  onHavale(){
  if (this.state.GonderenHesap===''&& this.state.GonderenEkno ==='' && this.state.GonderilenHesap===''&& this.state.GonderilenEkno ==='' && this.state.Bakiye===0) {
    Alert.alert('HATA','Değerlerin hiçbiri boş geçilemez')
  } else {
    if (!this.state.onHavale) {
        this.setState({onHavale:true})
        MSSQL.connect(config)
        .then(()=>{
            let query ="SELECT Bakiye FROM Hesaplar WHERE MusteriTc='"+TC+"' And HesapDurum='True' And HesapNo='"+this.state.GonderenHesap+"' And Bakiye>='"+this.state.Bakiye+"' And EkNumara='"+this.state.GonderenEkno+"'";
            MSSQL.executeQuery(query)
            .then(rows=>{
                if(rows.length>0){
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        g_bakiye=Number((row.Bakiye).toFixed(2))-Number((this.state.Bakiye))
                    }
                    let query2="SELECT Bakiye FROM Hesaplar WHERE HesapNo='"+ this.state.GonderilenHesap+"' AND EkNumara='"+ this.state.GonderilenEkno+"' AND MusteriTc!='"+ TC+"' And HesapDurum='True'"
                    MSSQL.executeQuery(query2)
                    .then(rows=>{
                        if(rows.length>0){
                            for (var i = 0; i < rows.length; i++) {
                                var row2 = rows[i];
                                a_bakiye= Number((row2.Bakiye).toFixed(2))+Number((this.state.Bakiye))
                            }
                            let query3 = "UPDATE Hesaplar SET Bakiye='"+g_bakiye.toFixed(2)+"' WHERE MusteriTc ='"+TC+"' And EkNumara ='"+this.state.GonderenEkno+"' And HesapNo='"+this.state.GonderenHesap+"'";
                            MSSQL.executeUpdate(query3) 
                            .then(()=>{
                                let query4 = "UPDATE Hesaplar SET Bakiye='"+a_bakiye.toFixed(2)+"' WHERE  MusteriTc!='"+TC+"' And EkNumara='"+this.state.GonderilenEkno+"' And HesapNo='"+this.state.GonderilenHesap+"'";
                                MSSQL.executeUpdate(query4) 
                                .then(()=>{
                                    let giden=this.state.GonderenHesap+"-"+this.state.GonderenEkno
                                    let gelen=this.state.GonderilenHesap+"-"+this.state.GonderilenEkno
                                    var date = new Date().getDate();
                                    var month = new Date().getMonth() + 1;
                                    var year = new Date().getFullYear();
                                    var minutes=new Date().getMinutes();
                                    tarih=year+'-'+month+'-'+date+' '+new Date().getHours()+':'+minutes+':'+new Date().getSeconds()+':'+new Date().getMilliseconds()
                                    let query5 = "INSERT INTO Havale (Miktar,GidenHesapNo,GelenHesapNo,MusteriId,Tarih,Kanal) VALUES ('"+Number((this.state.Bakiye))+"','"+giden+"', '"+gelen+"', '"+TC+"', '"+tarih+"','Mobil')";
                                    MSSQL.executeUpdate(query5) 
                                    .then(()=>{
                                        Alert.alert('Başarılı','Havale İşlemi Gerçekleşmiştir.')
                                        this.setState({GonderilenHesap:''})
                                        this.setState({GonderilenEkno:''})
                                        this.setState({GonderenHesap:''})
                                        this.setState({GonderenEkno:''})
                                        this.setState({Bakiye:0})
                                        this.setState({onHavale:false})
                                        this.props.navigation.navigate('menu',{TC:TC})
                                        MSSQL.close();
                                    })
                                    .catch(error=>{
                                        Alert.alert('Query error!','Querry: '+query5+'\r\nError: '+JSON.stringify(error))
                                        MSSQL.close();
                                        this.setState({onHavale:false})
                                    });
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
                                this.setState({onHavale:false})
                            });
                        }
                        else{
                            Alert.alert(''+query3+'\r\nHata: '+JSON.stringify(error))
                                MSSQL.close();
                                this.setState({onHavale:false})
                        }
                    })
                    .catch(error=>{
                        console.log(query2)
                        Alert.alert('Böyle bir kullanıcı bulunamadı. Gönderilecek hesap bilgilerini kontrol ediniz.')
                        MSSQL.close();
                        this.setState({onHavale:false})
                    });
                  }
                else{
                    Alert.alert('HATA','Böyle bir hesabınız bulunmamaktadır. Lütfen girdileri kontrol ediniz.')
                    this.setState({onHavale:false})
                    MSSQL.close();
                  }
              
            })
            
                
            })
            .catch(error=>{
                console.log(query)
                Alert.alert('Böyle bir hesabınız bulunmamaktadır. Bilgilerinin kontrol ediniz.')
                this.setState({onHavale:false})

            });   
            
            
    }
  }
  }
  render(){
      return ( 
          <View style={styles.formContainer}>
                  <View style={styles.formcontainer}>
          <TextInput style = {styles.forminput} 
                      autoCapitalize="none" 
                      returnKeyType="next" ref={(input)=> this.GelenHesapNoInput = input}
                      onSubmitEditing={() => this.GeleneknoInput.focus()} 
                      onChangeText={(GonderenHesap) => this.setState({GonderenHesap})}
                      placeholder='Gönderen Hesap No' 
                      maxLength={5}
                      value={this.state.GonderenHesap}
                      placeholderTextColor='#737A7A'/>

          <TextInput style = {styles.forminput}   
                      returnKeyType="next" ref={(input)=> this.GeleneknoInput = input}
                      onSubmitEditing={() => this.HesapNoInput.focus()} 
                      autoCapitalize="none"  
                      onChangeText={(GonderenEkno) => this.setState({GonderenEkno})}
                      placeholder='Gönderen Ek Numara' 
                      maxLength={4}
                      value={this.state.GonderenEkno} 
                      placeholderTextColor='#737A7A'/>

          <TextInput style = {styles.forminput} 
                      autoCapitalize="none" 
                      returnKeyType="next" ref={(input)=> this.HesapNoInput = input}
                      onSubmitEditing={() => this.eknoInput.focus()} 
                      placeholder='Gönderilecek Hesap No' 
                      onChangeText={(GonderilenHesap) => this.setState({GonderilenHesap})}
                      maxLength={5}
                      value={this.state.GonderilenHesap}
                      placeholderTextColor='#737A7A'/>

          <TextInput style = {styles.forminput}   
                      returnKeyType="next" ref={(input)=> this.eknoInput = input}
                      onSubmitEditing={() => this.BakiyeInput.focus()} 
                      autoCapitalize="none"  
                      placeholder='Gönderilecek Ek Numara' 
                      onChangeText={(GonderilenEkno) => this.setState({GonderilenEkno})}
                      maxLength={4}
                      value={this.state.GonderilenEkno}
                      placeholderTextColor='#737A7A'/>

          <TextInput style = {styles.forminput}   
                      returnKeyType="next" ref={(input)=> this.BakiyeInput = input}
                      autoCapitalize="none"  
                      placeholder='Bakiye' 
                      maxLength={4}
                      value={this.state.Bakiye}
                      onChangeText={(Bakiye) => this.setState({Bakiye})}
                      placeholderTextColor='#737A7A'/>
                      
          <TouchableOpacity style={styles.button} onPress={()=>this.onHavale()}>
              <Text  style={styles.buttonText}>Havale Yap</Text>
          </TouchableOpacity>    
            </View>
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
      width: 270,
      borderColor: '#9EA2B0',
      height: 50,
      padding: 20,
      borderRadius: 20,
      marginTop: 30,
      marginLeft:50,
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