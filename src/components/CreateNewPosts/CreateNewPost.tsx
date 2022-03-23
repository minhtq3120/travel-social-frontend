import { Button, Form, Input, Tag } from 'antd';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import styles from 'src/styles/CreateNewPost.module.scss';
import { SearchOutlined } from '@ant-design/icons';
import { FcAddImage } from 'react-icons/fc';
import { AiOutlineHeart , AiOutlineShareAlt} from 'react-icons/ai';
import { FaRegComment, FaRegHeart, FaShareAlt,FaRegShareSquare , FaLocationArrow} from 'react-icons/fa';
import ReactHashtag from "react-hashtag";
import ImageGallery from 'react-image-gallery';
import { Slide, Fade } from 'react-slideshow-image';
import "react-slideshow-image/dist/styles.css";
import ReactPlayer from 'react-player';
import AwesomeSlider from 'react-awesome-slider';
import moment from 'moment';
const cx = classNames.bind(styles);

import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import UploadLogo from '../Upload';
import { useForm } from 'antd/lib/form/Form';
import TextArea from 'antd/lib/input/TextArea';
import Avatar from 'antd/lib/avatar/avatar';
import { createPost } from 'src/services/post-service';



export const FILE_TYPE_VIDEO = [
  "video/mp4",
  "video/3gp",
  "video/3gpp",
  "video/mov",
  "video/wmv",
  "video/x-ms-wmv",
  "video/quicktime",
];

const handleCustomRequest = ({onSuccess}: any) => {onSuccess('ok')};

const renderPreView = (data: any) => {
        return (
            <>
                {data.type.includes(FILE_TYPE_VIDEO) ? 
                    <ReactPlayer
                       src={data.thumbUrl}
                        // playing
                        controls={true}
                        width="100%"
                        height="100%"
                        className="shareImg"
                        />
                : 
                    <img
                        src={data.thumbUrl}
                        alt=""
                        className="shareImg"
                        />
                }
            </>
        )
    }

    

const CreateNewPost = (props: any) => {
    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [previewTitle, setPreviewTitle] = useState('')
    const [fileList, setFileList] = useState<any>([])
    const [file, setFile] = useState<any>(null);
    const [form] = useForm()
    const [imageBase64Arr, setImageBase64Arr] = useState([])

    // function getBase64(img: any, callback: any) {
    //     const reader = new FileReader();
    //     reader.addEventListener("load", () => callback(reader.result));
    //     reader.readAsDataURL(img);
    // }

    // const convertImg = async (data) => {
    //     let temp:any = [];
    //     console.log("?????????", data)
    //     data.map((item: any) => {
    //         return getBase64(item.originFileObj, (imageUrl) => {
    //             temp.push(imageUrl)
    //         });
    //     })
    //     setImageBase64Arr(temp)
    // }

    // useEffect(() => {
    //     convertImg(fileList)
    // }, [fileList])

    console.log(imageBase64Arr)

    const handleFinish = async (values) => {
        try {
            let mediaFiles:any = []
            fileList.map((item: any) => {
                return mediaFiles.push(item.originFileObj)
            })
            const formData = new FormData();
            console.log('asdfadsf', mediaFiles)
            mediaFiles.map((file) => formData.append('mediaFiles', file));
            formData.append('description', values.description)
            const create = await createPost(formData)
            console.log(create)
            return
        }
        catch (err){
            return err
        }
    }

    useEffect(() => {
        
    }, [fileList])

    const handleCancel = () => {
        setPreviewVisible(false)
    }
    return (
        <div className={cx('createNewPostContainer')}>
            <div className={cx('left')}>
                <UploadLogo
                    fileList={fileList}
                    createPostType={true}
                    name="creat post"
                    title="upload file photo"
                    setFile={setFile}
                    setFileList={setFileList}
                    maxCount={10}
                    file={file}
                    setImageBase64Arr={setImageBase64Arr}
                    imageBase64Arr={imageBase64Arr}
                    // listType="picture-card"
                    custom={
                        <div  className={cx('uploadContainer')} >
                            <div className={cx('uploadIcon')}>
                                <FcAddImage style={{ fontSize: '100px', marginRight: '10px', cursor: 'pointer'}}/>
                            </div>
                            <div className={cx('uploadText')}>
                                Upload load your photos and videos here 
                            </div>
                        </div>
                    }
                    >
                        
                </UploadLogo>
                {/* {
                    <div className={cx('filelistArr')}>
                    { 
                        fileList.map((item: any, index: any) => {
                            console.log(item.type, 'check-----', FILE_TYPE_VIDEO.includes(item.type))
                            return (
                                FILE_TYPE_VIDEO.includes(item.type) ? 
                                    <ReactPlayer
                                        src={imageBase64Arr[index]}
                                        // playing
                        light="https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg"

                                        controls={true}
                                        width="300px"
                                        height="300px"
                                        className="shareImg"
                                    />
                                    : 
                                    <img
                                        style={{width: '300px', height: '300px'}}
                                        src={imageBase64Arr[index]}
                                        alt=""
                                        className="shareImg"
                                    />
                            )
                            })
                        }
                    </div>
                } */}
            </div>
            
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    onFinish={handleFinish}
                    className={cx('right')}
                >
                       
                    <div className={cx('info')}>
                        <Avatar src={props?.profile?.avatar} />
                        <div className={cx('name')}>{props?.profile?.displayName}</div>
                    </div>
                    <Form.Item 
                        name="description"
                        className={cx(`input`)}
                        rules={[
                        ({ getFieldValue }) => ({
                            validator(_, value: string) {
                            return Promise.resolve()
                            }
                            })
                        ]}
                        >
                         <TextArea rows={25} placeholder='Write a caption...' style={{width: '100%', borderRadius: '10px',  }}/>

                    </Form.Item>
                
                    <Form.Item>
                    <Button
                        className={cx('button')}
                        htmlType="submit"
                    >
                        Post now
                        {/* <FaLocationArrow style={{ color: '#e0bf88'}} /> */}
                    </Button>
                    </Form.Item>
                </Form>
            
            
        </div>
    )
};

export default CreateNewPost;
