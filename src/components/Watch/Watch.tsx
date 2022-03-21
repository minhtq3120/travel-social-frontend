import React, { useState, useEffect } from 'react';
import { List, message, Avatar, Skeleton, Divider, Button } from 'antd';
import VirtualList from 'rc-virtual-list';
import { followId, getFollowers, getFollowing, unfollowId } from 'src/services/follow-service';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RiRestaurant2Line } from 'react-icons/ri';
import styles from 'src/styles/Watch.module.scss';
import classNames from 'classnames/bind';


const cx = classNames.bind(styles);
const fakeDataUrl =
  'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
const ContainerHeight = 500;

import { render } from 'react-dom';
import Gallery from 'react-grid-gallery';
import { getWatchs } from 'src/services/watchs-service';
import ReactPlayer from 'react-player';
import { BsThreeDots } from 'react-icons/bs';
import moment from 'moment';

const Watch = (props: any) => {
  const [data, setData] = useState<any>([]);
  const [totalItem, setTotalItem] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [textSearch, setTextSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurentPage] = useState(0);
  const [trigger, setTrigger] = useState(false)


  const appendData =  async (page?: number) => {
    let params = {
        page: page
    }
      const result = await getWatchs(params)
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
    <div className={cx('watchs-container')}>
      <div className={cx('watchs-child')}>
        {
        data?.length> 0 ?data?.map((item: any, index: any) => {
          return (
            <div key={index} className={cx('watch')}>
                 <div className={cx('info')}>
                    <div className={cx('left')}>
                         <Avatar src={item?.avatar} />
                        <div className={cx('name-time-container')}>
                          <div className={cx('name')}>{item?.displayName}</div>
                          <div className={cx('time')}>{moment(item?.createdAt).format('YYYY-MM-DD HH-MM')}</div>
                        </div>
                    </div>
                    
                    <BsThreeDots style={{ fontSize: '25px', margin: '0 10px', cursor: 'pointer', color: 'white'}} />
                </div>
                <ReactPlayer
                  url={item?.url}
                  playing={false}
                  loop={true}
                  controls={true}
                  width="100%"
                  height="600px"
                  />
            </div>
          )
        }) :null
      }

      </div>

      
    </div>

  );
};

export default Watch