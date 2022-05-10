import { Button, Form, Input, List, Spin, Tag } from 'antd';
import classNames from 'classnames/bind';
import React, { useCallback, useEffect, useState } from 'react';
import styles from 'src/styles/PagePostDetail.module.scss';
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
import { getLikeOfPots, likePost, unLikePost } from 'src/services/like-service';
import Modal from 'antd/lib/modal/Modal';
import { followId, unfollowId } from 'src/services/follow-service';
import _ from 'lodash'
import { commentToPost, getCommentsOfPost, getReplyOfComment, replyToComment } from 'src/services/comment-service';
import VirtualList from 'rc-virtual-list';
import Avatar from 'antd/lib/avatar/avatar';
import Reply from './PostReply';
import { sleep } from 'src/containers/Newfeed/Newfeed';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import { addInterest, getPostDetail } from 'src/services/post-service';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { SEND_NOTIFICATION } from 'src/components/Notification/Notification';
import { NotificationAction } from '../Layout/layout';
import InfinityList from 'src/components/InfinityScroll/InfinityScroll';

const cx = classNames.bind(styles);
const ContainerHeight = 850;

const ListReplys = (props) => {
    const [item, setItem] = useState(props?.item)
    
    return (
        <Reply commentId={item?.item?.commentId} 
        // form={form} setReplyCommentId={setReplyCommentId}
        />
    )
}

const ReplyNoOneSeeThis = (props) => {
    const [showReply, setShowReply] = useState(props?.showReply)
    const [item, setItem] = useState(props?.item)

    return (
        <>
            {
                item?.replys <= 0 ? null   
                : showReply.includes(item?.commentId) ? <div className={cx('view-replys')} onClick={() => {
                    let temp = showReply.filter((it:any) => it !== item.commentId)
                    setShowReply(temp)
                    props?.setShowReply(temp)
                }}>
                    {`----- Hide replies (${item?.replys}) -----`}
                </div>  : <div className={cx('view-replys')} onClick={() => {
                    let temp = showReply
                    console.log('?????')
                    temp.push(item?.commentId)
                    setShowReply(temp)
                    props?.setShowReply(temp)
                }}>
                    {`----- View replies (${item?.replys}) -----`}
                </div> 
            }
            {
                props?.showReply.includes(item?.commentId) ? (
                    <ListReplys item={item}/>
                ) : null
            }
        </>
        
    )
}

