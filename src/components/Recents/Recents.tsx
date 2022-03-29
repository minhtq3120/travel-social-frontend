import { Button, Form, Input, Tag } from 'antd';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import styles from 'src/styles/Recents.module.scss';
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
import Avatar from 'antd/lib/avatar/avatar';
const cx = classNames.bind(styles);

const Recent = () => {
    return (
        <div className={cx('recent-container')}>
            <img src={`https://assets.traveltriangle.com/blog/wp-content/uploads/2016/07/limestone-rock-phang-nga-1-Beautiful-limestone-rock-in-the-ocean.jpg`}
             alt="img" className={cx('img')}/> 
             <div className={cx('info')}>
                <Avatar src={''} className={cx(`avatar`)}/>
                <div className={cx('detail')}>
                    <div className={cx('name')}>{`Tran Quang Minh`}</div>
                    <div className={cx('time')}>{`2h ago`}</div>
                </div>
            </div>
            <div className={cx('location-name')}>
                Dubai
            </div>
            <div className={cx('location-pos')}>
                <MdLocationOn size={45} className={cx(`localtion-icon`)}/>
            </div>
        </div>
    )
}

const Recents = (props: any) => {
    const temp = [
        {
            id:1,
            url: 'haha'
        },
        {
            id:2,
            url: 'haha'
        },
        {
            id:3,
            url: 'haha'
        },
        {
            id:4,
            url: 'haha'
        },
        {
            id:5,
            url: 'haha'
        },
        {
            id:6,
            url: 'haha'
        },

    ]
    const [images, setImages] = useState<any>([])
    const socket: any = useSelector((state: RootState) => state.wallet.socket);


    // useEffect(() => {
    //     if(props?.item.files?.length>0){
    //         setImages(props?.item.files)
    //     }
    // },[props?.item])

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

  

    return (
        <React.Fragment>
        <div className={cx(`recents-container`)}>
            <div className={cx(`recents-header`)}>
            Recents
            </div>
            
            <div className={cx(`recents-body`)}>
                {
                    temp.map((item, index) => {
                        return (
                            <Recent key={index}/>
                        )
                    })
                }
            </div>
        </div>
        </React.Fragment>
    );
};

export default Recents;
