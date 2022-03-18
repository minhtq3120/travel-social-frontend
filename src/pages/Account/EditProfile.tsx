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
import { getCurrUserProfile } from 'src/services/user-service';
import styles from 'src/styles/EditProfile.module.scss';
import { getCurrentUser } from 'src/utils/utils';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import TextArea from 'antd/lib/input/TextArea';



const cx = classNames.bind(styles);

const EditProfile = (props: any) => {
    const dispatch = useDispatch();
  const history = useHistory()
  const [form] = Form.useForm();

;
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [formInput, setFormInput] = useState({email: '', password: ''})


  const handleFinish = async (values: any) => {
    try {
        console.log(values)
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
    //     labelCol={{ span: 8 }}
    //   wrapperCol={{ span: 16 }}
        >

                <Form.Item 
                label="Your Username"
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
                    onChange={(e) => setFormInput({...formInput, email: e.target.value})}
                />

                </Form.Item>

                <Form.Item 
                label='Bio'
                name="bio"
                rules={[
                    ({ getFieldValue }) => ({
                    validator(_, value: string) {
                        return Promise.resolve()
                    }
                    })
                ]}
                >
                {/* <Input
                    type='text'
                    className={cx('email-input')}
                    onChange={(e) => setFormInput({...formInput, email: e.target.value})}
                /> */}
                <TextArea rows={4} placeholder='write something about your self'/>

                </Form.Item>

                <Form.Item 
                label='Gender'
                name="sex"
                rules={[
                    ({ getFieldValue }) => ({
                    validator(_, value: string) {
                        return Promise.resolve()
                    }
                    })
                ]}
                >
                    <Radio.Group onChange={onChangeRadio} defaultValue="a">
                        <Radio.Button value="0">Female</Radio.Button>
                        <Radio.Button value="1">Male</Radio.Button>
                        <Radio.Button value="2">Prefer not show</Radio.Button>
                    </Radio.Group>

                </Form.Item>

                 <Form.Item 
                label='Date of birth'
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
