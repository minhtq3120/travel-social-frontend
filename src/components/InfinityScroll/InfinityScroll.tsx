import React, { useState, useEffect, useCallback } from 'react';
import { List, message, Avatar, Skeleton, Divider, Button, Spin } from 'antd';
import VirtualList from 'rc-virtual-list';
import { followId, getFollowers, getFollowing, unfollowId } from 'src/services/follow-service';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RiRestaurant2Line } from 'react-icons/ri';

const fakeDataUrl =
  'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
const ContainerHeight = 500;

const SEND_NOTIFICATION = 'sendNotification';
import { io } from "socket.io-client";
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { NotificationAction } from 'src/pages/Layout/layout';

import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import { sleep } from 'src/containers/Newfeed/Newfeed';
import { useHistory } from 'react-router-dom';

import classNames from 'classnames/bind';
import styles from 'src/styles/UserList.module.scss';
const cx = classNames.bind(styles);


const FakeFollow2 = (props) => {
  const socket: any = useSelector((state: RootState) => state.wallet.socket);

  const [isFollow, setIsFollow] = useState<boolean>((props?.item?.followed && !props?.item?.isCurrentUser && (props?.typeList === 'followers' || props?.typeList === 'followings')) || 
                (props?.item?.isFollowed && props?.typeList === 'likes'))
  const handleFollow  = async (userId: string) => {
    try {
      const follow = await followId(userId)
      socket.emit(SEND_NOTIFICATION, {
        receiver: userId,
        action: NotificationAction.Follow
      })
      return follow
    }
    catch (err){
      console.log(err)
    }
  }

  const handleUnFollow  = async (userId: string) => {
    try {
      const unfollow = await unfollowId(userId)
      return unfollow
    }
    catch (err){
      console.log(err)
    }
  }
  return (
    isFollow? (
      <Button className={cx('button')} onClick={() => {
        setIsFollow(!isFollow)
        handleUnFollow(props?.item?.userId)
      }}>
        Unfollow
      </Button>
    ) : (
      <Button className={cx('button')}  onClick={() => {
          setIsFollow(!isFollow)
         handleFollow(props?.item?.userId)
        }}> 
        Follow
      </Button>
      )
  )
}


const InfinityList = (props: any) => {

  

  const handleFetchMore = async () => {
    //await sleep();
    setCurentPage(currentPage + 1)
  }
  const scrollRef: any = useBottomScrollListener(() => {
     totalPage - 1 === currentPage || data?.length === 0 ? null : handleFetchMore()
  });
  const history = useHistory()
  const [data, setData] = useState<any>([]);
  const [totalItem, setTotalItem] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [textSearch, setTextSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurentPage] = useState(0);
  const [trigger, setTrigger] = useState(false)
  const socket: any = useSelector((state: RootState) => state.wallet.socket);

  const appendData =  async (page?: number) => {
    let params = {}
    if(props?.typeList === 'followers' || props?.typeList === 'followings') {
      params = {
        page: page
      }
    }
    if(props?.typeList === 'likes' ) {
      params = {
        postId: props.postId,
        page: page
      }
    }
    if(props?.queryAPI){
      const result = await props?.queryAPI(params)
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
    
  };


  useEffect(() => {
    appendData(currentPage);
  }, [currentPage, trigger]);

  const onScroll = e => {
    if(data.length === totalItem || currentPage === totalPage)return
    if (e.target.scrollHeight - e.target.scrollTop === ContainerHeight && currentPage < totalPage) {
      setCurentPage(currentPage+1)
    }
  };


  return (
     <div  ref={scrollRef } style={{width: '100%',height: '700px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', overflowY: 'scroll', overflowX: 'hidden'}} >

      {data?.map((item: any, index: any) => {
                return (
                    <div key={index} className={cx('user-list-container')}>
                      <div className={cx('user-left')}>
                        <div onClick={() => {
                             history.push(`/profile?userId=${item.userId}`)
                          }}>
                          <Avatar src={item?.avatar} size={40} className={cx('user-avatar')}
                          
                        />
                        </div>
                        
                        <div className={cx('user-info')}> 
                           <div className={cx('name')} onClick={() => {
                             history.push(`/profile?userId=${item.userId}`)
                          }}>{item?.displayName}</div>
                        </div>
                       
                      </div>
                      <div className={cx('user-right')}> 
                        <FakeFollow2 item={item} typeList={props?.typeList}/>
                      </div>
                    </div>
                  
                )
              })}
      {
      totalPage - 1 === currentPage || data?.length === 0 ? null : (
        <Spin size="large" style={{margin: '15px 0', padding: '5px 0'}}/>
      )}
    </div>
  )

};

export default InfinityList