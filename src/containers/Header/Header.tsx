import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from 'src/styles/Header.module.scss';
import RenderSearch from 'src/components/render-search/RenderSearch';
import Logo from 'src/assets/MadLogo.png';
import {
  HeartOutlined,
  HomeOutlined,
  MessageOutlined,
  PlusSquareOutlined,
  UserOutlined
} from '@ant-design/icons';
import { BsPersonCircle } from 'react-icons/bs';
import { IoMdNotificationsOutline } from 'react-icons/io';
import {
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineUserSwitch,
  AiOutlineLogout,
  AiOutlineHome,
  AiOutlineMessage,
  AiOutlinePlusSquare,
  AiOutlineYoutube
} from 'react-icons/ai';
import { Dropdown, Input, Menu, message, Modal } from 'antd';
import { getCurrentUser } from 'src/utils/utils';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setIconTabKey } from 'src/redux/IconTabReducer';
import { RootState } from 'src/redux/store';
import CreateNewPost from 'src/components/CreateNewPosts/CreateNewPost';
import InfinityList from 'src/components/InfinityScroll/InfinityScroll';
import { getFollowers } from 'src/services/follow-service';
import NotificationList, { RECEIVE_NOTIFICATION } from 'src/components/Notification/Notification';
import SearchBar from './SearchBar';
import { setChatNotSeen, setNotiNotSeen, setSearchFilter, setSearchValue, setTriggerSearch } from 'src/redux/WalletReducer';
import { RECEIVE_MESSAGE } from 'src/components/Chat/Chat';
import { getRecentsChat } from 'src/services/chat-service';
import { getNotifi } from 'src/services/notifi-service';
import _ from 'lodash'

const cx = classNames.bind(styles);
const { Search } = Input;

