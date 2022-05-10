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
import styles from 'src/styles/SuggestionDetail.module.scss';
import { ChatFeed, Message } from 'react-chat-ui'
 

import classNames from 'classnames/bind';
import { FaLocationArrow } from 'react-icons/fa';
import { createChatGroup, getChatDetailById, getRecentsChat } from 'src/services/chat-service';
import moment from 'moment';
import {getSuggestList } from 'src/services/suggestion-service';
import { Slide, Fade } from 'react-slideshow-image';
import "react-slideshow-image/dist/styles.css";
import { MdLocationOn} from 'react-icons/md';
import {AiFillStar } from 'react-icons/ai';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import {MdOutlineLocationOn} from 'react-icons/md'
import {IoMdArrowRoundForward} from 'react-icons/io';
import {GiAirplaneDeparture, GiAirplaneArrival } from 'react-icons/gi';
import {FaArrowRight} from 'react-icons/fa'
import Maps from 'src/components/GoogleMap/CurrentLocation';
import { notificationError, notificationSuccess } from '../Login/Login';
import {FaRegMoneyBillAlt} from 'react-icons/fa'
import ConsumseTrip from './ConsumseTrip';
const cx = classNames.bind(styles);


const SuggestionDetail = (props: any) => {

  const [data, setData] = useState<any>([]);
  const [totalItem, setTotalItem] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [textSearch, setTextSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurentPage] = useState(0);
  const [loading, setLoading] = useState(false)

  const [trip, setTrip] = useState<any>(null)

  const [isModalVisibleTripDetail, setIsModalVisibleTripDetail] = useState(false)

  const history = useHistory()
  
  const getSugeestionLists = async (page: number) => {
    try {

    setLoading(true)
    const params ={
      userId: '',
      page: 0
    }
    const result = await getSuggestList(params);
    const dataSource = _.get(result, 'data.items', []);
    const totalItem = _.get(result, 'data.meta.totalItems', 0);
    const totalPages = _.get(result, 'data.meta.totalPages', 0);
    const itemsPerPage = _.get(result, 'data.meta.perPage', 0);
    const currentPage = _.get(result, 'data.meta.currentPage', 0);

    setData(dataSource);
    setTotalItem(parseInt(totalItem));
    setTotalPage(parseInt(totalPages));
    setItemsPerPage(parseInt(itemsPerPage));
    setCurentPage(parseInt(currentPage));
    setLoading(false)
    }
    catch(err) {
      setLoading(false)
    }
  }


  const destinationInfo = {
  lat: 10.776308,
  lon: 106.702867
}

  useEffect(() => {
    getSugeestionLists(currentPage)
  }, [currentPage])

  const handleCancel = () => {
      setIsModalVisibleTripDetail(false)
      setTrip(null)
  };

  return (
    <>
    <div className={cx('suggestion-detail-container')}>
      <div className={cx(`suggestion-container`)}>
          
          <div className={cx('right')} >
            <div className={cx('text')}>
              Các đề xuất của bạn
            </div>
            <Button className={cx('btn-add')} onClick={() => {
              history.push('/suggestion')
                }}>
              Tạo đề xuất mới
            </Button>
          </div>

          {/* <div className={cx('left')}> */}
            {
              loading && data?.length === 0 ? (
                <div className={cx('text-container')}>
                  <Spin size="large" style={{marginTop: '20px'}}/>
                </div>
              ) : !loading && data?.length===0 ? (
                <>
                <div className={cx('text-container')}>
                  <img src="https://cdn.dribbble.com/users/88213/screenshots/8560585/media/7263b7aaa8077a322b0f12a7cd7c7404.png?compress=1&resize=400x300"
                    width={400}
                  />
                  <div className={cx('text')}> Bạn chưa tạo đề xuất nào</div>
                </div>
                </>
              ) : data?.map((item, index) => {
                return (
                  <div className={cx('rightright')} key={index}>
                    <div className={cx('left')}>
                      <div className={cx('from-to')}>
                          <div className={cx('info-detail')}>
                              <img src={item?.travelPlace?.photo?.images?.original?.url } alt="img" className={cx('img')}/> 
                              <div className={cx('inforeal')}>
                                <div className={cx('name')}>
                                      {item?.travelPlace?.name}
                                </div>
                                <div className={cx('reviews')}>
                                  <div className={cx('visited')}>
                                    <AiFillStar size={20} color={'white'} style={{margin: '0 5px'}}/>
                                    <div className={cx('count')}>
                                      {item?.hotelSelect?.rating} 
                                    </div>
                                </div>
                                
                                <div className={cx('total')}>
                                    {item?.hotelSelect?.num_reviews || '0'} Reviews
                                </div>
                              </div>
                            </div>
                          </div>
                      </div>


                      <div className={cx('transport-container')}>
                        <div className={(cx('title-container'))}>
                          <div className={cx('text')}>Phương tiện:</div>
                          <div className={cx('name')}>{item?.vehicleChoose?.name === 'plane' ? 'máy bay' :item?.vehicleChoose?.name === 'car' ? "ô tô" : "xe máy" }</div>
                        </div>
                        <div className={(cx('title-container'))}>
                          <div className={cx('text')}> Khoảng cách ước tính: </div>
                          <div className={cx('name')}> {parseFloat(item?.vehicleChoose?.distance).toFixed(2)}km</div>
                        </div>
                        <div className={(cx('title-container'))}>
                          <div className={cx('text')}>Thời gian dự kiến</div>
                          <div className={cx('name')}>{moment.utc(parseFloat(item?.vehicleChoose?.duration)).format('HH:mm:ss')}</div>
                        </div>
                      </div>

                      <div className={cx('transport-container')}>
                        <div className={(cx('title-container2'))}>
                          <div className={cx('text')}>Thời gian:</div>
                          <div className={cx('name')}>{`${item?.startDate} - ${item?.endDate}`}</div>
                        </div>
                      </div>
                    </div>
                      <Button className={cx('right')} onClick={() => {
                            setTrip(item)
                          setIsModalVisibleTripDetail(true)
                            }}>
                          Xem chi tiết
                        </Button>
                  </div>
                )
              })
            }
          </div>
      {/* </div> */}
    </div>
    <Modal visible={isModalVisibleTripDetail} footer={null} onCancel={handleCancel} style={{borderRadius: '20px', padding: '0px !important'}} width={1300} closable={false} bodyStyle={{padding: '0'}}>
         {trip ? <ConsumseTrip destinationInfo={destinationInfo}
                    startInfo={{}}
                    startDate={trip?.startDate}
                    endDate={trip?.endDate}
                    selectedTravelType={trip?.selectedTravelType}
                    selectedTravelWith={trip?.selectedTravelWith}
                    travelCity={trip?.travelCity}
                    travelPlace={trip?.travelPlace}
                    vehicleChoose={trip?.vehicleChoose}
                    flightDetail={trip?.flightDetail}
                    hotelSelect={trip?.hotelSelect}
                    widthCustom={{width: '100%'}}
                    hideBtn={true}
                    /> : null}  
      </Modal>
    </>


   
  )

};

export default SuggestionDetail