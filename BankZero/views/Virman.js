import React, { Component } from 'react';
import { View, Platform, ScrollView, StyleSheet,TouchableOpacity,Text,TextInput,Alert } from 'react-native';
import MSSQL from 'react-native-mssql';
import MyButton from './button';


let config = {
    server: '192.168.217.2', //ip address of the mssql database
    username: 'meral', //username to login to the database
    password: '7777', //password to login to the database
    database: 'Banka', //the name of the database to connect to
    port: 1546, //OPTIONAL, port of the database on the server
  };

let TC= 0

export default class App extends Component{
    constructor(props){
        super(props);
        this.virmanIslemi = this.virmanIslemi.bind(this);
        const{navigate} = this.props.navigation;
        const{navigation} = this.props;
        TC=navigation.getParam('TC','')

        this.state = {
            GidenHesapNo:'',
            GidenEkHesapNo:'',
            GelenEkHesapNo:'',
            tutar:0,
            virmanIslemi:false,
        }
    } 
    virmanIslemi(){
        if (this.state.GidenHesapNo===''&& this.state.GidenEkHesapNo ==='' && this.state.GelenEkHesapNo==='' && this.state.tutar===0) {
            Alert.alert('HATA','Boş alan bırakılamaz');
        } else {
            if (!this.state.virmanIslemi) {
                this.setState({virmanIslemi:true})
                MSSQL.connect(config)
                .then(()=>{
                    let query = "SELECT TOP 1 * FROM Hesaplar WHERE MusteriTc="+TC+" AND HesapNo='"
                    + this.state.GidenHesapNo+"' AND EkNumara='"
                    + this.state.GidenEkHesapNo+"' AND HesapDurum='True'"
                    let query1= "SELECT TOP 1 * FROM Hesaplar WHERE EkNumara='"
                    +this.state.GelenEkHesapNo+"' AND MusteriTc='"+TC+"' AND HesapDurum='True'"
                    MSSQL.executeQuery(query)
                    MSSQL.executeQuery(query1)
                    .then(rows=>{
                        if(rows.length>0){
                            for (var i = 0; i < rows.length; i++) {
                                var row = rows[i];
                                if(row.Bakiye>this.state.tutar){
                                    let query3="UPDATE Hesaplar SET Bakiye=Bakiye-'"+this.state.tutar+"' WHERE MusteriTc='"+TC+"' AND HesapNo='"
                                    +this.state.GidenHesapNo+"' AND EkNumara='"
                                    +this.state.GidenEkHesapNo+"'"
                                    let query4="UPDATE Hesaplar SET Bakiye=Bakiye+'"+this.state.tutar+"' WHERE MusteriTc='"+TC+"' AND HesapNo='"
                                    +this.state.GidenHesapNo+"' AND EkNumara='"
                                    +this.state.GelenEkHesapNo+"'"
                                    MSSQL.executeUpdate(query3)
                                    MSSQL.executeUpdate(query4)
                                    .then(()=>{
                                        let giden=this.state.GidenHesapNo+"-"+this.state.GidenEkHesapNo
                                        let gelen=this.state.GidenHesapNo+"-"+this.state.GelenEkHesapNo
                                        var date = new Date().getDate();
                                        var month = new Date().getMonth() + 1;
                                        var year = new Date().getFullYear();
                                        var minutes=new Date().getMinutes();
                                        var tarih=year+'-'+month+'-'+date+' '+new Date().getHours()+':'+minutes+':'+new Date().getSeconds()+':'+new Date().getMilliseconds()
                                        let query5 = "INSERT INTO Virman (Miktar,GidenHesapNo,GelenHesapNo,MusteriId,Tarih,Kanal) VALUES ('"+this.state.tutar+"','"+giden+"', '"+gelen+"', '"+TC+"', '"+tarih+"','Mobil')";
                                        MSSQL.executeUpdate(query5) 
                                        .then(()=>{
                                            Alert.alert('Virman işlemi başarıyla gerçekleşti.')
                                            this.setState({virmanIslemi: false})
                                            this.setState({GidenHesapNo:''})
                                            this.setState({GidenEkHesapNo:''})
                                            this.setState({GelenEkHesapNo:''})
                                            this.setState({tutar:''})
                                            this.props.navigation.navigate('menu',{TC: TC})
                                            MSSQL.close();
                                        })
                                    })
                                }
                                else{
                                    Alert.alert('Girilen tutar hesabınızdaki bakiyeden yüksektir')
                                }
                            }
                            
                        }else{
                            Alert.alert('HATA','Böyle bir hesabınız bulunmamaktadır')
                            this.setState({virmanIslemi:false})
                            MSSQL.close();
                        }
                        })
                    .catch(error=>{
                        Alert.alert('Veritabanı bağlantısı sağlanamadı.'+query+'\r\nHata: '+JSON.stringify(error))
                        this.setState({virmanIslemi:false})
                    });
                })
                .catch(error=>{
                    Alert.alert('Hata!',JSON.stringify(error))
                    this.setState({virmanIslemi:false})
                    this.setState({GidenHesapNo:''})
                    this.setState({GidenEkHesapNo:''})
                    this.setState({GelenEkHesapNo:''})
                    this.setState({tutar:''})
                    router.navigate('Config')
                });
            }
        }
    }

    render(){  
        return(
            <View style={styles.container}>
                <TextInput
                style = {styles.forminput}
                placeholder={'Gönderilecek Hesabın Numarası'}
                onChangeText={(GidenHesapNo) => this.setState({GidenHesapNo})} 
                autoCapitalize="none" 
                value={this.state.GidenHesapNo}
                />
                <TextInput
                style = {styles.forminput}
                placeholder={'Gönderilecek Hesabın Ek Numarası'} 
                onChangeText={(GidenEkHesapNo) => this.setState({GidenEkHesapNo})}
                value={this.state.GidenEkHesapNo}
                />
                <TextInput
                style = {styles.forminput}
                placeholder={'Yatırılacak Hesabın Ek Numarası'} 
                onChangeText={(GelenEkHesapNo) => this.setState({GelenEkHesapNo})}
                value={this.state.GelenEkHesapNo}
                />
                <TextInput
                style = {styles.forminput}
                placeholder={'Yatırılacak Tutar'}
                onChangeText={(tutar) => this.setState({tutar})}
                value={this.state.tutar}
                />
                <TouchableOpacity style={styles.button} onPress={()=>this.virmanIslemi()}>
                    <Text  style={styles.buttonText}>PARA YATIR</Text>
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