import React, { useState, useEffect, useCallback } from 'react';
import { List, message, Avatar, Skeleton, Divider, Button, Spin, Form, Input, Modal } from 'antd';
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
import styles from 'src/styles/Hotel.module.scss';
import { ChatFeed, Message } from 'react-chat-ui'
 import { Radio } from 'antd';

import classNames from 'classnames/bind';
import { FaLocationArrow } from 'react-icons/fa';
import { createChatGroup, getChatDetailById, getRecentsChat } from 'src/services/chat-service';
import moment from 'moment';
import { getAirport, getFlight, getSuggestion, getSuggestionAttraction, getSuggestionDetail, getSuggestionHotels, getSuggestionThingToDo } from 'src/services/suggestion-service';
import { Slide, Fade } from 'react-slideshow-image';
import "react-slideshow-image/dist/styles.css";
import { AiOutlineArrowDown, AiOutlineClockCircle, AiFillStar} from 'react-icons/ai';
import {BsArrowDownCircle } from 'react-icons/bs';
import { useLocation, useParams } from 'react-router-dom';
const cx = classNames.bind(styles);
import { DatePicker, Space } from 'antd';
import { Select, Checkbox } from 'antd';
import dataHotel from './hotel.json'
import dataHotel2 from './TravidHotel.json'
import { Slider, Switch } from 'antd';


const { Option } = Select;

import dataRoundTrop from './dataRoundtrip.json'


const hanoi = {
  lat: 21.035911,
  lon: 105.839431
}

const hcmLocation = {
  lat: 10.776308,
  lon: 106.702867
}

const { RangePicker } = DatePicker;


