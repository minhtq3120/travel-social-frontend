import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select, Tag, Tooltip, Upload, Switch, message, notification, InputNumber, Modal } from 'antd';
import classNames from 'classnames/bind';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import closeImg from 'src/assets/icon/close-icon.svg';
import Logo from 'src/assets/MadLogo.png';
import BaseButton from 'src/components/Button';
import FloatLabel from 'src/components/FloatingLabel/FloatingLabel';
import { OPP_NO_ADMIN, OPP_SOMETHING_WRONG, WRONG_EMAIL_OR_PASSWORD } from 'src/constant/message';
import { RootState } from 'src/redux/store';
import { setAccountAddress, setConnected, setLoginResult } from 'src/redux/WalletReducer';
import {  login } from 'src/services/auth-service';
import styles from 'src/styles/Login.module.scss';
import './Login.scss';

const cx = classNames.bind(styles);

const Login = (props: any) => {
  const windowObj = window as any;
  const dispatch = useDispatch();
  const history = useHistory()
  const [form] = Form.useForm();

;
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [formInput, setFormInput] = useState({email: '', password: ''})

  const handleFinish = async (values: any) => {
    try {
      (values)
      setLoadingSignIn(true);
      const payload = {
        email: values.email,
        password: values.password
      }
      const result = await login(payload)
       if (result === 400) {
        setLoadingSignIn(false);
      }

      const userInfo = {
        accessToken: _.get(result, 'data.accessToken', ''),
        sex: _.get(result, 'data.sex', ''),
        name: _.get(result, 'data.displayName', ''),
        avatar: _.get(result, 'data.avatar', '')
      };

      const {accessToken, sex, name, avatar} = userInfo

      if (accessToken) {
        await dispatch(
          setLoginResult({
            accessToken,
            sex,
            name,
            avatar,
            email: values.email
          })
        );
        history.push('/home');
        
      } else {
        setLoadingSignIn(false);
      }
      setLoadingSignIn(false)
    } 
    catch (err) {
      setLoadingSignIn(false)
     console.log(err)
    }
  };

  return (
    <>
      <div className={cx('main')}>
        <div className={cx('main__right')}></div>

        <div className={cx('main__left')}>
          <div className={cx('left-child')}>

          <img src={Logo} alt="logo" className={cx('logo')}/>
          <div className={cx('title')}></div>
          <Form
            form={form}
            className={cx('list-input')}
            layout="vertical"
            autoComplete="off"
            onFinish={handleFinish}
          >
                <FloatLabel label="Email"  value={formInput.email}>
                  <Form.Item 
                    name="email"
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
                      className={cx('email-input')}
                      onChange={(e) => setFormInput({...formInput, email: e.target.value})}
                    />

                  </Form.Item>
                </FloatLabel>


              <FloatLabel label="Password"  value={formInput.password}>
                <Form.Item 
                  name="password"
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value: string) {
                        return Promise.resolve()
                      }
                      })
                  ]}
                  >
                  <Input
                  type='password'
                    className={cx('password-input')}
                    onChange={(e) => setFormInput({...formInput, password: e.target.value})}
                  />
                </Form.Item>
              </FloatLabel>
              
              <Form.Item>
              <Button
                className={cx('button')}
                htmlType="submit"
                loading={loadingSignIn}
              >
                Log In
              </Button>
              </Form.Item>

              <div className={cx('middle')}>
                  <div className={cx('middle-line')}></div>
                  <div className={cx('middle-text')}>OR</div>
                  <div className={cx('middle-line')}></div>
              </div>

              <div className={cx('forget-password')}> 
                <div className={cx('forget-text')}>Forgot password?</div>
              </div>
              
            </Form>
          </div>  
           <div className={cx('left-child2')}>
             <div className={cx('signup-text')}>{`Don't have an account?`}</div>
             <Link to='/signup' className={cx('signup-link')}>Sign up now</Link>
           </div>
        </div>
      </div>
    </>
  );
};

export default Login;
