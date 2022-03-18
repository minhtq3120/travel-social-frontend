import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select, Tag, Tooltip, Upload, Switch, message, notification, InputNumber, Modal } from 'antd';
import classNames from 'classnames/bind';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GoLocation } from 'react-icons/go';
import {RiLockPasswordLine} from 'react-icons/ri'
import { BsMoonStars, BsInfoCircle, BsImages, BsFillShieldLockFill } from 'react-icons/bs';
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
import { getFollowers } from 'src/services/follow-service';
import { getCurrUserProfile } from 'src/services/user-service';
import styles from 'src/styles/Account.module.scss';
import { getCurrentUser } from 'src/utils/utils';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import EditProfile from './EditProfile';
import ChangeAvatarCover from './ChangeAvatarCover';
import ChangePassword from './ChangePassword';



const cx = classNames.bind(styles);

const Account = (props: any) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  return (
    <div className={cx('account-container')}>
       <Tabs className={cx('tabs-container')} 
       //selectedTabClassName={cx('tab-selected')}
      //  selectedTabPanelClassName={cx('panel-selected')}
       >
        <TabList className={cx('tabs-list-container')}>
          <Tab>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <BsInfoCircle style={{fontSize: '20px', margin: '0 10px'}}/>
              <div style={{fontWeight: 'bold', fontSize: '15px'}}>Edit Profile</div>
            </div>
          </Tab>
          <Tab>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <BsImages style={{fontSize: '20px', margin: '0 10px'}}/>
              <div style={{fontWeight: 'bold', fontSize: '15px'}}>Edit Avatar/Cover Photo</div>
            </div>
          </Tab>
          <Tab>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <RiLockPasswordLine style={{fontSize: '20px', margin: '0 10px'}}/>
              <div style={{fontWeight: 'bold', fontSize: '15px'}}>Change Password</div>
            </div>
          </Tab>
          <Tab>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <GoLocation style={{fontSize: '20px', margin: '0 10px'}}/>
              <div style={{fontWeight: 'bold', fontSize: '15px'}}>Checkin manager</div>
            </div>
          </Tab>
          <Tab>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <BsMoonStars style={{fontSize: '20px', margin: '0 10px'}}/>
              <div style={{fontWeight: 'bold', fontSize: '15px'}}>Dark mode</div>
            </div>
          </Tab>
        </TabList>

        <TabPanel>
          <EditProfile/>
        </TabPanel>
        <TabPanel>
          <ChangeAvatarCover />
        </TabPanel>
        <TabPanel>
          <ChangePassword />
        </TabPanel>
        <TabPanel>
          <h2>Any content 4</h2>
        </TabPanel>
        <TabPanel>
          <h2>Any content 5</h2>
        </TabPanel>
      </Tabs>
    </div>
    
  )
  
};

export default Account;
