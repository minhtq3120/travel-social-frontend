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
import { RootState } from 'src/redux/store';
import { setAccountAddress, setConnected, setLoginResult } from 'src/redux/WalletReducer';
import {  login, resetLink } from 'src/services/auth-service';
import styles from 'src/styles/Login.module.scss';
import {AiFillCloseCircle} from 'react-icons/ai'
import { emailreg, PASSWORD_REGEX } from 'src/utils/utils';
import { notificationError, notificationSuccess } from '../Login/Login';

const cx = classNames.bind(styles);


const ResetPassword = (props: any) => {
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
      }
      const result: any = await resetLink(payload.email)
      console.log(result)
      if(result?.statusCode === 400){
        notificationError(result?.message)
        setLoadingSignIn(false)

        return
      }
        notificationSuccess('Mã reset mật khẩu đã được gửi đến mail của bạn.')
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


              
              <Form.Item>
              <Button
                className={cx('button')}
                htmlType="submit"
                loading={loadingSignIn}
              >
                Send
              </Button>
              </Form.Item>

              <div className={cx('middle')}>
                  <div className={cx('middle-text')}>chúng tôi sẽ gửi mã reset mật khẩu tới email của bạn</div>
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

export default ResetPassword;
