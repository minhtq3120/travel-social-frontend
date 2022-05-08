import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select, Tag, Tooltip, Upload, Switch, message, notification, InputNumber, Modal, Tabs, Spin } from 'antd';
import classNames from 'classnames/bind';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AiOutlineSetting } from 'react-icons/ai';
import { BsPersonCircle } from 'react-icons/bs';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import closeImg from 'src/assets/icon/close-icon.svg';
import Logo from 'src/assets/MadLogo.png';
import BaseButton from 'src/components/Button';
import FloatLabel from 'src/components/FloatingLabel/FloatingLabel';
import InfinityList from 'src/components/InfinityScroll/InfinityScroll';
import { OPP_NO_ADMIN, OPP_SOMETHING_WRONG, WRONG_EMAIL_OR_PASSWORD } from 'src/constant/message';
import { RootState } from 'src/redux/store';
import { setAccountAddress, setConnected, setLoginResult } from 'src/redux/WalletReducer';
import {  activate, login, register } from 'src/services/auth-service';
import { getFollowers, getFollowing } from 'src/services/follow-service';
import { getNewFeedPost } from 'src/services/post-service';
import { getCurrUserProfile } from 'src/services/user-service';
import styles from 'src/styles/ProfilePosts.module.scss';
import { getCurrentUser } from 'src/utils/utils';
import { FaRegComment, FaRegHeart, FaShareAlt,FaRegShareSquare , FaLocationArrow, FaHeart} from 'react-icons/fa';
import {BsFiles} from 'react-icons/bs'
import PostDetail from 'src/components/PostDetail/PostDetail';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
const sleep = (ms = 1500) => new Promise((resolve) => setTimeout(resolve, ms));

const cx = classNames.bind(styles);
const { TabPane } = Tabs;

const ProfilePosts = (props: any) => {
  const [dataSrc, setDataSrc] = useState([]);
  const [totalItem, setTotalItem] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [textSearch, setTextSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurentPage] = useState(0);
  const [isModalVisibleDetail, setIsModalVisibleDetail] = useState(false)
  const [postId, setPostId] = useState<any>(null)
  const [files, setFiles] = useState<any>([])
  const [item, setItem] = useState<any>(null)
  const [trigger, setTrigger] = useState<boolean>(false)
  

  useBottomScrollListener(() => {
    console.log('REACRT ENDNDNDN')
    handleFetchMore()

  });

  const handleFetchMore = async () => {
    //await sleep();
    setCurentPage(currentPage + 1)
  }

  const handleCancel = () => {
        setPostId(null)
        setFiles([])
        setItem(null)
        setIsModalVisibleDetail(false)
    };
  const getNewfeed = async (page?: number) => {
    try {
      const params = {
        page: page,
        postLimit: 'profile',

      }
      if(props?.userId?.userId) {
        params["userId"] = props.userId.userId
      }
      const result = await getNewFeedPost(params)

      const dataSource = _.get(result, 'data.items', []);
      const totalItem = _.get(result, 'data.meta.totalItems', 0);
      const totalPages = _.get(result, 'data.meta.totalPages', 0);
      const itemsPerPage = _.get(result, 'data.meta.perPage', 0);
      const currentPage = _.get(result, 'data.meta.currentPage', 0);

      let temp = dataSrc.concat(dataSource)
      setDataSrc(temp);

      setTotalItem(parseInt(totalItem));
      setTotalPage(parseInt(totalPages));
      setItemsPerPage(parseInt(itemsPerPage));
      setCurentPage(parseInt(currentPage));

    }
    catch (err) {
      return err
    }
  }

  useEffect(() => {
    setDataSrc([])
    if(currentPage === 0) setTrigger(!trigger)
    setCurentPage(0)
  }, [props?.userId?.userId])

  useEffect(() => {
    getNewfeed(currentPage);
  }, [currentPage, trigger]);


  return (
    <>
    <div className={cx('profile-posts-container')}>
      <div className={cx('profile-posts-child-container')}>

      {
        dataSrc?.length> 0 ?dataSrc?.map((item: any, index: any) => {
          return (
            <div key={index} className={cx('profile-post')} onClick={() => {
                setItem(item)
                setIsModalVisibleDetail(true)
                setFiles(item.files)
                setPostId(item.postId)
              }}>
              {
                item?.files[0]?.type === "image" ? (
                  <>
                    <div className={cx('img-container')}>
                      <img src={item?.files[0]?.url} alt="img" className={cx('img')}/> 
                      <div className={cx('overlay')}>
                        <div className={cx('text')}>
                          <FaRegHeart style={{margin: '0 10px'}} />{`${item.likes}`}
                          <FaRegComment style={{margin: '0 10px'}} />{`${item.comments}`}
                          <BsFiles style={{margin: '0 10px'}}/>{`${item.files.length}`}
                        </div>
                      </div>
                    </div>
                  </>
                )
                : (
                  <>
                    <div className={cx('img-container')} style={{borderRadius: '10px'}}>
                      <ReactPlayer
                        url={item?.files[0]?.url || ''}
                        // light="https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg"
                        light={true}
                        playing={false}
                        loop={true}
                        controls={true}
                        width="100%"
                        height="100%"
                        className={cx('img')}
                        style={{borderRadius: '10px'}}

                        />
                      <div className={cx('overlay')}>
                        <div className={cx('text')}>
                          <FaRegHeart style={{margin: '0 10px'}} />{`${item.likes}`}
                          <FaRegComment style={{margin: '0 10px'}} />{`${item.comments}`}
                          <BsFiles style={{margin: '0 10px'}}/>{`${item.files.length}`}
                        </div>
                      </div>
                    </div>
                  </>
                )
                
                
              }
            </div>
          )
        }) : null
      }
      {
      totalPage - 1 === currentPage || dataSrc?.length === 0 ? null : (
        <Spin size="large" style={{margin: '15px 0'}}/>
      )}
      
      </div>
    </div>
    {
      isModalVisibleDetail && 
       <Modal visible={isModalVisibleDetail} footer={[]} onCancel={handleCancel} style={{borderRadius: '20px', padding: '0px !important'}} width={1400}  closable={false} bodyStyle={{padding: '0'}}>
        {files && postId ? <PostDetail images={files} postId={postId} info={item}/> : null}
      </Modal>
    }
    
    </>
  );
};

export default ProfilePosts;
