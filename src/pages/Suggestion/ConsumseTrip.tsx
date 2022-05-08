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
import styles from 'src/styles/Trip.module.scss';
import { ChatFeed, Message } from 'react-chat-ui'
 import { Radio } from 'antd';

import classNames from 'classnames/bind';
import { FaLocationArrow } from 'react-icons/fa';
import { createChatGroup, getChatDetailById, getRecentsChat } from 'src/services/chat-service';
import moment from 'moment';
import { getAirport, getFlight, getHotelDetailTravid, getSuggestion, getSuggestionAttraction, getSuggestionDetail, getSuggestionHotels, getSuggestionThingToDo } from 'src/services/suggestion-service';
import { Slide, Fade } from 'react-slideshow-image';
import "react-slideshow-image/dist/styles.css";
import { ImCalendar} from 'react-icons/im';
import {GiModernCity} from 'react-icons/gi'

import {MdOutlineFlight, MdOutlinePlace, MdOutlineTravelExplore} from 'react-icons/md'

import {SiYourtraveldottv} from 'react-icons/si'
import {RiHotelFill, RiMotorbikeFill} from 'react-icons/ri'
import {AiFillCar} from 'react-icons/ai'
const cx = classNames.bind(styles);
import { DatePicker, Space } from 'antd';
import { Select, Checkbox } from 'antd';
import { Popover } from 'antd';
import ShowMoreText from "react-show-more-text";

import "react-slideshow-image/dist/styles.css";
import hotelDetail from './hotelDetail.json'
const { Option } = Select;
import {FaRegMoneyBillAlt} from 'react-icons/fa'

import dataRoundTrop from './dataRoundtrip.json'
const { RangePicker } = DatePicker;
import { DateRangePicker } from 'react-date-range';
import { AiOutlineArrowDown, AiOutlineClockCircle, AiFillStar} from 'react-icons/ai';
import tc from'./travelCity.json'
import tp from './travelPlace.json'
import hs from './hotelSelect.json'
import {MdOutlineLocationOn} from 'react-icons/md'

