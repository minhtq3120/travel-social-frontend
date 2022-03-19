import { EyeInvisibleOutlined, EyeTwoTone, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
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
import { getCurrUserProfile, uploadProfileImage } from 'src/services/user-service';
import styles from 'src/styles/ChangeAvatarCover.module.scss';
import { getCurrentUser } from 'src/utils/utils';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import TextArea from 'antd/lib/input/TextArea';
import UploadLogo from 'src/components/Upload';



const cx = classNames.bind(styles);

const ChangeAvatarCover = (props: any) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [form] = Form.useForm();

    const [loadingSignIn, setLoadingSignIn] = useState(false);
    const [formInput, setFormInput] = useState({email: '', password: ''})
    const [file, setFile] = useState<any>(null);
    const [file2, setFile2] = useState<any>(null);
    console.log(file, file2)
    const handleFinish = async (values: any) => {
        try {
            const form = {
                avatar: file,
                coverPhoto: file2
            }
            console.log(form)

            const formData = new FormData();
            if(file)formData.append('avatar', file);
            if(file2) formData.append('coverPhoto', file2)
            const upload = await uploadProfileImage(formData)
            return
        } 
        catch (err) {

        console.log(err)
        }
    };

   
  return (
    <div className={cx('change-image-container')}>
        <Form
        form={form}
        className={cx('list-input')}
        layout="vertical"
        autoComplete="off"
        onFinish={handleFinish}
    //     labelCol={{ span: 8 }}
    //   wrapperCol={{ span: 16 }}
        >
        <div className={cx('avatar-container')}>
            <div className={cx('current-avatar')}>
                <div className={cx('current-title')}>Avatar</div>
                {
                    props?.profile?.avatar ? (
                        <img 
                            src={props?.profile?.avatar}
                            alt='avatar'
                            className={cx('avatar')}
                        />
                    ) : null
                }
            </div>
            
            
            <Form.Item name="avatar-upload" className={cx('form-item')}>
                
                <UploadLogo
                    className={cx('upload')}
                    name="avatar"
                    maxCount={1}
                    title="Change avatar"
                    setFile={setFile}
                    file={file}
                />
            </Form.Item>
            
        </div>
        <div className={cx('cover-container')}>
            <div className={cx('current-avatar')}>
                <div className={cx('current-title')}>Cover Photo</div>
                {
                    props?.profile?.coverPhoto ? (
                        <img 
                            src={props?.profile?.coverPhoto}
                            alt='cover'
                            className={cx('cover')}
                        />
                    ) : null
                }
            </div>
            
            
            <Form.Item name="cover-upload" className={cx('form-item')}>
                
                <UploadLogo
                    className={cx('upload')}
                    name="cover"
                    title="Change cover photo"
                    setFile={setFile2}
                    maxCount={1}
                    file={file2}
                />
            </Form.Item>
        </div>

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

export default ChangeAvatarCover;
