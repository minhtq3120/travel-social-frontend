import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select, Tag, Tooltip, Upload, Switch, message, notification, InputNumber, Modal, Radio } from 'antd';
import classNames from 'classnames/bind';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GoLocation } from 'react-icons/go';
import {AiOutlineWoman, AiOutlineMan} from 'react-icons/ai'
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
import { getCurrUserProfile, updateInfo } from 'src/services/user-service';
import styles from 'src/styles/EditProfile.module.scss';
import { getCurrentUser } from 'src/utils/utils';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import { notificationError, notificationSuccess } from '../Login/Login';



const cx = classNames.bind(styles);

const EditProfile = (props: any) => {
    const dispatch = useDispatch();
  const history = useHistory()
  const [form] = Form.useForm();

;
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [formInput, setFormInput] = useState({email: '', password: ''})

  useEffect(() => {
      console.log(props?.profile)
    if(props?.profile) {
        form.setFieldsValue({'displayName': props?.profile?.displayName})
        form.setFieldsValue({'bio': props?.profile?.bio || null})
        form.setFieldsValue({'birthday': moment(props?.profile?.birthday) || ''})
        form.setFieldsValue({'sex': props?.profile?.sexNumber?.toString()} || null)
    }
  }, [])

  const handleFinish = async (values: any) => {
    try {
        let payload: any = {
            bio: values.bio,
            sex: Number(values.sex),
            birthday:moment(values.birthday).format('YYYY-MM-DD')
        }
        
        if(values.displayName !== props?.profile?.displayName) {
            payload = {
                ...payload,
                displayName: values.displayName,
            }
        }
        const update = await updateInfo(payload)
        if(update?.status === 200) {
            notificationSuccess("Thay đổi thông tin cá nhân thành công")
            // form.resetFields()
            return
        }
        notificationError(update?.message)
        return
        return;
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
                    <p style={{ margin: '10px 0px' , fontWeight: 'bold', fontSize: '17px'}}>
                        Tên người dùng 
                    </p>
                <Form.Item 
                name="displayName"
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
                />

                </Form.Item>

                <p style={{ margin: '10px 0px' , fontWeight: 'bold', fontSize: '17px'}}>
                    Giới thiệu bản thân
                </p>
                <Form.Item 
                name="bio"
                rules={[
                    ({ getFieldValue }) => ({
                    validator(_, value: string) {
                        return Promise.resolve()
                    }
                    })
                ]}
                >
                <TextArea rows={5} placeholder='write something about your self'/>

                </Form.Item>

                <p style={{ margin: '10px 0px' , fontWeight: 'bold', fontSize: '17px'}}>
                    Giới tính
                </p>
                <Form.Item 
                name="sex"
                rules={[
                    ({ getFieldValue }) => ({
                    validator(_, value: string) {
                        return Promise.resolve()
                    }
                    })
                ]}
                >
                    <Radio.Group onChange={onChangeRadio}>
                        <Radio.Button value="0">Nữ<AiOutlineWoman/></Radio.Button>
                        <Radio.Button value="1">Nam <AiOutlineMan/></Radio.Button>
                        <Radio.Button value="2">Prefer not show</Radio.Button>
                    </Radio.Group>

                </Form.Item>

                <p style={{ margin: '10px 0px' , fontWeight: 'bold', fontSize: '17px'}}>
                    Ngày sinh
                </p>
                 <Form.Item 
                name="birthday"
                rules={[
                    ({ getFieldValue }) => ({
                    validator(_, value: string) {
                        return Promise.resolve()
                    }
                    })
                ]}
                >
                   <DatePicker placeholder='Date of birth'/>
                </Form.Item>
                 
            
            <Form.Item>
            <Button
            className={cx('button')}
            htmlType="submit"
            loading={loadingSignIn}
            >
                Save 
            </Button>
            </Form.Item>

        </Form>
    </div>
    
  )
  
};

export default EditProfile;