const ConsumseTrip = (props: any) => {
//  const { destinationInfo,
//             startInfo,
//             startDate,
//             endDate,
//             selectedTravelType,
//             selectedTravelWith,
//             travelCity,
//             travelPlace,
//             vehicleChoose,
//             flightDetail,
//             hotelSelect
//           } = props
// console.log( destinationInfo,
//             startInfo,
//             startDate,
//             endDate,
//             selectedTravelType,
//             selectedTravelWith,
//             travelCity,
//             travelPlace,
//             vehicleChoose,
//             flightDetail,
//             hotelSelect)

  const startDate = "2022-04-20"
  const endDate = "2022-07-05"
  const selectedTravelType = {
      id: "47",
      title: "Danh lam thắng cảnh",
      img: "https://cdnimg.vietnamplus.vn/t1200/Uploaded/ngtmbh/2021_10_24/ttxvn_du_lich_tphcm.jpg"
  }
  const selectedTravelWith = {
      id: 3,
      title: "Người yêu",
      img: "https://sktravel.com.vn/wp-content/uploads/2021/05/di-du-lich-sapa-2-nguoi-tong-chi-phi-het-bao-nhieu-2.jpg"
  }
  const travelCity = tc
  const travelPlace = tp
  const hotelSelect = hs
  const vehicleChoose = 'plane'

  const [isVisibleModalShow1, setIsVisibleModalShow1] = useState(false)
  const [isVisibleModalShow2, setIsVisibleModalShow2] = useState(false)
  const [isVisibleModalShow3, setIsVisibleModalShow3] = useState(false)
  const [isVisibleModalShow4, setIsVisibleModalShow4] = useState(false)
  const [isVisibleModalShow5, setIsVisibleModalShow5] = useState(false)


  const handleCancle = () => {
    setIsVisibleModalShow1(false)
    setIsVisibleModalShow2(false)
    setIsVisibleModalShow3(false)
    setIsVisibleModalShow4(false)
    setIsVisibleModalShow5(false)
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
          <Slide
              {...properties}
          >
                  {
                  props?.data?.map((item: any, index: any) => {
                      return (
                          <div className={cx('recent-container')} key={index} style={{
                            display: 'flex',
                            flexDirection:'row',
                            justifyContent: 'flex-start',
                            alignItems: 'denter'
                          }} >
                              
                             <img src={`${item?.images?.small}`} alt="img" style={{width: '50px', height: '50px'}}/> 
                             <div>{item?.display_name}</div>
                          </div>
                      )
                  })
             }
            </Slide>
      </div>
      )
  }


  const SlideshowReward2 = (props) => {
    console.log(props?.data)
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
                    <SlideshowReward2 data={travelCity?.result_object?.awards}/>
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
                width={600}
                truncatedEndingComponent={"... "}
            >   
                    {travelCity?.result_object?.geo_description}
                  </ShowMoreText>
                </div>
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
                    <SlideshowReward2 data={travelCity?.result_object?.awards}/>
                  ) : null
                }
                </div>

              <div className={cx('ranking')}>
                <div className={cx('total')}>
                    {travelPlace?.ranking}
                </div>
              </div>
              <div className={cx('address')}>
                <div className={cx('total')} style={{fontSize: '19px'}}>
                    {travelPlace?.location_string}
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

              
          </div>
            
        </div>
          
      </div> : null
    )
  }

  const ModalTravelTime = () => {
    return (
      <div  style={{
        width: '1200px',
        display: 'flex',
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'denter'
      }}>
        <DateRangePicker
          editableDateInputs={false}
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={[{
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            key: 'selection'
          }]}
          direction="horizontal"
          rangeColors={["#68d1c8"]}
          onChange={() => null}
        />
      </div>
    )
  }

  const ModalTravelType = () => {
    return (
      <div className={cx('type-container-all')}>
          <div  className={cx('type-container-selected')}>
            <img src={selectedTravelType.img} className={cx('type-img')}/>
            <div className={cx('type-text')}>
                {selectedTravelType?.title}
            </div>
          </div>
        <div className={cx('type-container-selected')}>
          <img src={selectedTravelWith.img} className={cx('type-img')}/>
            <div className={cx('type-text')}>
                {selectedTravelWith?.title}
            </div>
          </div>
      </div>
    )
  }

  const ModalHotelDetail = () => {
    return (
      <>
                   <div className={cx('hotel-detail-container')}>
              <div className={cx('hotel-info')}>

                <img src={hotelSelect?.photo?.images?.original?.url || `https://media-cdn.tripadvisor.com/media/photo-s/1d/c3/ac/85/exterior-view.jpg`} alt="img" className={cx('img')}/> 

                <div className={cx('info-detail')}>
                  <div className={cx('location-name')}>
                        {hotelSelect?.name}
                    </div>
                    <div className={cx('reviews')}>
                        <div className={cx('visited')}>
                          <AiFillStar size={20} color={'white'} style={{margin: '0 5px'}}/>
                          <div className={cx('count')}>
                            {hotelSelect?.rating} 
                          </div>
                      </div>
                      
                      <div className={cx('total')}>
                          {hotelSelect?.num_reviews || '0'} Reviews
                      </div>
                    </div>

                    <div className={cx('price')}>
                        <div className={cx('visited')}>
                          <FaRegMoneyBillAlt size={30} color={'white'} style={{margin: '0 5px'}}/>
                          <div className={cx('count')}>
                            {hotelSelect?.price} 
                          </div>
                      </div>
                    </div>

                    <div className={cx('recent-body')}>
                      {
                        hotelSelect?.awards ? (
                          <SlideshowReward data={hotelSelect?.awards}/>
                        ) : null
                      }
                      </div>

                    <div className={cx('ranking')}>
                      <div className={cx('total')}>
                          {hotelSelect?.ranking}
                      </div>
                    </div>
                    <div className={cx('address')}>
                      <div className={cx('total')}>
                        
                          {hotelSelect?.address}
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
                      width={600}
                      truncatedEndingComponent={"... "}
                  >   
                          {hotelSelect?.description}
                        </ShowMoreText>
                      </div>
                    </div>

                    <div className={cx('address')}>
                      <div className={cx('total')}
                      style={{cursor: 'pointer', color: '#68d1c8'}}
                      onClick={() => {
                        window.open(`${hotelSelect?.web_url}`)
                        }}>
                        xem chi tiết tại đây
                      </div>
                    </div>
                </div>
                </div>
              </div> 
                   </>
    )
  }


  return (
    <>
      <div className={cx('trip-detail-container')}>
          <div className={cx('title')}>
            Chuyến đi của bạn
          </div>
          <div className={cx('body')}> 

          <div className={cx('left')}>

                <div className={cx('containter-father')} onClick={() => {
                  setIsVisibleModalShow1(true)
                }}>
                  <div className={cx('container')}>
                    <ImCalendar size={40} className={cx('icon')}/>
                  </div>
                  <div className={cx('content')}>
                    <div className={cx('text')}>Thời gian</div>
                    <div className={cx('detail')}>{`${startDate} - ${endDate}`}</div>
                  </div>
                </div>


                
                  <div className={cx('containter-father')} onClick={() => {
                  setIsVisibleModalShow2(true)
                }}>
                    <div className={cx('container')}>
                      <MdOutlineTravelExplore size={40} className={cx('icon')}/>
                    </div>
                    <div className={cx('content')}>
                      <div className={cx('text')}>Loại hình du lịch</div>
                      <div className={cx('detail')}>{`${selectedTravelType?.title} - ${selectedTravelWith?.title}`}</div>
                    </div>
                  </div>
              

                <div className={cx('containter-father')} onClick={() => {
                  setIsVisibleModalShow3(true)
                }}>
                  <div className={cx('container')}>
                    <GiModernCity size={40} className={cx('icon')}/>
                  </div>
                  <div className={cx('content')}>
                    <div className={cx('text')}>Thành phố du lịch</div>
                    <div className={cx('detail')}>{`${travelCity?.result_object?.name}`}</div>
                  </div>
                </div>

                <div className={cx('containter-father')} onClick={() => {
                  setIsVisibleModalShow4(true)
                }}>
                  <div className={cx('container')}>
                    <MdOutlinePlace size={40} className={cx('icon')}/>
                  </div>
                  <div className={cx('content')}>
                    <div className={cx('text')}>Địa điểm du lịch</div>
                    <div className={cx('detail')}>{`${travelPlace?.name}`}</div>
                  </div>
                </div>

                <div className={cx('containter-father')}>
                  <div className={cx('container')}>
                    <MdOutlineFlight size={40} className={cx('icon')}/>
                    
                  </div>
                  <div className={cx('content')}>
                    <div className={cx('text')}>Phương tiện di chuyển</div>
                    <div className={cx('detail')}>{vehicleChoose === 'plane' ? 'máy bay' : vehicleChoose === 'car' ? 'ô tô' : 'xe máy'}</div>
                  </div>
                </div>

                <div className={cx('containter-father')} onClick={() => {
                  setIsVisibleModalShow5(true)
                }}>
                  <div className={cx('container')}>
                    <RiHotelFill size={40} className={cx('icon')}/>
                    
                  </div>
                  <div className={cx('content')}>
                    <div className={cx('text')}>Khách sạn</div>
                    <div className={cx('detail')}>{hotelSelect?.name}</div>
                  </div>
                </div>
  
          </div>

            <div className={cx('right')}>
              <div className={cx('title-container')}>
                <div className={cx('title')}>Lộ trình</div>
              </div>   
              <div className={cx('from-to-container')}>
                <div className={cx('from-to')}>
                  <div className={cx('title')}>Điểm đi</div>
                  <div className={cx('info-detail')}>
                      <MdOutlineLocationOn color={`#68d1c8`} size={80}/>
                  </div>
                </div> 
                <div className={cx('from-to')}>
                  <div className={cx('title')}>Điểm đến</div>
                  <div className={cx('info-detail')}>
                      <img src={travelPlace?.photo?.images?.original?.url } alt="img" className={cx('img')}/> 
                      <div className={cx('inforeal')}>
                      <div className={cx('name')}>
                              {travelPlace?.name}
                        </div>
                        <div className={cx('reviews')}>
                          <div className={cx('visited')}>
                            <AiFillStar size={20} color={'white'} style={{margin: '0 5px'}}/>
                            <div className={cx('count')}>
                              {hotelSelect?.rating} 
                            </div>
                        </div>
                        
                        <div className={cx('total')}>
                            {hotelSelect?.num_reviews || '0'} Reviews
                        </div>
                      </div>
                    </div>
                  </div>
                </div> 
              </div>

              <div>
                <div>
                  Phương tiện
                </div>
              </div>

              <div>
                Nơi nghỉ
              </div>
            </div>
          </div>
      </div>

      <Modal visible={isVisibleModalShow1} footer={null} onCancel={handleCancle} style={{padding: '0px !important'}} width={1200} closable={false} bodyStyle={{padding: '0'}}>
        {  startDate && endDate ? (
          <>
            <ModalTravelTime/>
          </>
        ) : null }
      </Modal>
      <Modal visible={isVisibleModalShow2} footer={null} onCancel={handleCancle} style={{padding: '0px !important'}} width={1200} closable={false} bodyStyle={{padding: '0'}}>
        {  selectedTravelType && selectedTravelWith ? (
          <>
           <ModalTravelType />
          </>
        ) : null }
      </Modal>
      <Modal visible={isVisibleModalShow3} footer={null} onCancel={handleCancle} style={{padding: '0px !important'}} width={1200} closable={false} bodyStyle={{padding: '0'}}>
        {  travelCity? (
          <>
            <ModalCityDetail />
          </>
        ) : null }
      </Modal>
      <Modal visible={isVisibleModalShow4} footer={null} onCancel={handleCancle} style={{padding: '0px !important'}} width={1200} closable={false} bodyStyle={{padding: '0'}}>
        {  travelPlace? (
          <>
           <ModalPlaceTravelDetail />
          </>
        ) : null }
      </Modal>
      <Modal visible={isVisibleModalShow5} footer={null} onCancel={handleCancle} style={{padding: '0px !important'}} width={1200} closable={false} bodyStyle={{padding: '0'}}>
        {  hotelDetail ? (
          <>
            <ModalHotelDetail/>
          </>
        ) : null }
      </Modal>
    </>
  )
};

export default ConsumseTrip