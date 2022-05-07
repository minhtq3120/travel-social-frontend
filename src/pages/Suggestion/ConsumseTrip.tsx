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


const ConsumseTrip = (props: any) => {
 const { destinationInfo,
            startInfo,
            startDate,
            endDate,
            selectedTravelType,
            selectedTravelWith,
            travelCity,
            travelPlace,
            vehicleChoose,
            flightDetail,
            hotelSelect
          } = props
console.log( destinationInfo,
            startInfo,
            startDate,
            endDate,
            selectedTravelType,
            selectedTravelWith,
            travelCity,
            travelPlace,
            vehicleChoose,
            flightDetail,
            hotelSelect)

// const startDate1 = "2022-04-20"
// const endDate1 = "2022-07-05"
// const selectedTravelType1 = {
//     id: "47",
//     title: "Danh lam thắng cảnh",
//     img: "https://cdnimg.vietnamplus.vn/t1200/Uploaded/ngtmbh/2021_10_24/ttxvn_du_lich_tphcm.jpg"
// }
// const selectedTravelWith1 = {
//     id: 3,
//     title: "Người yêu",
//     img: "https://sktravel.com.vn/wp-content/uploads/2021/05/di-du-lich-sapa-2-nguoi-tong-chi-phi-het-bao-nhieu-2.jpg"
// }

  const [isVisibleModalShowDate, setIsVisibleModalShowDate] = useState(false)

  const handleCancle = () => {
    setIsVisibleModalShowDate(false)
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


  return (
    <>
      <div className={cx('trip-detail-container')}>
          <div className={cx('title')}>
            Chuyến đi của bạn
          </div>
          <div className={cx('body')}> 

          <div className={cx('left')}>
              <Popover  content={() => <DateRangePicker
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
                  />}
                  placement='right'
                  trigger="click"
                >
                <div className={cx('containter-father')} onClick={() => {
                  // setIsVisibleModalShowDate(true)
                }}>
                  <div className={cx('container')}>
                    <ImCalendar size={40} className={cx('icon')}/>
                  </div>
                  <div className={cx('content')}>
                    <div className={cx('text')}>Thời gian</div>
                    <div className={cx('detail')}>{`${startDate} - ${endDate}`}</div>
                  </div>
                </div>
              </Popover>

                
                <Popover  content={() => 
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
                  }
                  overlayStyle={{width: '700px'}}
                  placement='right'
                  trigger="click"
                >
                  <div className={cx('containter-father')}>
                    <div className={cx('container')}>
                      <MdOutlineTravelExplore size={40} className={cx('icon')}/>
                    </div>
                    <div className={cx('content')}>
                      <div className={cx('text')}>Loại hình du lịch</div>
                      <div className={cx('detail')}>{`${selectedTravelType?.title} - ${selectedTravelWith?.title}`}</div>
                    </div>
                  </div>

                </Popover>
              

              <div className={cx('containter-father')}>
                <div className={cx('container')}>
                  <GiModernCity size={40} className={cx('icon')}/>
                </div>
                <div className={cx('content')}>
                  <div className={cx('text')}>Thành phố du lịch</div>
                  <div className={cx('detail')}>{`${travelCity?.result_object?.name}`}</div>
                </div>
              </div>
              <div className={cx('containter-father')}>
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

              <Popover  content={() =>
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
                  }
                  placement='right'
                  trigger="click"
                >
                  <div className={cx('containter-father')}>
                    <div className={cx('container')}>
                      <RiHotelFill size={40} className={cx('icon')}/>
                      
                    </div>
                    <div className={cx('content')}>
                      <div className={cx('text')}>Khách sạn</div>
                      <div className={cx('detail')}>{hotelSelect?.name}</div>
                    </div>
                </div>
                </Popover>
          </div>

          <div className={cx('right')}>

          </div>
           
            
            {/* <div className={cx('container')}>
              <GiModernCity size={40} className={cx('icon')}/>
              <div className={cx('text')}>Thành phố du lịch</div>
            </div>

            <div className={cx('container')}>
              <MdOutlinePlace size={40} className={cx('icon')}/>
              <div className={cx('text')}>Địa điểm du lịch</div>
            </div>

            <div className={cx('container')}>
              <MdOutlineFlight size={40} className={cx('icon')}/>
              <div className={cx('text')}>chuyến bay</div>
            </div>
            <div className={cx('container')}>
              <AiFillCar size={40} className={cx('icon')}/>
              <div className={cx('text')}>ô tô</div>
            </div>

            <div className={cx('container')}>
              <RiMotorbikeFill size={40} className={cx('icon')}/>
              <div className={cx('text')}>xe máy</div>
            </div>
            <div className={cx('container')}>
              <SiYourtraveldottv size={40} className={cx('icon')}/>
              <div className={cx('text')}>Loại hình du lịch</div>
            </div>
            <div className={cx('container')}>
              <RiHotelFill size={40} className={cx('icon')}/>
              <div className={cx('text')}>khách sạn</div>
            </div> */}
          </div>


      </div>

    <Modal visible={isVisibleModalShowDate} footer={null} onCancel={handleCancle} style={{padding: '0px !important'}} width={1000} closable={false} bodyStyle={{padding: '0'}}>
        {  startDate && endDate ? (
          <>
            <DateRangePicker
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
          </>
          
        ) : null }
      </Modal>
      
    </>
  )
};

export default ConsumseTrip