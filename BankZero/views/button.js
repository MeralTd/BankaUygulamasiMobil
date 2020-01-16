import React, { Component } from "react";

import {View,Text,TouchableOpacity} from 'react-native';

export default class MyButton extends Component<{}>{
    render(){
        return(
            <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity onPress={this.props.onPress} style={{ borderRadius:10, height:40, backgroundColor: '#0963bc', justifyContent:'center'}}>
                    <Text style={{fontSize: 18}}>
                        {this.props.text}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

}