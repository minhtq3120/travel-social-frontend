import React, { useState, useEffect, useCallback, useRef } from 'react';
import { List, message, Avatar, Skeleton, Divider, Button, Spin, Form, Input, Modal } from 'antd';
import VirtualList from 'rc-virtual-list';
import { followId, getFollowers, getFollowing, unfollowId } from 'src/services/follow-service';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FiSend } from 'react-icons/fi';

const fakeDataUrl =
  'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
const ContainerHeight = 500;

import { GoPrimitiveDot } from 'react-icons/go';

import { io } from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux';
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
import { setChatNotSeen, setOldChat } from 'src/redux/WalletReducer';
import { getCurrUserProfile } from 'src/services/user-service';
import { MessageList } from 'react-chat-elements'
import ScrollToBottom,  { useScrollToBottom, useSticky , useAtTop} from 'react-scroll-to-bottom';
import { css } from '@emotion/css';
import {BsThreeDots,BsFillPersonPlusFill} from 'react-icons/bs'
import {RiLogoutCircleRLine} from 'react-icons/ri'
import { notificationError, notificationSuccess } from 'src/pages/Login/Login';
import AddUserToChat from './AddUserToChat';

const JOIN_ROOM ='joinRoom';
const JOIN_ROOM_SUCCESS ='joinRoomSuccess'
export const SEND_MESSAGE = 'sendMessage';
export const RECEIVE_MESSAGE = 'receiveMessage'
const LEAVE_CHAT_GROUP = 'leaveChatGroup';
const LEAVE_CHAT_GROUP_SUCCESS = 'leaveChatGroupSuccess';
const ADD_USERS_TO_CHAT_GROUP = 'addUsersToChatGroup';
const ADD_USERS_TO_CHAT_GROUP_SUCCESS = 'addUsersToRoomSuccess';

const cx = classNames.bind(styles);

