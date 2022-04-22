import React, { useState, useEffect, useCallback } from 'react';
import { List, message, Avatar, Skeleton, Divider, Button, Spin, Form, Input, Modal } from 'antd';
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
import { getSuggestion, getSuggestionThingToDo } from 'src/services/suggestion-service';
import { useHistory } from 'react-router-dom';

import { Steps } from 'antd';
import FlightSelect from './FlightSelection';
import HotelSuggestion from './HotelSuggestion';

const { Step } = Steps;

const JOIN_ROOM ='joinRoom';
const JOIN_ROOM_SUCCESS ='joinRoomSuccess'
export const SEND_MESSAGE = 'sendMessage';
export const RECEIVE_MESSAGE = 'receiveMessage'
import city from './city.json'

const cx = classNames.bind(styles);


const Suggestion = (props: any) => {
  const [btn, setBtn] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState(0)


  const onChangeStep = current => {
    setCurrentStep(current)
  };

  const history = useHistory()

  const [data, setData] = useState<any>(city)

  const [destinationInfo, setDestinationInfo] = useState<any>(null)
  

  // const getSugeestionCity = async () => {
  //   const suggest = await getSuggestion({
  //     query: 'viet nam',
  //     locale: 'vi_VN',
  //     currency: 'VND'
  //   });
  //   const rs = _.get(suggest, 'data', null);
  //   console.log(rs)
  //   setData(rs)
  // }

 
  // useEffect(() => {
  //  if(currentStep === 1) getSugeestionCity()
  // }, [currentStep])

  const checkStepStatus = (step) => {
    if(step === currentStep) return "process"
    else if(step > currentStep) return "finish"
    else return "wait"
  }
  

  return (
    <div className={cx(`suggestion-container`)}>
      <div className={cx('suggestion-city')}>
        
        <Steps
          current={currentStep}
          onChange={onChangeStep}
          size='small'
           type="navigation"
        >
          <Step  title="Step 1" />
          <Step  title="Step 2" />
          <Step  title="Step 3"/>
          <Step  title="Step 4" />
          <Step  title="Step 5"/>
          <Step  title="Step 6"/>
        </Steps>

        {
          
           currentStep === 0 ? (
            <div className={cx('suggestion-step1')}>
              <div className={cx(`setup-tour`)} onClick={() => {setCurrentStep(currentStep + 1)}}>
                <div className={cx('setup-tour-text')}>Tạo chuyến du lịch cho riêng bạn</div>
              </div>
            </div>
          ) : currentStep === 1 ? (
            <>
              <div className={cx(`suggestion-text`)}>
                Bạn muốn đi du lịch ở đâu?
              </div>
              <div className={cx(`suggestion-text2`)}>
                Lựa chọn thành phố  bạn muốn đến.
              </div>
                <div className={cx(`suggestion-body`)}>
                  {data  ? data?.suggestions[0]?.entities.map((item, index) => {
                    return (
                      <div className={cx(`image-container`)} key={index} onClick={
                        () => {
                          setDestinationInfo({
                            destinationId: item?.destinationId,
                            lat: item?.latitude,
                            lon: item?.longitude
                          })
                          setCurrentStep(currentStep+1)
                          
                          // history.push(`/suggestionDetail?destinationId=${item.destinationId}&name=${item.name}&lat=${item.latitude}&lon=${item.longitude}`)
                        }
                      }>
                          <img src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSJ2PKvRQD7fg9HKp4_vltnN9SfFZi4Qecgg&usqp=CAU`}
                            className={cx(`image`)}
                          />
                          <div className={cx(`text`)} style={{color: 'white'}}>
                            {item?.name}
                          </div>
                      </div>
                    )
                  }) : 
                  <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}><Spin size='large'/>
                    </div>
                  }
              </div>
            </>
          ) :
           currentStep === 2 ? (
            <>
              <div className={cx(`suggestion-text`)}>
                Các chuyến bay tới địa điểm của bạn
              </div>
                <div className={cx(`suggestion-body`)}>
                  <FlightSelect destinationInfo={destinationInfo}/>
              </div>
            </>
          ) :currentStep === 3 ? (
            <>
              <div className={cx(`suggestion-text`)}>
                Khách sạn gần điểm đến của bạn
              </div>
                <div className={cx(`suggestion-body`)}>
                  <HotelSuggestion/>
              </div>
            </>
          )  : 
          <div>hahaha</div>
          
        }

        
      </div>

       
    </div>
  )

};

export default Suggestion