import { Button, Form, Input, Spin, Tag } from 'antd';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import styles from 'src/styles/Discovery.module.scss';
import { SearchOutlined } from '@ant-design/icons';
import { BsThreeDots, BsPersonCircle,BsFlag, BsFiles } from 'react-icons/bs';
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
import Gallery from 'react-grid-gallery';
 
const cx = classNames.bind(styles);

const  shuffleArray = (array) => {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const images =  shuffleArray([
        {
            src: "https://c5.staticflickr.com/9/8768/28941110956_b05ab588c1_b.jpg",
            thumbnail: "https://c5.staticflickr.com/9/8768/28941110956_b05ab588c1_n.jpg",
            thumbnailWidth: 240,
            thumbnailHeight: 320,
            caption: "8H (gratisography.com)",
            thumbnailCaption: "8H"
        },
        {
            src: "https://c3.staticflickr.com/9/8583/28354353794_9f2d08d8c0_b.jpg",
            thumbnail: "https://c3.staticflickr.com/9/8583/28354353794_9f2d08d8c0_n.jpg",
            thumbnailWidth: 320,
            thumbnailHeight: 190,
            caption: "286H (gratisography.com)",
            thumbnailCaption: "286H"
        },
        {
            src: "https://c7.staticflickr.com/9/8569/28941134686_d57273d933_b.jpg",
            thumbnail: "https://c7.staticflickr.com/9/8569/28941134686_d57273d933_n.jpg",
            thumbnailWidth: 320,
            thumbnailHeight: 148,
            caption: "315H (gratisography.com)",
            thumbnailCaption: "315H"
        },
        {
            src: "https://c6.staticflickr.com/9/8342/28897193381_800db6419e_b.jpg",
            thumbnail: "https://c6.staticflickr.com/9/8342/28897193381_800db6419e_n.jpg",
            thumbnailWidth: 320,
            thumbnailHeight: 213,
            caption: "201H (gratisography.com)",
            thumbnailCaption: "201H"
        },
        {
            src: "https://c2.staticflickr.com/9/8239/28897202241_1497bec71a_b.jpg",
            thumbnail: "https://c2.staticflickr.com/9/8239/28897202241_1497bec71a_n.jpg",
            thumbnailWidth: 248,
            thumbnailHeight: 320,
            caption: "Big Ben (Tom Eversley - isorepublic.com)",
            thumbnailCaption: "Big Ben"
        },
        {
            src: "https://c7.staticflickr.com/9/8785/28687743710_3580fcb5f0_b.jpg",
            thumbnail: "https://c7.staticflickr.com/9/8785/28687743710_3580fcb5f0_n.jpg",
            thumbnailWidth: 320,
            thumbnailHeight: 113,
            caption: "Red Zone - Paris (Tom Eversley - isorepublic.com)",
            thumbnailCaption: (<span style={{color: "darkred"}}>Red Zone - <i>Paris</i></span>)
        },
        {
            src: "https://c6.staticflickr.com/9/8520/28357073053_cafcb3da6f_b.jpg",
            thumbnail: "https://c6.staticflickr.com/9/8520/28357073053_cafcb3da6f_n.jpg",
            thumbnailWidth: 313,
            thumbnailHeight: 320,
            caption: "Wood Glass (Tom Eversley - isorepublic.com)",
            thumbnailCaption: "Wood Glass"
        },
        {
            src: "https://c8.staticflickr.com/9/8104/28973555735_ae7c208970_b.jpg",
            thumbnail: "https://c8.staticflickr.com/9/8104/28973555735_ae7c208970_n.jpg",
            thumbnailWidth: 320,
            thumbnailHeight: 213,
            caption: "Flower Interior Macro (Tom Eversley - isorepublic.com)",
            thumbnailCaption: "Flower Interior Macro"
        }
    ])



const Discovery = (props: any) => {
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
        indicators: false,
        slidesToShow: 3,
        slidesToScroll: 1,
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
                                <div className={cx('location-pos')}>
                                    <MdLocationOn size={30} className={cx(`location-icon`)}/>
                                </div>
                                <div className={cx('location-name')}>
                                    Dubai
                                </div>
                                <div className={cx('visited')}>
                                    <div className={cx('icon')}>
                                        <BsFiles size={25} color={'white'}/>
                                    </div>
                                    <div className={cx('count')}>
                                        50+ 
                                    </div>
                                </div>
                                <div className={cx('visited-user')}>
                                    <Avatar src={''} className={cx(`mot`)} size={40}/>
                                    <Avatar src={''} className={cx(`hai`)} size={40}/>
                                    {
                                        index % 2 === 0  ? <Avatar src={''} className={cx(`ba`)} size={40}/> : (
                                            <div className={cx(`ba-more`)}>
                                                <div className={cx(`num-more`)}>+6</div>
                                            </div>
                                        )
                                        
                                    }
                                </div>
                                
                            </div>
                        )
                    })
                }
             </Slide>
        </div>
        )
    }

    const GridDiscovery = () => {
        return (
            <div style={{
                display: "block",
                minHeight: "1px",
                width: "100%",
                border: "1px solid #ddd",
                overflow: "auto",
                textAlign: "center",
                background: "white"
            }}>
                <Gallery
                    images={images}
                    enableImageSelection={false}
                />
            </div>
        );
    }

  

    return (
        <React.Fragment>
        <div className={cx(`recents-container`)}>
            <div className={cx(`recents-header`)}>
                <div className={cx(`left`)}>Discover
                </div>
                {/* <div className={cx(`right`)} onClick={() => {setIsModalVisibleMap(true)}}>View all
                </div> */}
            </div>
            <div className={cx(`recent-body`)}>
                <Slideshow />
            </div>
        </div>

        <Modal visible={isModalVisibleMap} footer={null} onCancel={handleCancel} style={{borderRadius: '20px', padding: '0px !important'}} width={1200} closable={false} bodyStyle={{padding: '0'}}>
            {  locactionVisited && centerVisited ? <div></div>: <Spin size='large'/> }
        </Modal>
        </React.Fragment>
    );
};

export default Discovery;
