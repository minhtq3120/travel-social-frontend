import { Button, Form, Input, List, Spin, Tag } from 'antd';
import classNames from 'classnames/bind';
import React, { useCallback, useEffect, useState } from 'react';
import styles from 'src/styles/PostDetail.module.scss';
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
import InfinityList from '../InfinityScroll/InfinityScroll';
import { followId, unfollowId } from 'src/services/follow-service';
import _ from 'lodash'
import { commentToPost, getCommentsOfPost, getReplyOfComment, replyToComment } from 'src/services/comment-service';
import VirtualList from 'rc-virtual-list';
import Avatar from 'antd/lib/avatar/avatar';
import Reply from './Reply';

const cx = classNames.bind(styles);
const ContainerHeight = 850;

const PostDetail = (props: any) => {
    const [data, setData] = useState<any>([]);

    const [totalItem, setTotalItem] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurentPage] = useState(0);
    const [trigger, setTrigger] = useState(false)
    const [replyCommentId, setReplyCommentId] = useState(null)

    const [form] = Form.useForm();
    const [showReply, setShowReply] = useState<any>([])


    const appendData =  async (page?: number) => {
        let params = {
            postId: props.postId,
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

    const handleFollow  = async (userId: string) => {
        try {
        console.log(userId)
        const follow = await followId(userId)
        console.log(follow)
        setCurentPage(0)
        setData([])
        setTrigger(!trigger)
        return follow
        }
        catch (err){
        console.log(err)
        }
    }

    const handleUnFollow  = async (userId: string) => {
        try {
        console.log(userId)
        const unfollow = await unfollowId(userId)
        console.log(unfollow)
        setCurentPage(0)
        setData([])
        setTrigger(!trigger)
        return unfollow
        }
        catch (err){
        console.log(err)
        }
    }

    useEffect(() => {
        appendData(currentPage);
    }, [currentPage, trigger]);

    const onScroll = e => {
        // if(data.length === totalItem || currentPage === totalPage)return
        // if (e.target.scrollHeight - e.target.scrollTop === ContainerHeight && currentPage < totalPage) {
        //     setCurentPage(currentPage+1)
        // }
    };


    const properties = {
        duration: 5000,
        autoplay: false,
        transitionDuration: 500,
        arrows: true,
        infinite: true,
        easing: "ease",
        indicators: true
    };

    const Itemmm = useCallback(( item: any, index: any) => {
        item = item.item
        return (
            <List.Item key={index} style={{width: '100%'}}>
                <div className={cx('comment-container')}>
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
                    {
                        item?.replys <= 0 ? null   
                        : showReply.includes(item?.commentId) ? <div className={cx('view-replys')} onClick={() => {
                            let temp = showReply.filter((it:any) => it !== item.commentId)
                            setShowReply(temp)
                        }}>
                            {`----- Hide replies (${item?.replys}) -----`}
                        </div>  : <div className={cx('view-replys')} onClick={() => {
                            let temp = showReply
                            temp.push(item?.commentId)
                            setShowReply(temp)
                        }}>
                            {`----- View replies (${item?.replys}) -----`}
                        </div> 
                    }
                    {
                        showReply.includes(item?.commentId) ? (
                            <Reply commentId={item?.commentId} form={form} setReplyCommentId={setReplyCommentId}/>
                        ) : null
                    }
                
                </div>
                
            </List.Item>
        )
    }, [showReply])

    const ListComment = useCallback(() => {
        return ( 
            <List style={{width:'100%'}}>
                <VirtualList
                style={{width: '100%'}}
                    data={data}
                    height={ContainerHeight}
                    itemHeight={47}
                    itemKey="email"
                    onScroll={onScroll}
                >
                    {(item: any, index: any) => (
                        <Itemmm item={item} index={index}/>
                    )}
                </VirtualList>
            </List>
        )
    }, [showReply, data])

    const Slideshow = () => {
        return (
        <div className={`slide-container ${cx('slider-container2')}`} >
            <Slide
                {...properties}
            >
                {
                    props?.images?.map((item: any, index: any) => {
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
            const addCommentToPost = {
                postId: props.postId,
                comment: values.comment
            }
            const addReplyComment = {
                commentId: replyCommentId,
                comment: values.comment
            }
            console.log(replyCommentId)

            if(replyCommentId) {
                await replyToComment(addReplyComment)
            }
            else await commentToPost(addCommentToPost)
            form.resetFields()
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={cx(`post-detail-container`)}>
            <div className={cx(`post-left`)}>
                <Slideshow/>
             </div>
             <div className={cx(`post-right`)}>
                <ListComment />
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
  );
};

export default PostDetail;
