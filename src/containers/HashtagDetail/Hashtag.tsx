import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from 'classnames/bind';

import styles from 'src/styles/Hashtag.module.scss';
import RenderSearch from "src/components/render-search/RenderSearch";
import Logo from 'src/assets/MadLogo.png';
import { HeartOutlined, HomeOutlined, MessageOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Button, Divider, Input, List, Skeleton, Spin } from "antd";
import Post from "src/components/Post/Post";
import { getHashtagPosts, getNewFeedPost } from "src/services/post-service";
import VirtualList from 'rc-virtual-list';
import _ from 'lodash';
import InfiniteScroll from "react-infinite-scroll-component";
import Avatar from "antd/lib/avatar/avatar";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import GoogleMapCom from "src/components/GoogleMap/GoogleMap";
import Weather from "src/components/GoogleMap/Weather";
import Maps from "src/components/GoogleMap/CurrentLocation";
import Discovery from "src/components/Discovery/Discovery";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";

const cx = classNames.bind(styles);

const ContainerHeight = 1000;
export const sleep = (ms = 1500) => new Promise((resolve) => setTimeout(resolve, ms));

const HashtagDetail = (props: any) => {
  const [dataSrc, setDataSrc] = useState<any>([]);
  const [totalItem, setTotalItem] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [textSearch, setTextSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurentPage] = useState(0);
  const [trigger, setTrigger] = useState(false)
  const [viewMoreLoading, setViewMoreLoading] = useState(false);
  const [popular, setPopular] = useState<any>(null)
  const [hashtagDetail, setHashtagDetail] = useState<any>(null)
  const [loading, setLoading] = useState(false)

const history = useHistory()
  const search = useLocation().search;
  const hashtagFromUrl=new URLSearchParams(search).get("hashtag");

  const htag: any = useSelector((state: RootState) => state.wallet.hashtagSearch)


  useBottomScrollListener(() => {
    handleFetchMore()
  });

  const handleFetchMore = async () => {
    await sleep();
    setViewMoreLoading(true);
   setCurentPage(currentPage + 1)
  }

  const getNewfeed = async (hashtag: string, page: number) => {
    try {
      setLoading(true)
      const params = {
        page: page?.toString(),
        keyword: hashtag
      }
      const result = await getHashtagPosts(
        params
      )
      const dataSource = _.get(result, 'data.posts.items', []);
      const totalItem = _.get(result, 'data.posts.meta.totalItems', 0);
      const totalPages = _.get(result, 'data.posts.meta.totalPages', 0);
      const itemsPerPage = _.get(result, 'data.posts.meta.perPage', 0);
      const currentPage = _.get(result, 'data.posts.meta.currentPage', 0);
      const popular = _.get(result, 'data.popular', null);
      const hsdt = _.get(result, 'data.hashtag' ,null)
      let temp = dataSrc.concat(dataSource)
       setDataSrc(temp);
      setTotalItem(parseInt(totalItem));
      setTotalPage(parseInt(totalPages));
      setItemsPerPage(parseInt(itemsPerPage));
      setCurentPage(parseInt(currentPage));
      setViewMoreLoading(false);
      setPopular(popular)
      setHashtagDetail(hsdt)
      setLoading(false)
    }
    catch (err) {
      setViewMoreLoading(false);
      setLoading(false)
      return err
    }
  }

useEffect(() => {
    setDataSrc([])
    if(currentPage === 0) setTrigger(!trigger)
    else setCurentPage(0)
  }, [hashtagFromUrl]);


  useEffect(() => {
    if(hashtagFromUrl) getNewfeed(hashtagFromUrl,currentPage);
  }, [currentPage, trigger]);

  return (
    <div className={cx('newFeed-container')}>
      <div className={cx(`newFeed-container-child`)}>
       
        <div className={cx(`newFeed-middle`)}>
          
          {
            loading && dataSrc?.length === 0 ? (
              <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
                <Spin size="large" style={{margin: '15px 0', padding: '5px 0'}}/>
              </div>  
            ) : hashtagDetail && popular && !loading? (
              <div className={cx('hashtag-info')}>
                <div className={cx('hashtag-name')}>
                  {hashtagDetail}
                </div>
                {
                  popular ?  <div className={cx('hashtag-posts')}>
                  <b>{popular}</b> posts
                  </div> : null
                }
               
              </div>
            ) : null
          }
           
            {
              dataSrc?.length> 0 ?dataSrc?.map((item: any, index: any) => {
                return (
                  <>
                    <div key={index}>
                      <Post item={item}/>
                    </div>
                  </>
                  
                )
              }) :null
            }
            {
            totalPage - 1 === currentPage || dataSrc?.length === 0 ? null : (
              <Spin size="large" style={{margin: '15px 0'}}/>
            )}
          </div>
      </div>
    </div>
  );
};

export default HashtagDetail;
