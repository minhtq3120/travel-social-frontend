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
import { createChatGroup, getChatDetailById, getRecentsChat } from 'src/services/chat-service';
import moment from 'moment';
import Search from './SearchUserChat';

const JOIN_ROOM ='joinRoom';
const JOIN_ROOM_SUCCESS ='joinRoomSuccess'
export const SEND_MESSAGE = 'sendMessage';
export const RECEIVE_MESSAGE = 'receiveMessage'

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
  const [isModalVisibleNewChat, setIsModalVisiblNewChat] = useState(false);

  const [userSelected, setUserSelected] = useState<any>([])

  const [chatDetail, setChatDetail] = useState<any>(null)
  const [createNewChat, setCreateNewChat] = useState<boolean>(false)
  const [messages, setMessages] = useState<any>(null)

  const socket: any = useSelector((state: RootState) => state.wallet.socket);

  socket?.on(RECEIVE_MESSAGE, (data) => {
    console.log('?????????????//')
    if(messages) setMessages([...messages, new Message({
      id: data?.isCurrentUserMessage === true ? 0 : data?.userId,
      message: data?.message,
      senderName: data?.displayName
    })])
  })

  const getChatDetail = async (groupChatId: string) => {
    let params =  {
        groupChatId
    }
    const result = await getChatDetailById(params)
    if(result) {
      const dataSource = _.get(result, 'data.items', []);
      const totalItem = _.get(result, 'data.meta.totalItems', 0);
      const totalPages = _.get(result, 'data.meta.totalPages', 0);
      const itemsPerPage = _.get(result, 'data.meta.perPage', 0);
      const currentPage = _.get(result, 'data.meta.currentPage', 0);

      
      let mapMess: any = []
      dataSource.reverse().map((item) => {[
        mapMess.push(
          new Message({
            id: item?.isCurrentUserMessage ? 0 : item?.userId,
            message: item?.message,
            senderName: item?.displayName
          })
        )
      ]})
      setMessages(mapMess);
      // setTotalItem(parseInt(totalItem));
      // setTotalPage(parseInt(totalPages));
      // setItemsPerPage(parseInt(itemsPerPage));
      // setCurentPage(parseInt(currentPage));
    }
  }

  useEffect(() => {
    if(chatDetail?._id) getChatDetail(chatDetail?._id)
  }, [chatDetail])

  const handleCancel = () => {
        setIsModalVisiblNewChat(false)
    };



  
  
  

  const handleFinish = async (values) => {
        try {
            socket.emit(SEND_MESSAGE, {
              message: values.message,
              chatGroupId: chatDetail._id || chatDetail?.chatGroupId
            })
            setIsTyping(false)
            form.resetFields()
        }
        catch (err) {
            console.log(err)
        }
    }
    const ListRecentsChat = () => {
     return <div  ref={scrollRef } style={{width: '100%',height: '700px', display: 'flex', flexDirection: 'column', alignItems: 'center',alignContent:'flex-start', overflowY: 'scroll', overflowX: 'hidden'}} >
         {
            data.map((item: any, index: any) => (
                 <div style={{width: '100%', display: 'flex',flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignContent: 'center', padding: '15px 10px' , cursor: 'pointer'}}
                  key={index}
                  onClick={() => {
                    console.log(item)
                    setChatDetail({
                      avatar: item?.image[0] || '',
                      _id: item.chatGroupId,
                      chatGroupName: item.chatGroupName
                    })
                     socket.emit(JOIN_ROOM, {
                      chatGroupId: item.chatGroupId,
                    })}
                  }
                  
                  >
                    <div className={cx('chat-info')} style={{display: 'flex',flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignContent: 'center'}}>
                        <Avatar src={item?.image[0]} size={50}/>
                       <div style={{height: '100%',display: 'flex',flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', alignContent: 'center'}}>
                        <div className={cx('name')} style={{fontWeight: 'bold', fontSize: '16px', padding: '0px 10px', opacity: '0.8'}}>{item?.chatGroupName}</div>
                        <div style={{ fontSize: '14px', padding: '0px 10px', opacity: '0.8'}}>{item?.message}</div>
                        <div style={{ fontSize: '13px', padding: '0px 10px', opacity: '0.7'}}>{moment(item?.createdAt).format('YYYY-MM-DD HH-MM')}</div>
                      </div>
                    </div>
                    <div className={cx('chat')}>{item?.lastChat}</div>
                </div>
            ))
        }
        {
        totalPage - 1 === currentPage || data?.length === 0 ? null : (
            <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
                <Spin size="large" style={{margin: '15px 0', padding: '5px 0'}}/>
            </div>  
        )}
    </div>
    }


  const appendData =  async (page?: number) => {
    let params =  {
        page: page
    }

    const result = await getRecentsChat(params)
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
    appendData(currentPage);
  }, [currentPage]);

  const handleCreateChat = async (payload) => {
    try {
      let participants: string[] = []
      payload.map((user) => {
        return participants.push(user?.userId)
      })
      const bodyPrivateTrue = {
        participants,
        isPrivate: true 
      }
      const bodyPrivateFalse = {
        name:  `you and ${payload?.length} more peoples`,
        participants,
        isPrivate: false
      }
      let body = payload?.length === 1 ? bodyPrivateTrue : bodyPrivateFalse
      const creatNewGroupChat = await createChatGroup(body)
      const newChat = _.get(creatNewGroupChat, 'data', null);
      if(newChat) {
        setChatDetail({
          ...newChat,
          avatar: newChat.image[0]
        })
        setMessages([])
        socket.emit(JOIN_ROOM, {
          chatGroupId: newChat?.chatGroupId,
        })
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  
  const ChatInbox =() => {
     return (
       messages?
        <div style={{width: '95%', overflowX: 'hidden', overflowY: 'scroll', display: 'flex', flexDirection: 'column-reverse', minHeight: '650px'}}>
            <ChatFeed
              messages={messages} // Array: list of message objects
              isTyping={isTyping} // Boolean: is the recipient typing
              hasInputField={false} // Boolean: use our input, or use your own
              showSenderName // show the name of the user who sent the message
              bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
              bubbleStyles={
                {
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
          </div> : null
     )
  }

  const ChatDetail = () => {
    return (
      chatDetail  ?
      <>
      <div className={cx('chat-info')}>
              <Avatar src={chatDetail?.avatar} className={cx(`avatar`)}/>
              <div className={cx('name')}>{chatDetail?.chatGroupName}</div>
          </div>
          <ChatInbox />
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
        </> : <div style={{width: '100%', height: '100%', display: 'flex',flexDirection: 'column', alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
           <FiSend size={50}/>
           <div style={{fontSize: '16px', padding:'10px', opacity: '0.7'}}>Send private message to your friend right now</div>
           <Button style={{backgroundColor: '#68d1c8', borderRadius: '5px', height: 'auto'}}  onClick={() => {setIsModalVisiblNewChat(true)}}>
              <div style={{fontWeight: 'bold', padding: '5px', opacity: '0.8'}}>Send Message</div>
             </Button>
        </div>
    ) 
  }

  return (
    <div className={cx(`chat-container`)}>
      <div className={cx('chat-container-child')}>
        <div className={cx(`chat-left`)}>
          <div className={cx(`recent-chat`)}>
            Recent Chats
          </div>
          <FiSend className={cx('chat-icon')} size={30} onClick={() => {setIsModalVisiblNewChat(true)}}/>
          <div className={cx(`middle`)}>
            <ListRecentsChat />
          </div>
        </div>
        <div className={cx(`chat-middle`)}>
        </div>
        <div className={cx(`chat-right`)}>
            <ChatDetail />
        </div>
      </div>

      <Modal title={`New Message`} visible={isModalVisibleNewChat} footer={null} onCancel={handleCancel} width={500} closable={false} bodyStyle={{padding: '0', borderRadius: '0'}}>
            <Search userSelected={userSelected} setUserSelected={setUserSelected} setIsModalVisiblNewChat={setIsModalVisiblNewChat} handleCreateChat={handleCreateChat}/>
      </Modal>
    </div>
  )

};

export default Chat