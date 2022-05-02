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
import styles from 'src/styles/Flight.module.scss';
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
import {FaArrowDown} from 'react-icons/fa'
import { useLocation, useParams } from 'react-router-dom';
const cx = classNames.bind(styles);
import { DatePicker, Space } from 'antd';
import { Select } from 'antd';
import flightFrom from './flightFrom.json'
import flightTo from './flightTo.json'
import dataRoundTrop from './dataRoundtrip.json'

const { Option } = Select;

const hanoi = {
  lat: 21.035911,
  lon: 105.839431
}

const hcmLocation = {
  lat: 10.776308,
  lon: 106.702867
}

const { RangePicker } = DatePicker;


const FlightSelect = (props: any) => {
  const [btn, setBtn] = useState<boolean>(false)
  const location = useLocation();
  const params = useParams()
  const [data, setData] = useState<any>(null)
  const [airline, setAirline] = useState<any>(null)

  

  const CLASS_TYPE = {
    ECO: "ECO",
    BUS: "BUS",
    PEC: "PEC",
    FST: "FST"
  }

  const ITINERARY_TYPE = {
    ONE_WAY: "ONE_WAY",
    ROUND_TRIP: "ROUND_TRIP"
  }

  const [airportFrom, setAirportFrom] = useState<any>(null)
  const [airportTo, setAirportTo] = useState<any>(null)


  const [flightForm, setFlightForm] = useState<any>({
    date_departure: null,
    class_type: CLASS_TYPE.ECO,
    itinerary_type: ITINERARY_TYPE.ONE_WAY,
    location_arrival: null,
    location_departure: null,
    sort_order: 'PRICE',
    date_departure_return: null,
  })

  const [date_departure, setDate_departure] = useState(null)
  const [date_departure_return, setDate_departure_return] = useState(null)
  const [location_arrival, setLocation_arrival] = useState(null)
  const [location_departure, setLocation_departure] = useState(null)
  
  


 
  function disabledDate(current) {
    return current && current < moment().endOf('day');
  }

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

  useEffect(() => {
    if(props?.startDate?.length>0) {
      setFlightForm({...flightForm, date_departure: props?.startDate})
    }
  }, [props?.startDate?.length>0])

  useEffect(() => {
    console.log('start------------', props?.startDate , props?.endDate)
    if(props?.endDate) {
      setFlightForm({...flightForm,  date_departure_return: props?.endDate})
    }
  }, [props?.endDate])

  useEffect(() => {
    console.log('get flight comer here', flightForm)
    if(airportFrom&& airportTo&& props?.startDate && props?.endDate  ) getFLightEJ(airportFrom, airportTo, props?.startDate ,props?.endDate )
  }, [airportFrom, airportTo , flightForm?.startDate , flightForm?.endDate  ])

  const getAirportSelect = async (lat: number, lon:number, type: string) => {
    const suggest = await getAirport(lat, lon, {});
    const rs = _.get(suggest, 'data', null);
    if(type==='from') {
      setFlightForm({...flightForm, location_departure: rs?.items[0]?.iata})
      setAirportFrom(rs)
    }
    if(type==='to') {
      setFlightForm({...flightForm, location_arrival: rs?.items[0]?.iata})
      setAirportTo(rs)
    }
    console.log("++++++++++++++++++++++++++",rs)


    // if(type==='from') setAirportFrom(flightFrom)
    // if(type==='to') setAirportTo(flightTo)
  }

  console.log(flightForm)

  const getFLightEJ = async (airportFrom, airportTo ,startDate, endDate ) => {
    console.log("why-------=======",airportFrom, airportTo ,startDate, endDate )
    setFlightForm({
      ...flightForm,
      date_departure: startDate, 
      date_departure_return: endDate,
       location_arrival: airportTo,
       location_departure: airportFrom
    })

    let payload = {
      class_type: flightForm.class_type,
      itinerary_type: flightForm.itinerary_type,
      sort_order: 'PRICE',
      date_departure: startDate, 
      date_departure_return: endDate,
       location_arrival: airportTo?.items[0]?.iata,
       location_departure: airportFrom?.items[0]?.iata
    }
    console.log("why-------======",flightForm)

    console.log('CLGT', payload)
    if(payload) {
      console.log('comer here')
      const suggest = await getFlight(payload)
      console.log(suggest)
      const rs = _.get(suggest, 'data', null);
      console.log(rs)
      setAirline(rs?.airline)
      setData(rs)
    }
    //  setData(dataRoundTrop)
    // setAirline(dataRoundTrop.airline)
  }


  const ListFlight = () => {
    return (
      data?.itineraryType === ITINERARY_TYPE.ONE_WAY ?
      <div className={cx('flight-container')}>
        {
          data?.segment?.filter((it) => it?.origAirport === data?.totalTripSummary?.airport[0]?.origin
           && it?.destAirport === data?.totalTripSummary?.airport[0]?.destination)?.map((item, index) => {
            return (
              <div className={cx('flight-detail-cotainer')} key={index}>
                <div className={cx('flight-info')}>
                  <div className={cx('airline-info')}>
                    <>
                       <img src='https://tonghopweb.com/upload/product/unnamed-1-3097.png'
                        className={cx('logo')}
                      />
                        {airline?.filter((ai) => ai?.code === item?.operatingAirline)[0]?.name}
                    </>
                    <div style={{margin: '5px 0', fontSize: '15px'}}>{airline?.filter((ai) => ai?.code === item?.operatingAirline)[0]?.phoneNumber}</div>
                  </div>
                  

                  <div className={cx('time-flight')}>
                    <div className={cx('from')}>
                      <div className={cx('top')}>Khởi hành - {data?.totalTripSummary?.airport[0]?.origin}</div>
                      <div className={cx('time')}>{moment(item?.departDateTime).format('HH:mm')}</div>
                      <div className={cx('date')}>{moment(item?.departDateTime).format('YYYY-MM-DD')}</div>
                    </div>
                    <div className={cx('time')}>
                        <div className={cx('flight-duration')}><AiOutlineClockCircle style={{margin: '0 5px'}}/> {Math.floor(item?.duration / 60) + 'h ' + item?.duration % 60 + 'm'}</div>
                        <div className={cx('line')}></div>
                        <div className={cx('stop-quantity')}>{item?.stopQuantity === 0 ? 'non stop' : `${item?.stopQuantity} stop`}</div>
                    </div>
                    <div className={cx('from')}>
                        <div className={cx('top')}>Hạ cánh - {data?.totalTripSummary?.airport[0]?.destination}</div>
                        <div className={cx('time')}>{moment(item?.arrivalDateTime).format('HH:mm')}</div>
                        <div className={cx('date')}>{moment(item?.arrivalDateTime).format('YYYY-MM-DD')}</div>
                    </div>
                  </div>

                </div>

                <div className={cx('durration')}>
                  Số hiệu máy bay: {item?.flightNumber} 
                </div>

                {/* <div>
                  {data?.slice?.segment?.findIndex((seg) => seg?.uniqueSegId === item?.uniqueSegId)}
                  {data?.pricedItinerary?.slice?.filter((sli) => sli?.uniqueSliceId === item?.uniqueSegId)}
                </div> */}
                
              </div>
            )
          })
        }
      </div> : data?.itineraryType === ITINERARY_TYPE.ROUND_TRIP ? (
          <div className={cx('flight-container')}>
        {
          data?.segment?.map((item, index) => {
            return (
              <div className={cx('flight-detail-cotainer')} key={index}>
                <div className={cx('flight-info')}>
                  <div className={cx('airline-info')}>
                    <>
                       <img src='https://tonghopweb.com/upload/product/unnamed-1-3097.png'
                        className={cx('logo')}
                      />
                        {airline?.filter((ai) => ai?.code === item?.operatingAirline)[0]?.name}
                    </>
                    <div style={{margin: '5px 0', fontSize: '15px'}}>{airline?.filter((ai) => ai?.code === item?.operatingAirline)[0]?.phoneNumber}</div>
                  </div>
                  

                  <div className={cx('time-flight')}>
                    <div className={cx('from')}>
                      <div className={cx('top')}>Khởi hành - {item?.origAirport}</div>
                      <div className={cx('time')}>{moment(item?.departDateTime).format('HH:mm')}</div>
                      <div className={cx('date')}>{moment(item?.departDateTime).format('YYYY-MM-DD')}</div>
                    </div>
                    <div className={cx('time')}>
                        <div className={cx('flight-duration')}><AiOutlineClockCircle style={{margin: '0 5px'}}/> {Math.floor(item?.duration / 60) + 'h ' + item?.duration % 60 + 'm'}</div>
                        <div className={cx('line')}></div>
                        <div className={cx('stop-quantity')}>{item?.stopQuantity === 0 ? 'non stop' : `${item?.stopQuantity} stop`}</div>
                    </div>
                    <div className={cx('from')}>
                        <div className={cx('top')}>Hạ cánh - {item?.destAirport}</div>
                        <div className={cx('time')}>{moment(item?.arrivalDateTime).format('HH:mm')}</div>
                        <div className={cx('date')}>{moment(item?.arrivalDateTime).format('YYYY-MM-DD')}</div>
                    </div>
                  </div>

                </div>

                <div className={cx('durration')}>
                  Số hiệu máy bay: {item?.flightNumber} 
                </div>

                {/* <div>
                  {data?.slice?.segment?.findIndex((seg) => seg?.uniqueSegId === item?.uniqueSegId)}
                  {data?.pricedItinerary?.slice?.filter((sli) => sli?.uniqueSliceId === item?.uniqueSegId)}
                </div> */}
                
              </div>
            )
          })
        }
      </div>
      ) : <div className={cx('flight-container')}>
        No data
      </div>
      
    )
  }

  return (
    <div className={cx('flight-suggestion-detail-container')}>
      
        <div className={cx('left')}>
          {
            airportFrom && airportTo ? (
              <>
              <div className={cx('class')}>Địa điểm</div>
                <div className={cx('from-to-location-container')}>
                  <div className={cx('from')}>
                      <div className={cx('top')}>Từ 
                        <Tooltip placement="topLeft" title={"sân bay gần với vị trí của bạn nhất"}>
                          <AiFillQuestionCircle color='#68d1c8' size={20} style={{margin: '0 10px'}}/>
                        </Tooltip>
                      </div>
                      <div className={cx('name')}><GiAirplaneDeparture size={20} style={{marginRight: '10px'}}/>{airportFrom?.items[0]?.name}</div>
                      <div className={cx('iata')}>{airportFrom?.items[0]?.iata}</div>
                  </div>
                  <FaArrowDown size={50} color='#68d1c8' className={cx('icon-arrow')}/>
                  <div className={cx('from')}>
                    <div className={cx('top')}>đến
                        <Tooltip placement="topLeft" title={"sân bay gần với điểm đến của bạn nhất"}>
                          <AiFillQuestionCircle color='#68d1c8' size={20} style={{margin: '0 10px'}}/>
                        </Tooltip>
                      </div>
                      <div className={cx('name')}><GiAirplaneArrival size={20} style={{marginRight: '10px'}}/>{airportTo?.items[0]?.name}</div>
                      <div className={cx('iata')}>{airportTo?.items[0]?.iata}</div>
                  </div>
                </div>

                {/* <div className={cx('class')}>Thời gian</div>

                <div className={cx('from-to-departure')}>
                   */}
                  {/* <Modal visible={pickerOpen} footer={null} onCancel={() => {setpickerOpen(false)}}  width={500} closable={false} > */}
                    {/* <RangePicker disabledDate={disabledDate} style={{width: '100%'}} onChange={(e: any) => {
                        if(e) {
                          let start = moment(e[0]).format('YYYY-MM-DD')
                          let end = moment(e[1]).format('YYYY-MM-DD')
                          setFlightForm({...flightForm, date_departure: start, date_departure_return: end})
                        }
                      }}/> */}
                  {/* </Modal> */}
                {/* </div> */}

                <div className={cx('class')}>Hạng vé</div>
                <div className={cx('class-type')}>
                  
                  <Radio.Group className={cx('class-select')} defaultValue={CLASS_TYPE.ECO} buttonStyle="solid" onChange={(e) => {
                    setFlightForm({...flightForm, class_type: e.target.value})
                    }}>
                    <Radio.Button value={CLASS_TYPE.ECO}>Economy</Radio.Button>
                    <Radio.Button value={CLASS_TYPE.PEC}>Premium</Radio.Button>
                    <Radio.Button value={CLASS_TYPE.BUS}>Business</Radio.Button>
                    <Radio.Button value={CLASS_TYPE.FST}>First Class</Radio.Button>
                  </Radio.Group>
                </div>

                <div className={cx('class')}>Loại vé</div>
                <div className={cx('itinerary-type')}>
                  <Radio.Group defaultValue={ITINERARY_TYPE.ONE_WAY} onChange={(e) => {
                    setFlightForm({...flightForm, itinerary_type: e.target.value})
                    }}>
                    <Radio  value={ITINERARY_TYPE.ONE_WAY}>One way</Radio>
                    <Radio value={ITINERARY_TYPE.ROUND_TRIP}>Round trip</Radio>
                  </Radio.Group>
                </div>

                <div className={cx('button-search')} 
                onClick={() => getFLightEJ(
                  flightForm?.location_departure, 
                  flightForm?.location_arrival,
                  flightForm?.date_departure,
                  flightForm?.date_departure_return
                )}
                >
                  SEARCH
                </div>
              </>
            ) : null
          }
         
        </div>

        <div className={cx('right')}>
              {
                airline && data ? <ListFlight /> : null
              }
        </div>
        
        
    </div>

 
  )
};

export default FlightSelect