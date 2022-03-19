import React, { useState, useEffect } from 'react';
import { List, message, Avatar, Skeleton, Divider, Button } from 'antd';
import VirtualList from 'rc-virtual-list';
import { followId, getFollowers, getFollowing, unfollowId } from 'src/services/follow-service';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RiRestaurant2Line } from 'react-icons/ri';

const fakeDataUrl =
  'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
const ContainerHeight = 400;

const InfinityList = (props: any) => {
  const [data, setData] = useState<any>([]);
  const [totalItem, setTotalItem] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [textSearch, setTextSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurentPage] = useState(0);
  const [trigger, setTrigger] = useState(false)

  console.log('current',currentPage, '   total', totalPage)
  const appendData =  async (page?: number) => {
    const params = {
        page: page
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
  console.log('data:' , data.length, data)

  const handleFollow  = async (userId: string) => {
    try {
      console.log(userId)
      const follow = await followId(userId)
      console.log(follow)
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
      console.log(userId)
      const unfollow = await unfollowId(userId)
      console.log(unfollow)
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
    if(data.length === props?.totalItems)return
    if (e.target.scrollHeight - e.target.scrollTop === ContainerHeight && currentPage < totalPage) {
      setCurentPage(currentPage+1)
    }
  };

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
              item?.followed && !item?.isCurrentUser ? (
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