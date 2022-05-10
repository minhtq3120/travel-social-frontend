import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { List, message, Avatar, Skeleton, Divider, Button, Spin, Form, Input } from 'antd';
import VirtualList from 'rc-virtual-list';
import { followId, getFollowers, getFollowing, unfollowId } from 'src/services/follow-service';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RiRestaurant2Line } from 'react-icons/ri';

const fakeDataUrl =
  'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
const ContainerHeight = 500;
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import { io } from "socket.io-client";
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { NotificationAction } from 'src/pages/Layout/layout';

import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import { sleep } from 'src/containers/Newfeed/Newfeed';
import { ChatEngine } from 'react-chat-engine'
import styles from 'src/styles/Weather.module.scss';

import classNames from 'classnames/bind';
import { FaLocationArrow } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap,LayersControl  } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L, {} from 'leaflet';
import RoutingMachine from './RoutineMachine';
import { MdLocationOn} from 'react-icons/md';
import moment from 'moment';
const cx = classNames.bind(styles);


// const myCustomColour = '#68d1c8';

// const markerHtmlStyles = `
//   background-color: ${myCustomColour};
//   width: 2.5rem;
//   height: 2.5rem;
//   display: block;
//   left: -1.5rem;
//   top: -1.5rem;
//   position: relative;
//   border-radius: 3rem 3rem 0;
//   transform: rotate(45deg);
//   border: 1px solid #FFFFFF`

// const iconc = L.divIcon({
//   className: "my-custom-pin",
//   iconSize: [25, 41],
//   iconAnchor: [0, 24],
//   // labelAnchor: [-6, 0],
//   popupAnchor: [0, -36],
//   html: `<span style="${markerHtmlStyles}" />`
// })

// const greenIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// });

// L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationPopup = (props: any) => {
    return (
        <div className={cx('recent-container')}>
            <img src={props?.marker?.data?.lastestPost?.mediaFiles[0]?.url|| `https://assets.traveltriangle.com/blog/wp-content/uploads/2016/07/limestone-rock-phang-nga-1-Beautiful-limestone-rock-in-the-ocean.jpg`}
             alt="img" className={cx('img')}/> 
             <div className={cx('info')}>
                <div className={cx('detail')}>
                    <div className={cx('name')}>{props?.marker?.data?.place?.name}</div>
                    <div className={cx('time')}>{moment(props?.marker?.data?.lastVisitedDate).format('DD MMM YYYY HH:mm').toString()}</div>
                    <div className={cx('description')}>{props?.marker?.data?.place?.formattedAddress}</div>
                </div>
            </div>
        </div>
    )
}


const Maps = (props: any) => {
  const currentPos: any = useSelector((state: RootState) => state.wallet.currentPosition);

  const [currentPosition, setCurrentPosition] = useState<any>(null)
  const [showDirection, setShowDirection] = useState(true)

  useEffect(() => {
    setCurrentPosition(currentPos)
  }, [currentPos])

  const [map, setMap] = useState(null);

  const positionInit: any = [props.lat, props.long]

  const [position, setPosition] = useState<any>(positionInit)
  const [markers, setMarkers] = useState<any>([position])
  const [activePark, setActivePark] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if(props.locationVisited) setMarkers(props.locationVisited)
  }, [props.locationVisited])

  const [draggable, setDraggable] = useState(false)
  const markerRef: any = useRef(null)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          setPosition(marker.getLatLng())
        }
      },
    }),
    [],
  )
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d)
  }, [])

  const LocationMarker = () => {
    // const map = useMapEvents({
    //   click(e: any) {
    //     if(!props.locationVisited) {
    //     console.log('recieved event', e.latlng)
    //     map.locate()
    //      setSelectedPosition([
    //           e.latlng.lat,
    //           e.latlng.lng
    //       ]);
    //       setMarkers([...markers ,[
    //           e.latlng.lat,
    //           e.latlng.lng
    //       ]])
    //     }
    //   },
    //   locationfound(e: any) {
    //     console.log('localtion found',selectedPosition)
    //     // setPosition(e.latlng)
    //     if(selectedPosition)map.flyTo(selectedPosition, map.getZoom())
    //   },
    // })

    // console.log('position ', position)

    return (
      markers?.length > 0 &&
          markers?.map((marker,index) => {
            return <Marker 
            draggable={false}
            key={index}
            position={marker}
            >
              {
                props.locationVisited ? (
                  <Popup minWidth={400} maxHeight={250}> 
                    <LocationPopup marker={marker}/>
                  </Popup>
                ) : <Popup> {marker.toString()}</Popup>
              }
            </Marker>
          })
    )
  }

  const ChangeMapView = ({ coords }) => {
  const map = useMap();
  map.setView(coords, map.getZoom());

  return null;
}
  return (
    <div style={{width: props?.mapWidth ? props.mapWidth : '1200px', height: props?.mapHeight ? props.mapHeight : '700px', position: 'relative'}}>
      {
        currentPosition && position ? (
          <MapContainer
          center={ props?.mapType === 'direction' ?
           [(currentPosition[0] + position[0]) / 2 , (currentPosition[1] + position[1]) / 2 ] : 
           props.locationVisited ?  [props.lat, props.lng] :
           position}
            zoom={ props?.mapType === 'direction'|| props.locationVisited  ? 5: 10}  
            style={{ width: props?.mapWidth ? props.mapWidth : '1200px', height: props?.mapHeight ? props.mapHeight : '700px', borderRadius: '10px' }}
            scrollWheelZoom={false}
            whenCreated={(map : any) => setMap(map)}
            >
              {
                props?.mapType === 'direction' ?  (
                  <RoutingMachine 
                    from={{lat: currentPosition[0], lng: currentPosition[1]}}
                    to={{lat: position[0], lng: position[1]}}
                  />
                ) : ( <LocationMarker /> ) 
              }
            
{/*               
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Map"> */}
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {/* </LayersControl.BaseLayer>
                <LayersControl.BaseLayer  name="noroad">

                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri"
                  />
                  </LayersControl.BaseLayer>
                
              </LayersControl> */}
          </MapContainer>
         ) : <Spin size='large'/>
    }
    {
       props.locationVisited || props?.suggestVehicle ?  null  : (
      <Button className={cx('btn-next')} 
            style={{
                position: "absolute",
                bottom: "20px",
                right: "10px",
                cursor: "pointer",
                padding: "10px 35px",
                borderRadius: "30px",
                height: "auto",
                margin: "10px 30px",
                backgroundColor: "#68d1c8",
                color: "white",
                borderColor: "#68d1c8",
                fontSize: "16px",
                fontWeight: 'bold',
                zIndex: '9999'
              }}
          
          onClick={() => {
              props.setMapType('direction')
            }}>
              Xem đường đi
        </Button>
      )
    } 
     
    </div>
      
  )
};

export default Maps