import React, { useCallback, useEffect, useState } from 'react';
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
  AiOutlineYoutube,
  AiOutlineWallet
} from 'react-icons/ai';
import { Button, Dropdown, Input, Menu, message, Modal } from 'antd';
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
import { setAccountAddress, setChatNotSeen, setNotiNotSeen, setSearchFilter, setSearchValue, setTriggerSearch } from 'src/redux/WalletReducer';
import { RECEIVE_MESSAGE } from 'src/components/Chat/Chat';
import { getRecentsChat } from 'src/services/chat-service';
import { getNotifi } from 'src/services/notifi-service';
import _ from 'lodash'
import { injectedConnector, signWallet } from 'src/constant/contract-service';
import { useWeb3React } from '@web3-react/core';
import { loginWalletAddress, registerWalletAddress } from 'src/services/auth-service';
import { ReactComponent as Wallet } from 'src/assets/Wallet.svg';
import {MdOutlineTravelExplore} from 'react-icons/md'
import { notificationError, notificationSuccess } from 'src/pages/Login/Login';

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
  const { account : ac, library, chainId , activate, deactivate} = useWeb3React();
  const walletAccount: any = useSelector((state: RootState) => state.wallet.account) || localStorage.getItem('account');


  const [iconStyle, setIconStyle] = useState(iconNotClick);
  const [keyword, setKeyword] = useState<string>('')
  const socket: any = useSelector((state: RootState) => state.wallet.socket);
  const userInfo: any = useSelector((state: RootState) => state.wallet.userInfo);

  const [popupConnectMetamask, setPopupConnectMetamask] = useState(false)

  const [walletAddress, setWalletAddress] = useState(null)

  const [metaType, setMetaType] = useState('')

  const handleOnChange = (event: any) => {
    console.log(event.target.value);
  };

  const onSearch = async (value: string) => {
    // if(keyword?.length > 0) dispatch(setSearchValue(keyword))
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

    const [triggerWallet, setTriggerWallet] = useState<any>(false)

    const chatNotSeen: any = useSelector((state: RootState) => state.wallet.chatNotSeen);
  const notiNotSeen: any= useSelector((state: RootState) => state.wallet.notiNotSeen);
    useEffect(() => {
    socket?.on(RECEIVE_MESSAGE, (data) => {
      if(data?.isCurrentUserMessage === false) {
        setTrigger(data?.createdAt)
      }
    })
  }, [socket])

  useEffect(() => {
    socket?.on(RECEIVE_NOTIFICATION, (data) => {
      setTrigger2(data?.createdAt)
    })
  }, [socket])

  useEffect(() => {
      dispatch(setChatNotSeen(chatNotSeen + 1))
  }, [trigger])

   useEffect(() => {
      dispatch(setNotiNotSeen(notiNotSeen + 1))
  }, [trigger2])

  useEffect(() => {
    if(chatNotSeen)setChatNotSeenCount(chatNotSeen)
  }, [chatNotSeen])
  
  useEffect(() => {
      if(notiNotSeen)setNotiNotSeenCount(notiNotSeen)
    }, [notiNotSeen])

  const handleLogout = async () => {
    history.push('/login');
    dispatch(setAccountAddress(null))
    localStorage.clear();
    await deactivate()
    
  };

  const handleSignUpWalletAddress = async (email: string, walletAddress: string) => {
      try {
        const credentials = {
          walletAddress,
         email
        };
        const rsSignup: any = await registerWalletAddress(credentials);
        if(rsSignup?.status === 400) {
          notificationError('Tài khoản này đã được đăng ký địa chỉ ví')
          return
        }

        notificationSuccess('Đăng ký địa chỉ ví thành công!')
      } catch (error) {
        console.log(error)
      }
    }
    

  const handleSignInWalletAddress = async (email: string, walletAddress: string) => {
    try {
      const signature = await signWallet(library, walletAddress);
      const credentials = {
        email,
        walletAddress,
        signature,
      };
      const rs= await loginWalletAddress(credentials);
      if(rs?.status === 500 && rs?.message === 'User is undefined') {
        notificationError('bạn chưa đăng ký địa chỉ ví với tài khoản này')
        return
      }
      if(rs?.status === 201) {
        notificationSuccess('đăng nhập ví thành công')
        const data = _.get(rs, 'data', []);
        if(rs && data) {
          localStorage.setItem('metamaskAccessToken', data?.accessToken)
          dispatch(setAccountAddress(ac))
        }
      }
      
    } catch (error) {
      console.log(error)
    }
  };
  const handleLoginMetamask = async () => {
    try {
      if ((window as any)?.ethereum?.isMetaMask) {
        await activate(injectedConnector, undefined, true);
      }
      setTriggerWallet(!triggerWallet)
    }
    catch (err: any) {
      if(err && err?.code === -32002) notificationError('Mở tiện tích để tiếp tục process') 
    }
    
  };

  useEffect(() => {
    if(walletAccount && walletAccount?.length > 0) activate(injectedConnector, undefined, true);
  }, [walletAccount, ac])

  useEffect(() => {

    const email = localStorage.getItem('email')
    if(ac && email && ac !== walletAccount && metaType === 'login') {
      handleSignInWalletAddress(email, ac)
    }
    if(ac && email && ac !== walletAccount && metaType === 'signup') {
      handleSignUpWalletAddress(email, ac)
    }
    // if(!ac) {
      // dispatch(setAccountAddress(null))
      // localStorage.removeItem('account')
      // localStorage.removeItem('metamaskAccessToken')
      // setMetaType('')
    // }
  },[triggerWallet])


  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item
        key="1"
        icon={
          <AiOutlineUser style={{ fontSize: '20px', marginRight: '12px', cursor: 'pointer' }} />
        }
        style={{ padding: '10px 10px' }}>
       <div style={{width: '100px', fontSize: '17px'}}>Profile</div> 
      </Menu.Item>
      {/* <Menu.Item
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
      </Menu.Item> */}
      <Menu.Item
        key="4"
        icon={
          <AiOutlineLogout style={{ fontSize: '20px', marginRight: '12px', cursor: 'pointer' }} />
        }
        style={{ padding: '10px 10px'}}>
               <div style={{width: '100px', fontSize: '17px'}}>Log out</div> 
      </Menu.Item>
    </Menu>
  );

  const notifi = <NotificationList />;

  const ConnectMetamaskPopup = () => { 
    return(
      <div style={{backgroundColor: '#68d1c8', width: '400px', height: 'auto', minHeight: '300px', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems:'flex-start', justifyContent: 'flex-start'}}>
          <div style={{fontWeight: 'bold', fontSize: '25px', color: 'white', padding: '20px'}}>
            Connect Wallet
          </div>
          <div style={{width: '100%', height: 'auto', display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center'}}>
           {
             !(walletAccount && walletAccount?.length > 0) || !ac? (
               <>
               <div style={{backgroundColor: 'white', padding: '10px 20px', marginTop: '20px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: '25px', cursor: 'pointer'}}
                onClick={() => {
                  setMetaType('login')
                  handleLoginMetamask()}}
              >
                <Wallet />
                <div style={{fontWeight: 'bold', fontSize: '16px', color: 'black', padding: '0px 10px'}}>Connect with Metamask</div>
              </div> 

              <div style={{fontSize: '15px', color: 'white', marginTop: '70px'}}>Chưa đăng ký địa chỉ ví với tài khoản của bạn?</div>
              <div style={{fontSize: '15px', fontWeight: 'bold', color: 'white', cursor: 'pointer'}}
                onClick={() => {
                  setMetaType('signup')
                  handleLoginMetamask()
                  // handleSignUpWalletAddress()
                }}
              >Đăng kí ngay</div>
               </>
             ) : (
               <>
                <div style={{backgroundColor: 'white', padding: '10px 20px', marginTop: '20px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: '25px', cursor: 'pointer'}}
                  onClick={() => {
                    deactivate()
                    dispatch(setAccountAddress(null))
                    localStorage.removeItem('account')
                    localStorage.removeItem('metamaskAccessToken')
                    setMetaType('')
                  }}
                >
                  <Wallet />
                  <div style={{fontWeight: 'bold', fontSize: '16px', color: 'black', padding: '0px 10px'}}>Disconnect</div>
                </div> 
                <div style={{backgroundColor: 'white', padding: '10px 20px', marginTop: '20px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: '25px', cursor: 'pointer'}}
                onClick={() => {
                    history.push('/staking')
                  }}
                >
                  <div style={{fontWeight: 'bold', fontSize: '16px', color: 'black', padding: '0px 10px'}} >staking page</div>
                </div> 
               </>
              )
           }
            
          </div>
          
      </div>
    )
  }

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
              <Button className={cx('btn-next')} onClick={() => {
                // handleLoginMetamask()
                setPopupConnectMetamask(true)
              }}>
                <AiOutlineWallet size={20}/>
                  <div style={{margin: '0 5px'}}>{walletAccount && walletAccount?.length > 0 && ac?  `${walletAccount?.slice(0, 6) + '...' + walletAccount?.slice(-4)}` : `Connect wallet` }</div>
                </Button>
              <MdOutlineTravelExplore 
              style={account === '5' ? iconClicked : iconNotClick}
              onClick={() => {
                history.push('/suggestionDetail');
                dispatch(setIconTabKey('5'));
              }}
            />
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
                <BsPersonCircle style={{ fontSize: '35px', margin: '0 10px', cursor: 'pointer' }} />
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

      <Modal
        title=""
        centered
        visible={popupConnectMetamask}
        onOk={() => setPopupConnectMetamask(false)}
        onCancel={() => {
          setPopupConnectMetamask(false)
        }}
        width={400}
        footer={null}
        closable={false}>
          <ConnectMetamaskPopup />
      </Modal>
    </>
  );
};

export default HeaderContainer;
