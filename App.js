/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import axios from 'axios';


type Props = {};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    temp:{
        fontSize: 90,
        color:'#fff',
        alignItems:'center'
    },
    isRain:{
        backgroundColor: '#00001F'
    },
    isNotRain:{
        backgroundColor: '#ea1646'
    }
  });
  

export default class App extends Component<Props> {

    constructor(props) {
        super(props);

        this.state = {
            position:null,
            city : null,
            weather: null,
            temp:null,
            appid:'fba7259a077d0b3d08abe3985b9e525e',
            url:'https://api.openweathermap.org/data/2.5/forecast?',
            backgroundColor: styles.isNotRain
        };
    }

    getWeather(){
        let state = this.state;
        let position = state.position;

        if(position != null){
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            let url = state.url+'lat='+lat+'&lon='+lon+'&appid='+state.appid;
            console.log(url);
            axios.get(url).then((response)=>{
                
                let api = response.data.list[0];
                let weather = api.weather[0].main;
                let color = state.backgroundColor;

                if(weather == 'Rain'){
                    color = styles.isRain;   
                }

                this.setState({
                    weather: weather,
                    backgroundColor:color,
                    temp: (api.main.temp - 273)
                });
            });
        }
    }

    componentWillMount() {
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.setState({
                    position:position
                });
                this.getWeather();
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );

    }
    componentWillUnmount(){

        navigator.geolocation.clearWatch(this.watchId);

    }

    componentWillUpdate(){

        this.getWeather();

    }

    render() {

        return (

            <View style={[styles.container,this.state.backgroundColor]}>
                <Text style={styles.temp}>{Math.round(this.state.temp)}º</Text>
            </View>

        );
    }
}

//4001 7850 9672 4148 01/21 601