const HotelSuggestion = (props: any) => {
  const [btn, setBtn] = useState<boolean>(false)
  const location = useLocation();
  const params = useParams()
  const [data, setData] = useState<any>(null)

  const [form] = Form.useForm();
  const [currentPosition, setCurrentPosition] = useState<any>(null)
  const [hotelStar, setHotelStar] = useState<any>(null)

  const currentPos: any = useSelector((state: RootState) => state.wallet.currentPosition);

  useEffect(() => {
    setCurrentPosition(currentPos)
  }, [currentPos])


  console.log(data)

  const search = useLocation().search;
  const name=new URLSearchParams(search).get("name");
  const lat=new URLSearchParams(search).get("lat");
  const lon=new URLSearchParams(search).get("lon");
  const destinationId=new URLSearchParams(search).get("destinationId") || '1633619';

  const properties = {
        duration: 5000,
        autoplay: false,
        transitionDuration: 500,
        arrows: true,
        infinite: true,
        easing: "ease",
        indicators: false,
        slidesToShow: 3,
        slidesToScroll: 1,
    };


  const Slideshow = () => {
        return (
         <div className={`slide-container ${cx('slider-container2')}`} >
            {/* <Slide
                {...properties}
            > */}
                    {
                    // data?.body?.searchResults?.results?.map((item: any, index: any) => {
                      data?.data?.map((item: any, index: any) => {
                        return (
                           <div className={cx('recent-container')} key={index} onClick={() => {

                            }}>
                                   <img src={item?.photo?.images?.original?.url || `https://media-cdn.tripadvisor.com/media/photo-s/1d/c3/ac/85/exterior-view.jpg`} alt="img" className={cx('img')}/> 
                                {/* <div className={cx('location-pos')}>
                                    <MdLocationOn size={30} className={cx(`location-icon`)}/>
                                </div> */}
                                <div className={cx('location-name')}>
                                    {item?.name}
                                </div>
                                <div className={cx('reviews')}>
                                   <div className={cx('visited')}>
                                      <AiFillStar size={20} color={'white'} style={{margin: '0 5px'}}/>
                                      <div className={cx('count')}>
                                        {item?.price} 
                                      </div>
                                  </div>
                                  <div className={cx('total')}>
                                      {item?.num_reviews || '0'} Reviews
                                  </div>
                                </div>

                                <div className={cx('reviews')}>
                                  <div className={cx('total')}>
                                      {item?.ranking}
                                  </div>
                                </div>
                                 <div className={cx('reviews')}>
                                  <div className={cx('total')}>
                                      {item?.address?.streetAddress}
                                  </div>
                                </div>

                               
                                
                            </div>
                        )
                    })
                }
             {/* </Slide> */}
        </div>
        )
    }

    const hotelStars = [
      { label: '1 star', value: '1' },
      { label: '2 stars', value: '2' },
        { label: '3 stars', value: '3' },
      { label: '4 stars', value: '4' },
        { label: '5 stars', value: '5' },
    ];

  
  const children: any = [
    "amenities",
    "beach",
    "fitness_center",
    "free_internet",
    "minibar",
    "self_service_laundry_facilities",
    "spa",
    "pets_allowed",
    "adult_pool",
    "suites",
    "indoor_pool",
    "hot_tub",
    "bar_lounge",
    "smoking_rooms",
    "high_speed_internet_in_room",
    "refrigerator",
    "swimming_pool",
    "high_speed_internet_in_room_surcharge",
    "ski_in_ski_out",
    "concierge_desk",
    "wireless_internet_in_public_areas",
    "kids_activities",
    "wheelchair_access",
    "dry_cleaning",
    "babysitting_service",
    "free_wireless_internet_in_room",
    "outdoor_pool",
    "kids_pool",
    "golf_course",
    "meeting_room",
    "electric_vehicle_charging_station",
    "free_breakfast",
    "breakfast_available",
    "shuttle_bus_service",
    "multilingual_staff",
    "family_rooms",
    "banquet_room",
    "kitchenette",
    "free_parking",
    "business_services",
    "microwave",
    "airport_transportation",
    "air_conditioning",
    "reduced_mobility_rooms",
    "room_service",
    "laundry",
    "non_smoking_hotel",
    "non_smoking",
    "tennis_court",
    "conference_facilities",
    "restaurant",
    "casino",
    "beverage_selection"
  ];
  const amenities: any = []
  children.forEach(item => {
    amenities.push(<Option key={item}>{item}</Option>);
  });

  const zfff = [
    {
      label: "Romantic",
      id: 3
    },
    {
      label: "Family",
      id: 4
    },
    {
      label: "Best Value",
      id: 6
    },
    {
      label: "Business",
      id: 7
    },
    {
      label: "Top resorts",
      id: 8
    },
    {
      label: "On the beach",
      id: 10
    },
    {
      label: "Spa",
      id: 13
    },
    {
      label: "Casino",
      id: 14
    },

  ]
  const hotelStyles: any = []
  zfff.forEach(item => {
    hotelStyles.push(<Option key={item.id}>{item.label}</Option>);
  });


  const [hotelForm, setHotelForm] = useState<any>({
    destinationId: destinationId,
    pageNumber: '1',
    pageSize: '30',
    checkIn: null,
    checkOut: null,
    priceMin: null,
    priceMax: null,
    sortOrder:'PRICE',
    locale: 'vi_VN',
    currency: 'VND'
    // number_of_passengers: '2'
  })

 
  function disabledDate(current) {
    return current && current < moment().endOf('day');
  }

  useEffect(() => {
    setData(dataHotel2)
  }, [])

  const getListsHotels = async (payload) => {
    // if(payload?.checkIn && payload?.checkOut && payload?.destinationId) {
    //    const suggest = await getSuggestionHotels({latitude: '21.032188', longitude: '105.81282', limit: '30', distance: '100'})
      // console.log(suggest)
      // const rs = _.get(suggest, 'data.data', null);
      // console.log(rs)
      // setData(rs)
      setData(dataHotel2)
    // }
   

    
  }

  
  useEffect(() => {

  }, [])

  
  const handleFinish = async (values) => {
    console.log(values)
    const payload = {
      ...values,
      ...hotelForm
    }
    // console.log(payload)
    // return;
    if(hotelStar) payload["starRatings"] = hotelStar
    await getListsHotels(payload)
  console.log(payload)    
  }

  return (
    <div className={cx('flight-suggestion-detail-container')}>
      
        <div className={cx('left')}>
          

          <Form
              form={form}
              layout="vertical"
              autoComplete="off"
              onFinish={handleFinish}
              style={{ width: '100%' }}
          >
            <div className={cx('class')}>Số người lớn</div>
          <Form.Item 
              name="adults1"
              className={cx(`input`)}
              style={{ width: '100%' }}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value: string) {
                    return Promise.resolve()
                  }
                  })
              ]}
              >
              <Input
                type='number'
                placeholder='Adults'
                className={cx('comment-input')}
                // onChange={() => {setIsTyping(true)}}
              />
            </Form.Item>


          </Form>

          <div className={cx('class')}>Thời gian nhận phòng</div>

          <DatePicker onChange={(e: any) => {
            if(e) {
              setHotelForm({...hotelForm, checkIn: moment(e).format('YYYY-MM-DD')})
            }
          }} 
          style={{ width: '100%' }}
          />

           <div className={cx('class')}>Thời gian trả phòng</div>

          <DatePicker onChange={(e: any) => {
            if(e) {
             setHotelForm({...hotelForm, checkOut: moment(e).format('YYYY-MM-DD')})
            }
          }} 
           style={{ width: '100%' }}
          />

          <div className={cx('class')}>Loại khách sạn</div>
          <div style={{ width: '100%' , display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
               <Checkbox.Group options={hotelStars}  onChange={(e) => {setHotelStar(e.toString())}} />
          </div>
          
          {
            data ?  (
              <>
                <div className={cx('class')}>Gía mỗi đêm (VNĐ)</div>
                <Slider range defaultValue={[data?.filters?.price?.range?.min?.defaultValue,data?.filters?.price?.range?.max?.defaultValue]}  
                style={{width: '100%'}}
                min={data?.filters?.price?.range?.min?.defaultValue}
                max={data?.filters?.price?.range?.max?.defaultValue}
                onAfterChange={(e) => {
                  console.log(e)
                  setHotelForm({...hotelForm, priceMin: e[0], priceMax: e[1]})
                }}
                />
             </>
            ): null
          }
          
          <div className={cx('class')}>Loại vé</div>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              defaultValue={[]}
              onChange={(e) => {console.log(e)}}
            >
              {amenities}
            </Select>


            

          <div className={cx('class')}>Lựa chọn các tiện nghi</div>

            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              defaultValue={[]}
              onChange={(e) => {console.log(e)}}
            >
              {hotelStyles}
            </Select>

            <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Button className={cx('button-search')} onClick={() => form.submit()}>
                SEARCH
              </Button>
            </div>

          
        </div>

        <div className={cx('right')}>
              {data ?  <Slideshow />  : null }
        </div>
        
        
    </div>

 
  )
};

export default HotelSuggestion