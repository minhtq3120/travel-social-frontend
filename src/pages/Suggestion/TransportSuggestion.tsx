import React, { useState, useEffect, useCallback } from 'react';
import { List, message, Avatar, Skeleton, Divider, Button, Spin, Form, Input, Modal, Tooltip } from 'antd';
import VirtualList from 'rc-virtual-list';
import { followId, getFollowers, getFollowing, unfollowId } from 'src/services/follow-service';
import _, { at } from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FiSend } from 'react-icons/fi';

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
import styles from 'src/styles/Transport.module.scss';
import { ChatFeed, Message } from 'react-chat-ui'
 import { Radio } from 'antd';

import classNames from 'classnames/bind';
import { FaLocationArrow } from 'react-icons/fa';
import { createChatGroup, getChatDetailById, getRecentsChat } from 'src/services/chat-service';
import moment from 'moment';
import { getAirport, getFlight, getSuggestion, getSuggestionAttraction, getSuggestionDetail, getSuggestionThingToDo } from 'src/services/suggestion-service';
import { Slide, Fade } from 'react-slideshow-image';
import "react-slideshow-image/dist/styles.css";
import { AiOutlineArrowDown, AiOutlineClockCircle, AiFillQuestionCircle} from 'react-icons/ai';
import {GiAirplaneDeparture, GiAirplaneArrival } from 'react-icons/gi';
import {FaArrowRight} from 'react-icons/fa'
import { useLocation, useParams } from 'react-router-dom';
const cx = classNames.bind(styles);
import { DatePicker, Space } from 'antd';
import { Select } from 'antd';
import flightFrom from './flightFrom.json'
import flightTo from './flightTo.json'
import dataRoundTrop from './dataRoundtrip.json'
import Maps from 'src/components/GoogleMap/CurrentLocation';

const { Option } = Select;

const { RangePicker } = DatePicker;


const TransportSuggestion = (props: any) => {
 
 const [airportFrom, setAirportFrom] = useState<any>(null)
  const [airportTo, setAirportTo] = useState<any>(null)

  useEffect(() => {
    if(props?.destinationInfo) {
      getAirportSelect(props?.destinationInfo?.lat, props?.destinationInfo?.lon, 'to')
    }
  }, [props?.destinationInfo])

   useEffect(() => {
    if(props?.startInfo) {
      getAirportSelect(props?.startInfo?.lat, props?.startInfo?.lon, 'from')
    }
  }, [props?.startInfo])


  const getAirportSelect = async (lat: number, lon:number, type: string) => {
    // const suggest = await getAirport(lat, lon, {});
    // const rs = _.get(suggest, 'data', null);
    // if(type==='from') setAirportFrom(rs)
    
    // if(type==='to') setAirportTo(rs)
    
    // console.log("++++++++++++++++++++++++++",rs)

    if(type==='from') setAirportFrom(flightFrom)
    if(type==='to') setAirportTo(flightTo)

  }

  console.log(props?.destinationInfo)
  return (
    <div className={cx('transport-suggestion-detail-container')}
      
    >
      
        <div className={cx('left')} onClick={() =>{
        props?.setCurrentStep(props?.currentStep + 1)
      }}>
          <div className={cx('transport-info')}>
            <div className={cx('name')}>
              Máy bay
            </div>
            <img src="https://statics.vinpearl.com/kinh-nghiem-dat-ve-may-bay-2_1630647705.jpg"
                className={cx('img')}
              />
          </div>
          
          <div className={cx('text1')}>
            Khoảng cách từ điểm xuất phát tới điểm du lịch là<b style={{fontSize: '25px', margin: '0 10px'}}>30km</b> 
          </div>

          <div className={cx('text')}>
            Chúng tôi đề xuất các sân bay gần nhât so với địa điểm bạn chọn <br />
            * Bạn có thể thay đổi ở bước gợi ý vé máy bay
          </div>

            <div className={cx('from-to-location-container')}>
                  <div className={cx('from')}>
                      <div className={cx('top')}>Từ 
                      </div>
                      <div className={cx('name')}><GiAirplaneDeparture size={20} style={{marginRight: '10px'}}/>{airportFrom?.items[0]?.name}</div>
                      <div className={cx('iata')}>{airportFrom?.items[0]?.iata}</div>
                  </div>
                  <FaArrowRight size={50} color='#68d1c8' className={cx('icon-arrow')}/>
                  <div className={cx('from')}>
                    <div className={cx('top')}>đến
                      </div>
                      <div className={cx('name')}><GiAirplaneArrival size={20} style={{marginRight: '10px'}}/>{airportTo?.items[0]?.name}</div>
                      <div className={cx('iata')}>{airportTo?.items[0]?.iata}</div>
                  </div>
                </div>
        </div>
         <div className={cx('right')} onClick={() =>{
        props?.setCurrentStep(props?.currentStep + 2)
      }}>
          <div className={cx('transport-info')}>
            <div className={cx('name')}>
              đường bộ
            </div>
            <img src="https://mof.gov.vn/webcenter/cs/groups/cqlg_all_content/documents/tinbai/dwnt/mtk4/~edisp/~export/MOFUCM198757~1/5258.jpg"
                className={cx('img')}
              />
          </div>
          
          <div className={cx('text1')}>
            Khoảng cách từ điểm xuất phát tới điểm du lịch là<b style={{fontSize: '25px', margin: '0 10px'}}>30km</b> 
          </div>

          {/* <div className={cx('from-to-location-container')}> */}
            {props?.destinationInfo?.lat && props?.destinationInfo?.lon? <Maps lat={Number(props?.destinationInfo?.lat)} long={Number(props?.destinationInfo?.lon)} mapWidth={`100%`} mapHeight={'300px'} mapType="direction"/> : <Spin size='large'/>}
          {/* </div> */}
        </div>

        {/* <div className={cx('right')}>

        </div> */}
        
        
    </div>

 
  )
};

export default TransportSuggestion