const Chat = (props: any) => {
  const [form] = Form.useForm();
  const handleFetchMore = async () => {
    // await sleep();
    setCurentPage(currentPage + 1)
  }
  const scrollRef: any = useBottomScrollListener(() => {
     totalPage - 1 === currentPage || data?.length === 0 ? null : handleFetchMore()
  });
  


  const handleFetchMore2 = async () => {
    // await sleep();
    setCurentPage2(currentPage2 + 1)
  }
  const scrollRef2: any = useBottomScrollListener(() => {
     totalPage2 - 1 === currentPage2 || messages?.length === 0 ? null : handleFetchMore2()
  });

  const dispatch = useDispatch()

  const [data, setData] = useState<any>([]);
  const [totalItem, setTotalItem] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [textSearch, setTextSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurentPage] = useState(0);
  const [trigger, setTrigger] = useState<any>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [isModalVisibleNewChat, setIsModalVisiblNewChat] = useState(false);

  const [isModalVisibleAddPeople, setIsModalVisiblAddPeople] = useState(false);

  const [isModalVisibleLeaveChat, setIsModalVisiblLeaveChat] = useState(false);

  const [userSelected, setUserSelected] = useState<any>([])

  const [chatDetail, setChatDetail] = useState<any>(null)
  const [createNewChat, setCreateNewChat] = useState<boolean>(false)

  const [messages, setMessages] = useState<any>(null)
  const [totalItem2, setTotalItem2] = useState(0);
  const [totalPage2, setTotalPage2] = useState(0);
  const [itemsPerPage2, setItemsPerPage2] = useState(5);
  const [currentPage2, setCurentPage2] = useState(0);

  const socket: any = useSelector((state: RootState) => state.wallet.socket);
  const chatNotSeen: any = useSelector((state: RootState) => state.wallet.chatNotSeen);

  const [leaveChat, setLeaveChat] = useState<any>(null)
  const getCurrentUser = async() => {
    const user = await getCurrUserProfile()
  }

  useEffect(() => {
    socket?.on(RECEIVE_MESSAGE, (data) => {
      console.log(data?.chatGroupId, '=============', chatDetail)
    if(data?.isCurrentUserMessage === false) {
      setTrigger({
        id:  data?.userId,
        message: data?.message,
        senderName: data?.displayName,
        avatar: data?.avatar,
        chatGroupId: data?.chatGroupId
      })
      dispatch(setChatNotSeen(chatNotSeen + 1))
    }
    })
    // getCurrentUser()
  }, [socket])
  
  useEffect(() => {
  socket?.on(LEAVE_CHAT_GROUP_SUCCESS, (data) => {
        console.log(data)
    if(data) {
      setTrigger({
        id: LEAVE_CHAT_GROUP_SUCCESS,
        message: `${data?.user?.displayName} rời khỏi nhóm chat`,
        senderName: data?.user?.displayName,
        avatar: data?.user?.avatar,
        chatGroupId: data?.newChatGroup.chatGroupId
      })
      console.log(trigger)
      dispatch(setChatNotSeen(chatNotSeen + 1))
    }
    })
  }, [socket])
  useEffect(() => {
  socket?.on(ADD_USERS_TO_CHAT_GROUP_SUCCESS, (dataa) => {
    console.log(dataa)
    if(dataa) {
      let temp: any = []
      dataa?.addedUsers?.forEach((user) => {
        temp.push(user?.displayName)
      })
      setTrigger({
        id: ADD_USERS_TO_CHAT_GROUP_SUCCESS,
        message: `${dataa?.adder?.displayName} đã thêm ${temp?.length} người vào nhóm: ${temp?.toString()}`,
        senderName: dataa?.displayName,
        avatar: dataa?.avatar, 
        chatGroupId: dataa.newChatGroup.chatGroupId,
        newChatGroup: dataa.newChatGroup,
      })
      
      console.log(trigger)
      dispatch(setChatNotSeen(chatNotSeen + 1))
    }
    })
  }, [socket])
  useEffect(() => {
    if(trigger && messages && trigger?.chatGroupId === chatDetail?._id){
      let temp = [trigger].concat(messages)
      setMessages(temp)
      
    }
    if(trigger?.id === ADD_USERS_TO_CHAT_GROUP_SUCCESS && data?.filter((item) => item?.chatGroupId ===trigger?.newChatGroup?.chatGroupId)?.length === 0  ) {
        console.log('DATA+++++++++++++++++++' , data)
        setData([
          {
            image: trigger?.newChatGroup?.image || [],
            chatGroupId: trigger?.newChatGroup?.chatGroupId,
            chatGroupName: trigger?.newChatGroup?.chatGroupName,
          },
            ...data,
        ])
      }
  }, [trigger])


  const getChatDetail = async (groupChatId: string, page) => {
    let params =  {
      page: page,
      perPage:20,
        groupChatId,
    }
    const result = await getChatDetailById(params)
    if(result) {
      const dataSource = _.get(result, 'data.items', []);
      const totalItem = _.get(result, 'data.meta.totalItems', 0);
      const totalPages = _.get(result, 'data.meta.totalPages', 0);
      const itemsPerPage = _.get(result, 'data.meta.perPage', 0);
      const currentPage = _.get(result, 'data.meta.currentPage', 0);

      
      let mapMess: any = []
      dataSource.map((item) => {[
        mapMess.push(
          {
            id: item?.isCurrentUserMessage ? 0 : item?.userId,
            message: item?.message,
            senderName: item?.displayName,
            avatar: item?.avatar
          }
        )
      ]})
      let temp: any = []
      if(!messages) temp = mapMess
      else temp = messages.concat(mapMess)
      setMessages(temp);
      dispatch(setOldChat(temp))
      setTotalItem2(parseInt(totalItem));
      setTotalPage2(parseInt(totalPages));
      setItemsPerPage2(parseInt(itemsPerPage));
      setCurentPage2(parseInt(currentPage));
    }
  }

  useEffect(() => {
    console.log('========',chatDetail)
    if(chatDetail?._id) getChatDetail(chatDetail?._id, currentPage2)
  }, [chatDetail, currentPage2])

  const handleCancel = () => {
        setIsModalVisiblNewChat(false)
        setIsModalVisiblAddPeople(false)
        setIsModalVisiblLeaveChat(false)
    };

    const handleFinish = async (values) => {
        try {
          let temp = [{
               id:  0,
               message: values.message
            }].concat(messages)
            setMessages(temp)
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
      
     return <div  ref={scrollRef } style={{width: '100%',height: '700px', display: 'flex', flexDirection: 'column', alignItems: 'center',alignContent:'flex-start', overflowY: 'scroll', overflowX: 'hidden', marginTop: '10px'}} >

         {
            data?.map((item: any, index: any) => {
              const [seenFake, setSeenFake] = useState<any>(item?.seen)
              return (
                 <div style={{width: '100%', display: 'flex',flexDirection: 'row',borderLeft: seenFake ? '5px solid white' : '5px solid#68d1c8',  justifyContent: 'space-between', alignItems: 'center', alignContent: 'center', padding: '15px 10px' , cursor: 'pointer', margin: '5px 0'}}
                  key={index}
                  onClick={() => {
                    setMessages([])
                    setCurentPage2(0)
                    setSeenFake(true)
                    console.log('?come ere', seenFake)
                    setChatDetail({
                      avatar: item?.image,
                      _id: item.chatGroupId,
                      chatGroupName: item.chatGroupName
                    })
                     socket.emit(JOIN_ROOM, {
                      chatGroupId: item.chatGroupId,
                    })}
                  }
                  
                  >
                    <>
                    <div className={cx('chat-info')} style={{display: 'flex',flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignContent: 'center'}}>
                        {
                          item?.image?.length === 1 ?  <div style={{width: '70px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Avatar style={{ border: '2px solid white'}} src={item?.image[0]} size={50} /></div> :
                          item?.image?.length > 1 ? (
                            <div style={{width: '70px',position: 'relative', height: '50px'}}>
                               <Avatar src={item?.image[0]} size={50} style={{position: 'absolute', top: '0px', left: '-5px', border: '2px solid white'}}/>
                              <Avatar src={item?.image[1]} size={50} style={{position: 'absolute', top: '-20px', right: '5px', border: '2px solid white'}}/>
                              <Avatar src={item?.image[2]} size={50} style={{position: 'absolute', top: '15px', right: '0px', border: '2px solid white'}}/>
                            </div>
                          ): null
                        }
                        
                       <div style={{height: '100%',display: 'flex',flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', alignContent: 'center'}}>
                        <div className={cx('name')} style={{fontWeight: 'bold', fontSize: '16px', padding: '0px 10px', opacity: '0.8'}}>{item?.chatGroupName}</div>
                        <div style={seenFake ? { fontSize: '14px', padding: '0px 10px', opacity: '0.8', width:'200px', whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis' } :
                         {fontWeight: 'bold', color: '#68d1c8', fontSize: '14px', padding: '0px 10px', opacity: '0.8', width:'200px', whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis'}}>{item?.message}</div>
                        <div style={{ fontSize: '13px', padding: '0px 10px', opacity: '0.7'}}>{moment(item?.createdAt).format('YYYY-MM-DD HH-MM')}</div>
                      </div>
                    </div>
                    <div className={cx('chat')} style={seenFake ? {} : {fontWeight: 'bold', color: '#68d1c8'}}>{item?.lastChat}</div>
                    </>
                    {seenFake ? null: <GoPrimitiveDot size={20} color='#68d1c8'style={{marginRight: '20px'}} />}
                </div>
            )
                      })
        }
        {
        totalPage - 1 === currentPage || data?.length === 0 || (totalPage === 0 && currentPage === 0) ? null : (
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
//     {
//     "chatId": "627aa12839a0c0272895412a",
//     "chatGroupId": "627aa12239a0c02728954117",
//     "chatGroupName": "you and 4 more peoples",
//     "image": [
//         "http://loremflickr.com/640/480/people?12789",
//         "http://loremflickr.com/640/480/people?37927",
//         "http://loremflickr.com/640/480/people?62998"
//     ],
//     "isCurrentUserMessage": true,
//     "message": "test",
//     "createdAt": "2022-05-10T17:30:16.543Z",
//     "seen": true
// }
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
        setMessages([])
        setChatDetail({
          ...newChat,
          avatar: newChat.image,
          _id: newChat.chatGroupId,
          chatGroupName: newChat.chatGroupName,
          createNew: true
        })
        setData([
         {
          ...newChat,
          image: newChat.image,
          _id: newChat.chatGroupId,
          chatGroupName: newChat.chatGroupName,
        },
          ...data,
      ])
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
  const handleLeaveChat = async (chatGroupId: string) => {
    try {
      socket.emit(LEAVE_CHAT_GROUP, {
        chatGroupId
      })
      setLeaveChat(chatGroupId)
      setData(data?.filter((item) => item.chatGroupId !== chatGroupId))
      setChatDetail(null)
    }
    catch (err) {
      console.log(err)
    }
  }

   const handleAddNewPeopleToChat = async (userId: string[]) => {
    try {
      let userIdArr: any = []
      userId.forEach((item: any) => {
        userIdArr.push(item?.userId)
      })
      if(chatDetail?.avatar?.length === 1) {
        notificationError('Không thể thêm người vào nhóm chat cá nhân')
        return
      }
      socket.emit(ADD_USERS_TO_CHAT_GROUP, {
        chatGroupId: chatDetail?._id,
        userIds: userIdArr
      })
      notificationSuccess('thành viên đã được thêm vào nhóm chat.')
      // setLeaveChat(chatGroupId)
      // setData(data?.filter((item) => item.chatGroupId !== chatGroupId))
      // setChatDetail(null)
    }
    catch (err) {
      console.log(err)
    }
  }

  const onScroll = async () => {
    if (scrollRef2.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef2.current;
      if ((-(clientHeight - scrollHeight) + scrollTop < 10) && !( totalPage2 - 1 === currentPage2 || messages?.length === 0  || (totalPage2 === 0 && currentPage2 === 0))) {
        // TO SOMETHING HERE
        //await sleep()
        setCurentPage2(currentPage2 + 1)
      }
    }
  };




  const ChatInbox2 = ()  => {
    // const messagesEndRef: any = useRef(null);
    // const scrollToBottom = () => {
    //   console.log('????')
    //   messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
    // };
    // useEffect(scrollToBottom, [messages]);
     return (
       messages?
        <div ref={scrollRef2} style={{width: '95%', overflowX: 'hidden', overflowY: 'scroll', display: 'flex', flexDirection: 'column-reverse', height: '650px'}}
       onScroll={() => onScroll()}
       >
         
          {
            messages.map((mess, index) => {
              return (
                <div  key={index} style={{width: '100%',marginBottom: '5px', display: 'flex', flexDirection: 'row', justifyContent: mess.id ===LEAVE_CHAT_GROUP_SUCCESS ? 'center' : mess?.id === 0 ? 'flex-end' : 'flex-start', alignItems: 'center'}}>
                  <div style={{width: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '5 10px'}}>
                   {
                     mess.id ===LEAVE_CHAT_GROUP_SUCCESS ? (
                       <>
                          <div style={{width: 'auto', padding: '10px 20px', borderRadius: '30px', backgroundColor: 'white', color: 'grey', fontWeight: 'bold'}}>{mess?.message}</div>
                       </>
                     ):
                     mess.id ===ADD_USERS_TO_CHAT_GROUP_SUCCESS ? (
                       <>
                          <div style={{width: 'auto', textAlign: 'center', padding: '10px 20px', borderRadius: '30px', backgroundColor: 'white', color: 'grey', fontWeight: 'bold'}}>{mess?.message}</div>
                       </>
                     ) : mess.id === 0 ? (
                       <div style={{width: 'auto', padding: '10px 20px', borderRadius: '30px', backgroundColor: '#68d1c8', color: 'white', fontWeight: 'bold'}}>{mess?.message}</div>
                     ) : (
                       <>
                       {
                         messages[index]?.id !== messages[index+1]?.id ? 
                           <div style={{fontSize: '15px', fontWeight: 'bold', opacity: '0.7', marginLeft: '60px', marginBottom: '5px'}}>{mess?.senderName}</div>
                        : null
                       }
                        <div style={{width: 'auto',display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}} >
                        {messages[index]?.id === messages[index-1]?.id ?  <Avatar src={mess?.avatar}size={40} style={{margin: '0 10px', visibility: 'hidden' , minWidth: '40px'}} /> : (
                          <>
                           <Avatar  src={mess?.avatar} size={40} style={{margin: '0 10px', minWidth: '40px'}} />
                          </>
                       
                        )}
                          
                          <div style={{width: 'auto', padding: '10px 20px', borderRadius: '30px', backgroundColor: 'lightgrey', color: 'white', fontWeight: 'bold'}}>{mess?.message}</div>
                          </div>
                        {/* <div style={{fontSize: '15px', opacity: '0.8', marginLeft: '15px'}}>{mess?.senderName}</div> */}
                       </>

                     )

                       
                   }
                    
                  </div>
                </div>
              )
            })
          }  
           {
          totalPage2 - 1 === currentPage2 ||  messages?.length === 0 || (totalPage2 === 0 && currentPage2 === 0) ? null : (
              <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
                  <Spin size="large" style={{margin: '15px 0', padding: '5px 0'}}/>
              </div>  
          )}
          
        </div> : null
     )
  }
  const ROOT_CSS = css({
    height: 650,
    width: '95%'
  });

  const ConfirmLeaveChat = () => {
    return (
      <div style={{width: '100%', height: 'auto', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Button style={{
             padding: '10px 35px',
                    borderRadius: '30px',
                    height: 'auto',
                    margin: '10px 30px',
                    backgroundColor: chatDetail?.avatar?.length === 1 ? 'grey' : '#68d1c8',
                    color: 'white',
                    borderColor: chatDetail?.avatar?.length === 1 ? 'grey' : '#68d1c8',
                    fontSize: '16px',
                    fontWeight: 'bold'
          }}
          disabled={chatDetail?.avatar?.length === 1}
          onClick={() => {
            handleLeaveChat(chatDetail?._id)
            notificationSuccess('bạn đã rời khỏi nhóm chat.')
            handleCancel()
          }}
          >
            {chatDetail?.avatar?.length === 1 ? 'Không thể rời chat cá nhân' :'Rời khỏi nhóm chat'}
          </Button>
      </div>

    )
  }


  const ChatDetail = () => {
    return (
      chatDetail  ?
      <>
      <div className={cx('chat-info-container')}>
        <div className={cx('chat-info')}>
              {
                chatDetail?.avatar.length === 1 ?  <div style={{width: '70px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Avatar className={cx(`avatar`)} style={{ border: '2px solid white'}} src={chatDetail?.avatar[0]} size={50} /></div> :
                chatDetail?.avatar.length > 1 ? (
                  <div style={{width: '150px',position: 'relative', height: '50px', marginLeft: '0px'}}>
                      <Avatar src={chatDetail?.avatar[0]} size={50} className={cx(`avatar`)} style={{position: 'absolute', top: '-8px', right: '0px', border: '2px solid white'}}/>
                    <Avatar src={chatDetail?.avatar[1]} size={50} className={cx(`avatar`)} style={{position: 'absolute', top: '-8px', right: '30px', border: '2px solid white'}}/>
                    <Avatar src={chatDetail?.avatar[2]} size={50} className={cx(`avatar`)} style={{position: 'absolute', top: '-8px', right: '60px', border: '2px solid white'}}/>
                  </div>
                ): null
              }
              {/* <Avatar src={chatDetail?.avatar[0]} className={cx(`avatar`)}/> */}
              <div className={cx('name')}>{chatDetail?.chatGroupName}</div>
          </div>
          <div>
            <BsFillPersonPlusFill style={{ fontSize: '25px', margin: '0 10px', cursor: 'pointer'}} onClick={() => {
               setIsModalVisiblAddPeople(true)
            }} />
            <RiLogoutCircleRLine style={{ fontSize: '25px', margin: '0 10px', marginRight: '25px', cursor: 'pointer'}} onClick={() => {
              setIsModalVisiblLeaveChat(true)
            }}/>
          </div>
      </div>

          <ChatInbox2 />
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

      <Modal title={`Tin nhắn mới`} visible={isModalVisibleNewChat} footer={null} onCancel={handleCancel} width={500} closable={false} bodyStyle={{padding: '0', borderRadius: '0'}}>
            <Search userSelected={userSelected} setUserSelected={setUserSelected} setIsModalVisiblNewChat={setIsModalVisiblNewChat} handleCreateChat={handleCreateChat}/>
      </Modal>
      <Modal title={`Thêm người vào nhóm chat`} visible={isModalVisibleAddPeople} footer={null} onCancel={handleCancel} width={500} closable={false} bodyStyle={{padding: '0', borderRadius: '0'}}>
            <AddUserToChat userSelected={userSelected} setUserSelected={setUserSelected} setIsModalVisiblAddPeople={setIsModalVisiblAddPeople} handleAddNewPeopleToChat={handleAddNewPeopleToChat}/>
      </Modal>
      <Modal title={`Bạn có chắc muốn rời khỏi nhóm chat?`} visible={isModalVisibleLeaveChat} footer={null} onCancel={handleCancel} width={350} closable={false} bodyStyle={{padding: '0', borderRadius: '0'}}>
            <ConfirmLeaveChat />
      </Modal>
    </div>
  )

};

export default Chat