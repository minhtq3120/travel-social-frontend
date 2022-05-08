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
import _ from 'lodash';
import { getRecentsVisited } from 'src/services/place-service';
import { sleep } from 'src/containers/Newfeed/Newfeed';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';

const cx = classNames.bind(styles);



const Recents = (props: any) => {


    const [data, setData] = useState<any>([]);
    const [totalItem, setTotalItem] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [textSearch, setTextSearch] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurentPage] = useState(0);
    const [latLng, setLatLng] = useState<any>(null)

    const [mapType, setMapType] = useState<any>('')
    const [isModalVisibleMapSingle, setIsModalVisibleMapSingle] = useState(false)
   
    const [loading,setLoading] = useState(false)
    
    const [dataVisited, setDataVisited] = useState<any>([]);

    const fetchRecents  = async (page?: number) => {
        let params = {
            page: page
        }
        setLoading(true)
        const result = await getRecentsVisited(params)

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
            setLoading(false)
        }
        setLoading(false)
    }
    
    useEffect(() => {
        console.log('WTFFFFFFFFFFFFF', currentPage)
        fetchRecents(currentPage)
    }, [currentPage])

    useEffect(() => {
        let temp: any = []
        if(data?.length > 0 ) {
            data?.map((item) => {
                return temp.push({
                    lat: item?.place?.coordinate?.latitude,
                    lng: item?.place?.coordinate?.longitude,
                    data: item
                })
            })
        }
        setDataVisited(temp)
    }, [data])

    const [images, setImages] = useState<any>([])
    const [isModalVisibleMap, setIsModalVisibleMap] = useState(false);
    const socket: any = useSelector((state: RootState) => state.wallet.socket);
    const [centerVisited, setCenterVisited] = useState<any>(null)

    const handleCancel = () => {
        setIsModalVisibleMap(false)
        setIsModalVisibleMapSingle(false)
        setLatLng(null);
        setMapType('')
    };


    useEffect(() => {
        if(dataVisited) {
            let tempLat = 0
            let tempLng = 0
            dataVisited.forEach((item) => {
                tempLat += item.lat;
                tempLng += item.lng
            })
            setCenterVisited([tempLat / dataVisited.length, tempLng /  dataVisited.length])
        }
    }, [dataVisited])

    const properties = {
        duration: 3000,
        autoplay: true,
        transitionDuration: 500,
        arrows: true,
        infinite: true,
        easing: "ease",
        indicators: false
    };

    const Slideshow = () => {
        return (
            
         <div className={`slide-container ${cx('slider-container2')}`} >
             { data?.length === 0 ? (<>
                    <div className={cx('recent-container')} style={{height: '150px'}}>
                        Bạn chưa đi địa điểm nào
                    </div>
                    </>) : 
            <Slide
                {...properties}
            >
                    {
                   data?.map((item: any, index: any) => {
                        return (
                           <div className={cx('recent-container')} key={index}>
                                <img src={`${item?.lastestPost?.mediaFiles[0]?.url || 'https://www.intrepidtravel.com/adventures/wp-content/uploads/2017/02/Italy-Cinque-Terra-coast-houses-Intrepid-Travel.jpg'}`}
                                alt="img" className={cx('img')}/> 
                                <div className={cx('location-name')}>
                                    {item?.place?.name}
                                </div>
                                <div className={cx('location-info')} 
                                    onClick={() => {
                                    setIsModalVisibleMapSingle(true)
                                    setLatLng({
                                        lat: item.place?.coordinate?.latitude,
                                        lng: item.place?.coordinate?.longitude,
                                    })
                                }}
                                >
                                    {/* <div className={cx('locate')}>Location</div> */}
                                    <MdLocationOn size={30} className={cx(`locate`)}/>
                                    <div className={cx('city')}>{item?.place?.name}</div>
                                </div>
                            </div>
                        )
                    })
                }
             </Slide>}
        </div>
        )
    }
  
    return (
        <React.Fragment>
        <div className={cx(`recents-container`)}>
            <div className={cx(`recents-header`)}>
                <div className={cx(`left`)}>Recents visited
                </div>
                {
                    dataVisited?.length > 0 ? <div className={cx(`right`)} onClick={() => {setIsModalVisibleMap(true)}}>View all
                </div> : null
                }
                
            </div>
            <div className={cx(`recent-body`)}>
                 {!loading && dataVisited && centerVisited ? <Slideshow /> : <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}><Spin size='large' style={{height: '100px'}}/></div> }
            </div>
        </div>

        <Modal visible={isModalVisibleMap} footer={null} onCancel={handleCancel} style={{borderRadius: '20px', padding: '0px !important'}} width={1200} closable={false} bodyStyle={{padding: '0'}}>
            { !loading && dataVisited && centerVisited ? <Maps lat={centerVisited[0]} lng={centerVisited[1]}  locationVisited={dataVisited }/> : <Spin size='large'/> }
        </Modal>
         <Modal visible={isModalVisibleMapSingle} footer={null} onCancel={handleCancel} style={{borderRadius: '20px', padding: '0px !important'}} width={1200} closable={false} bodyStyle={{padding: '0'}}>
            {  latLng ? <Maps lat={latLng.lat} long={latLng.lng} mapType={mapType} setMapType={setMapType}/> : <Spin size='large'/> }
        </Modal>
        </React.Fragment>
    ); 
};

export default Recents;
