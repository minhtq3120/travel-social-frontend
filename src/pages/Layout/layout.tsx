import React, { useCallback, useEffect, useState } from 'react';
import Logo from 'src/assets/MadLogo.png';
import { ReactComponent as Wallet } from 'src/assets/Wallet.svg';

// import { logout } from 'src/services/auth-service';
import styles from 'src/styles/Layout.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Link, Route, Switch, useHistory } from 'react-router-dom';
import { setAccountAddress, setConnected, setLoginResult, setModalWrongNetwork } from 'src/redux/WalletReducer';
import { RootState } from 'src/redux/store';
import classNames from 'classnames/bind';
import { PieChartOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { CHAIN_ID } from 'src/constant/urlConfig';
import { Layout, Menu, notification, Popover } from 'antd';
import HeaderContainer from 'src/containers/Header/Header';
import NewFeed from 'src/containers/Newfeed/Newfeed';
import Profile from '../Profile/Profile';
import Account from '../Account/Account';
import { getCurrUserProfile } from 'src/services/user-service';

const cx = classNames.bind(styles);

const { Header, Content, Footer, Sider } = Layout;

const LayoutComponent = (props: any) => {
  const history = useHistory();

  const dispatch = useDispatch();

  const [activeStep, setActiveStep] = useState(0);
  const [_activestep, _setActiveStep] = useState(0);
  const [profile,setProfile] = useState<any>(null)
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


  const resetLogin = async () => {
    dispatch(setAccountAddress(''));
    dispatch(setConnected(false));
    dispatch(
      setLoginResult({
        accessToken: '',
        userInfo: null,
      })
    );
    // await logout();
    history.push('/login');
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = (step?: any) => {
    if(activeStep>0)setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };



  return (
    <Layout>
      <Header className={cx('header')}>
        <HeaderContainer profile={profile}/>
      </Header>
      <Switch>  
        <Route exact path="/home">
          <Layout className={cx('body')}>
            <Content>
              <NewFeed />
            </Content>
          </Layout>
        </Route>
        <Route exact path="/profile">
          <Layout className={cx('body')}>
            <Content>
              <Profile />
            </Content>
          </Layout>
        </Route>
        <Route exact path="/account">
          <Layout className={cx('body')}>
            <Content>
              <Account />
            </Content>
          </Layout>
        </Route>
      </Switch>
    </Layout>

  );
};

export default LayoutComponent;
