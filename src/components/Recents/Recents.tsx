import { Button, Form, Input, Spin, Tag } from 'antd';
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
import Maps from '../GoogleMap/CurrentLocation';
const cx = classNames.bind(styles);



const Recents = (props: any) => {
    const temp = [
        {
            id:1,
            url: 'https://www.intrepidtravel.com/adventures/wp-content/uploads/2017/02/Italy-Cinque-Terra-coast-houses-Intrepid-Travel.jpg'
        },
        {
            id:2,
            url: 'https://d3hne3c382ip58.cloudfront.net/files/uploads/bookmundi/resized/cmsfeatured/places-to-travel-in-2018-1522385995-785X440.jpg'
        },
        {
            id:3,
            url: 'https://assets.traveltriangle.com/blog/wp-content/uploads/2016/07/limestone-rock-phang-nga-1-Beautiful-limestone-rock-in-the-ocean.jpg'
        },

    ]




    const locactionVisited = [
        {
            lat:10.835605681883571, lng:106.65673978501039, label: "position 1"
        }, 
        {
            lat: 20.11520273105653, lng: 105.91904437239343, label: "position 2"
        }, 
        {
            lat:19.76182095856043 , lng: 105.78529397239737, label: "position 3"
        },
        {
            lat:18.76182095856043 , lng: 105.78529397239737, label: "position 3"
        },
         {
            lat:16.234182095856043 , lng: 107.78529397239737, label: "position 3"
        },
        {
            lat:13.561180692551591 , lng: 109.19309496872849, label: "position 3"
        },
         {
            lat:12.630239302777985, lng: 108.70969647059705, label: "position 3"
        },
    ]

    


    const [images, setImages] = useState<any>([])
    const [isModalVisibleMap, setIsModalVisibleMap] = useState(false);
    const socket: any = useSelector((state: RootState) => state.wallet.socket);
    const [centerVisited, setCenterVisited] = useState<any>(null)

    const handleCancel = () => {
        setIsModalVisibleMap(false)
    };


    useEffect(() => {
        if(locactionVisited) {
            let tempLat = 0
            let tempLng = 0
            locactionVisited.forEach((item) => {
                tempLat += item.lat;
                tempLng += item.lng
            })
            setCenterVisited([tempLat / locactionVisited.length, tempLng /  locactionVisited.length])
        }
    }, [])

    const properties = {
        duration: 5000,
        autoplay: false,
        transitionDuration: 500,
        arrows: true,
        infinite: true,
        easing: "ease",
        indicators: false
    };

    const Slideshow = () => {
        return (
         <div className={`slide-container ${cx('slider-container2')}`} >
            <Slide
                {...properties}
            >
                    {
                    temp?.map((item: any, index: any) => {
                        return (
                           <div className={cx('recent-container')} key={index}>
                                <img src={`${item.url}`}
                                alt="img" className={cx('img')}/> 
                                {/* <div className={cx('info')}>
                                    <Avatar src={''} className={cx(`avatar`)}/>
                                    <div className={cx('detail')}>
                                        <div className={cx('name')}>{`Tran Quang Minh`}</div>
                                        <div className={cx('time')}>{`2h ago`}</div>
                                    </div>
                                </div> */}
                                <div className={cx('location-name')}>
                                    Dubai
                                </div>
                                {/* <div className={cx('location-pos')}>
                                    <MdLocationOn size={45} className={cx(`localtion-icon`)}/>
                                </div> */}
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
                <div className={cx(`left`)}>Recents visited
                </div>
                <div className={cx(`right`)} onClick={() => {setIsModalVisibleMap(true)}}>View all
                </div>
            </div>
            <div className={cx(`recent-body`)}>
                <Slideshow />
            </div>
        </div>

        <Modal visible={isModalVisibleMap} footer={null} onCancel={handleCancel} style={{borderRadius: '20px', padding: '0px !important'}} width={1200} closable={false} bodyStyle={{padding: '0'}}>
            {  locactionVisited && centerVisited ? <Maps lat={centerVisited[0]} lng={centerVisited[1]}  locationVisited={locactionVisited }/> : <Spin size='large'/> }
        </Modal>
        </React.Fragment>
    );
};

export default Recents;
