import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select, Tag, Tooltip, Upload, Switch, message, notification, InputNumber, Modal, Radio } from 'antd';
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
import { changePassword, getCurrUserProfile } from 'src/services/user-service';
import styles from 'src/styles/EditProfile.module.scss';
import { getCurrentUser, PASSWORD_REGEX } from 'src/utils/utils';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import TextArea from 'antd/lib/input/TextArea';
import { notificationError, notificationSuccess } from '../Login/Login';



const cx = classNames.bind(styles);

const ChangePassword = (props: any) => {
    const dispatch = useDispatch();
  const history = useHistory()
  const [form] = Form.useForm();

;
  const [loadingSignIn, setLoadingSignIn] = useState(false);


  const handleFinish = async (values: any) => {
    try {
        const payload = {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword
        }
        const changePass = await changePassword(payload)
        if(changePass?.status === 200) {
            notificationSuccess("Thay đổi mật khẩu thành công")
            form.resetFields()
            return
        }
        notificationError(changePass?.message)
        return
    } 
    catch (err) {
     console.log(err)
    }
  };

  const onChangeRadio  = (e: any) =>  {
    console.log(`radio checked:${e.target.value}`);
    }
  
  return (
    <div className={cx('edit-profile-container')}>
        <Form
        form={form}
        className={cx('list-input')}
        layout="vertical"
        autoComplete="off"
        onFinish={handleFinish}
        >
            <p style={{ margin: '5px' }}>
                Current password<span style={{ color: 'red' }}> (*)</span>
            </p>
            <Form.Item 
                name="currentPassword"
                rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value: string) {
                        if (!value) {
                            return Promise.reject(
                              new Error('mật khẩu là bắt buộc')
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
                />

            </Form.Item>

            <p style={{ margin: '5px' }}>
                New password<span style={{ color: 'red' }}> (*)</span>
            </p>
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
                />

            </Form.Item>

            <p style={{ margin: '5px' }}>
                Confirm new password<span style={{ color: 'red' }}> (*)</span>
            </p>
            <Form.Item 
                name="confirmNewPassword"
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
                          if (value !== form.getFieldValue('newPassword')) {
                            return Promise.reject(
                               new Error('mật khẩu không trùng khớp!')
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
                />

            </Form.Item>

            <Form.Item>
                <Button
                className={cx('button')}
                htmlType="submit"
                loading={loadingSignIn}
                >
                    CHANGE PASSWORD 
                </Button>
            </Form.Item>

        </Form>
    </div>
    
  )
  
};

export default ChangePassword;
