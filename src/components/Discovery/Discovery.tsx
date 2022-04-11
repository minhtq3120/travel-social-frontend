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
import { getDiscovery, getDiscoveryDetail } from 'src/services/place-service';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
 import _ from 'lodash';
import { sleep } from 'src/containers/Newfeed/Newfeed';
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

const Discovery = (props: any) => {
    const handleFetchMore = async () => {
    await sleep();
        setCurentPage(currentPage + 1)
    }
    const scrollRef: any = useBottomScrollListener(() => {
        // console.log("REACH BOTTOM")
        totalPage - 1 === currentPage || data?.length === 0 ? null : handleFetchMore()
    });

    const [images, setImages] = useState<any>([])
    const [isModalVisibleMap, setIsModalVisibleMap] = useState(false);
    const socket: any = useSelector((state: RootState) => state.wallet.socket);
    const [centerVisited, setCenterVisited] = useState<any>(null)
    const [placeId, setPlaceId] = useState<null | string>(null)
    const [postId, setPostId] = useState<null | string>(null)
    const [discovery, setDiscovery] = useState([])

    const [data, setData] = useState<any>([]);
    const [totalItem, setTotalItem] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [textSearch, setTextSearch] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurentPage] = useState(0);
    

    const handleCancel = () => {
        setIsModalVisibleMap(false)
        setPlaceId(null)
        setData([])
    };
   
    useEffect(() => {
        const fetchDiscovery  = async () => {
            let params = {}
            const rs = await getDiscovery(params)
            if(rs) {
                const dataSource = _.get(rs, 'data');
                setDiscovery(dataSource)

            }
        }

        fetchDiscovery()
    }, [])

    const fetchDiscoveryDetail  = async (page?: number) => {
        let params = {
            placeId,
            page: page
        }
        const result = await getDiscoveryDetail(params)

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
    }
    
    useEffect(() => {
        if(placeId) fetchDiscoveryDetail(currentPage)
    }, [placeId, currentPage])

    useEffect(() => {
        let temp: any  = []
        if(data?.length > 0) data?.map((item) => {
            return temp.push({
                src: item?.files[0].url,
                thumbnail: item?.files[0].type ===  'image' ? item.files[0].url  : "https://c8.staticflickr.com/9/8104/28973555735_ae7c208970_n.jpg",
                thumbnailWidth: Math.floor(Math.random() * (450 - 250) ) + 250,
                thumbnailHeight: 300,
                // caption: <><Avatar src={item?.userAvatar}/> <p>{item?.userDisplayName}</p></>,
                thumbnailCaption: <div style={{display: 'flex', flexDirection: 'row' ,justifyContent: 'flex-start',  alignItems: 'center', alignContent: 'center', margin: '10px 0'}}>
                    <Avatar src={item?.userAvatar}/> <div style={{fontWeight: 'bold', opacity: '0.7', margin: '0 10px'}}>{item?.userDisplayName}</div></div>,
            })
        })
        setImages(temp)
    }, [data])

    useBottomScrollListener(() => {
        console.log('REACRT ENDNDNDN')
        // handleFetchMore()

    });

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
                    discovery?.map((item: any, index: any) => {
                        return (
                           <div className={cx('recent-container')} key={index} onClick={() => {
                                setPlaceId(item._id)
                                setIsModalVisibleMap(true)
                            }}>
                                
                                {
                                    item?.post?.mediaFiles[0].type === "image" ? <img src={`${item?.post?.mediaFiles[0].url}`} alt="img" className={cx('img')}/> 
                                    : <ReactPlayer
                                        url={item?.post?.mediaFiles[0].url}
                                        playing={false}
                                        loop={true}
                                        controls={true}
                                        width="100%"
                                        height="100%"
                                        />
                                }
                                <div className={cx('location-pos')}>
                                    <MdLocationOn size={30} className={cx(`location-icon`)}/>
                                </div>
                                <div className={cx('location-name')}>
                                    {item?.name}
                                </div>
                                <div className={cx('visited')}>
                                    <div className={cx('icon')}>
                                        <BsFiles size={25} color={'white'}/>
                                    </div>
                                    <div className={cx('count')}>
                                        {item?.relatedPosts} 
                                    </div>
                                </div>
                                <div className={cx('visited-user')}>
                                    <Avatar src={item?.suggestedVisitors[0]?.avatar} className={cx(`mot`)} size={40}/>
                                    <Avatar src={item?.suggestedVisitors[1]?.avatar} className={cx(`hai`)} size={40}/>
                                    {
                                        item?.suggestedVisitors?.length <= 3 ? <Avatar src={item?.suggestedVisitors[2]?.avatar} className={cx(`ba`)} size={40}/> : (
                                            <div className={cx(`ba-more`)}>
                                                <div className={cx(`num-more`)}>{`+${item?.visits - 2}`}</div>
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
                height: '800px',
                border: "1px solid #ddd",
                overflow: "scroll",
                textAlign: "center",
                background: "white"
            }}
            ref={scrollRef }
            >
                <Gallery
                    images={images}
                    enableImageSelection={false}
                    rowHeight={300}
                    margin={10}
                    onClickThumbnail={(e) => {console.log('asdfjkladsfkl', e)}}
                />
                {
                totalPage - 1 === currentPage || data?.length === 0 ? null : (
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
                        <Spin size="large" style={{margin: '15px 0', padding: '5px 0'}}/>
                    </div>  
                )}
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
               {discovery?.length>0 ?  <Slideshow />  : <Spin size='large'/> }
            </div>
        </div>

        <Modal visible={isModalVisibleMap} footer={null} onCancel={handleCancel} style={{borderRadius: '20px', padding: '0px !important'}} width={1200} closable={false} bodyStyle={{padding: '0'}}>
            {  images?.length >0 ? (
                <GridDiscovery />
            ): <Spin size='large'/> }
        </Modal>
        </React.Fragment>
    );
};

export default Discovery;
