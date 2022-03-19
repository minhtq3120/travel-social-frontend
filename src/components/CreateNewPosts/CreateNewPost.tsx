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

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export const FILE_TYPE_VIDEO = [
  "video/mp4",
  "video/3gp",
  "video/3gpp",
  "video/mov",
  "video/wmv",
  "video/x-ms-wmv",
  "video/quicktime",
];

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


    const handleCancel = () => {
        setPreviewVisible(false)
    }

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview),
        setPreviewVisible(true)
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    }

    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    const handleChange = ({ fileList }) => {
        setFileList(fileList)
    };

    return (
        <div className={cx('createNewPostContainer')}>
            {
                fileList.length === 0 ? (
                    <>
                    <div className={cx('uploadIcon')}>
                        <FcAddImage style={{ fontSize: '100px', marginRight: '10px', cursor: 'pointer'}}/>
                    </div>
                    <div className={cx('uploadText')}>
                        Upload load your photos and videos here 
                    </div>
                    </>
                ) :
            
                <div className={cx('filelistArr')}>
                { 
                    fileList.map((item: any) => {
                        return (
                            item.type.includes(FILE_TYPE_VIDEO) ? 
                                <ReactPlayer
                                    src={item.thumbUrl}
                                    // playing
                                    controls={true}
                                    width="100%"
                                    height="100%"
                                    className="shareImg"
                                />
                                : 
                                <img
                                    src={item.thumbUrl}
                                    alt=""
                                    className="shareImg"
                                />
                        )
                        })
                    }
                </div>
            }

             <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                // listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
                >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    )
};

export default CreateNewPost;
