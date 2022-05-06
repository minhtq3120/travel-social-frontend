import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select, Tag, Tooltip, Upload, Switch, message, notification, InputNumber, Modal } from 'antd';
import classNames from 'classnames/bind';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import closeImg from 'src/assets/icon/close-icon.svg';
import Logo from 'src/assets/MadLogo.png';
import BaseButton from 'src/components/Button';
import FloatLabel from 'src/components/FloatingLabel/FloatingLabel';
import { OPP_NO_ADMIN, OPP_SOMETHING_WRONG, WRONG_EMAIL_OR_PASSWORD } from 'src/constant/message';
import { RootState } from 'src/redux/store';
import { setAccountAddress, setConnected, setLoginResult } from 'src/redux/WalletReducer';
import {  activate, login, register, sendActivate, setNewPassword } from 'src/services/auth-service';
import styles from 'src/styles/Login.module.scss';
import { useParams } from "react-router-dom";
import queryString from 'query-string';
import { ActivateParams } from 'src/services/params-type';
import { notificationError, notificationSuccess } from '../Login/Login';
import { emailreg, PASSWORD_REGEX } from 'src/utils/utils';
const cx = classNames.bind(styles);

const ResetPasswordPage = (props: any) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory()
  const [form] = Form.useForm();
  const params = useParams();


  const token = location.pathname.split("/")[2]
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [formInput, setFormInput] = useState({email: '', newPassword : '', token: ''})

  const handleFinish = async (values: any) => {
    try {
      const payload = {
        email: values.email,
        newPassword: values.newPassword,
        token: values.token
      }

      const sendActiveCode = await setNewPassword(payload)
      if(sendActiveCode.status === 400){
        notificationError(sendActiveCode?.message)
        return
      }

        notificationSuccess('Mật khẩu thay đổi thành công')
        history.push('/login') 
          
      return;
    } 
    catch (err) {
    setLoadingSignIn(false)
     console.log(err)
    }
  };

  useEffect(() => {
    if(token) {
      
      form.setFieldsValue({
        token
      })
    }
  }, [])

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

                 <FloatLabel label="new password"  value={formInput.email}>
                  <Form.Item 
                    name="newPassword"
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
                      className={cx('email-input')}
                      onChange={(e) => setFormInput({...formInput, newPassword: e.target.value})}
                    />

                  </Form.Item>
                </FloatLabel>

              <FloatLabel label="Token"  value={formInput.token}>
                <Form.Item 
                  name="token"
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
                    onChange={(e) => setFormInput({...formInput, token: e.target.value})}
                    readOnly
                  />
                </Form.Item>
              </FloatLabel>
              
              <Form.Item>
              <Button
                className={cx('button')}
                htmlType="submit"
                loading={loadingSignIn}
              >
                Active now
              </Button>
              </Form.Item>

              <div className={cx('middle')}>
                  <div className={cx('middle-line')}></div>

              </div>

              <div className={cx('forget-password')}> 
                <div className={cx('forget-text')}>By acctive Account, you agree to join out Network, have fun!</div>
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

export default ResetPasswordPage;
