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
import { getSuggestion, getSuggestionAttraction, getSuggestionDetail, getSuggestionThingToDo } from 'src/services/suggestion-service';
import { Slide, Fade } from 'react-slideshow-image';
import "react-slideshow-image/dist/styles.css";
import { MdLocationOn} from 'react-icons/md';
import {AiFillStar } from 'react-icons/ai';
import { useLocation, useParams } from 'react-router-dom';
const cx = classNames.bind(styles);


const SuggestionDetail = (props: any) => {
  const [btn, setBtn] = useState<boolean>(false)
  const location = useLocation();
  const params = useParams()
  const [data, setData] = useState<any>(null)
  const [thingsToDo, setThingsTodo] = useState<any>(null)
  const [restaurants, setRestaurants] = useState<any>(null)
  const [attractions, setAtrractions] = useState<any>(null)
  const search = useLocation().search;
  const name=new URLSearchParams(search).get("name");
  const lat=new URLSearchParams(search).get("lat");
  const lon=new URLSearchParams(search).get("lon");
  const destinationId=new URLSearchParams(search).get("destinationId");


  const getSugeestionCityDetail = async () => {
    if(destinationId) {
      const suggest = await getSuggestionDetail(destinationId);
      console.log(suggest)
      const rs = _.get(suggest, 'data', null);
      console.log(rs)
      setData(rs)
    }
    
  }

   const getSugeestionThingsToDo = async () => {
    const suggest = await getSuggestionThingToDo({
      query: name,
      limit: '1000',
      offset: '0',
      units: 'km',
      currency: 'VND',
      sort: 'relevance',
      lang: 'vi_VN'
    });
    const rs = _.get(suggest, 'data.data', null);
   if(rs?.filter((it) => it?.result_type === "things_to_do")?.length  > 0)  setThingsTodo(rs.filter((it) => it?.result_type === 'things_to_do'))
   if(rs?.filter((it) => it?.result_type === "restaurants")?.length  > 0) setRestaurants(rs.filter((it) => it?.result_type === "restaurants"))
  }


  const getSugeestionAttraction = async () => {
    const suggest = await getSuggestionAttraction({
      longitude: lon,
      latitude: lat,
      lunit: 'km',
      currency: 'VND',
      lang: 'vi_VN'
    });
    const rs = _.get(suggest, 'data.data', null);
    console.log(rs)
    if(rs?.length  > 0) setAtrractions(rs)
  }

  
console.log('TODO',data,thingsToDo,attractions, restaurants)

  useEffect(() => {
    getSugeestionCityDetail()
    getSugeestionThingsToDo()
    getSugeestionAttraction()
  }, [destinationId])

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
            <Slide
                {...properties}
            >
                    {
                    data?.data?.body?.searchResults?.results?.map((item: any, index: any) => {
                        return (
                           <div className={cx('recent-container')} key={index} onClick={() => {

                            }}>
                                   <img src={item?.optimizedThumbUrls?.srpDesktop || `https://media-cdn.tripadvisor.com/media/photo-s/1d/c3/ac/85/exterior-view.jpg`} alt="img" className={cx('img')}/> 
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
                                        {item?.guestReviews?.rating || '0'} / {item?.guestReviews?.scale || '10'} 
                                      </div>
                                  </div>
                                  <div className={cx('total')}>
                                      {item?.guestReviews?.total || '0'} Reviews
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
             </Slide>
        </div>
        )
    }

    const SlideshowThingsToDo = () => {
        return (
         <div className={`slide-container ${cx('slider-container2')}`} >
            <Slide
                {...properties}
            >
                    {
                    thingsToDo?.map((item: any, index: any) => {
                        return (
                           <div className={cx('recent-container')} key={index} onClick={() => {

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
                                        {item?.result_object?.rating || '0'} / {'5'} 
                                      </div>
                                  </div>
                                  <div className={cx('total')}>
                                      {item?.result_object?.num_reviews || '0'} Reviews
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
             </Slide>
        </div>
        )
    }


    const SlideshowRestaurants = () => {
        return (
         <div className={`slide-container ${cx('slider-container2')}`} >
            <Slide
                {...properties}
            >
                    {
                    restaurants?.map((item: any, index: any) => {
                        return (
                           <div className={cx('recent-container')} key={index} onClick={() => {

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
                                        {item?.result_object?.rating || '0'} / {'5'} 
                                      </div>
                                  </div>
                                  <div className={cx('total')}>
                                      {item?.result_object?.num_reviews || '0'} Reviews
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
             </Slide>
        </div>
        )
    }

const SlildShowAttraction = () => {
        return (
         <div className={`slide-container ${cx('slider-container2')}`} >
            <Slide
                {...properties}
            >
                    {
                    attractions?.map((item: any, index: any) => {
                        return (
                           <div className={cx('recent-container')} key={index} onClick={() => {

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


                                 <div className={cx('reviews')}>
                                  <div className={cx('total')}>
                                      {item?.ranking_position}
                                  </div>
                                </div>

                               
                                
                            </div>
                        )
                    })
                }
             </Slide>
        </div>
        )
    }

  return (
    <div className={cx('suggestion-detail-container')}>
      <div className={cx(`suggestion-container`)}>
        <div className={cx(`recents-header`)}>
            <div className={cx(`left`)}>{ data?.data?.body?.header}
            </div>
        </div>
        <div className={cx('title')}>
          <div className={cx(`text`)}>Những địa điểm nổi bật</div>
        </div>
         
        <div className={cx(`recent-body`)}>
            {thingsToDo ?  <SlideshowThingsToDo />  : <Spin size='large'/> }
        </div>

        <div className={cx('title')}>
          <div className={cx(`text`)}>Những khách sạn nổi tiếng</div>
        </div>
         <div className={cx(`recent-body`)}>
            {data ?  <Slideshow />  : <Spin size='large'/> }
        </div>
        <div className={cx('title')}>
          <div className={cx(`text`)}>Những Tour Du Lịch, Địa Điểm Vui Chơi</div>
        </div>

        <div className={cx(`recent-body`)}>
            {attractions ?  <SlildShowAttraction />  : <Spin size='large'/> }
        </div>

      <div className={cx('title')}>
          <div className={cx(`text`)}>Những nhà hàng phổ biến</div>
        </div>

         <div className={cx(`recent-body`)}>
            {restaurants ?  <SlideshowRestaurants />  : <Spin size='large'/> }
        </div>
        
      </div>
    </div>

   
  )

};

export default SuggestionDetail