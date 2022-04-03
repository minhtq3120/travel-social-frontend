import { ArrowsAltOutlined, SmileOutlined, ZoomInOutlined } from '@ant-design/icons';
import { Button, Form, Input, Popover, Slider } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { useForm } from 'antd/lib/form/Form';
import TextArea from 'antd/lib/input/TextArea';
import classNames from 'classnames/bind';
import Picker from 'emoji-picker-react';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { FcAddImage } from 'react-icons/fc';
import { GoLocation } from 'react-icons/go';
import ReactPlayer from 'react-player';
import 'react-slideshow-image/dist/styles.css';
import { createPost } from 'src/services/post-service';
import styles from 'src/styles/CreateNewPost.module.scss';
import UploadLogo from '../Upload';
import Cropper from 'react-easy-crop';
import './override.scss';
const cx = classNames.bind(styles);
export const FILE_TYPE_VIDEO = [
  'video/mp4',
  'video/3gp',
  'video/3gpp',
  'video/mov',
  'video/wmv',
  'video/x-ms-wmv',
  'video/quicktime'
];

const handleCustomRequest = ({ onSuccess }: any) => {
  onSuccess('ok');
  ``;
};

const renderPreView = (data: any) => {
  return (
    <>
      {data.type.includes(FILE_TYPE_VIDEO) ? (
        <ReactPlayer
          src={data.thumbUrl}
          // playing
          controls={true}
          width="100%"
          height="100%"
          className="shareImg"
        />
      ) : (
        <img src={data.thumbUrl} alt="" className="shareImg" />
      )}
    </>
  );
};

