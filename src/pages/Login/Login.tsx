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
import {AiFillCloseCircle} from 'react-icons/ai'
import { emailreg, PASSWORD_REGEX } from 'src/utils/utils';

const cx = classNames.bind(styles);

export const notificationError = (message: string) => {
  return notification.error({
          message: message && message?.length > 0 ? message : '',
          style: {width: 'auto' ,borderRadius: '40px', backgroundColor: 'white', border: '1px solid red'},
          duration: 7,
          className: 'toast__message toast__message__error',
          // closeIcon: <AiFillCloseCircle color='red' size={25}/>
        });
}

export const notificationSuccess = (message) => {
  return notification.success({
          message: message && message?.length > 0 ? message :'Có lỗi xảy ra',
          style: {width: 'auto' ,borderRadius: '40px',  backgroundColor: 'white', border: '1px solid #68d1c8'},
          duration: 7,
          className: 'toast__message toast__message__success',
          // closeIcon: <AiFillCloseCircle color='#68d1c8'  size={25}/>
      })
         
}

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
      const result: any = await login(payload)
       if (result?.statusCode === 401) {
        notificationError('Tài khoản hoặc mật khẩu không chính xác.')
        setLoadingSignIn(false);
        return
      }
       

      const userInfo = {
        accessToken: _.get(result, 'data.accessToken', ''),
        sex: _.get(result, 'data.sex', ''),
        name: _.get(result, 'data.displayName', ''),
        avatar: _.get(result, 'data.avatar', '')
      };

      const {accessToken, sex, name, avatar} = userInfo

      if (accessToken) {
        notificationSuccess('đăng nhập thành công')
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
                          //  if (!value.match(PASSWORD_REGEX)) {
                          //   return Promise.reject(
                          //     new Error('mật khẩu tối thiểu 8 kí tự, gồm chữ viết hoa, số  và kí tự đặc biệt')
                          //   );
                          // }
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
                <div className={cx('forget-text')} onClick={() =>{
                  history.push('/resetpassword')
                }}>Forgot password?</div>
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
