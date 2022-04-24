import { Button, Form, Input, Spin, Tag } from 'antd';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import styles from 'src/styles/Post.module.scss';
import { SearchOutlined } from '@ant-design/icons';
import { BsThreeDots, BsPersonCircle,BsFlag } from 'react-icons/bs';
import { MdLocationOn} from 'react-icons/md';
import {FaTemperatureHigh} from 'react-icons/fa'
import { FaRegComment, FaRegHeart, FaShareAlt,FaRegShareSquare , FaLocationArrow, FaHeart, } from 'react-icons/fa';
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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import Weather from '../GoogleMap/Weather';
import Maps from '../GoogleMap/CurrentLocation';
import { setHashtagSearch, setWeatherPosition } from 'src/redux/WalletReducer';
import { useHistory } from 'react-router-dom';
const cx = classNames.bind(styles);

const positions = [{
  lat:10.835605681883571, lng:106.65673978501039, label: "position 1"
}, {
  lat: 21.027763, lng: 106, label: "position 2"
}, {
  lat: 21.127763, lng: 106.1, label: "position 3"
}]



const Post = (props: any) => {
    const [form] = Form.useForm();
    const [images, setImages] = useState<any>([])
    const [isModalVisibleLikes, setIsModalVisibleLikes] = useState(false);
    const [isModalVisibleDetail, setIsModalVisibleDetail] = useState(false);
    const [isModalVisibleMap, setIsModalVisibleMap] = useState(false);
    const [isModalVisibleMapDirection, setIsModalVisibleMapDirection] = useState(false);

    const history = useHistory()
    
    const [liked, setLiked] = useState<boolean>(props?.item?.liked || false)
    const [numLikes, setNumLikes] = useState<any>(props?.item?.likes)
    const [numComments, setNumComments] = useState<any>(props?.item?.comments)
    const socket: any = useSelector((state: RootState) => state.wallet.socket);
    const [latLng, setLatLng] = useState<any>(null)

    const dispatch = useDispatch()


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
        setIsModalVisibleMap(false)
        setIsModalVisibleMapDirection(false)
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
                                style={{cursor: 'pointer'}}
                                onClick={() => {history.push(`/profile?userId=${props?.item?.userId}`)}}
                            />
                        ) : 
                        <BsPersonCircle style={{ fontSize: '40px', margin: '0 10px', cursor: 'pointer'}}/>
                    }
                    
                </div>
                <div className={cx(`name-time`)}>
                    <div className={cx(`name`)} style={{cursor: 'pointer'}}
                    onClick={() => {history.push(`/profile?userId=${props?.item?.userId}`)}}    
                    >
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
                    <MdLocationOn size={45} className={cx(`localtion-icon`)} onClick={() => {
                        setIsModalVisibleMap(true)
                        if(props?.item?.place) {
                            setLatLng({
                                lat: props.item.place?.coordinate?.latitude,
                                lng: props.item.place?.coordinate?.longitude,
                            })
                        }
                        else {
                            setLatLng({
                                lat: positions[0].lat,
                                lng: positions[0].lng
                            })
                        }
                    }}
                    />
                    <FaLocationArrow size={33} className={cx(`localtion-icon-direct`)} 
                        onClick={() => {
                            setIsModalVisibleMapDirection(true)
                            if(props?.item?.place) {
                                setLatLng({
                                    lat: props.item.place?.coordinate?.latitude,
                                    lng: props.item.place?.coordinate?.longitude,
                                })
                            }
                            else {
                                setLatLng({
                                    lat: positions[0].lat,
                                    lng: positions[0].lng
                                })
                            }
                        }} />
                    <FaTemperatureHigh size={40} className={cx(`localtion-icon-temp`)} 
                        onClick={() => {
                            if(props?.item?.place) {
                                console.log("???", props?.item?.place)

                                dispatch(setWeatherPosition([props.item.place?.coordinate?.latitude,props.item.place?.coordinate?.longitude]))
                            }
                            else {
                                dispatch(setWeatherPosition([positions[0].lat,positions[0].lng]))
                            }
                        }}
                    />
                    <div className={cx('location-info')}>
                        <div className={cx('locate')}>Location</div>
                        <div className={cx('city')}>{props?.item?.place?.name}</div>
                    </div>
                    {/* <div className={cx('lat-lng')}>{`${positions[0].lat} - ${positions[0].lng}`}</div> */}
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
                                    <FaRegHeart style={{ fontSize: '30px', margin: '0 10px', cursor: 'pointer', color: '#68d1c8'}}onClick={() => {handleUnlike(props?.item?.postId)}} />
                                    <div style={{cursor: 'pointer' ,fontSize: '17px'}} onClick={() => {setIsModalVisibleLikes(true)}}>{numLikes}</div>
                                </>
                            ) : (
                                <>
                                    <FaRegHeart style={{ fontSize: '30px', margin: '0 10px', cursor: 'pointer'}} onClick={() => {
                                        handleLike(props?.item?.postId, props?.item?.userId)
                                        }}
                                    /> 
                                     <div style={{cursor: 'pointer',fontSize: '17px'}} onClick={() => {setIsModalVisibleLikes(true)}}>{numLikes}</div>
                                </>
                            )
                        }
                    </div>
                    <div className={cx('num')}>
                        <FaRegComment style={{ fontSize: '30px', margin: '0 15px', cursor: 'pointer'}}/>
                         <div style={{cursor: 'pointer',fontSize: '17px'}}>{numComments}</div>
                    </div>

                    {/* <div className={cx('num')}>
                        <FaRegShareSquare style={{ fontSize: '30px', margin: '0 15px', cursor: 'pointer'}}/>
                         <div style={{cursor: 'pointer',fontSize: '17px'}}></div>10
                    </div> */}
                    
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
                                    <span className={cx(`hashtag`)} onClick={()=> {
                                        console.log(hashtagValue)
                                        dispatch(setHashtagSearch({hashtag: hashtagValue}))
                                         history.push(`/hashtagDetail`)
                                    }}><Tag color="#68d1c8">{hashtagValue}</Tag></span>
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
                    <span style={{margin: '0 5px', color: '#68d1c8'}}>Post</span>
                    <FaLocationArrow style={{ color: '#68d1c8'}} />
                </Button>
                </Form.Item>
            </Form>
        </div>
      </div>
      <Modal title={`Likes (${props?.item?.likes})`} visible={isModalVisibleLikes} footer={null} onCancel={handleCancel} style={{borderRadius: '10px'}}>
        <InfinityList  typeList="likes" queryAPI={async (params: any) => await getLikeOfPots(params)}  postId={props?.item?.postId}/>
      </Modal>

      <Modal visible={isModalVisibleDetail} footer={null} onCancel={handleCancel} style={{borderRadius: '20px', padding: '0px !important'}} width={1400}  closable={false} bodyStyle={{padding: '0'}}>
        {images ? <PostDetail images={images} postId={props?.item?.postId} info={props.item} setNumComments={setNumComments} numComments={numComments}/> : null}
      </Modal>

      <Modal visible={isModalVisibleMap} footer={null} onCancel={handleCancel} style={{borderRadius: '20px', padding: '0px !important'}} width={1200} closable={false} bodyStyle={{padding: '0'}}>
        {  latLng ? <Maps lat={latLng.lat} long={latLng.lng} /> : <Spin size='large'/> }
      </Modal>

      <Modal visible={isModalVisibleMapDirection} footer={null} onCancel={handleCancel} style={{borderRadius: '20px', padding: '0px !important'}} width={1200} closable={false} bodyStyle={{padding: '0'}}>
        {  latLng ? <Maps lat={latLng.lat} long={latLng.lng} mapType="direction"/> : <Spin size='large'/> }
      </Modal>

    </React.Fragment>
  );
};

export default Post;