const CreateNewPost = memo(
  (props: any) => {
    const { uploaded, setUploaded } = props;
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<any>([]);
    const [file, setFile] = useState<any>(null);
    const [form] = useForm();
    const [imageBase64Arr, setImageBase64Arr] = useState([]);
    const [showPicker, setShowPicker] = useState(false);
    const [value, setValue] = useState('');
    const [visible, setVisible] = useState(false);
    const [visibleSize, setVisibleSize] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
      console.log(croppedArea, croppedAreaPixels);
    }, []);
    const [sizeImage1, setSizeImage1] = useState(false);
    const [sizeImage2, setSizeImage2] = useState(false);
    const [sizeImage3, setSizeImage3] = useState(false);
    const [sizeImage4, setSizeImage4] = useState(false);

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

    const handleOnEmoji = useCallback((event: any, emojiObject: any) => {
      setShowPicker(false);
      setValue((prevValue: any) => prevValue + emojiObject.emoji);
    }, []);

    const handleVisibleChange = (visible) => {
      setVisible(visible);
    };
    const handleVisibleSizeChange = (visible) => {
      setVisibleSize(visible);
    };

    const handleChangeSlider = (value) => {
      setZoom(value);
    };

    const handleFinish = async (values) => {
      try {
        let mediaFiles: any = [];
        fileList.map((item: any) => {
          return mediaFiles.push(item.originFileObj);
        });
        const formData = new FormData();
        console.log('asdfadsf', mediaFiles);
        mediaFiles.map((file) => formData.append('mediaFiles', file));
        formData.append('description', values.description);
        const create = await createPost(formData);
        console.log(create);
        return;
      } catch (err) {
        return err;
      }
    };

    const onChangevalue = useCallback((e: any) => {
      setValue(e.target.value);
    }, []);

    useEffect(() => {}, [fileList]);

    const handleCancel = () => {
      setPreviewVisible(false);
    };

    console.log('sizeImage1', sizeImage1);
    console.log('sizeImage2', sizeImage2);
    console.log('sizeImage3', sizeImage3);
    console.log('sizeImage4', sizeImage4);
    return (
      <div className={cx('createNewPostContainer')}>
        <div className={cx('left')}>
          {!uploaded ? (
            <div
              className={cx('edit-image', {
                'image-origin': sizeImage1,
                'full-size': sizeImage2,
                'image-origin-2': sizeImage3,
                'fix-height': sizeImage4
              })}>
              <div className={cx('img-post')}>
                <Cropper
                  image="https://assets.traveltriangle.com/blog/wp-content/uploads/2016/07/limestone-rock-phang-nga-1-Beautiful-limestone-rock-in-the-ocean.jpg"
                  crop={crop}
                  zoom={zoom}
                  //   aspect={4 / 3}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className={cx('icon-edit')}>
                <Popover
                  trigger="click"
                  visible={visibleSize}
                  className={cx('popover-list_size')}
                  content={
                    <div className={cx('list-size')}>
                      <span
                        onClick={() => {
                          setSizeImage1(true);
                          setSizeImage2(false);
                          setSizeImage3(false);
                          setSizeImage4(false);
                        }}>
                        Gốc
                      </span>
                      <span
                        onClick={() => {
                          setSizeImage2(true);
                          setSizeImage1(false);
                          setSizeImage3(false);
                          setSizeImage4(false);
                        }}>
                        1:1
                      </span>
                      <span
                        onClick={() => {
                          setSizeImage3(true);
                          setSizeImage2(false);
                          setSizeImage1(false);
                          setSizeImage4(false);
                        }}>
                        4:5
                      </span>
                      <span
                        onClick={() => {
                          setSizeImage4(true);
                          setSizeImage3(false);
                          setSizeImage2(false);
                          setSizeImage1(false);
                        }}>
                        16:9
                      </span>
                    </div>
                  }
                  onVisibleChange={handleVisibleSizeChange}>
                  <ArrowsAltOutlined className={cx('icon-1')} />
                </Popover>
                <Popover
                  visible={visible}
                  onVisibleChange={handleVisibleChange}
                  trigger="click"
                  content={
                    <Slider min={1} max={3} step={0.1} onChange={handleChangeSlider} value={zoom} />
                  }>
                  <ZoomInOutlined className={cx('icon-2')} />
                </Popover>
              </div>
            </div>
          ) : (
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
              setUploaded={setUploaded}
              // listType="picture-card"
              custom={
                <div className={cx('uploadContainer')}>
                  <div className={cx('uploadIcon')}>
                    <FcAddImage
                      style={{ fontSize: '100px', marginRight: '10px', cursor: 'pointer' }}
                    />
                  </div>
                  <div className={cx('uploadText')}>Upload load your photos and videos here</div>
                </div>
              }
            />
          )}

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
          className={cx('right')}>
          <div className={cx('info')}>
            <Avatar src={props?.profile?.avatar} />
            <div className={cx('name')}>{`props?.profile?.displayName`}</div>
          </div>
          <Form.Item
            name="description"
            className={cx(`input`)}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value: string) {
                  return Promise.resolve();
                }
              })
            ]}>
            <TextArea
              rows={25}
              placeholder="Write a caption..."
              style={{
                width: '100%',
                borderRadius: '10px',
                border: 'none',
                resize: 'none',
                height: '144px',
                padding: 0,
                outline: 'none',
                paddingLeft: '10px'
              }}
              value={value}
              onChange={onChangevalue}
            />
            <div className={cx('emoji')}>
              <SmileOutlined
                style={{ cursor: 'pointer', paddingLeft: '10px' }}
                onClick={() => setShowPicker((val) => !val)}
              />
              {showPicker && (
                <Picker onEmojiClick={handleOnEmoji} pickerStyle={{ width: '100%' }} />
              )}
            </div>
            <div className={cx('location')}>
              <Input placeholder="Thêm vị tri" bordered={false} />
              <GoLocation style={{ paddingRight: '10px', fontSize: '25px', cursor: 'pointer' }} />
            </div>
          </Form.Item>

          <Form.Item>
            <Button className={cx('button')} htmlType="submit">
              Post now
              {/* <FaLocationArrow style={{ color: '#68d1c8'}} /> */}
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.profile === nextProps.profile;
  }
);

export default CreateNewPost;
