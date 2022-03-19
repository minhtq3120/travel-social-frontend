import { Button, Form, Input, Tag } from 'antd';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import styles from 'src/styles/Post.module.scss';
import { SearchOutlined } from '@ant-design/icons';
import { BsThreeDots, BsPersonCircle,BsFlag } from 'react-icons/bs';
import { AiOutlineHeart , AiOutlineShareAlt} from 'react-icons/ai';
import { FaRegComment, FaRegHeart, FaShareAlt,FaRegShareSquare , FaLocationArrow, FaHeart} from 'react-icons/fa';
import ReactHashtag from "react-hashtag";
import ImageGallery from 'react-image-gallery';
import { Slide, Fade } from 'react-slideshow-image';
import "react-slideshow-image/dist/styles.css";
import ReactPlayer from 'react-player';
import AwesomeSlider from 'react-awesome-slider';
import moment from 'moment';
import { likePost, unLikePost } from 'src/services/like-service';
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

    const Slideshow = () => {
        return (
        <div className={`slide-container ${cx('slider-container2')}`} >
            <Slide
                {...properties}
            >
                {
                    images?.map((item: any, index: any) => {
                        return (
                            <div key={index} className={cx('img-video-container')}>
                                {
                                    item.type === "image" ? <img src={item.url} alt="img" className={cx('img')}/> 
                                    : <ReactPlayer
                                        url={item?.url}
                                        playing={false}
                                        loop={true}
                                        controls={true}
                                        width="100%"
                                        height="100%"
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

    const handleLike = async (postId: string) => {
        try {
            console.log(postId)
            const like = await likePost(postId)
            console.log(like)
            return
        }
        catch (err) {
            console.log(err)
        }
    }


    const handleUnlike = async (postId: string) => {
        try {
            console.log(postId)
            const like = await unLikePost(postId)
            console.log(like)
            return
        }
        catch (err) {
            console.log(err)
        }
    }

  return (
    <React.Fragment>
      <div className={cx(`post-container`)}>
        <div className={cx(`post-header`)}>
            <div className={cx(`left`)}>
                <div className={cx(`avatar`)}>
                    {
                        props?.item?.userAvatar?.length > 0? (
                            <img
                                src={props?.item?.userAvatar}
                                alt="user-avatar"
                                className={cx('user-avatar')}
                            />
                        ) : 
                        <BsPersonCircle style={{ fontSize: '40px', margin: '0 10px', cursor: 'pointer'}}/>
                    }
                    
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
                    <div className={cx('num')}>
                        {
                            props?.item?.liked ? (
                                <>
                                    <FaHeart style={{ fontSize: '25px', margin: '0 10px', cursor: 'pointer', color: 'red'}}onClick={() => {handleUnlike(props?.item?.postId)}} />
                                    {props?.item?.likes}

                                </>
                            ) : (
                                <>
                                    <FaRegHeart style={{ fontSize: '25px', margin: '0 10px', cursor: 'pointer'}} onClick={() => {handleLike(props?.item?.postId)}}/> 
                                    {props?.item?.likes}
                                </>
                            )
                        }
                    </div>
                    <div className={cx('num')}>
                        <FaRegComment style={{ fontSize: '25px', margin: '0 10px', cursor: 'pointer'}}/>
                        {props?.item?.comments}
                    </div>

                    <div className={cx('num')}>
                        <FaRegShareSquare style={{ fontSize: '25px', margin: '0 10px', cursor: 'pointer'}}/>
                        10
                    </div>
                    
                </div>
                <div className={cx(`right`)}>
                    <BsFlag style={{ fontSize: '25px', margin: '0 10px', cursor: 'pointer'}}/>
                </div>
            </div>
            <div className={cx('footer-body')}>
                <div className={cx(`description`)}>
                    <div className={cx('user-name')}>
                        {props?.item?.userDisplayName || 'user-name'}:
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
