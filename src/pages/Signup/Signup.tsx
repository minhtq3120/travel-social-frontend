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
import {  activate, login, register, sendActivate } from 'src/services/auth-service';
import styles from 'src/styles/Login.module.scss';
import { emailreg, PASSWORD_REGEX } from 'src/utils/utils';
import { notificationError, notificationSuccess } from '../Login/Login';

const cx = classNames.bind(styles);

const Signup = (props: any) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [formInput, setFormInput] = useState({email: '', password: '', username: ''})

  const handleFinish = async (values: any) => {
    try {
      setLoadingSignIn(true);
      const payload = {
        email: values.email,
        password: values.password,
        displayName: values.username,
      }

      const result: any = await register(payload)
      console.log('register', result)
      if(result?.status === 409) {
        notificationError(result?.message)
        setLoadingSignIn(false)
        return
      }
        notificationSuccess('đăng ký thành công, vui lòng kích hoạt tài khoản trong mail.')
      const sendActiveCode = await sendActivate(payload.email)
      setLoadingSignIn(false)
      
      return;
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
                          if (!value) {
                            return Promise.reject(
                              new Error('email là bắt buộc')
                            );
                          }
                          if(!value.match(emailreg)){
                            return Promise.reject(
                              new Error('email không đúng định dạng')
                            );
                          }
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
                        if (!value) {
                            return Promise.reject(
                              new Error('mật khẩu là bắt buộc')
                            );
                          }
                          if (!value.match(PASSWORD_REGEX)) {
                            return Promise.reject(
                               new Error('mật khẩu tối thiểu 8 kí tự, gồm chữ viết hoa, số  và kí tự đặc biệt')
                            );
                          }
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

              <FloatLabel label="Username"  value={formInput.password}>
                <Form.Item 
                  name="username"
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value: string) {
                        if (!value) {
                            return Promise.reject(
                              new Error('tên người dùng là bắt buộc')
                            );
                          }
                        return Promise.resolve()
                      }
                      })
                  ]}
                  >
                  <Input
                    type='text'
                    className={cx('email-input')}
                    onChange={(e) => setFormInput({...formInput, username: e.target.value})}
                  />
                </Form.Item>
              </FloatLabel>
              
              <Form.Item>
              <Button
                className={cx('button')}
                htmlType="submit"
                loading={loadingSignIn}
              >
                Sign up
              </Button>
              </Form.Item>

              <div className={cx('middle')}>
                  <div className={cx('middle-line')}></div>
                  {/* <div className={cx('middle-text')}>OR</div>
                  <div className={cx('middle-line')}></div> */}
              </div>

              <div className={cx('forget-password')}> 
                <div className={cx('forget-text')}>By signing up, you agree to our Terms an our Policy.</div>
              </div>
              
            </Form>
          </div>  
           <div className={cx('left-child2')}>
             <div className={cx('signup-text')}>{`Already have an account?`}</div>
             <Link to='/login' className={cx('signup-link')}>Log in now</Link>
           </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
