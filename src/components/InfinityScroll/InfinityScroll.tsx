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
 

const InfinityList = (props: any) => {

  

  const handleFetchMore = async () => {
    await sleep();
    setCurentPage(currentPage + 1)
  }
  const scrollRef: any = useBottomScrollListener(() => {
     totalPage - 1 === currentPage || data?.length === 0 ? null : handleFetchMore()
  });

  const [data, setData] = useState<any>([]);
  const [totalItem, setTotalItem] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [textSearch, setTextSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurentPage] = useState(0);
  const [trigger, setTrigger] = useState(false)
  const socket: any = useSelector((state: RootState) => state.wallet.socket);

  console.log(data, '-------', totalPage, '-------', currentPage)
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

  const handleFollow  = async (userId: string) => {
    try {
      const follow = await followId(userId)
      socket.emit(SEND_NOTIFICATION, {
        receiver: userId,
        action: NotificationAction.Follow
      })
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
      const unfollow = await unfollowId(userId)
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
    if(data.length === totalItem || currentPage === totalPage)return
    if (e.target.scrollHeight - e.target.scrollTop === ContainerHeight && currentPage < totalPage) {
      setCurentPage(currentPage+1)
    }
  };


  return (
     <div  ref={scrollRef } style={{width: '100%',height: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', overflowY: 'scroll', overflowX: 'hidden'}} >
      {
      data.map((item: any, index: any) => (
            <div key={index} style={{width: '100%',display:'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0'}}>
              <div>
                <Avatar src={item?.avatar} />
                <a href="https://ant.design">{item?.displayName}</a>
                <div>{item?.userId}</div>
              </div>
              <div>
                {
                (item?.followed && !item?.isCurrentUser && (props?.typeList === 'followers' || props?.typeList === 'followings')) || 
                (item?.isFollowed && props?.typeList === 'likes')
                ? (
                  <Button onClick={() => {handleUnFollow(item.userId)}}>
                    Unfollow
                  </Button>
                ) : (
                  <Button onClick={() => {handleFollow(item.userId)}}> 
                    Follow
                  </Button>
                  )
                }
              </div>
            </div>
        ))
      }
      {
      totalPage - 1 === currentPage || data?.length === 0 ? null : (
        <Spin size="large" style={{margin: '15px 0', padding: '5px 0'}}/>
      )}
    </div>
  )

  return (
    <List>
      <VirtualList
        data={data}
        height={ContainerHeight}
        itemHeight={47}
        itemKey="email"
        onScroll={onScroll}
      >
        {(item: any, index: any) => (
          <List.Item key={index}>
            <List.Item.Meta
              avatar={<Avatar src={item?.avatar} />}
              title={<a href="https://ant.design">{item?.displayName}</a>}
              description={item?.userId}
            />
            <div>
              {
              (item?.followed && !item?.isCurrentUser && (props?.typeList === 'followers' || props?.typeList === 'followings')) || 
              (item?.isFollowed && props?.typeList === 'likes')
              ? (
                <Button onClick={() => {handleUnFollow(item.userId)}}>
                  Unfollow
                </Button>
              ) : (
                <Button onClick={() => {handleFollow(item.userId)}}> 
                  Follow
                </Button>
                )
              }
            </div>
          </List.Item>
        )}
      </VirtualList>
    </List>
  );
};

export default InfinityList