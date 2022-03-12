import { Button, Form, Input, Tag } from 'antd';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import styles from 'src/styles/Post.module.scss';
import { SearchOutlined } from '@ant-design/icons';
import { BsThreeDots, BsPersonCircle,BsFlag } from 'react-icons/bs';
import { AiOutlineHeart , AiOutlineShareAlt} from 'react-icons/ai';
import { FaRegComment, FaRegHeart, FaShareAlt,FaRegShareSquare , FaLocationArrow} from 'react-icons/fa';
import ReactHashtag from "react-hashtag";
import ImageGallery from 'react-image-gallery';
import { Slide, Fade } from 'react-slideshow-image';
import "react-slideshow-image/dist/styles.css";
import ReactPlayer from 'react-player';



import AwesomeSlider from 'react-awesome-slider';
import moment from 'moment';
// import 'react-awesome-slider/dist/styles.css';




const cx = classNames.bind(styles);

const Post = (props: any) => {
    const [form] = Form.useForm();
    const [images, setImages] = useState<any>([])

    const handleFinish = async (values) => {
        try {
            console.log(values)
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if(props?.item.files?.length>0){
            // let arr: any = []
            // props.item.files.forEach((item: any) => {
            //     arr.push(item.url)
            // })
            setImages(props?.item.files)
        }
    },[props?.item])

    const properties = {
        duration: 5000,
        autoplay: false,
        transitionDuration: 500,
        arrows: true,
        infinite: true,
        easing: "ease",
        indicators: true
    };


    const fadeImages = [
        {
    url: "https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
            type: 'image'
        },
        {
    url:     "https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80",
            type: 'image'
        },
        {
    url:     "https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
            type: 'image'
        },
        {
    url: "https://www.youtube.com/watch?v=Yw9Ra2UiVLw",
            type: 'video'
        },
        
    ]; 

    const Slideshow = () => {
        return (
        <div className="slide-container">
            <Slide
                {...properties}
            >
                {
                    fadeImages?.map((item: any, index: any) => {
                        return (
                            <div className="each-fade" key={index}>
                                {
                                    item.type === "image" ? <img src={item.url} alt="img" style={{height: '800px', width: '800px'}}/> 
                                    : <ReactPlayer
                                        url={item?.url}
                                        // playing
                                        controls={true}
                                        width="800px"
                                        height="800px"
                                        />
                                }
                                
                            </div>
                        )
                    })
                }
            </Slide>
        </div>
        )
    }

  return (
    <React.Fragment>
      <div className={cx(`post-container`)}>
        <div className={cx(`post-header`)}>
            <div className={cx(`left`)}>
                <div className={cx(`avatar`)}>
                    {/* {
                        props.userAvatar?.length > 0? null : 
                        <BsPersonCircle style={{ fontSize: '30px', margin: '0 10px', cursor: 'pointer'}}/>
                    } */}
                        <BsPersonCircle style={{ fontSize: '30px', margin: '0 10px', cursor: 'pointer'}}/>
                </div>
                <div className={cx(`name-time`)}>
                    <div className={cx(`name`)}>
                        {props.item.userDisplayName}
                    </div>
                    <div className={cx(`time`)}>
                        {moment(props.item.createdAt).format('DD MMM YYYY HH:mm').toString()}
                    </div>
                </div>
            </div>
            <div className={cx(`right`)}>
                <BsThreeDots style={{ fontSize: '25px', margin: '0 10px', cursor: 'pointer'}}/>
            </div>
        </div>
        {
            images?.length > 0 ? (
                <div className={cx(`post-body`)}>
                    <Slideshow/>
                </div>
            ) : null
        }
         
        <div className={cx(`post-footer`)}>
            <div className={cx('footer-top')}>
                <div className={cx('left')}>
                    <FaRegHeart style={{ fontSize: '25px', margin: '0 10px', cursor: 'pointer'}}/>
                    <FaRegComment style={{ fontSize: '25px', margin: '0 10px', cursor: 'pointer'}}/>
                    <FaRegShareSquare style={{ fontSize: '25px', margin: '0 10px', cursor: 'pointer'}}/>
                </div>
                <div className={cx(`right`)}>
                    <BsFlag style={{ fontSize: '25px', margin: '0 10px', cursor: 'pointer'}}/>
                </div>
            </div>
            <div className={cx('footer-body')}>
                <div className={cx(`description`)}>
                    <div className={cx('user-name')}>
                        {props.item.userDisplayName}:
                    </div>
                    <div className={cx(`descrip`)}>
                        {
                            props?.item?.description ? 
                            <ReactHashtag
                                renderHashtag={(hashtagValue) => (
                                    <span className={cx(`hashtag`)} onClick={()=> console.log(hashtagValue)}><Tag color="#e0bf88">{hashtagValue}</Tag></span>
                                )}
                            >
                                {props.item.description}
                            </ReactHashtag> : null
                        }
                    
                    </div>
                    
                </div>
                <div className={cx(`view-comment`)}>
                    {`View all ${props.item.comments} comments`}
                </div>
            </div>
                <Form
                    form={form}
                    className={cx('footer-footer')}
                    layout="vertical"
                    autoComplete="off"
                    onFinish={handleFinish}
                >
                <Form.Item 
                    name="comment"
                    className={cx(`input`)}
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
                      placeholder='Add a comment...'
                      className={cx('comment-input')}
                    />

                  </Form.Item>
              
                <Form.Item>
                <Button
                    className={cx('comment-button')}
                    htmlType="submit"
                >
                    <span style={{margin: '0 5px', color: '#e0bf88'}}>Post</span>
                    <FaLocationArrow style={{ color: '#e0bf88'}} />
                </Button>
                </Form.Item>
            </Form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Post;
