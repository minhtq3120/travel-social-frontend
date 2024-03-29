import React, { useState, useEffect } from 'react';
import { List, message, Avatar, Skeleton, Divider, Button, Spin } from 'antd';
import VirtualList from 'rc-virtual-list';
import { followId, getFollowers, getFollowing, unfollowId } from 'src/services/follow-service';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import { GoPrimitiveDot } from 'react-icons/go';
import { getNotifi, getNotifiDetail } from 'src/services/notifi-service';
import { getCommentsOfPost } from 'src/services/comment-service';
const fakeDataUrl =
  'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
const ContainerHeight = 500;
export const SEND_NOTIFICATION = 'sendNotification';
export const RECEIVE_NOTIFICATION = 'receiveNotification';
import { io } from "socket.io-client";
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { sleep } from 'src/containers/Newfeed/Newfeed';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import { useHistory } from 'react-router-dom';


const NotificationList = (props: any) => {
  const handleFetchMore = async () => {
    //await sleep();
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
  const [loading, setLoading] = useState(false)

  const history = useHistory()
  
  const noti: any = useSelector((state: RootState) => state.wallet.notification);

  const appendData =  async (page?: number) => {
     
    let params = {}
      params = {
        page: page
      }
      setLoading(true)
      // const result = await getNotifi(params)
      const result = await getNotifi(params)
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

        // let temp = data.concat(dataSource)
        // setData(temp)
        setLoading(false)
      }
    
  };

  useEffect(() => {
    appendData(currentPage);
  }, [currentPage, trigger]);

   useEffect(() => {
     if(noti) {
      setData([])
      setCurentPage(0)
      appendData(currentPage);
     }
     
  }, [noti]);

  const getNotificationDetailInfo = async (notificationId: string, userId: string) => {
    try {
      const dataNoti = await getNotifiDetail({
         notificationId: notificationId
      })
      const result = _.get(dataNoti, 'data', []);

      if(result?.action === 'follow') {
        history.push(`profile?userId=${userId}`)
      }
      if(result?.action === 'comment' || result?.action === 'like'|| result?.action === 'replyComment') {
        history.push(`postDetail?postId=${result?.data?.postId}`)
      }
    }
    catch (err) {
      return err
    }
  }

  return (
    <div  style={{width: '450px', height: '550px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center'}}>
      <div style={{fontWeight: 'bold', fontSize: '16px', padding: '5px 15px'}}>
        Notifications
      </div>
      <div ref={scrollRef }  style={{padding: '0 5px',width: '100%',height: '93%', display: 'flex', flexDirection: 'column', alignItems: 'center',alignContent:'flex-start', overflowY: 'scroll', overflowX: 'hidden'}}>
          {
            data.map((item: any, index: any) => (
              <div key={index}
               style={{borderLeft: item?.seen ? '' : '5px solid#68d1c8',width: '100%',display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', margin: '5px 0'}}
               onClick={() =>  [
                 getNotificationDetailInfo(item?.notificationId, item?.sender?._id)
               ]}
               >
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'center', alignItems: 'center', padding: '20px 15px', cursor: 'pointer'}}>
                  <Avatar src={item?.sender?.avatar} />
                  <div style={{fontWeight: 'bold', fontSize: '15px', margin: '0 10px', padding: '5px 0'}}>{item?.sender?.displayName}</div>
                  <div> {item?.action === 'follow' ? 'bắt đầu theo dõi bạn' : item?.action === 'like' ? `thích bài viết của bạn`
                  : item?.action === 'comment' ? `bình luận bài viết của bạn` :  item?.action === 'replyComment' ? `trả lời bình luận của bạn` : null}
                </div>
                </div>
                <div>
                  {item?.seen ? null: <GoPrimitiveDot color='#68d1c8'style={{marginRight: '20px'}} />}
                </div>
                
              </div>
            ))
            }
            {
          totalPage - 1 === currentPage || data?.length === 0 ? null : (
              <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
                  <Spin size="large" style={{margin: '15px 0', padding: '5px 0'}}/>
              </div>  
          )}
      </div>
      
    </div>
   
  );
};

export default NotificationList