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
import {  activate, login, register, sendActivate } from 'src/services/auth-service';
import styles from 'src/styles/Login.module.scss';
import { useParams } from "react-router-dom";
import queryString from 'query-string';
import { ActivateParams } from 'src/services/params-type';
const cx = classNames.bind(styles);

const ActiveAccount = (props: any) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory()
  const [form] = Form.useForm();
  const params = useParams();


  const token = location.pathname.split("/")[2]
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [formInput, setFormInput] = useState({email: '', code : '', })

  const handleFinish = async (values: any) => {
    try {
      const payload: ActivateParams = {
        email: values.email,
        activationCode: values.activationCode
      }
      console.log(payload)

      // const result = await register(payload)
      const sendActiveCode = await activate(payload)
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
        activationCode: token
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

              <FloatLabel label="Active Code"  value={formInput.code}>
                <Form.Item 
                  name="activationCode"
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
                    onChange={(e) => setFormInput({...formInput, code: e.target.value})}
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
                  {/* <div className={cx('middle-text')}>OR</div>
                  <div className={cx('middle-line')}></div> */}
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

export default ActiveAccount;
