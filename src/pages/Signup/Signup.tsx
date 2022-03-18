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
import {  activate, login, register } from 'src/services/auth-service';
import styles from 'src/styles/Login.module.scss';

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
        birthday: "2000-10-30",
        sex:1
      }

      const result = await register(payload)
      notification.success({
            message: 'LOGIN SUCCESS',
            duration: 13,
            icon: <img src={closeImg} alt="close" style={{cursor: 'pointer'}} onClick={() => notification.close('3')}/>,
            className: 'custom-notification',
            style: { background: '#14D16B', color: '#000000 !important' },
            key: '3'
          })
      const sendActiveCode = await activate(payload.email)
      setLoadingSignIn(false)
      
      return;
    } 
    catch (err) {
    setLoadingSignIn(false)
     notification.error({
          message: OPP_SOMETHING_WRONG,
          duration: 5,
          icon: <img src={closeImg} alt="close" />,
          className: 'custom-notification',
          style: { background: '#CB0404', color: '#FFFFFF!important' }
        });
     console.log(err)
    }
  };

  return (
    <>
      <div className={cx('main')}>
        <div className={cx('main__right')}></div>

        <div className={cx('main__left')}>
          <div className={cx('left-child')}>

          <img src={Logo} alt="logo" />
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

              <FloatLabel label="Username"  value={formInput.password}>
                <Form.Item 
                  name="username"
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
