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
import styles from 'src/styles/Chat.module.scss';
import { Map, GoogleApiWrapper , InfoWindow, Marker } from 'google-maps-react';

import classNames from 'classnames/bind';
import { FaLocationArrow } from 'react-icons/fa';

const cx = classNames.bind(styles);

const mapStyles = {
  map: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
};

const currentLocationDefault = {
  zoom: 14,
  initialCenter: {
    lat: -1.2884,
    lng: 36.8233
  },
  centerAroundCurrentLocation: false,
  visible: true
};

const CurrentLocation = (props: any) => {
  
  const { lat, lng } = currentLocationDefault.initialCenter;

  const [currentLocation, setCurrentLocation] = useState({
      lat,
      lng
    })

  return (
    <>
     
    </>
      
  )
};

export default CurrentLocation