const PagePostDetail = (props: any) => {

    const handleFetchMore = async () => {
    //await sleep();
        setCurentPage(currentPage + 1)
    }
    const scrollRef: any = useBottomScrollListener(() => {
        totalPage - 1 === currentPage || data?.length === 0 ? null : handleFetchMore()
    });

    const search = useLocation().search;
    const postId=new URLSearchParams(search).get("postId");

    const [data, setData] = useState<any>([]);

    


    const [totalItem, setTotalItem] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurentPage] = useState(0);
    const [trigger, setTrigger] = useState(false)
    const [replyCommentId, setReplyCommentId] = useState(null)

    const [postDetailInfo, setPostDetailInfo] = useState<any>(null)

    const history = useHistory()

    console.log(postDetailInfo)

     const [liked, setLiked] = useState<boolean>(postDetailInfo?.liked || false)
    const [isModalVisibleLikes, setIsModalVisibleLikes] = useState(false);
    const [numLikes, setNumLikes] = useState<any>(postDetailInfo?.likes)

    useEffect(() => {
        if(postDetailInfo) {
            setLiked(postDetailInfo?.liked)
            setNumLikes(postDetailInfo?.likes)
        }
    }, [postDetailInfo])

    const socket: any = useSelector((state: RootState) => state.wallet.socket);

    const [form] = Form.useForm();
    const [showReply, setShowReply] = useState<any>([])


    const appendData =  async (postId:string, page?: number) => {
        let params = {
            postId: postId,
            page: page
        }
        const result = await getCommentsOfPost(params)
        if(result) {
            const dataSource = _.get(result, 'data.items', []);
            const totalItem = _.get(result, 'data.meta.totalItems', 0);
            const totalPages = _.get(result, 'data.meta.totalPages', 0);
            const itemsPerPage = _.get(result, 'data.meta.perPage', 0);
            const currentPage = _.get(result, 'data.meta.currentPage', 0);

            setData(dataSource);
            setTotalItem(parseInt(totalItem));
            setTotalPage(parseInt(totalPages));
            setItemsPerPage(parseInt(itemsPerPage));
            setCurentPage(parseInt(currentPage));

            let temp = data.concat(dataSource)
            setData(temp)
        }
    };

    const getPostDetailInfo = async (postId: string) => {
        const result = await getPostDetail(postId)
        if(result) {
            const rs = _.get(result, 'data', null);
            setPostDetailInfo(rs)
        }
    }


    useEffect(() => {
        if(postId) getPostDetailInfo(postId)
    }, [postId])

    useEffect(() => {
       if(postId) appendData(postId, currentPage);
    }, [currentPage, trigger, postId]);

    

    const properties = {
        duration: 5000,
        autoplay: false,
        transitionDuration: 500,
        arrows: true,
        infinite: true,
        easing: "ease",
        indicators: true
    };

    const ListReplys = (props: any) => {
        const [item, setItem] = useState(props?.item)
        const [showReply2, setShowReply2] = useState<any>([])
        return (
            item?.replys <= 0 ? null   
            : showReply2.includes(item?.commentId) ? <div className={cx('view-replys')} >
               <div onClick={() => {
                setShowReply2(showReply2.filter((it:any) => it !== item.commentId))
            }}> {`----- Hide replies (${item?.replys}) -----`}</div>
                 <Reply commentId={item?.commentId} form={form} setReplyCommentId={setReplyCommentId}/>
            </div>  : <div className={cx('view-replys')} onClick={() => {
                console.log('?????')
                setShowReply2([...showReply2, item?.commentId])
            }}>
                {`----- View replies (${item?.replys}) -----`}
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



    const ListComments = useCallback(() => {
     return <div  ref={scrollRef } style={{width: '100%',height: '660px', display: 'flex', flexDirection: 'column', alignItems: 'center',alignContent:'flex-start', overflowY: 'scroll', overflowX: 'hidden'}} >
         {
            data.map((item: any, index: any) => (
                 <div className={cx('comment-container')} key={index}>
                    <div className={cx('comment-info')}>
                        <Avatar src={item?.avatar} />
                        <div className={cx('name')}>{item?.displayName}</div>
                    </div>
                        <div className={cx('comment')}>{item?.comment}</div>
                    <div className={cx('comment-time-reply')}>
                        <div className={cx('time')}>{moment(item?.createdAt).format('YYYY-MM-DD HH-MM')}</div>
                        <div className={cx('reply')} onClick={() => {
                            form.resetFields()
                            setReplyCommentId(item?.commentId)
                            form.setFieldsValue({comment: `@${item.displayName} `})
                        }}>{`Reply`}</div>
                    </div>
                    <ListReplys item={item}/>
                    {/* {
                        item?.replys <= 0 ? null   
                        : showReply.includes(item?.commentId) ? <div className={cx('view-replys')} onClick={() => {
                            let temp = showReply.filter((it:any) => it !== item.commentId)
                            setShowReply(temp)
                        }}>
                            {`----- Hide replies (${item?.replys}) -----`}
                            <ListReplys item={item}/>
                        </div>  : <div className={cx('view-replys')} onClick={() => {
                            let temp = showReply
                            console.log('?????')
                            temp.push(item?.commentId)
                            setShowReply(temp)
                        }}>
                            {`----- View replies (${item?.replys}) -----`}
                        </div> 
                    } */}

                    {/* {
                        showReply.includes(item?.commentId) ? ( */}
                            
                        {/* ) : null
                    } */}
                {/* <ReplyNoOneSeeThis item={item} showReply={showReply} setShowReply={setShowReply}/> */}
                </div>
            ))
        }
        {
        totalPage - 1 === currentPage || data?.length === 0 ? null : (
            <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
                <Spin size="large" style={{margin: '15px 0', padding: '5px 0'}}/>
            </div>  
        )}
    </div>
    }, [data, showReply])

    const Slideshow = (props) => {
        return (
        <div className={`slide-container ${cx('slider-container2')}`} >
            <Slide
                {...properties}
            >
                {
                    props?.detail?.files?.map((item: any, index: any) => {
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
    const handleFinish = async (values) => {
        try {
            console.log(values)
            // props.setNumComments(props.numComments + 1)
            const addCommentToPost = {
                postId: postId,
                comment: values.comment
            }
            const addReplyComment = {
                commentId: replyCommentId,
                comment: values.comment
            }
            console.log(replyCommentId)
            addInterest({
                postId: postId
            })
            if(replyCommentId) {
                await replyToComment(addReplyComment)
                socket.emit(SEND_NOTIFICATION, {
                receiver: props?.info?.userId,
                action: NotificationAction.ReplyComment,
                postId: props?.postId
            })}
            else {
                socket.emit(SEND_NOTIFICATION, {
                    receiver: props?.info?.userId,
                    action: NotificationAction.Comment,
                    postId: props?.postId
                })
                await commentToPost(addCommentToPost)
                
            }
            form.resetFields()
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <>
        <div className={cx(`post-detail-container`)}>
            {
                !postDetailInfo ? null : 
                <>
            <div className={cx(`post-left`)}>
                <Slideshow detail={postDetailInfo}/>
             </div>
             <div className={cx(`post-right`)}>
                 <div className={cx('info')}>
                    <div className={cx('left')} onClick={() => {
                        history.push(`/profile?userId=${props?.info?.userId}`)
                    }}>
                         <Avatar src={postDetailInfo?.userAvatar} />
                        <div className={cx('name')}>{postDetailInfo?.userDisplayName}</div>
                    </div>
                    
                    <BsThreeDots style={{ fontSize: '25px', margin: '0 10px', cursor: 'pointer'}} />
                </div>
                <ListComments />
                <div className={cx('like-container')}>
                    <div className={cx('like-container-child')}>
                        {
                            liked ? (
                                <>
                                    <FaRegHeart style={{ fontSize: '30px', margin: '0 20px',marginRight: '10px', cursor: 'pointer', color: '#68d1c8'}}onClick={() => {handleUnlike(postDetailInfo.postId)}} />
                                    <div style={{cursor: 'pointer' ,fontSize: '17px'}} onClick={() => {setIsModalVisibleLikes(true)}}>{liked ? `Liked by you and ${numLikes-1} peoples` : `Liked by ${numLikes} peoples`}</div>
                                </>
                            ) : (
                                <>
                                    <FaRegHeart style={{ fontSize: '30px', margin: '0 20px',marginRight: '10px', cursor: 'pointer'}} onClick={() => {
                                        handleLike(postDetailInfo.postId, postDetailInfo.userId)
                                        addInterest({
                                            postId: postDetailInfo.postId
                                        })
                                        }}
                                    /> 
                                        <div style={{cursor: 'pointer',fontSize: '16px'}} onClick={() => {setIsModalVisibleLikes(true)}}>{liked ? `Liked by you and ${numLikes-1} peoples` : `Liked by ${numLikes} peoples`}</div>
                                </>
                            )
                        }
                    </div>
                    
                    <div className={cx('time-create')}>
                        {moment(postDetailInfo?.createdAt).format('YYYY-MM-DD HH-MM')}
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
            </>
            }
         </div>
         <Modal title={`Likes (${postDetailInfo?.likes})`} visible={isModalVisibleLikes} footer={null} onCancel={() => setIsModalVisibleLikes(false)} style={{borderRadius: '10px'}}>
                <InfinityList  typeList="likes" queryAPI={async (params: any) => await getLikeOfPots(params)}  postId={postDetailInfo?.postId}/>
            </Modal>
         </>
         
  );
};

export default PagePostDetail;
