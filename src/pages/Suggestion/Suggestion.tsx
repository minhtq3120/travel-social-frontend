import React, { useState, useEffect, useCallback } from 'react';
import { List, message, Avatar, Skeleton, Divider, Button, Spin, Form, Input, Modal, Select } from 'antd';
import VirtualList from 'rc-virtual-list';
import { followId, getFollowers, getFollowing, unfollowId } from 'src/services/follow-service';
import _ from 'lodash';
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
import styles from 'src/styles/Suggestion.module.scss';
import { ChatFeed, Message } from 'react-chat-ui'
 

import classNames from 'classnames/bind';
import { FaLocationArrow } from 'react-icons/fa';
import { createChatGroup, getChatDetailById, getRecentsChat } from 'src/services/chat-service';
import moment from 'moment';
import { getSuggestion, getSuggestionActivities, getSuggestionThingToDo } from 'src/services/suggestion-service';
import { useHistory } from 'react-router-dom';

import { Steps } from 'antd';
import FlightSelect from './FlightSelection';
import HotelSuggestion from './HotelSuggestion';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {AiFillStar } from 'react-icons/ai';
import {GoLocation} from 'react-icons/go'
import {BiCurrentLocation} from 'react-icons/bi'

const { Step } = Steps;

import { Slide, Fade } from 'react-slideshow-image';
import "react-slideshow-image/dist/styles.css";

const JOIN_ROOM ='joinRoom';
const JOIN_ROOM_SUCCESS ='joinRoomSuccess'
export const SEND_MESSAGE = 'sendMessage';
export const RECEIVE_MESSAGE = 'receiveMessage'
import city from './city.json'
import { DatePicker, Space } from 'antd';
import { DateRangePicker } from 'react-date-range';

import ShowMoreText from "react-show-more-text";

const { RangePicker } = DatePicker;

import { Calendar } from 'react-date-range';
import ddddd from './test2.json'
import fffff from './test.json'

import test1 from './filter.json'
import test2 from './filter2.json'
import test3 from './filter3.json'
import test4 from './filter4vietnam.json'

import { getPlaces, getPlacesDetail } from 'src/services/place-service';
import TransportSuggestion from './TransportSuggestion';
import ConsumseTrip from './ConsumseTrip';

const cx = classNames.bind(styles);
const {Option} = Select

