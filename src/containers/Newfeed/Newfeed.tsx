import React, { useEffect, useRef, useState } from "react";
import classNames from 'classnames/bind';

import styles from 'src/styles/Newfeed.module.scss';
import RenderSearch from "src/components/render-search/RenderSearch";
import Logo from 'src/assets/MadLogo.png';
import { HeartOutlined, HomeOutlined, MessageOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Button, Divider, Input, List, Skeleton, Spin } from "antd";
import Post from "src/components/Post/Post";
import { getNewFeedPost } from "src/services/post-service";
import VirtualList from 'rc-virtual-list';
import _ from 'lodash';
import InfiniteScroll from "react-infinite-scroll-component";
import Avatar from "antd/lib/avatar/avatar";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';

const cx = classNames.bind(styles);

const ContainerHeight = 1000;
export const sleep = (ms = 1500) => new Promise((resolve) => setTimeout(resolve, ms));

const NewFeed = (props: any) => {
  const [dataSrc, setDataSrc] = useState<any>([]);
  const [totalItem, setTotalItem] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [textSearch, setTextSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurentPage] = useState(0);
  const [viewMoreLoading, setViewMoreLoading] = useState(false);
  
  useBottomScrollListener(() => {
    console.log('REACRT ENDNDNDN')
    handleFetchMore()

  });

  const handleFetchMore = async () => {
    await sleep();
    setViewMoreLoading(true);
    setCurentPage(currentPage + 1)
  }


  const getNewfeed = async (page?: number) => {
    try {
      console.log('GET INTO HERE')
      const params = {
        page: page?.toString(),
        postLimit: 'newsfeed',
      }
      const result = await getNewFeedPost(
        params
      )
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
      setViewMoreLoading(false);
    }
    catch (err) {
      setViewMoreLoading(false);
      return err
    }
  }

  useEffect(() => {
    getNewfeed(currentPage);
  }, [currentPage]);

  return (
    <div className={cx('newFeed-container')}
    >
      {
        dataSrc?.length> 0 ?dataSrc?.map((item: any, index: any) => {
          return (
            <div key={index}>
              <Post item={item}/>
            </div>
          )
        }) :null
      }
      {
      totalPage - 1 === currentPage || dataSrc?.length === 0 ? null : (
        // <Button
        //   onClick={handleViewMore}
        //   loading={viewMoreLoading}
        // >
        //   View More
        // </Button>
        <Spin size="large" style={{margin: '15px 0'}}/>
      )}
        
    </div>
  );
};

export default NewFeed;
