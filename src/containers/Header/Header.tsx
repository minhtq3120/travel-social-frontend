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
import NotificationList from 'src/components/Notification/Notification';
import SearchBar from './SearchBar';

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
    cursor: 'pointer'
  };

  const iconClicked = {
    fontSize: '32px',
    margin: '0 7px',
    cursor: 'pointer',
    color: 'white'
  };

  const [iconStyle, setIconStyle] = useState(iconNotClick);
  const [keyword, setKeyword] = useState<string>('')

  const handleOnChange = (event: any) => {
    console.log(event.target.value);
  };

  const onSearch = async (value: string) => {
    const params = {};
    console.log(value);
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

  console.log(uploaded,'uploaded')
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
          <RenderSearch onSearch={onSearch} onChange={onSearch} placeholder={'Search..'} />
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
            <AiOutlineMessage
              style={account === '2' ? iconClicked : iconNotClick}
              onClick={() => {
                history.push('/chats');
                dispatch(setIconTabKey('2'));
              }}
            />
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
              <IoMdNotificationsOutline
                style={account === '5' ? iconClicked : iconNotClick}
                onClick={() => {
                  dispatch(setIconTabKey('5'));
                }}
              />
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
        <CreateNewPost profile={props.profile} setUploaded={setUploaded} uploaded={uploaded} />
      </Modal>
    </>
  );
};

export default HeaderContainer;
