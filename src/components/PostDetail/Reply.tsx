import { Button, Form, Input, List, Spin, Tag } from 'antd';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import styles from 'src/styles/Reply.module.scss';
import "react-slideshow-image/dist/styles.css";
import ReactPlayer from 'react-player';
import AwesomeSlider from 'react-awesome-slider';
import moment from 'moment';
import { getLikeOfPots, likePost, unLikePost } from 'src/services/like-service';
import Modal from 'antd/lib/modal/Modal';
import InfinityList from '../InfinityScroll/InfinityScroll';
import { followId, unfollowId } from 'src/services/follow-service';
import _ from 'lodash'
import { getCommentsOfPost, getReplyOfComment } from 'src/services/comment-service';
import VirtualList from 'rc-virtual-list';
import Avatar from 'antd/lib/avatar/avatar';

const cx = classNames.bind(styles);
const ContainerHeight = 700;

const Reply = (props: any) => {
    const [data, setData] = useState<any>([]);
    const [data2, setData2] = useState<any>([]);

    const [totalItem, setTotalItem] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurentPage] = useState(0);
    const [trigger, setTrigger] = useState(false)

    
    const appendData =  async (page?: number) => {
        let params = {
            commentId: props.commentId,
            page: page,
            perPage: 1000,
        }
        const result = await getReplyOfComment(params)
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


    useEffect(() => {
        appendData(currentPage);
    }, [currentPage, trigger]);

    const properties = {
        duration: 5000,
        autoplay: false,
        transitionDuration: 500,
        arrows: true,
        infinite: true,
        easing: "ease",
        indicators: true
    };

    return (
        data?.length > 0 ?
            <List 
            style={{padding: '0 30px', height: 'auto'}}
            dataSource={data}
            renderItem={(item: any, index: any) => {
                return (
                    <List.Item key={index}>
                        <div className={cx('comment-container')}>
                            <div className={cx('comment-info')}>
                                <Avatar src={item?.avatar} />
                                <div className={cx('name')}>{item?.displayName}</div>
                                <div className={cx('comment')}>{item?.comment}</div>

                            </div>
                            <div className={cx('comment-time-reply')}>
                                <div className={cx('time')}>{moment(item?.createdAt).format('YYYY-MM-DD HH-MM')}</div>
                                <div className={cx('reply')} onClick={() => {
                                    props.form.resetFields()
                                    props.setReplyCommentId(props.commentId)
                                    props.form.setFieldsValue({comment: `@${item.displayName} `})
                                }}>{`Reply `}</div>
                            </div>
                        </div>
                        
                    </List.Item>
                )
            
            }}
        /> : <Spin size="small" style={{marginLeft: '60px'}}/>
  );
};

export default Reply;