const Suggestion = (props: any) => {
  const [btn, setBtn] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState(0)

  const [seachPlace, setSearchPlace] = useState<any>(null)
  const [dataPlaces, setDataPlaces] = useState<any>([])

  const [currentPosition, setCurrentPosition] = useState<any>(null)

  const currentPos: any = useSelector((state: RootState) => state.wallet.currentPosition);

  useEffect(() => {
    setCurrentPosition(currentPos)
  }, [currentPos])

  useEffect(() => {
      const fetchPlace = async () =>{
        const rs = await getPlaces({
          input: seachPlace
        })
        const dataSource = _.get(rs, 'data');
        setDataPlaces(dataSource)
      }

      fetchPlace()
    }, [seachPlace])


  const onChangeStep = current => {
    setCurrentStep(current)
  };


  const history = useHistory()

  const [data, setData] = useState<any>(city)

  const [destinationInfo, setDestinationInfo] = useState<any>(null)

  const [startInfo, setStartInfo] = useState<any>(null)

  const [thingsToDo, setThingsTodo] = useState<any>(test4)

  const [selectedTypeTravel, setSelectedTypeTravel] = useState<any>('')
  const [selectedTravelWith, setSelectedTravelWith] = useState<any>('')
  const [travelCity, setTravelCity] = useState<any>(null) 
  const [travelPlace, setTravelPlace] = useState<any>(null)
  const [vehicleChoose,setVehicleChoose] = useState<any>(null)
  const [flightDetail, setFlightDetail] = useState<any>(null)
  const [hotelSelect, setHotelSelect] = useState<any>(null)

  const [dataSuggest, setDataSuggest] = useState<any>(null)

  const [visibleModalCityDetail, setVisibleModalCityDetail] = useState(false)
  const [visibleModalPlaceDetail, setVisibleModalPlaceDetail] = useState(false)


  const [locationId, setLocationId] = useState<any>(null) 
  const setStartPosFromPlaceId = async (placeId: string) => {
    const placeDetail = await getPlacesDetail(placeId)
    const rs = _.get(placeDetail, 'data', null);
    setStartInfo({
      lat: rs?.coordinate?.latitude,
      lon: rs?.coordinate?.longitude
    })
    setCurrentStep(currentStep + 1)
  }

  const getSugeestionThingsToDo = async () => {
    const suggest = await getSuggestionThingToDo({
      query: 'HUẾ',
      limit: '1000',
      offset: '3',
      units: 'km',
      sort: 'relevance',
      lang: 'vi_VN'
    });
    const rs = _.get(suggest, 'data', null);
  }

  const getPlacesSuggest = async (locationId: string, subcategory: string ) => {
    let params = {
      location_id: locationId,
      lang: 'vi_VN',
      lunit: 'km',
      sort: 'recommended',
      // typeadhead_tag: 12169,
      subcategory: subcategory,
      // subtype:263,
    }
    const suggest = await getSuggestionActivities(params);
    const rs = _.get(suggest, 'data', null);
    if(rs) setDataSuggest(rs)
  }

  useEffect(() => {
    if(locationId && selectedTypeTravel?.length>0) getPlacesSuggest(locationId, selectedTypeTravel)
  }, [locationId])
  
  const TravelType = [
    {
      id: '42',
      title: "Chuyến tham quan",
      img: 'https://baodautu.vn/Images/chicong/2019/02/06/sep-savills-cbre-bat-dong-san-nghi-duong-viet-nam-co-nhieu-du-dia-phat-trien1549427175.jpg'
    },
     {
      id: '57',
      title: "Chiêm ngưỡng thiên nhiên",
      img: "https://otohanquoc.vn/tai-nguyen-du-lich-tu-nhien-la-gi/imager_2240.jpg"
    },
     {
      id: '47',
      title: "Danh lam thắng cảnh",
      img: "https://cdnimg.vietnamplus.vn/t1200/Uploaded/ngtmbh/2021_10_24/ttxvn_du_lich_tphcm.jpg"
    },
     {
      id: '61',
      title: "Hoạt động ngoài trời",
      img: "https://baokhanhhoa.vn/dataimages/201910/original/images5380577_c1.jpg"
    },
    {
      id: '56',
      title: "Vui chơi và giải trí",
      img: 'https://www.chudu24.com/wp-content/uploads/2018/07/1-12.png',
    },
  ]

  const TravelWith = [
    {
      id:1,
      title: "Một mình",
      img: "https://statics.vinpearl.com/du-lich-mot-minh-2_1632395432.jpg"
    },
     {
      id:2,
      title: "Gia đình",
      img: "https://dulichvietnam.com.vn/vnt_upload/news/09_2019/chon-dia-diem-gia-dinh-cung-thich.jpg"
    },
     {
      id:3,
      title: "Người yêu",
      img: "https://sktravel.com.vn/wp-content/uploads/2021/05/di-du-lich-sapa-2-nguoi-tong-chi-phi-het-bao-nhieu-2.jpg"
    },
     {
      id:4,
      title: "Nhóm bạn bè",
      img: "https://media.vov.vn/sites/default/files/styles/large/public/2020-11/5906-du-lich-theo-nhom-tu-tuc-hay-dat-tour-135831.jpg"
    },
  ]


  
  
  

  // const getSugeestionCity = async () => {
  //   const suggest = await getSuggestion({
  //     query: 'Việt Nam',
  //     locale: 'vi_VN',
  //     // currency: 'VND'
  //   });
  //   const rs = _.get(suggest, 'data', null);
  //   setData(rs)
  // }

 
  // useEffect(() => {
  //  if(currentStep === 1) getSugeestionCity()
  // }, [currentStep])


  const [selectionRange, setSelectionRange] = useState([{
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  }])

  const handleCancel = () => {
      setVisibleModalCityDetail(false)
      setTravelCity(null)
      setLocationId(null)
      
  };

  const handleCancel2 = () =>{
    setVisibleModalPlaceDetail(false)
    setTravelPlace(null)
    setDestinationInfo(null)
  }

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

  const SlideshowReward = (props) => {
        return (
         <div className={`slide-container ${cx('slider-container3')}`} >
          {/* <Slide
              {...properties}
          > */}
                  {
                  props?.data?.map((item: any, index: any) => {
                      return (
                          <div className={cx('recent-container')} key={index} style={{
                            display: 'flex',
                            flexDirection:'row',
                            justifyContent: 'flex-start',
                            alignItems: 'denter'
                          }} >
                             <img src={`${item?.images?.small}`} alt="img" style={{width: '80px', height: '80px'}}/> 
                             <div style={{marginLeft: '10px'}}>
                               <div style={{fontSize: '17px'}}>{item?.display_name}</div>
                              <div style={{fontSize: '17px'}}>{item?.categories?.toString()}</div>
                              </div>
                             
                          </div>
                      )
                  })
             }
            {/* </Slide> */}
      </div>
      )
  }



  const ModalCityDetail = () => {
    return (
        travelCity ? 
      
      <div className={cx('hotel-detail-container')}>
        <div className={cx('hotel-info')}>

          <img src={travelCity?.result_object?.photo?.images?.original?.url || `https://media-cdn.tripadvisor.com/media/photo-s/1d/c3/ac/85/exterior-view.jpg`} alt="img" className={cx('img')}/> 

          <div className={cx('info-detail')}>
            <div className={cx('location-name')}>
                  {travelCity?.result_object?.name}
              </div>
              <div className={cx('reviews')}>
                  <div className={cx('visited')}>
                    <AiFillStar size={20} color={'white'} style={{margin: '0 5px'}}/>
                    <div className={cx('count')}>
                      {travelCity?.result_object?.num_reviews || '0'} Reviews
                    </div>
                </div>
                
                {/* <div className={cx('total')}>
                    {travelCity?.result_object?.num_reviews || '0'} Reviews
                </div> */}
              </div>

              {/* <div className={cx('price')}>
                  <div className={cx('visited')}>
                    <FaRegMoneyBillAlt size={30} color={'white'} style={{margin: '0 5px'}}/>
                    <div className={cx('count')}>
                      {travelCity?.result_object?.price} 
                    </div>
                </div>
              </div> */}

              <div className={cx('recent-body')}>
                {
                  travelCity?.result_object?.awards ? (
                    <SlideshowReward data={travelCity?.result_object?.awards}/>
                  ) : null
                }
                </div>

              <div className={cx('ranking')}>
                <div className={cx('total')}>
                    {travelCity?.result_object?.photo?.helpful_votes || '0'} Votes
                </div>
              </div>
              <div className={cx('address')}>
                <div className={cx('total')} style={{fontSize: '19px'}}>
                    {travelCity?.result_object?.location_string}
                </div>
              </div>

              <div className={cx('address')}>
                <div className={cx('total')}>
                   <ShowMoreText
                /* Default options */
                lines={3}
                more="Hiển thị thêm "
                less="Hiển thị bớt"
                className="content-css"
                anchorClass="my-anchor-css-class"
                onClick={() => {console.log('hehe')}}
                expanded={false}
                // width={'auto'}
                truncatedEndingComponent={"... "}
            >   
                    {travelCity?.result_object?.geo_description}
                  </ShowMoreText>
                </div>
              </div>


              <div className={cx('btn-next-container')} >
                <Button className={cx('btn-next')} onClick={() => {
                  setVisibleModalCityDetail(false)
                  setCurrentStep(currentStep + 1)

                }}>
                    lựa chọn thành phố này
                </Button>
              </div>
              
          </div>
            
        </div>
          
      </div> : null
    )
  }

  const ModalPlaceTravelDetail = () => {
    return (
        travelPlace ? 
      
      <div className={cx('hotel-detail-container')}>
        <div className={cx('hotel-info')}>

          <img src={travelPlace?.photo?.images?.original?.url || `https://media-cdn.tripadvisor.com/media/photo-s/1d/c3/ac/85/exterior-view.jpg`} alt="img" className={cx('img')}/> 

          <div className={cx('info-detail')}>
            <div className={cx('location-name')}>
                  {travelPlace?.name}
              </div>

      
              <div className={cx('reviews')}>
                  <div className={cx('visited')}>
                    <AiFillStar size={20} color={'white'} style={{margin: '0 5px'}}/>
                    <div className={cx('count')}>
                      {travelPlace?.rating} 
                    </div>
                </div>
                
                <div className={cx('total')}>
                    {travelPlace?.num_reviews || '0'} Reviews
                </div>
              </div>

              {/* <div className={cx('price')}>
                  <div className={cx('visited')}>
                    <FaRegMoneyBillAlt size={30} color={'white'} style={{margin: '0 5px'}}/>
                    <div className={cx('count')}>
                      {travelCity?.result_object?.price} 
                    </div>
                </div>
              </div> */}

              <div className={cx('recent-body')}>
                {
                  travelPlace?.awards ? (
                    <SlideshowReward data={travelCity?.result_object?.awards}/>
                  ) : null
                }
                </div>

              <div className={cx('ranking')}>
                <div className={cx('total')}>
                    {travelPlace?.ranking}
                </div>
              </div>
              {/* <div className={cx('address')}>
                <div className={cx('total')} style={{fontSize: '19px'}}>
                    {travelPlace?.location_string}
                </div>
              </div> */}

              <div className={cx('address')}>
                <div className={cx('total')}>
                   <ShowMoreText
                /* Default options */
                lines={3}
                more="Hiển thị thêm "
                less="Hiển thị bớt"
                className="content-css"
                anchorClass="my-anchor-css-class"
                onClick={() => {console.log('hehe')}}
                expanded={false}
                width={600}
                truncatedEndingComponent={"... "}
            >   
                    {travelPlace?.description}
                  </ShowMoreText>
                </div>
              </div>

              <div className={cx('address')}>
                <div className={cx('total')}
                style={{cursor: 'pointer', color: '#68d1c8'}}
                onClick={() => {
                  window.open(`${travelPlace?.web_url}`)
                  }}>
                  xem chi tiết tại đây
                </div>
              </div>


              <div className={cx('btn-next-container')} >
                <Button className={cx('btn-next')} onClick={() => {
                  setVisibleModalPlaceDetail(false)
                  setCurrentStep(currentStep + 1)

                }}>
                    lựa chọn địa điểm này
                </Button>
              </div>
              
          </div>
            
        </div>
          
      </div> : null
    )
  }



  return (
    <>

    <div className={cx(`suggestion-container`)}>
      <div className={cx('suggestion-city')}>
        
        <Steps
          current={currentStep}
          onChange={onChangeStep}
          size='small'
           type="navigation"
        >
          <Step  title="Step 1"  disabled={true} />
          <Step  title="Step 2" disabled={true}/>
          <Step  title="Step 3" disabled={true} /> 
          <Step  title="Step 4"   disabled={true}/>
          <Step  title="Step 5"  disabled={true}/>
          <Step  title="Step 6"  disabled={true}/>
          <Step  title="Step 7"  disabled={true} />
          <Step  title="Step 8"  disabled={true}/>
          <Step  title="Step 9"   disabled={true}/>
          <Step  title="Step 10" disabled={true} />
          
        </Steps>

        {
          
           currentStep === 0 ? (
            <div className={cx('suggestion-step1')}>
              <div className={cx(`setup-tour`)}>
                <div className={cx('choose-travel-type')}>
                  <div className={cx(`text`)}>
                    Bạn thích kiểu du lịch nào?
                  </div>
                  <div className={cx(`travel-type`)} >
                    {
                      TravelType.map((item) => {
                        return (
                            selectedTypeTravel !== item.id ? (
                                <div key={item?.id} className={cx('type-container')} onClick={() => {setSelectedTypeTravel(item.id)}}>
                                  <img src={item.img} className={cx('type-img')}/>
                                  <div className={cx('type-text')}>
                                      {item?.title}
                                  </div>
                                </div>
                            ) : (
                              <div key={item?.id} className={cx('type-container-selected')} onClick={() => {setSelectedTypeTravel('')}}>
                                <img src={item.img} className={cx('type-img')}/>
                                <div className={cx('type-text')}>
                                    {item?.title}
                                </div>
                              </div>
                            )
                          
                        )
                      })
                    }
                  </div>
                </div>
              </div>
              <div className={cx('btn-next-container')} onClick={() => {
                setCurrentStep(currentStep + 1)
              }}>
                <Button className={cx('btn-next')}>
                  Tiếp theo
                </Button>
              </div>
            </div>
          ) : currentStep === 1 ? (
            <div className={cx('suggestion-step2')}>
              <div className={cx(`setup-tour`)}>
                <div className={cx('choose-travel-type')}>
                  <div className={cx(`text`)}>
                    Bạn đi cùng với ai?
                  </div>
                  <div className={cx(`travel-type`)} >
                    {
                      TravelWith.map((item) => {
                        return (
                            selectedTravelWith !== item.id ? (
                                <div key={item?.id} className={cx('type-container')} onClick={() => {setSelectedTravelWith( item.id)}}>
                                  <img src={item.img} className={cx('type-img')}/>
                                  <div className={cx('type-text')}>
                                      {item?.title}
                                  </div>
                                </div>
                            ) : (
                              <div key={item?.id} className={cx('type-container-selected')} onClick={() => {setSelectedTravelWith('')}}>
                                <img src={item.img} className={cx('type-img')}/>
                                <div className={cx('type-text')}>
                                    {item?.title}
                                </div>
                              </div>
                            )
                          
                        )
                      })
                    }
                  </div>
                </div>
              </div>
              <div className={cx('btn-next-container')} >
                <Button className={cx('btn-next')} onClick={() => {
                setCurrentStep(currentStep - 1)
              }}>
                  Quay lại
                </Button>
                <Button className={cx('btn-next')} onClick={() => {
                setCurrentStep(currentStep + 1)
              }}>
                  Tiếp theo
                </Button>
              </div>
            </div>
          ) : currentStep === 2 ? (
            <div className={cx('suggestion-step2')}>
              <div className={cx(`setup-tour`)}>
                <div className={cx('choose-travel-type')}>
                  <div className={cx(`text`)}>
                    Bạn muốn đi vào khoảng thời gian nào?
                  </div>
                  <div className={cx(`travel-type`)} >
                      <DateRangePicker
                        onChange={item => setSelectionRange([item.selection])}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        ranges={selectionRange}
                        direction="horizontal"
                        rangeColors={["#68d1c8"]}
                        minDate={new Date()}
                      />;
                  </div>
                </div>
              </div>
              <div className={cx('btn-next-container')} >
                <Button className={cx('btn-next')} onClick={() => {
                setCurrentStep(currentStep - 1)
              }}>
                  Quay lại
                </Button>
                <Button className={cx('btn-next')} onClick={() => {
                setCurrentStep(currentStep + 1)
              }}>
                  Tiếp theo
                </Button>
              </div>
            </div>

           ) : currentStep === 3 ? (
            <div className={cx('suggestion-step4')}>
              <div className={cx(`setup-tour`)}>
                <div className={cx('choose-travel-type')}>
                  <div className={cx(`text`)}>
                    Đề xuất các thành phố du lịch nổi bật
                  </div>
                  <div className={cx(`travel-type`)} >
                      {
                        thingsToDo?.data?.filter((it) => it.result_type ==='geos')?.map((item: any, index: any) => {
                        return (
                           <div className={cx('recent-container')} key={index} onClick={() => {
                            setLocationId(item?.result_object?.location_id)
                            setTravelCity(item)
                            setVisibleModalCityDetail(true)
                            }}>
                                   <img src={item?.result_object?.photo?.images?.original?.url || `https://media-cdn.tripadvisor.com/media/photo-s/1d/c3/ac/85/exterior-view.jpg`} alt={item?.photo?.caption || "img"} className={cx('img')}/> 
                                {/* <div className={cx('location-pos')}>
                                    <MdLocationOn size={30} className={cx(`location-icon`)}/>
                                </div> */}
                                <div className={cx('location-name')}>
                                    {item?.result_object?.name}
                                </div>
                                <div className={cx('reviews')}>
                                   <div className={cx('visited')}>
                                      <AiFillStar size={20} color={'white'} style={{margin: '0 5px'}}/>
                                      <div className={cx('count')}>
                                        {/* {item?.result_object?.rating || '0'} / {'5'}  */}
                                        {item?.result_object?.num_reviews || '0'} Reviews
                                      </div>
                                  </div>
                                  <div className={cx('total')}>
                                      {item?.result_object?.photo?.helpful_votes || '0'} Votes
                                  </div>
                                </div>

                                 <div className={cx('reviews')}>
                                  <div className={cx('total')}>
                                      {item?.result_object?.address}
                                  </div>
                                </div>


                                 <div className={cx('reviews')}>
                                  <div className={cx('total')}>
                                      {item?.result_object?.open_now_text}
                                  </div>
                                </div>

                               
                                
                            </div>
                        )
                    })
                      }
                  </div>
                </div>
              </div>
            </div>
            ): currentStep === 4 ? (
            <div className={cx('suggestion-step4')}>
              <div className={cx(`setup-tour`)}>
                <div className={cx('choose-travel-type')}>
                  <div className={cx(`text`)}>
                    Đề xuất các hoạt động dựa theo lựa chọn của bạn
                  </div>
                  <div className={cx(`travel-type`)} >
                      {
                        dataSuggest !== null ?
                        dataSuggest?.data?.map((item: any, index: any) => {
                        return (
                           <div className={cx('recent-container')} key={index} onClick={() => {
                            setTravelPlace(item)
                            setDestinationInfo({
                              lat: item?.latitude,
                              lon: item?.longitude,
                            })
                            setVisibleModalPlaceDetail(true)
                            }}>
                                   <img src={item?.photo?.images?.original?.url || `https://media-cdn.tripadvisor.com/media/photo-s/1d/c3/ac/85/exterior-view.jpg`} alt={item?.photo?.caption || "img"} className={cx('img')}/> 
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
                                        {item?.rating || '0'} / {'5'} 
                                      </div>
                                  </div>
                                  <div className={cx('total')}>
                                      {item?.num_reviews || '0'} Reviews
                                  </div>
                                </div>

                                 <div className={cx('reviews')}>
                                  <div className={cx('total')}>
                                      {item?.address}
                                  </div>
                                </div>
                                 <div className={cx('reviews')}>
                                  <div className={cx('total')}>
                                      {item?.open_now_text}
                                  </div>
                                </div>
                            </div>
                        )
                    }) : <Spin size='large'/>
                      }
                  </div>
                </div>
              </div>
            </div>
            )
            : currentStep === 5 ? (
            <div className={cx('suggestion-step5')}>
              <div className={cx(`setup-tour`)}>
                <div className={cx('choose-travel-type')}>
                  <div className={cx(`text`)}>
                    Bạn muốn xuất phát ở đâu?
                  </div>
                  <div className={cx(`travel-type`)} >
                    <div className={cx('current-pos')} onClick={() => {
                          setStartInfo({
                              lat: currentPosition[0],
                              lon: currentPosition[1]
                            })
                          setCurrentStep(currentStep + 1)
                        }}>
                      <div className={cx('text')} >Vị trí hiện tại </div>
                      <BiCurrentLocation size={30} color='white'/>
                    </div>
                    <div style={{fontSize: '16px', margin: '0 15px'}}>Hoặc</div>
                    <Select
                      showSearch
                      className={cx('select-location')}
                      optionFilterProp="children"
                      placeholder="Thêm vị tri"
                      bordered={false} 
                      suffixIcon={() => <GoLocation style={{ paddingRight: '10px', fontSize: '25px', cursor: 'pointer', zIndex: '988' }} />}
                      onSelect={(value: any) => {
                          setStartPosFromPlaceId(value)
                      }}
                        showArrow={false}
                      filterOption={(input, option: any) => {
                        return true
                      }}

                      onSearch={(e)=> {
                        setSearchPlace(e)
                      }}
                    >
                      {dataPlaces?.length > 0 && dataPlaces?.map((item: any) => {
                        return (
                          <Option key={item.placeId} value={item.placeId}>
                            {item?.mainText}
                          </Option>
                        )})}
                    </Select>
                    
                  </div>
                </div>
              </div>
            </div>
            ): currentStep === 6 ? (
            <div className={cx('suggestion-step5')}>
              <div className={cx(`setup-tour`)}>
                <div className={cx('choose-travel-type')}>
                  <div className={cx(`text`)}>
                    Đề xuất phương tiện đi lại cho bạn.
                  </div>
                  <div className={cx(`travel-type`)} >
                    <TransportSuggestion destinationInfo={destinationInfo} startInfo={startInfo}
                     setCurrentStep={setCurrentStep} currentStep={currentStep}
                     setVehicleChoose={setVehicleChoose}
                     />
                    
                  </div>
                </div>
              </div>
             
            </div>
            ) :
           currentStep === 7 ? (
            <>
              <div className={cx(`suggestion-text`)} style={{color: 'black', fontSize: '25px'}}>
                Các chuyến bay tới địa điểm của bạn
              </div>
                <div className={cx(`suggestion-body2`)}>
                  <FlightSelect destinationInfo={destinationInfo} startInfo={startInfo}
                   startDate={moment(selectionRange[0]?.startDate).format('YYYY-MM-DD')}
                  endDate={moment(selectionRange[0]?.endDate).format('YYYY-MM-DD')}
                  setCurrentStep={setCurrentStep}
                  currentStep={currentStep}
                  setFlightDetail={setFlightDetail}
                   />

              </div>
            </>
          ) :currentStep === 8 ? (
            <>
              <div className={cx(`suggestion-text`)} style={{color: 'black', fontSize: '25px'}}>
                Khách sạn gần điểm đến của bạn
              </div>
                <div className={cx(`suggestion-body2`)}>
                  <HotelSuggestion destinationInfo={destinationInfo}
                  startDate={moment(selectionRange[0]?.startDate).format('YYYY-MM-DD')}
                  endDate={moment(selectionRange[0]?.endDate).format('YYYY-MM-DD')}
                  setCurrentStep={setCurrentStep}
                  currentStep={currentStep}
                  setHotelSelect={setHotelSelect}
                  />
              </div>
            </>

          
          ) : currentStep === 9 ? (
            <>
                <div className={cx(`suggestion-body2`)}>
                  <ConsumseTrip 
                    destinationInfo={destinationInfo}
                    startInfo={startInfo}
                    startDate={moment(selectionRange[0]?.startDate).format('YYYY-MM-DD')}
                    endDate={moment(selectionRange[0]?.endDate).format('YYYY-MM-DD')}
                    selectedTravelType={TravelType.filter((item) => item?.id === selectedTypeTravel)[0]}
                    selectedTravelWith={TravelWith.filter((item) => item?.id === selectedTravelWith)[0] }
                    travelCity={travelCity}
                    travelPlace={travelPlace}
                    vehicleChoose={vehicleChoose}
                    flightDetail={flightDetail}
                    hotelSelect={hotelSelect}
                  />
              </div>
            </>  ):  null
          
        }

        
      </div>

       
    </div>
    <Modal visible={visibleModalCityDetail} footer={null} onCancel={handleCancel} style={{borderRadius: '20px', padding: '0px !important'}} width={1200} closable={false} bodyStyle={{padding: '0'}}>
        {  travelCity ? <ModalCityDetail/> : null }
      </Modal>
      <Modal visible={visibleModalPlaceDetail} footer={null} onCancel={handleCancel2} style={{borderRadius: '20px', padding: '0px !important'}} width={1200} closable={false} bodyStyle={{padding: '0'}}>
        {  travelPlace? <ModalPlaceTravelDetail/> : null }
      </Modal>
    </>
  )

};

export default Suggestion