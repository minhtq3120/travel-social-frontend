import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select, Tag, Tooltip, Upload, Switch, message, notification, InputNumber, Modal, Tabs } from 'antd';
import classNames from 'classnames/bind';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AiOutlineSetting } from 'react-icons/ai';
import { BsPersonCircle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import closeImg from 'src/assets/icon/close-icon.svg';
import Logo from 'src/assets/MadLogo.png';
import BaseButton from 'src/components/Button';
import FloatLabel from 'src/components/FloatingLabel/FloatingLabel';
import InfinityList from 'src/components/InfinityScroll/InfinityScroll';
import { OPP_NO_ADMIN, OPP_SOMETHING_WRONG, WRONG_EMAIL_OR_PASSWORD } from 'src/constant/message';
import { RootState } from 'src/redux/store';
import { setAccountAddress, setConnected, setLoginResult } from 'src/redux/WalletReducer';
import {  activate, login, register } from 'src/services/auth-service';
import { getFollowers, getFollowing } from 'src/services/follow-service';
import { getCurrUserProfile } from 'src/services/user-service';
import styles from 'src/styles/Profile.module.scss';
import { getCurrentUser } from 'src/utils/utils';
import ProfilePosts from './ProfilePosts';

import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { BottomScrollListener } from 'react-bottom-scroll-listener';
 


const cx = classNames.bind(styles);
const { TabPane } = Tabs;

// const RenderImageBlock = () => {
//   return (
//     <div className={}>

//     </div>
//   )
// }

const TabProfile = () => (
  <Tabs defaultActiveKey="1" centered tabPosition='top' style={{width: '100%'}}>
    <TabPane tab="Posts" key="1">
      <ProfilePosts />
    </TabPane>
    <TabPane tab="Saved" key="2">
      Content of Tab Pane 2
    </TabPane>
    <TabPane tab="Tagged" key="3">
      Content of Tab Pane 3
    </TabPane>
  </Tabs>
);

const Profile = (props: any) => {
  const scrollRef: any = useBottomScrollListener(() => {
    console.log('REACH END')
  });
  const currentUser: any = getCurrentUser()
  const [profile,setProfile] = useState<any>(null)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleFollowers, setIsModalVisibleFollowers] = useState(false);
  const [isModalVisibleFollowings, setIsModalVisibleFollowings] = useState(false);
  const [scrollList, setScrollList] = useState<string | null>(null)
  const history = useHistory()
  
  const handleCancel = () => {
    setIsModalVisibleFollowers(false)
    setIsModalVisibleFollowings(false)
  };


  useEffect(() => {
    getCurrentUserProfile() 
  }, [])

  const getCurrentUserProfile = async () => {
    try {
      const user = await getCurrUserProfile()
      setProfile(user)
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <>
   <div className={cx('profile-container')}>
    <div className={cx('profile-header-container')} 
    style={{backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.6) 100%),url(${profile?.coverPhoto})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}> 
     <div className={cx('profile-header')} >
      {
        profile?.avatar?.length > 0 ? (
          <img
              src={profile?.avatar}
              alt="user-avatar"
              className={cx('avatar-img')}
          />
        ) :  <BsPersonCircle style={{ fontSize: '30px', margin: '0 10px', cursor: 'pointer'}}/>
      }
      <div className={cx('info')}> 
        <div className={cx('name-follow')}>
          <div className={cx('name')}>{profile?.displayName}</div>
          <Button className={cx('follow-btn')}>
            <div className={cx('text')}
              onClick={() => {
                history.push('/account')
              }}
            >Edit profile</div>
            <AiOutlineSetting style={{fontSize: '25px', margin: '0 5px', cursor: 'pointer', opacity: '0.5'}}/>
          </Button>
        </div>
        <div className={cx('posts-follow')}>
          <div className={cx('total')}>
            <span style={{width: '10px', fontWeight: 'bold'}}>10</span> posts
          </div>
          <div className={cx('total')} onClick={() => {
              setIsModalVisibleFollowers(true)
            }}>
             <span style={{width: '10px', fontWeight: 'bold'}}>{profile?.followers}</span>  followers
          </div>
          <div className={cx('total')} onClick={() => {
              setIsModalVisibleFollowings(true)
            }}>
             <span style={{width: '10px', fontWeight: 'bold'}}>{profile?.followings}</span>  followings
          </div>
        </div>
        <div className={cx('bios')}>
          <div className={cx('gender')}>
            Sex: {profile?.sex}
          </div>
          <div className={cx('bio')}>
            Bio: Contrary to popular belief, ced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
          </div>
        </div>

      </div>
     </div>
     </div>

    <div className={cx('middle')}>
    </div>

     <div className={cx('profile-body')}>
          <TabProfile />
     </div>
    </div>
      <Modal  title={`Followers (${profile?.followers})`} visible={isModalVisibleFollowers} footer={null} onCancel={handleCancel} style={{borderRadius: '10px'}} width={550}>
        <InfinityList typeList="followers" queryAPI={async (params: any) => await getFollowers(params)} totalItems={profile?.followers}/>
      </Modal>
      <Modal title={`Followings (${profile?.followings})`} visible={isModalVisibleFollowings} footer={null} onCancel={handleCancel}  style={{borderRadius: '10px'}} width={550}>
        <InfinityList typeList="followings" queryAPI={async (params: any) => await getFollowing(params)} totalItems={profile?.followings}/>
      </Modal>
    </>
  );
};

export default Profile;
