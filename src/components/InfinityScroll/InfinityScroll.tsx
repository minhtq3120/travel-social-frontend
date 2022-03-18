import React, { useState, useEffect } from 'react';
import { List, message, Avatar, Skeleton, Divider, Button } from 'antd';
import VirtualList from 'rc-virtual-list';
import { getFollowers, getFollowing } from 'src/services/follow-service';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';

const fakeDataUrl =
  'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
const ContainerHeight = 400;

const InfinityList = (props: any) => {
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(0)

  const appendData =  async (page?: number) => {
    const params = {
        page: page
    }
    if(props?.queryAPI){
      const rs = await props?.queryAPI(params)
      if(rs) {
        console.log(rs)
        const src = _.get(rs, 'data' ,[])
        let temp = data.concat(src)
        setData(temp)
      }
    }
    
  };


  console.log(data)
  useEffect(() => {
    appendData(currentPage);
  }, [currentPage]);

  const onScroll = e => {
    if(data.length === props?.totalItems)return
    if (e.target.scrollHeight - e.target.scrollTop === ContainerHeight && data.length <= props?.totalItems) {
      setCurrentPage(currentPage+1)
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
              item?.followed ? (
                <Button>
                  Unfollow
                </Button>
              ) : (
                <Button>
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