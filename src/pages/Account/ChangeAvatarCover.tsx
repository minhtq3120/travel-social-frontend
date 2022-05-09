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
import { notificationError, notificationSuccess } from '../Login/Login';



const cx = classNames.bind(styles);

const ChangeAvatarCover = (props: any) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [form] = Form.useForm();

    const [file, setFile] = useState<any>(null);
    const [file2, setFile2] = useState<any>(null);
      const [uploaded, setUploaded] = useState(false);
      const [imageBase64Arr, setImageBase64Arr] = useState<any>(null);
      const [imageBase64Arr2, setImageBase64Arr2] = useState<any>(null);
      const [loading, setLoading] = useState(false)


    const handleFinish = async (values: any) => {
        try {
            setLoading(true)
            const form = {
                avatar: file,
                coverPhoto: file2
            }
            console.log(form)

            const formData = new FormData();
            if(file)formData.append('avatar', file);
            if(file2) formData.append('coverPhoto', file2)
            const upload = await uploadProfileImage(formData)
            console.log(upload)
            if(upload?.status === 201) {
                notificationSuccess("Thay đổi ảnh thành công")
                setFile(null)
                setFile2(null)
                setLoading(false)
                return
            }
            notificationError(upload?.message)
            setFile(null)
            setFile2(null)
            setLoading(false)
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
        <div className={cx('current-title')}>Thay đổi ảnh đại diện</div>

        <div className={cx('avatar-container')}>
            <div className={cx('current-avatar')}>
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
            
                <UploadLogo
                    className={cx('upload')}
                    name="avatar"
                    maxCount={1}
                    title="Change avatar"
                    setFile={setFile}
                    file={file}
                    setUploaded={setUploaded}
                    setImageBase64Arr={setImageBase64Arr}
                    imageBase64Arr={imageBase64Arr}
                    uploaded={uploaded}
                />
                 {/* {
                    imageBase64Arr && imageBase64Arr[0]?.imageUrl ? (
                        <img
                            src={
                            imageBase64Arr[0]?.imageUrl
                            }
                            alt="img"
                            className={cx('img')}
                            style={{width: '150px', height:'150px', borderRadius: '50%', padding: '5px'}}
                        />
                    ) : null
                } */}
            
        </div>
                <div className={cx('current-title')}>Thay đổi ảnh bìa</div>

        <div className={cx('cover-container')}>

            <div className={cx('current-avatar')}>

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
            



                <UploadLogo
                    className={cx('upload')}
                    name="cover"
                    title="Change cover photo"
                    setFile={setFile2}
                    maxCount={1}
                    file={file2}
                    setUploaded={setUploaded}
                    setImageBase64Arr={setImageBase64Arr2}
                    imageBase64Arr={imageBase64Arr2}
                    uploaded={uploaded}
                    coverStyle={{width: '150px', height:'150px', borderRadius: '10px', padding: '5px'}}
                />

                {/* {
                    imageBase64Arr2 && imageBase64Arr2[0]?.imageUrl ? (
                        <img
                            src={
                            imageBase64Arr2[0]?.imageUrl
                            }
                            alt="img"
                            className={cx('img')}
                            style={{width: '150px', height:'150px', borderRadius: '50%', padding: '5px'}}
                        />
                    ) : null
                } */}
                
        </div>

        <Form.Item>
            <Button
            className={cx('button')}
            htmlType="submit"
            loading={loading}
            >
                Save 
            </Button>
            </Form.Item>
        </Form>
    </div>
    
  )
  
};

export default ChangeAvatarCover;
