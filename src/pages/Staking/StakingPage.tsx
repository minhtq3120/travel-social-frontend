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
import { sleep } from 'src/containers/Newfeed/Newfeed';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import { getPostDetail } from 'src/services/post-service';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { SEND_NOTIFICATION } from 'src/components/Notification/Notification';
import { NotificationAction } from '../Layout/layout';
import InfinityList from 'src/components/InfinityScroll/InfinityScroll';

const cx = classNames.bind(styles);
const ContainerHeight = 850;


const StakingPage = (props: any) => {

    const handleFinish = async (values) => {
        try {
            
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={cx('staking-container')}>
            <div className={cx('pool-container')}>
                <div className={cx('totalstaked')}>
                    10000 MSN
                </div>
                <div className={cx('pool-lockduration')}>
                    100000000s
                </div>
                <div className={cx('pool-apr')}>
                    25%
                </div>
                <div className={cx('pool-minStake')}>
                    200000 MSN
                </div>
                 <Button className={cx('btn-next')} onClick={() => {
            
                     }}>
                    Stake now
                </Button>
            </div>
            
        </div>
         
  );
};

export default StakingPage;
