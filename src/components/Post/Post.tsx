import { Button, Form, Input, Tag } from 'antd';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import styles from 'src/styles/Post.module.scss';
import { SearchOutlined } from '@ant-design/icons';
import { BsThreeDots, BsPersonCircle,BsFlag } from 'react-icons/bs';
import { MdLocationOn} from 'react-icons/md';
import { FaRegComment, FaRegHeart, FaShareAlt,FaRegShareSquare , FaLocationArrow, FaHeart} from 'react-icons/fa';
import ReactHashtag from "react-hashtag";
import ImageGallery from 'react-image-gallery';
import { Slide, Fade } from 'react-slideshow-image';
import "react-slideshow-image/dist/styles.css";
import ReactPlayer from 'react-player';
import AwesomeSlider from 'react-awesome-slider';
import moment from 'moment';
import { getLikeOfPots, likePost, unLikePost } from 'src/services/like-service';
import Modal from 'antd/lib/modal/Modal';
import InfinityList from '../InfinityScroll/InfinityScroll';
import PostDetail from '../PostDetail/PostDetail';
import { commentToPost } from 'src/services/comment-service';
import { SEND_NOTIFICATION } from '../Notification/Notification';
import { NotificationAction } from 'src/pages/Layout/layout';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
const cx = classNames.bind(styles);

const Post = (props: any) => {
    const [form] = Form.useForm();
    const [images, setImages] = useState<any>([])
    const [isModalVisibleLikes, setIsModalVisibleLikes] = useState(false);
    const [isModalVisibleDetail, setIsModalVisibleDetail] = useState(false);
    const [liked, setLiked] = useState<boolean>(props?.item?.liked || false)
    const [numLikes, setNumLikes] = useState<any>(props?.item?.likes)
    const [numComments, setNumComments] = useState<any>(props?.item?.comments)
    const socket: any = useSelector((state: RootState) => state.wallet.socket);

    const handleFinish = async (values) => {
        try {
            console.log(values)
            setNumComments(numComments + 1)
            const addCommentToPost = {
                postId: props?.item?.postId,
                comment: values.comment
            }
            
            socket.emit(SEND_NOTIFICATION, {
                receiver: props.item.userId,
                action: NotificationAction.Comment
            })
            const addCom = await commentToPost(addCommentToPost)
            console.log(addCom)
            form.resetFields()
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if(props?.item.files?.length>0){
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

    const handleLike = async (postId: string, userId: string) => {
        try {
            const like = await likePost(postId)
            setLiked(true)
            setNumLikes(numLikes + 1)
            socket.emit(SEND_NOTIFICATION, {
                receiver: userId,
                action: NotificationAction.Like,
                postId: postId
            })
            return
        }
        catch (err) {
            console.log(err)
        }
    }


    const handleUnlike = async (postId: string) => {
        try {
            const unlike = await unLikePost(postId)
            setLiked(false)
            setNumLikes(numLikes - 1)
            return
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleCancel = () => {
        setIsModalVisibleLikes(false)
        setIsModalVisibleDetail(false)
    };

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
                    <MdLocationOn size={45} className={cx(`localtion-icon`)}/>

                </div>
            ) : null
        }
         
        <div className={cx(`post-footer`)}>
            <div className={cx('footer-top')}>
                <div className={cx('left')}>
                    <div className={cx('num')}>
                        {
                            liked ? (
                                <>
                                    <FaHeart style={{ fontSize: '25px', margin: '0 10px', cursor: 'pointer', color: 'red'}}onClick={() => {handleUnlike(props?.item?.postId)}} />
                                    <div style={{cursor: 'pointer'}} onClick={() => {setIsModalVisibleLikes(true)}}>{numLikes}</div>
                                </>
                            ) : (
                                <>
                                    <FaRegHeart style={{ fontSize: '25px', margin: '0 10px', cursor: 'pointer'}} onClick={() => {
                                        handleLike(props?.item?.postId, props?.item?.userId)
                                        }}
                                    /> 
                                     <div style={{cursor: 'pointer'}} onClick={() => {setIsModalVisibleLikes(true)}}>{numLikes}</div>
                                </>
                            )
                        }
                    </div>
                    <div className={cx('num')}>
                        <FaRegComment style={{ fontSize: '25px', margin: '0 10px', cursor: 'pointer'}}/>
                        {numComments}
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
                <div className={cx(`view-comment`)} onClick={() => {setIsModalVisibleDetail(true)}}>
                    {`View all ${numComments} comments`}
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
      <Modal title={`Likes (${props?.item?.likes})`} visible={isModalVisibleLikes} footer={[]} onCancel={handleCancel} style={{borderRadius: '10px'}}>
        <InfinityList  typeList="likes" queryAPI={async (params: any) => await getLikeOfPots(params)}  postId={props?.item?.postId}/>
      </Modal>

      <Modal visible={isModalVisibleDetail} footer={[]} onCancel={handleCancel} style={{borderRadius: '20px', padding: '0px !important'}} width={1400}  closable={false} bodyStyle={{padding: '0'}}>
        {images ? <PostDetail images={images} postId={props?.item?.postId} info={props.item} setNumComments={setNumComments} numComments={numComments}/> : null}
      </Modal>

    </React.Fragment>
  );
};

export default Post;
