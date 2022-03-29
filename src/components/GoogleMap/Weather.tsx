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
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { NotificationAction } from 'src/pages/Layout/layout';

import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import { sleep } from 'src/containers/Newfeed/Newfeed';
import { ChatEngine } from 'react-chat-engine'
import styles from 'src/styles/Weather.module.scss';
import { Map, GoogleApiWrapper , InfoWindow, Marker } from 'google-maps-react';

import classNames from 'classnames/bind';
import { FaLocationArrow } from 'react-icons/fa';
import { Card } from 'semantic-ui-react'
import moment from 'moment';
import Maps from './CurrentLocation';

const WeatherInfo = ({data}) => {
  return (
    <div className={cx(`weather-info-container`)}
      style={{backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.6) 100%),url(https://i.pinimg.com/736x/f6/f9/cb/f6f9cbb958cfe546e4d6be69fbe1bbe7.jpg)`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}
    >
      <div className={cx(`header`)}>
        <div className={cx(`name`)}>
          {`${data.name}`}
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
  
  
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [data, setData] = useState<any>([]);

  

  useEffect(() => {
    const fetchWeather = async () => {
      navigator.geolocation.getCurrentPosition(function(position: any) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });
    
      await fetch(`${process.env.REACT_APP_API_URL}/weather/?lat=${lat}&lon=${long}&lang=vi&units=metric&APPID=${process.env.REACT_APP_API_KEY}`)
      .then(res => res.json())
      .then(result => {
        setData(result)
        console.log(result);
      });
    }
    console.log('latal', lat, '=====', long)
    fetchWeather()
      
    }, [lat, long]);

  return (
    <>
      {(typeof data?.main != 'undefined') ? (
        <WeatherInfo data={data}/>
      ): <div className={cx(`weather-info-container`)}
      style={{backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.6) 100%),url(https://i.pinimg.com/736x/f6/f9/cb/f6f9cbb958cfe546e4d6be69fbe1bbe7.jpg)`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}
      ><Spin size="large" style={{padding: '5px 0'}}/></div>}
      {
       lat && long ? <Maps lat={lat} long={long}/> :null
      }

    </>
      
  )
};

export default Weather