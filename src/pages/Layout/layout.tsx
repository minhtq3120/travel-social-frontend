import React, { useCallback, useEffect, useState } from 'react';
import Logo from 'src/assets/MadLogo.png';
import { ReactComponent as Wallet } from 'src/assets/Wallet.svg';

import PoolManagement from 'src/pages/PoolManagement/PoolManagement';
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

const cx = classNames.bind(styles);

const { Header, Content, Footer, Sider } = Layout;

const LayoutComponent = (props: any) => {
  const history = useHistory();
  const [collapse, setCollapse] = useState({
    collapsed: false
  });
  const getKey = localStorage.getItem('key');
  const getKeyObj = getKey as any
  const dispatch = useDispatch();
  const account = useSelector((state: RootState) => state.wallet.account);
  const [visible, setVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState({
    current: getKeyObj
  });
  const [address, setAddress] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [_activestep, _setActiveStep] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const windowObj = window as any;
  localStorage.setItem('key', selectedKey.current);
  const onCollapse = (collapsed: boolean) => {
    setCollapse({ collapsed });
  };
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


  // const _renderStepContent = (step: number) => {
  //   switch (step) {
  //     case 0:
  //       return <PropertyManagement handleNext={_handleNext} />;
  //     case 1:
  //       return <CreateProperty handleBack={_handleBack} />;
  //   }
  // };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = (step?: any) => {
    if(activeStep>0)setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };



  return (
    <>
          <Switch>
            <Route exact path="/home">
              <Layout>
                <Header className={cx('header')}>
                  <HeaderContainer />
                  </Header>
                <Layout className={cx('body')}>
                  <Content>
                    <NewFeed />
                  </Content>
                </Layout>
              </Layout>
            </Route>
          </Switch>
    </>

  );
};

export default LayoutComponent;
