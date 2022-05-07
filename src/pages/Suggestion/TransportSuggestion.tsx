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
import { getSuggestionVehicle } from 'src/services/place-service';
import { MdOutlineRecommend} from 'react-icons/md'
import {AiFillCar} from 'react-icons/ai'
import {RiMotorbikeFill} from 'react-icons/ri'
const { Option } = Select;
import recommendVehicle from './recommentVehicle.json'

const { RangePicker } = DatePicker;


const TransportSuggestion = (props: any) => {
 
 const [airportFrom, setAirportFrom] = useState<any>(null)
  const [airportTo, setAirportTo] = useState<any>(null)

  const [recommentVehicle, setRecommentVehicle] = useState<any>(null)
    const [isModalVisibleMapDirection, setIsModalVisibleMapDirection] = useState(false);


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
    const suggest = await getAirport(lat, lon, {});
    const rs = _.get(suggest, 'data', null);
    if(type==='from') setAirportFrom(rs)
    
    if(type==='to') setAirportTo(rs)
    
    console.log("++++++++++++++++++++++++++",rs)

    // if(type==='from') setAirportFrom(flightFrom)
    // if(type==='to') setAirportTo(flightTo)

  }

  console.log(recommentVehicle)
  useEffect(() => {
    if(props?.destinationInfo && props?.startInfo && airportFrom && airportTo){
      let airportFromFormat: any = []
      console.log("from",airportFrom)
      if(airportFrom) airportFrom?.items?.map((from) => {
          return airportFromFormat.push(
              {
                address: from?.iata,
                name: from?.name,
                lat: from?.location?.lat,
                lng: from?.location?.lon
            }
        )
      })

      let airportToFormat: any = []
     if(airportTo) airportTo?.items?.map((to) => {
          return airportToFormat.push(
              {
                address: to?.iata,
                name: to?.name,
                lat: to?.location?.lat,
                lng: to?.location?.lon
            }
        )
      })

      suggestVehicle({
        destinationLat: Number(props?.destinationInfo?.lat), 
        destinationLng: Number(props?.destinationInfo?.lon),
        depatureLat: Number(props?.startInfo?.lat), 
        depatureLng: Number(props?.startInfo?.lon),
        nearDepartureAirports: airportFromFormat,
        nearDestinationAirports: airportToFormat
      })
    } 
  }, [props?.destinationInfo, props?.startInfo, airportFrom, airportTo])

  const suggestVehicle = async (payload) => {
    console.log(payload)
    const vehicle = await getSuggestionVehicle(payload)
    const rs =  _.get(vehicle, 'data', null);
    console.log(rs)
    setRecommentVehicle(rs)
  }


    const handleCancel = () => {
        setIsModalVisibleMapDirection(false)
    };

  console.log(props?.destinationInfo)
  return (
    <div className={cx('transport-suggestion-detail-container')}
      
    >

      <div className={cx('vehile-suggestion')}>
        {
          !recommentVehicle ? <Spin size='large'/> :
(            <>
              <div className={cx(`${recommentVehicle.filter((rv) => rv?.name === 'plane')[0]?.recomment === true ? 'transport-info-recommend' : 'transport-info' }`)}>
                  <div className={cx('name')}>
                    Máy bay
                  </div>
                  <img src="https://img.freepik.com/free-photo/white-plane-flying-low-airport-road_512343-675.jpg"
                      className={cx('img')}
                    />
                    {
                      recommentVehicle.filter((rv) => rv?.name === 'plane')[0]?.recomment === true ? 
                      <MdOutlineRecommend  color='white' className={cx('icon-recommend')} size={40} />: null 
                      }
                </div>
                <div className={cx(`${recommentVehicle.filter((rv) => rv?.name === 'car')[0]?.recomment === true ? 'transport-info-recommend' : 'transport-info' }`)}>
                  <div className={cx('name')}>
                    Ô tô
                  </div>
                  <img src="https://assets.traveltriangle.com/blog/wp-content/uploads/2016/09/countries-drive-from-india-cover2.jpg"
                      className={cx('img')}
                    />
                    {
                      recommentVehicle.filter((rv) => rv?.name === 'car')[0]?.recomment === true ? 
                      <MdOutlineRecommend  color='white' className={cx('icon-recommend')} size={40} />: null 
                      }
                </div>
                <div className={cx(`${recommentVehicle.filter((rv) => rv?.name === 'bike')[0]?.recomment === true ? 'transport-info-recommend': 'transport-info'  }`)}>
                  <div className={cx('name')}>
                    Xe máy
                  </div>
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9L1KtUKQb3RrXjFzOvPa5CFbWFDjqIBIcyQ&usqp=CAU"
                      className={cx('img')}
                    />
                     {
                      recommentVehicle.filter((rv) => rv?.name === 'bike')[0]?.recomment === true ? 
                      <MdOutlineRecommend  color='white' className={cx('icon-recommend')} size={40} />: null 
                      }
                </div>
              </>)
        }
          
      </div>
      
      <div className={cx('vehicle-detail-info')}>
        <div className={cx('left')} >
          <div className={cx('transport-info')}>
            <div className={cx('name')}>
              Đường hàng không
            </div>
            {/* <img src="https://statics.vinpearl.com/kinh-nghiem-dat-ve-may-bay-2_1630647705.jpg"
                className={cx('img')}
              /> */}

              <div className={cx('text1-container')}>
                <div className={cx('text1')}>
                  Khoảng cách ước tính<b style={{fontSize: '20px', margin: '0 10px'}}>30km</b> 
                </div>
                <div className={cx('text1')}>
                  Thời gian dự kiến<b style={{fontSize: '20px', margin: '0 10px'}}>{moment.utc(5893718.319301199*1000).format('HH:mm:ss')}</b> 
                </div>
              </div>
          </div>
          
          

          <div className={cx('text')}>
            Chúng tôi đề xuất các sân bay gần nhât so với địa điểm bạn chọn <br />
           
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

              <div className={cx('btn-next-container')}
              >
                <Button className={cx('btn-next')} onClick={() =>{
                    props?.setCurrentStep(props?.currentStep + 1)
                    props?.setVehicleChoose('plane')
                  }}>
                  Tham khảo các chuyến bay
                </Button>
               </div> 
            
        </div>
         <div className={cx('right')} >
          <div className={cx('transport-info')}>
            <div className={cx('name')}>
              đường bộ
            </div>
            <img src="https://mof.gov.vn/webcenter/cs/groups/cqlg_all_content/documents/tinbai/dwnt/mtk4/~edisp/~export/MOFUCM198757~1/5258.jpg"
                className={cx('img')}
              />
          </div>
          
          <div className={cx('ground-street')}>
            <div className={cx('text1-container')} onClick={() => {
              props?.setVehicleChoose('car')
              props?.setCurrentStep(props?.currentStep + 2)
            }}>
                <div className={cx('text-name')} >
                  <div className={cx('name')}>Ô tô </div><AiFillCar size={35}/>
                </div>
                <div className={cx('text1')}>
                  Khoảng cách ước tính<b style={{fontSize: '20px', margin: '0 10px'}}>30km</b> 
                </div>
                <div className={cx('text1')}>
                  Thời gian dự kiến<b style={{fontSize: '20px', margin: '0 10px'}}>{moment.utc(5893718.319301199*1000).format('HH:mm:ss')}</b> 
                </div>
            </div>
            <div className={cx('text1-container')} onClick={() => {
              props?.setVehicleChoose('bike')
              props?.setCurrentStep(props?.currentStep + 2)
            }}>
               <div className={cx('text-name')}>
                  <div className={cx('name')}>Xe máy</div><RiMotorbikeFill size={35}/>
                </div>
                <div className={cx('text1')}>
                  Khoảng cách ước tính<b style={{fontSize: '20px', margin: '0 10px'}}>30km</b> 
                </div>
                <div className={cx('text1')}>
                  Thời gian dự kiến<b style={{fontSize: '20px', margin: '0 10px'}}>{moment.utc(5893718.319301199*1000).format('HH:mm:ss')}</b> 
                </div>
            </div>
          </div>
           

          <div className={cx('btn-next-container')}
              >
                <Button className={cx('btn-next')} onClick={() =>{
                    setIsModalVisibleMapDirection(true)
                  }}>
                  xem đường đi
                </Button>
                {/* <Button className={cx('btn-next')} onClick={() =>{
                    props?.setCurrentStep(props?.currentStep + 2)
                  }}>
                  Tiếp theo
                </Button> */}
               </div> 

          {/* <div className={cx('from-to-location-container')}> */}

          <Modal visible={isModalVisibleMapDirection} footer={null} onCancel={handleCancel} style={{borderRadius: '20px', padding: '0px !important'}} width={1200} closable={false} bodyStyle={{padding: '0'}}>
            {  props?.destinationInfo?.lat && props?.destinationInfo?.lon? <Maps lat={Number(props?.destinationInfo?.lat)} long={Number(props?.destinationInfo?.lon)} mapType="direction" suggestVehicle={true}/> : null }
          </Modal>
            {/* {props?.destinationInfo?.lat && props?.destinationInfo?.lon? <Maps lat={Number(props?.destinationInfo?.lat)} long={Number(props?.destinationInfo?.lon)} mapWidth={`100%`} mapHeight={'300px'} mapType="direction"/> : null} */}
          {/* </div> */}
        </div>

        {/* <div className={cx('right')}>

        </div> */}
        </div>
        
    </div>

 
  )
};

export default TransportSuggestion