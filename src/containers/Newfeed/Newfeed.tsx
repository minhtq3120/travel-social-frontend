import React, { useEffect, useState } from "react";
import classNames from 'classnames/bind';

import styles from 'src/styles/Newfeed.module.scss';
import RenderSearch from "src/components/render-search/RenderSearch";
import Logo from 'src/assets/MadLogo.png';
import { HeartOutlined, HomeOutlined, MessageOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Input } from "antd";
import Post from "src/components/Post/Post";
import { getNewFeedPost } from "src/services/post-service";
import _ from 'lodash';

const cx = classNames.bind(styles);

const NewFeed = (props: any) => {
  const [dataSrc, setDataSrc] = useState([]);
  const [totalItem, setTotalItem] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [textSearch, setTextSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurentPage] = useState(1);

  useEffect(() => {
    getNewfeed()
  }, [])

  const getNewfeed = async () => {
    try {
      const result = await getNewFeedPost({
        page: 0,
        postLimit: 5,
      })

    
      const dataSource = _.get(result, 'data', []);
      // const totalItem = _.get(result, 'data.meta.totalItems', 0);
      // const totalPages = _.get(result, 'data.meta.totalPages', 0);
      // const itemsPerPage = _.get(result, 'data.meta.itemsPerPage', 0);
      // const currentPage = _.get(result, 'data.meta.currentPage', 0);

      setDataSrc(dataSource);
      // setTotalItem(parseInt(totalItem));
      // setTotalPage(parseInt(totalPages));
      // setItemsPerPage(parseInt(itemsPerPage));
      // setCurentPage(parseInt(currentPage));

      console.log(result)
    }
    catch (err) {
      return err
    }
  }


  return (
    <div className={cx('newFeed-container')}>
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