const HeaderContainer = (props: any) => {
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser: any = getCurrentUser();
  const [uploaded, setUploaded] = useState(false);
  const account = useSelector((state: RootState) => state.iconTabb.iconKey);
  const iconNotClick = {
    fontSize: '32px',
    margin: '0 7px',
    cursor: 'pointer',
    color: 'white'
  };

  const iconClicked = {
    fontSize: '32px',
    margin: '0 7px',
    cursor: 'pointer',
    color: 'white'
  };



  const [iconStyle, setIconStyle] = useState(iconNotClick);
  const [keyword, setKeyword] = useState<string>('')
  const socket: any = useSelector((state: RootState) => state.wallet.socket);
  const handleOnChange = (event: any) => {
    console.log(event.target.value);
  };

  const onSearch = async (value: string) => {
    setKeyword(value)
  };

  const getStyleIcon = (key) => {
    return localStorage.getItem('iconTabKey') === key ? iconClicked : iconNotClick;
  };

  const handleMenuClick = (e) => {
    switch (e.key) {
      case '1':
        history.push('/profile');
        break;
      case '2':
        break;
      case '3':
        break;
      case '4':
        {
          handleLogout();
        }
        break;
      default: {
        break;
      }
    }
  };
  const getTotalNotifi = async () => {
    let params =  {
        page: 0
    }
     const resultChat = await getRecentsChat(params)
     const resultNoti = await getNotifi(params)

     const dataChat = _.get(resultChat, 'data.items', []);
    const dataNoti = _.get(resultNoti, 'data.items', []);
    
    let tempCountChat = 0;
    let tempCountNoti = 0
    dataChat.forEach((it) => {
      if(!it?.seen) tempCountChat+=1
     })
    dataNoti.forEach((it) => {
      if(!it?.seen) tempCountNoti+=1
     })
     console.log({
       tempCountChat,
       tempCountNoti
     })
     dispatch(setChatNotSeen(tempCountChat))
     dispatch(setNotiNotSeen(tempCountNoti))
  }

  useEffect(() => {
    getTotalNotifi()
  }, [])

  const [chatNotSeenCount, setChatNotSeenCount] = useState(null)
    const [notiNotSeenCoung, setNotiNotSeenCount] = useState(null)
    const [trigger, setTrigger] = useState<any>(false)
    const [trigger2, setTrigger2] = useState<any>(false)

    const chatNotSeen: any = useSelector((state: RootState) => state.wallet.chatNotSeen);
  const notiNotSeen: any= useSelector((state: RootState) => state.wallet.notiNotSeen);
    useEffect(() => {
    socket?.on(RECEIVE_MESSAGE, (data) => {
      console.log('?????????????//, CHAT')
      if(data?.isCurrentUserMessage === false) {
        console.log("WORKKKKKKKKKKKKKKKKKKKk")
        setTrigger(data?.createdAt)
      }
    })
  }, [socket])

  useEffect(() => {
    socket?.on(RECEIVE_NOTIFICATION, (data) => {
      console.log('?????????????//, NOTIFICATIOn',data )
      // if(data?.isCurrentUserMessage === false) {
      //   console.log("WORKKKKKKKKKKKKKKKKKKKk")
      //   setTrigger(data?.createdAt)
      // }
      setTrigger2(data?.createdAt)
    })
  }, [socket])

  useEffect(() => {
      console.log('COMER+HEERRELKREKLJER', chatNotSeen)
      dispatch(setChatNotSeen(chatNotSeen + 1))
      console.log('AFTER DISPATCH', chatNotSeen)
  }, [trigger])

   useEffect(() => {
      console.log('COMER+HEERRELKREKLJER',  notiNotSeen)
      dispatch(setNotiNotSeen(notiNotSeen + 1))
      console.log('AFTER DISPATCH NOTI', notiNotSeen)
  }, [trigger2])

  useEffect(() => {
    if(chatNotSeen)setChatNotSeenCount(chatNotSeen)
    console.log('bruh', chatNotSeen, '====', chatNotSeenCount)

  }, [chatNotSeen])
  
  useEffect(() => {
      if(notiNotSeen)setNotiNotSeenCount(notiNotSeen)
    }, [notiNotSeen])

  // console.log('==========', chatNotSeen, "============", notiNotSeen)
  const handleLogout = () => {
    localStorage.clear();
    history.push('/login');
  };
  

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item
        key="1"
        icon={
          <AiOutlineUser style={{ fontSize: '20px', marginRight: '10px', cursor: 'pointer' }} />
        }
        style={{ padding: '10px 10px' }}>
        Profile
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={
          <AiOutlineSetting style={{ fontSize: '20px', marginRight: '10px', cursor: 'pointer' }} />
        }
        style={{ padding: '10px 10px' }}>
        Settings
      </Menu.Item>
      <Menu.Item
        key="3"
        icon={
          <AiOutlineUserSwitch
            style={{ fontSize: '20px', marginRight: '10px', cursor: 'pointer' }}
          />
        }
        style={{ padding: '10px 10px' }}>
        Change Accounts
      </Menu.Item>
      <Menu.Item
        key="4"
        icon={
          <AiOutlineLogout style={{ fontSize: '20px', marginRight: '10px', cursor: 'pointer' }} />
        }
        style={{ padding: '10px 10px' }}>
        Log Out
      </Menu.Item>
    </Menu>
  );

  const notifi = <NotificationList />;

  return (
    <>
      <div className={cx('header-container')}>
        <img
          className={cx('header-logo')}
          src={Logo}
          alt="logo"
          onClick={() => {
            history.push('/');  
          }}
        />
        <div className={cx(`header-search`)}>
          <RenderSearch onChange={onSearch} placeholder={'Search..'} handlePressEnterSearch={
            () => {
              console.log("???")
              if(keyword?.length > 0) dispatch(setSearchValue(keyword))
              dispatch(setTriggerSearch(''))
              setKeyword('')
              history.push(`/searchDetail`)}
            
          }/>
          {
            keyword?.length > 0 ?<SearchBar keyword={keyword} setKeyword={setKeyword}/> : null
          }
        </div>

        <div className={cx('header-icon')}>
          <div className={cx('icon-chat')}>
            <AiOutlineHome
              style={account === '1' ? iconClicked : iconNotClick}
              onClick={() => {
                history.push('/');
                dispatch(setIconTabKey('1'));
              }}
            />
            <div style={{width: 'auto', display: 'flex', alignContent: 'center', justifyContent: 'center', position: 'relative'}} onClick={() => {
                  history.push('/chats');
                  dispatch(setIconTabKey('2'));
                }}>
              <AiOutlineMessage
                style={account === '2' ? iconClicked : iconNotClick}
                
              />
              {
                !chatNotSeenCount || !chatNotSeen || chatNotSeenCount === 0 ? null : 
                <div style={{width: '25px', height: '25px', borderRadius: '50%', backgroundColor: 'red',
                display: 'flex', alignItems: 'center', justifyContent: 'center',textAlign: 'center', 
                position: 'absolute', top: '-5px', right: '-5px',
                fontWeight: 'bold', color: 'white' ,
                }}>
                  {chatNotSeenCount}
                </div>
              }
            </div>
            
            <AiOutlinePlusSquare
              style={account === '3' ? iconClicked : iconNotClick}
              onClick={() => {
                setOpenCreatePost(true);
                dispatch(setIconTabKey('3'));
              }}
            />
            <AiOutlineYoutube
              style={account === '4' ? iconClicked : iconNotClick}
              onClick={() => {
                history.push('/watchs');
                dispatch(setIconTabKey('4'));
              }}
            />

            <Dropdown
              overlay={() => <NotificationList />}
              trigger={['click']}
              arrow
              placement="bottomRight">
              <div style={{width: 'auto', display: 'flex', alignContent: 'center', justifyContent: 'center', position: 'relative'}} onClick={() => {
                  dispatch(setIconTabKey('5'));
                }}>
              <IoMdNotificationsOutline
                style={account === '5' ? iconClicked : iconNotClick}
                
              />
              {
                !notiNotSeenCoung || !notiNotSeen || notiNotSeenCoung === 0 ? null : 
                <div style={{width: '25px', height: '25px', borderRadius: '50%', backgroundColor: 'red',
                display: 'flex', alignItems: 'center', justifyContent: 'center',textAlign: 'center', 
                position: 'absolute', top: '-5px', right: '-5px',
                fontWeight: 'bold', color: 'white' 
                }}>
                  {notiNotSeenCoung}
                </div>
              }
            </div>
              {/* <IoMdNotificationsOutline
                style={account === '5' ? iconClicked : iconNotClick}
                onClick={() => {
                  dispatch(setIconTabKey('5'));
                }}
              /> */}
            </Dropdown>
          </div>
          <div className={cx('icon-profile')}>
            <Dropdown overlay={menu} trigger={['click']} arrow>
              {props?.profile?.avatar?.length > 0 ? (
                <img src={props?.profile?.avatar} alt="user-avatar" className={cx('user-avatar')} />
              ) : (
                <BsPersonCircle style={{ fontSize: '30px', margin: '0 10px', cursor: 'pointer' }} />
              )}
            </Dropdown>
          </div>
        </div>
      </div>
      <Modal
        title=""
        centered
        visible={openCreatePost}
        onOk={() => setOpenCreatePost(false)}
        onCancel={() => {
          setOpenCreatePost(false);
          setUploaded(false);
        }}
        width={1000}
        footer={null}
        closable={false}>
        <CreateNewPost profile={props.profile} setOpenCreatePost={setOpenCreatePost} setUploaded={setUploaded} uploaded={uploaded} />
      </Modal>
    </>
  );
};

export default HeaderContainer;
