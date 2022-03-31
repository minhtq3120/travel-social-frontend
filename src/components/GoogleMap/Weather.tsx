import React, { useState, useEffect, useCallback } from 'react';
import { List, message, Avatar, Skeleton, Divider, Button, Spin, Form, Input } from 'antd';
import VirtualList from 'rc-virtual-list';
import { followId, getFollowers, getFollowing, unfollowId } from 'src/services/follow-service';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RiRestaurant2Line } from 'react-icons/ri';

const fakeDataUrl =
  'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
const ContainerHeight = 500;

const SEND_NOTIFICATION = 'sendNotification';
const RECEIVE_NOTIFICATION = 'receiveNotification';
import { io } from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { NotificationAction } from 'src/pages/Layout/layout';

import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import { sleep } from 'src/containers/Newfeed/Newfeed';
import { ChatEngine } from 'react-chat-engine'
import styles from 'src/styles/Weather.module.scss';
import { Map, GoogleApiWrapper , InfoWindow } from 'google-maps-react';

import classNames from 'classnames/bind';
import { FaLocationArrow } from 'react-icons/fa';
import { Card } from 'semantic-ui-react'
import moment from 'moment';
import ReactWeather, { useOpenWeather } from 'react-open-weather';

import Maps from './CurrentLocation';
import { setWeatherData } from 'src/redux/WalletReducer';

const customStyles = {
	fontFamily:  'Helvetica, sans-serif',
	gradientStart:  '#0181C2',
	gradientMid:  '#68d1c8',
	gradientEnd:  '#4BC4F7',
	locationFontColor:  '#FFF',
	todayTempFontColor:  '#FFF',
	todayDateFontColor:  '#B5DEF4',
	todayRangeFontColor:  '#B5DEF4',
	todayDescFontColor:  '#B5DEF4',
	todayInfoFontColor:  '#B5DEF4',
	todayIconColor:  '#FFF',
	forecastBackgroundColor:  '#FFF',
	forecastSeparatorColor:  '#DDD',
	forecastDateColor:  '#777',
	forecastDescColor:  '#777',
	forecastRangeColor:  '#777',
	forecastIconColor:  '#68d1c8',
};


const WeatherInfoDetail = (props) => {
  const { data, isLoading, errorMessage } = useOpenWeather({
    key: process.env.REACT_APP_API_KEY,
    lat: props?.data?.coord?.lat,
    lon: props?.data?.coord?.lon,
    lang: 'vi',
    unit: 'metric', // values are (metric, standard, imperial)
  });
  return (
    <div className={cx(`weather-info-container`)}>
      <ReactWeather
      style={{width: '400px', height: '300px'}}
      theme={customStyles}
      isLoading={isLoading}
      errorMessage={errorMessage}
      data={data}
      lang="en"
      locationLabel={<p style={{color: 'white'}}>{props?.data?.name}</p>}
      unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
      showForecast
    />
    </div>
    
  );
}


const WeatherInfo = ({data}) => {
  return (
    <div className={cx(`weather-info-container`)}
      style={{backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.6) 100%),url(https://i.pinimg.com/736x/f6/f9/cb/f6f9cbb958cfe546e4d6be69fbe1bbe7.jpg)`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}
    >
      <div className={cx(`header`)}>
        <div className={cx(`name`)}>
          <FaLocationArrow color='#68d1c8' size={20} style={{margin: '0 10px'}}/> 
         <div className={cx(`name-child`)}>{`${data.name}`}</div>
        </div>
        <div className={cx(`coord`)}>
          {`${data.coord.lon} - ${data.coord.lat}`}
        </div>
      </div>
      <div className={cx(`body`)}>
        <div className={cx(`temp`)}>{`${data.main.temp}`}&deg; C</div> 
        <div className={cx(`detail`)}>{
          data.weather.map((item: any) => {
            return (
              <div key={item.id}>
                {`${item.main} : ${item.description}`}
              </div>
            )
          })
        }</div>
      </div>
      <div className={cx(`footer`)}>
        <div className={cx(`date`)}>
          {`${moment().format('dddd')} ${moment().format('LL')}`}
        </div>
        <div className={cx(`humidity`)}>
          {`Humidity: ${data.main.humidity} %`}
        </div>
      </div>

    </div>
  )
}

const cx = classNames.bind(styles);

const Weather = (props: any) => {
  const dispatch = useDispatch()
  const weatherData: any = useSelector((state: RootState) => state.wallet.weatherData);
  const weatherPosition: any = useSelector((state: RootState) => state.wallet.weatherPosition);
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true)
      await sleep();
      await fetch(`${process.env.REACT_APP_API_URL}/weather/?lat=${weatherPosition[0]}&lon=${weatherPosition[1]}&lang=vi&units=metric&APPID=${process.env.REACT_APP_API_KEY}`)
      .then(res => res.json())
      .then(result => {
        setLoading(false)
        dispatch(setWeatherData(result))
      });
    }

    if(weatherPosition) fetchWeather()
    }, [weatherPosition]);

  return (
    <>
      {weatherData && weatherData?.cod !=='404' && !loading ? (
        <WeatherInfoDetail data={weatherData}/>
      ): (
        <div className={cx(`weather-info-container`)} style={{minHeight: '500px', background: 'linear-gradient(90deg, #0181C2 0%, #68d1c8 47.71%, #4BC4F7 100%)'}}>
          <Spin size="large" style={{padding: '5px 0'}}/>
        </div>
      )
      }
      {/* {
       lat && long  ? (
            <Maps lat={lat} long={long} />
        ) :null
      } */}

    </>
      
  )
};

export default Weather