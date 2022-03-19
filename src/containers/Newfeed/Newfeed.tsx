import React, { useEffect, useRef, useState } from "react";
import classNames from 'classnames/bind';

import styles from 'src/styles/Newfeed.module.scss';
import RenderSearch from "src/components/render-search/RenderSearch";
import Logo from 'src/assets/MadLogo.png';
import { HeartOutlined, HomeOutlined, MessageOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Button, Divider, Input, List, Skeleton } from "antd";
import Post from "src/components/Post/Post";
import { getNewFeedPost } from "src/services/post-service";
import VirtualList from 'rc-virtual-list';
import _ from 'lodash';
import InfiniteScroll from "react-infinite-scroll-component";
import Avatar from "antd/lib/avatar/avatar";

const cx = classNames.bind(styles);

const ContainerHeight = 1000;

const NewFeed = (props: any) => {
  const [dataSrc, setDataSrc] = useState([]);
  const [totalItem, setTotalItem] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [textSearch, setTextSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurentPage] = useState(0);

  const getNewfeed = async (page?: number) => {
    try {
      const params = {
        page: 0,
        postLimit: 'newsFeed',

      }
      const result = await getNewFeedPost({
        params
      })

      const dataSource = _.get(result, 'data.items', []);
      const totalItem = _.get(result, 'data.meta.totalItems', 0);
      const totalPages = _.get(result, 'data.meta.totalPages', 0);
      const itemsPerPage = _.get(result, 'data.meta.perPage', 0);
      const currentPage = _.get(result, 'data.meta.currentPage', 0);

      setDataSrc(dataSource);
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
    getNewfeed(currentPage);
  }, [currentPage]);

  return (
    <div className={cx('newFeed-container')} >
      {
        dataSrc?.length> 0 ?dataSrc?.map((item: any, index: any) => {
          return (
            <div key={index}>
              <Post item={item}/>
            </div>
          )
        }) :null
      }
        
    </div>
  );
};

export default NewFeed;
