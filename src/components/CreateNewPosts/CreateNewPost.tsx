import { ArrowsAltOutlined, SmileOutlined, ZoomInOutlined } from '@ant-design/icons';
import { Button, Form, Input, Popover, Slider } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { useForm } from 'antd/lib/form/Form';
import TextArea from 'antd/lib/input/TextArea';
import classNames from 'classnames/bind';
import Picker from 'emoji-picker-react';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FaRegImages } from 'react-icons/fa';
import { GoLocation } from 'react-icons/go';
import ReactPlayer from 'react-player';
import 'react-slideshow-image/dist/styles.css';
import { createPost } from 'src/services/post-service';
import styles from 'src/styles/CreateNewPost.module.scss';
import { BsThreeDots, BsPersonCircle,BsFlag, BsFiles } from 'react-icons/bs';
import UploadLogo from '../Upload';
import Cropper from 'react-easy-crop';
import './override.scss';
import { Select } from 'antd';
import {AiOutlinePlus} from 'react-icons/ai'
import { getPlaces } from 'src/services/place-service';
import { Slide, Fade } from 'react-slideshow-image';
import _ from 'lodash';
import { notificationError, notificationSuccess } from 'src/pages/Login/Login';
const { Option } = Select;

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

const Slideshow2 = ({fileList, imageBase64Arr}: any) => {
  const properties = {
        duration: 5000,
        autoplay: false,
        transitionDuration: 500,
        arrows: true,
        infinite: true,
        easing: "ease",
        indicators: true
    };

    const Slider = () => {
      return (<div className={`slide-container ${cx('slider-container2')}`} >
            <Slide
                {...properties}
            >
                    {
                    fileList?.map((item: any, index: any) => {
                      // console.log('fileList', fileList) 
                      // console.log('imageBase64', imageBase64Arr )
                        return (
                           <div className={cx('recent-container')} key={index}>
                                {FILE_TYPE_VIDEO.includes(item.type) ? 
                                  // <video
                                  //     src={
                                  //       imageBase64Arr[index]
                                  //     }
                                  //     width='700px'
                                  //     height='700px'                        // playing
                                  //     // light="https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg"
                                  //     // controls={true}
                                  //     className={cx('img')}
                                  // />
                                  <video width="700px" height="620px" controls>
                                      <source src={URL.createObjectURL(item.originFileObj)}/>
                                  </video>
                                   : 
                                    //  <Cropper
                                    //   image={imageBase64Arr[index]}
                                    //   crop={crop}
                                    //   zoom={zoom}
                                    //   //   aspect={4 / 3}
                                    //   onCropChange={setCrop}
                                    //   onCropComplete={onCropComplete}
                                    //   onZoomChange={setZoom}
                                    // />

                                  <img
                                      src={
                                       imageBase64Arr?.filter((it) => it.uid === item.uid)[0]?.imageUrl
                                      }
                                      alt="img"
                                      className={cx('img')}
                                  />
                                  }
                            </div>
                        )
                    })
                }
             </Slide>
        </div>)
    }
    

        return (
           <div className={cx('img-post')}>
                {
                  fileList?.length > 0 ? (
                      <Slider />
         
                  ) : (
                      <div className={cx('uploadContainer')}>
                        <div className={cx('uploadIcon')}>
                          <FaRegImages
                          size={50}
                            style={{  marginRight: '10px', cursor: 'pointer' }}
                          />
                        </div>
                        <div className={cx('uploadText')}>Share your images and videos</div>
                      </div>
                  )
                }
              </div>
        )
  }
  
