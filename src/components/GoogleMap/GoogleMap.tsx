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

const mapStyles = {
  width: '400px',
  height: '500px'
};
import classNames from 'classnames/bind';
import { FaLocationArrow } from 'react-icons/fa';
import { withGoogleMap, withScriptjs, GoogleMap } from "react-google-maps"
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox'

const cx = classNames.bind(styles);

const options = { closeBoxURL: '', enableEventPropagation: true };

const optionsPolyline = {
  strokeColor: 'red',
  strokeOpacity: 0.8,
  strokeWeight: 3,
  fillColor: '#085daa',
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  zIndex: 1
};

const positions = [{
  lat: 21.027763, lng: 105.834160, label: "position 1"
}, {
  lat: 21.027763, lng: 106, label: "position 2"
}, {
  lat: 21.127763, lng: 106.1, label: "position 3"
}]



const GoogleMapCom = ({props}: any) => {
  
  const [showingInfoWindow, setShowingInfoWindow] = useState(false)
  const [activeMarker, setActiveMarker] = useState<any>({})
  const [selectedPlace, setSelectedPlace] = useState<any>({})

  const onMarkerClick = (props, marker, e) => {
    console.log(props)
    setSelectedPlace(props)
    setActiveMarker(marker)
    setShowingInfoWindow(true)
  }
      

  const onClose = props => {
    if (showingInfoWindow) {
      setShowingInfoWindow(false)
      setActiveMarker(null)
    }
  };

  return (
       <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: -34.397, lng: 150.644 }}
      >
         <Marker
              icon={{
                url: 'https://insulationpads.co.uk/wp-content/uploads/2017/10/Home.png',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
              position={{ lat: 21.027763, lng: 105.834160 }}
          >
            <InfoBox
              options={options}
            >
              <>
                <div style={{ backgroundColor: 'green', color: 'white', borderRadius:'1em', padding: '0.2em' }}>
                  someone house
                </div>
              </>
            </InfoBox>  
            </Marker>
      </GoogleMap>
  )
};
export default withScriptjs(withGoogleMap(GoogleMapCom));
// export default GoogleApiWrapper({
//   apiKey: 'AIzaSyDyLJbSf7aGSocPkzyqU7jmjVZb-Og9Ym8'
// })(GoogleMapCom);