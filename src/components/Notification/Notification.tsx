import React, { useState, useEffect } from 'react';
import { List, message, Avatar, Skeleton, Divider, Button, Spin } from 'antd';
import VirtualList from 'rc-virtual-list';
import { followId, getFollowers, getFollowing, unfollowId } from 'src/services/follow-service';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RiRestaurant2Line } from 'react-icons/ri';
import { getNotifi } from 'src/services/notifi-service';
import { getCommentsOfPost } from 'src/services/comment-service';

const fakeDataUrl =
  'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
const ContainerHeight = 500;

const NotificationList = (props: any) => {
  const [data, setData] = useState<any>([]);
  const [totalItem, setTotalItem] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [textSearch, setTextSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurentPage] = useState(0);
  const [trigger, setTrigger] = useState(false)
  const [loading, setLoading] = useState(false)

  const appendData =  async (page?: number) => {
    console.log('????')
    let params = {}
      params = {
        postId: '6235552b9aee25ef29d7ee1e',
        page: page
      }
      setLoading(true)
      // const result = await getNotifi(params)
      const result = await getCommentsOfPost(params)
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
    
  };

  useEffect(() => {
    appendData(currentPage);
  }, [currentPage, trigger]);

  const onScroll = e => {
    if(data.length === totalItem || currentPage === totalPage)return
    if (e.target.scrollHeight - e.target.scrollTop === ContainerHeight && currentPage < totalPage) {
      // setCurentPage(currentPage+1)
    }
  };



  return (
    <div style={{width: '450px', height: '550px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center'}}>
      <div style={{fontWeight: 'bold', fontSize: '16px', padding: '5px 15px'}}>
        Notifications
      </div>
      {
        loading ? <Spin size='large'/> :
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
                <div style={{padding: '0 15px'}}>
                  <List.Item.Meta
                  avatar={<Avatar src={item?.avatar} />}
                
                  title={<a href="https://ant.design">do something</a>}
                  description='adfdfsfds'
                />
                </div>
                
              </List.Item>
            )}
          </VirtualList>
        </List>
      }
    </div>
   
  );
};

export default NotificationList