const CreateNewPost = memo(
  (props: any) => {
    const { uploaded, setUploaded } = props;
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [file, setFile] = useState<any>(null);
    const [form] = useForm();
    const [imageBase64Arr, setImageBase64Arr] = useState<any>([]);
    const [fileList, setFileList] = useState<any>([])
    const [showPicker, setShowPicker] = useState(false);
    const [value, setValue] = useState('');
    const [visible, setVisible] = useState(false);
    const [visibleSize, setVisibleSize] = useState(false);
    const [visibleUpload, setVisibleUpload] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [cropImg, setCropImg] = useState<any>(null)
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
      console.log(croppedArea, croppedAreaPixels);
    }, []);
    const [sizeImage1, setSizeImage1] = useState(false);
    const [sizeImage2, setSizeImage2] = useState(false);
    const [sizeImage3, setSizeImage3] = useState(false);
    const [sizeImage4, setSizeImage4] = useState(false);

    const [createPostLoading, setCreatePostLoading] = useState(false)

    const [seachPlace, setSearchPlace] = useState<any>(null)
    const [dataPlaces, setDataPlaces] = useState<any>([])

    const [placeId, setPlaceId] = useState<any>(null)

    useEffect(() => {
      const fetchPlace = async () =>{
        const rs = await getPlaces({
          input: seachPlace
        })
        const dataSource = _.get(rs, 'data');
        setDataPlaces(dataSource)
      }

      fetchPlace()
    }, [seachPlace])

   

    function getBase64(img: any, callback: any) {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img);
    }
    

     

      //    <Cropper
      //       image={imageBase64Arr[index]}
      //       crop={crop}
      //       zoom={zoom}
      //       //   aspect={4 / 3}
      //       onCropChange={setCrop}
      //       onCropComplete={onCropComplete}
      //       onZoomChange={setZoom}
      //     />

    const handleOnEmoji = useCallback((event: any, emojiObject: any) => {
      setShowPicker(false);
      setValue((prevValue: any) => prevValue + emojiObject.emoji);
    }, []);

    const handleVisibleChange = (visible) => {
      setVisible(visible);
    };

    const handleVisibleUploadChange = (visible) => {
      setVisibleUpload(visible);
    };
    const handleVisibleSizeChange = (visible) => {
      setVisibleSize(visible);
    };

    const handleChangeSlider = (value) => {
      setZoom(value);
    };

    const handleFinish = async (values) => {
      try {
        setCreatePostLoading(true)
        let mediaFiles: any = [];
        fileList.map((item: any) => {
          return mediaFiles.push(item.originFileObj);
        });
        const formData = new FormData();
        mediaFiles.map((file) => formData.append('mediaFiles', file));
        formData.append('description', values.description);
        formData.append('placeId', placeId)
        const create = await createPost(formData);
        console.log(create);
        if(create?.status === 201) {
          notificationSuccess('bài viết đã được tạo thành công')
          props.setOpenCreatePost(false)
          setCreatePostLoading(false)
          return
        }
        notificationError('đã xảy ra lỗi khi tạo bài viết.')
        setCreatePostLoading(false)
        return;
      } catch (err) {
        setCreatePostLoading(false)
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
    return (
      <div className={cx('createNewPostContainer')}>
        <div className={cx('left')}>
        
            <div
              className={cx('edit-image', {
                'image-origin': sizeImage1,
                'full-size': sizeImage2,
                'image-origin-2': sizeImage3,
                'fix-height': sizeImage4
              })}>
                <Slideshow2 imageBase64Arr={imageBase64Arr} fileList={fileList}/>
             
               <Popover
                  visible={visibleUpload}
                  onVisibleChange={handleVisibleUploadChange}
                  trigger="click"
                  className={cx('icon-3')}
                  overlayInnerStyle={{width: '600px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center'}}
                  content={
                    <div style={{width: '600px'}}>
                      <UploadLogo
                      fileList={fileList}
                      createPostType={true}
                      name="creat post"
                      title={() => <AiOutlinePlus />}
                      setFile={setFile}
                      setFileList={setFileList}
                      maxCount={10}
                      file={file}
                      setImageBase64Arr={setImageBase64Arr}
                      imageBase64Arr={imageBase64Arr}
                      setUploaded={setUploaded}
                      listType="picture-card"
                      // custom={
                      //   <div className={cx('uploadContainer')}>
                      //     <div className={cx('uploadIcon')}>
                      //       <FcAddImage
                      //         style={{ fontSize: '100px', marginRight: '10px', cursor: 'pointer' }}
                      //       />
                      //     </div>
                      //     <div className={cx('uploadText')}>Upload load your photos and videos here</div>
                      //   </div>
                      // }
                    />
                    </div>
                    
                  }>
                   <BsFiles size={30} />
                </Popover>
                 {/* {
                  fileList?.length > 0 ? (
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
                  ) :null
                } */}
            </div>


          
        </div>

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={handleFinish}
          className={cx('right')}>
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
                      if (!value || value?.length <= 0) {
                        return Promise.reject(
                          new Error('Please tell something about this post')
                        );
                      }
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
                height: '250px',
                padding: 0,
                outline: 'none',
                paddingLeft: '10px'
              }}
              value={value}
              onChange={onChangevalue}
            />
            
          </Form.Item>

          <Form.Item
            name="location"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value: string) {
                  console.log(value)
                  if (!value) {
                    return Promise.reject(
                      new Error('Please select location')
                    );
                  }
                  return Promise.resolve();
                }
              })
            ]}
          >
            <div className={cx('location')}>
              <Select
              
                showSearch
                style={{ width: '100%' }}
                optionFilterProp="children"
                placeholder="Thêm vị tri"
                bordered={false} 
                 onSelect={(value: any) => {
                   setPlaceId(value)
                  }}
                  showArrow={false}
                filterOption={(input, option: any) => {
                  // console.log(option)
                  return true
                  // return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }}

                onSearch={(e)=> {
                 setSearchPlace(e)
                }}
              >
                {dataPlaces?.length > 0 && dataPlaces?.map((item: any) => {
                  return (
                    <Option key={item.placeId} value={item.placeId}>
                      {item?.mainText}
                    </Option>
                  )})}
              </Select>
              <GoLocation style={{ paddingRight: '10px', fontSize: '25px', cursor: 'pointer' }} />
              </div>
          </Form.Item>
          <Form.Item >
            {/* <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100px'}}> */}
              <Button className={cx('button')} htmlType="submit" loading={createPostLoading}>
              Post now
              {/* <FaLocationArrow style={{ color: '#68d1c8'}} /> */}
            </Button>
            {/* </div> */}
            
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
