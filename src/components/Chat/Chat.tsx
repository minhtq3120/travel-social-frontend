import React, { useState, useEffect, useCallback } from 'react';
import { List, message, Avatar, Skeleton, Divider, Button, Spin, Form, Input } from 'antd';
import VirtualList from 'rc-virtual-list';
import { followId, getFollowers, getFollowing, unfollowId } from 'src/services/follow-service';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RiRestaurant2Line } from 'react-icons/ri';

const fakeDataUrl =
  'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
const ContainerHeight = 500;

const SEND_NOTIFICATION = 'sendNotification';
const RECEIVE_NOTIFICATION = 'receiveNotification';
import { io } from "socket.io-client";
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { NotificationAction } from 'src/pages/Layout/layout';

import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import { sleep } from 'src/containers/Newfeed/Newfeed';
import { ChatEngine } from 'react-chat-engine'
import styles from 'src/styles/Chat.module.scss';
import { ChatFeed, Message } from 'react-chat-ui'
 

import classNames from 'classnames/bind';
import { FaLocationArrow } from 'react-icons/fa';

const cx = classNames.bind(styles);

const Chat = (props: any) => {
  const [form] = Form.useForm();
  const handleFetchMore = async () => {
    await sleep();
    setCurentPage(currentPage + 1)
  }
  const scrollRef: any = useBottomScrollListener(() => {
     totalPage - 1 === currentPage || data?.length === 0 ? null : handleFetchMore()
  });

  const [data, setData] = useState<any>([]);
  const [totalItem, setTotalItem] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [textSearch, setTextSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurentPage] = useState(0);
  const [trigger, setTrigger] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState(
    [
      new Message({
        id: 1,
        message: "I'm the recipient! (The person you're talking to)",
        senderName: 'wtf'
      }), 
      new Message({ id: 0, message: "I'm you -- the blue bubble!" , senderName: 'hehe'}), 
      new Message({
        id: 3,
        message: "I'm the recipient! (The person you're talking to)",
        senderName: 'wtf'
      }), 
      new Message({ id: 0, message: "I'm you -- the blue bubble!" , senderName: 'hehe'}), 
      new Message({
        id: 1,
        message: "I'm the recipient! (The person you're talking to)",
        senderName: 'wtf'
      }), 
      
      new Message({ id: 0, message: "I'm you -- the blue bubble!" , senderName: 'hehe'}), 
      new Message({ id: 0, message: "I'm you -- the blue bubble!" , senderName: 'hehe'}), 
      new Message({
        id: 3,
        message: "I'm the recipient! (The person you're talking to)",
        senderName: 'wtf'
      }), 
      new Message({ id: 0, message: "I'm you -- the blue bubble!" , senderName: 'hehe'}), 
      new Message({
        id: 1,
        message: "I'm the recipient! (The person you're talking to)",
        senderName: 'wtf'
      }), 
      new Message({ id: 0, message: "I'm you -- the blue bubble!" , senderName: 'hehe'}), 
      new Message({
        id: 3,
        message: "I'm the recipient! (The person you're talking to)",
        senderName: 'wtf'
      }), 
      new Message({ id: 0, message: "I'm you -- the blue bubble!" , senderName: 'hehe'}), 
      new Message({
        id: 1,
        message: "I'm the recipient! (The person you're talking to)",
        senderName: 'wtf'
      }), 
      new Message({ id: 0, message: "I'm you -- the blue bubble!" , senderName: 'hehe'}), 
      new Message({
        id: 3,
        message: "I'm the recipient! (The person you're talking to)",
        senderName: 'wtf'
      }), 
      new Message({ id: 0, message: "I'm you -- the blue bubble!" , senderName: 'hehe'}), 
    ],
  )


  const socket: any = useSelector((state: RootState) => state.wallet.socket);

  const handleFinish = async (values) => {
        try {
            console.log(values)
            setMessages([...messages, new Message({
                id: 0,
                message: values.message,
              })
            ])
            setIsTyping(false)
            form.resetFields()
        }
        catch (err) {
            console.log(err)
        }
    }

  console.log(data, '-------', totalPage, '-------', currentPage)
  const appendData =  async (page?: number) => {
    let params =  {
        page: page
    }

    const result = await props?.queryAPI(params)
    if(result) {
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

      let temp = data.concat(dataSource)
      setData(temp)
    }
    
  };

  useEffect(() => {
    // appendData(currentPage);
  }, [currentPage]);



  return (
    <div className={cx(`chat-container`)}>
      <div className={cx('chat-container-child')}>
        <div className={cx(`chat-left`)}>
          <div className={cx(`recent-chat`)}>
            Recent Chats
          </div>
          <div className={cx(`middle`)}>
          </div>
        </div>
        <div className={cx(`chat-middle`)}>
        </div>
        <div className={cx(`chat-right`)}>
            <div className={cx('chat-info')}>
              <Avatar src={''} className={cx(`avatar`)}/>
              <div className={cx('name')}>{`Tran Quang Minh`}</div>
          </div>
          <div style={{width: '95%', overflowX: 'hidden', overflowY: 'scroll', display: 'flex', flexDirection: 'column-reverse'}}>
            <ChatFeed
              messages={messages} // Array: list of message objects
              isTyping={isTyping} // Boolean: is the recipient typing
              hasInputField={false} // Boolean: use our input, or use your own
              showSenderName // show the name of the user who sent the message
              bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
              // JSON: Custom bubble styles
              bubbleStyles={
                {
                  // text: {
                  //   fontSize: 15
                  // },
                  // chatbubble: {
                  //   borderRadius: 20,
                  //   padding: 15,
                  // },
                  pSender: {
                      color: '#68d1c8',
                      fontSize: 16,
                      fontWeight: '300',
                      margin: 15,
                      padding: 15,
                      borderRadius: 20,
                  },
                  pRecipient: {
                      color: 'grey',
                      fontSize: 16,
                      fontWeight: '300',
                      margin: 15,
                      borderRadius: 20,
                      padding: 15
                  }
                }
                
              }
              
            />
          </div>
          <Form
              form={form}
              className={cx('footer-footer')}
              layout="vertical"
              autoComplete="off"
              onFinish={handleFinish}
          >
          <Form.Item 
              name="message"
              className={cx(`input`)}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value: string) {
                    return Promise.resolve()
                  }
                  })
              ]}
              >
              <Input
                type='text'
                placeholder='Add a comment...'
                className={cx('comment-input')}
                // onChange={() => {setIsTyping(true)}}
              />

            </Form.Item>
        
            <Form.Item>
            <Button
                className={cx('comment-button')}
                htmlType="submit"
            >
                <span style={{margin: '0 5px', color: '#68d1c8'}}>Post</span>
                <FaLocationArrow style={{ color: '#68d1c8'}} />
            </Button>
            </Form.Item>
        </Form>
        </div>
      </div>
    </div>
  )

};

export default Chat