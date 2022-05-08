import React, { useEffect, useRef, useState } from "react";
import classNames from 'classnames/bind';

import styles from 'src/styles/SearchDetail.module.scss';
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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux/store";
import { searchEverythingAll } from "src/services/search-service";
import {IoMdRadioButtonOff , IoMdRadioButtonOn} from 'react-icons/io'
import { setSearchFilter } from "src/redux/WalletReducer";
import { followId, unfollowId } from "src/services/follow-service";
import { SEND_NOTIFICATION } from "src/components/Notification/Notification";
import { NotificationAction } from "src/pages/Layout/layout";
const cx = classNames.bind(styles);

const ContainerHeight = 1000;
export const sleep = (ms = 1500) => new Promise((resolve) => setTimeout(resolve, ms));

const FakeFollow = (props) => {
  const socket: any = useSelector((state: RootState) => state.wallet.socket);

  const [isFollow, setIsFollow] = useState<boolean>(props?.item?.followed && !props?.item?.isCurrentUser  )
  const handleFollow  = async (userId: string) => {
    try {
      const follow = await followId(userId)
      socket.emit(SEND_NOTIFICATION, {
        receiver: userId,
        action: NotificationAction.Follow
      })
      return follow
    }
    catch (err){
      console.log(err)
    }
  }

  const handleUnFollow  = async (userId: string) => {
    try {
      const unfollow = await unfollowId(userId)
      return unfollow
    }
    catch (err){
      console.log(err)
    }
  }
  return (
    isFollow? (
      <Button className={cx('button')} onClick={() => {
        setIsFollow(!isFollow)
        handleUnFollow(props?.item?.userId)
      }}>
        Unfollow
      </Button>
    ) : (
      <Button className={cx('button')}  onClick={() => {
          setIsFollow(!isFollow)
         handleFollow(props?.item?.userId)
        }}> 
        Follow
      </Button>
      )
  )
}

const SearchDetail = (props: any) => {
  const [dataSrc, setDataSrc] = useState<any>([]);
  const [totalItem, setTotalItem] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [textSearch, setTextSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurentPage] = useState(0);
  const [trigger, setTrigger] = useState(false)
  const [viewMoreLoading, setViewMoreLoading] = useState(false);
  const dispatch = useDispatch();
  const [loadingSearch, setLoadingSearch] = useState(false)

const history = useHistory()
  const search = useLocation().search;


  const htag: any = useSelector((state: RootState) => state.wallet.hashtagSearch);
  useBottomScrollListener(() => {
    console.log('REACRT ENDNDNDN')
    handleFetchMore()

  });

  const searchValue: any =  useSelector((state: RootState) => state.wallet.searchValue)||  localStorage.getItem('searchValue');
  const searchFilter: any =  useSelector((state: RootState) => state.wallet.searchFilter) || localStorage.getItem('searchFilter') ;

  const triggerSearch: any = useSelector((state: RootState) => state.wallet.triggerSearch);

  const handleFetchMore = async () => {
    //await sleep();
    setViewMoreLoading(true);
    setCurentPage(currentPage + 1)
  }

  const searchOption = [
    {
      label: 'Posts',
      value: 'post'
    },
    {
      label: 'Users',
      value: 'user'
    },
  ]

  const getNewfeed = async (page?: number) => {
    try {
      setLoadingSearch(true)
      //await sleep()
      const params = {
        page: page?.toString(),
        filter: searchFilter,
        keyword: searchValue
      }
      console.log('KLFSDLKDLDSFLLKJDF')
      const result = await searchEverythingAll(
        params
      )
      if(searchFilter === 'post') {
        const dataSource = _.get(result, 'data.posts.items', []);
        const totalItem = _.get(result, 'data.posts.meta.totalItems', 0);
        const totalPages = _.get(result, 'data.posts.meta.totalPages', 0);
        const itemsPerPage = _.get(result, 'data.posts.meta.perPage', 0);
        const currentPage = _.get(result, 'data.posts.meta.currentPage', 0);
        let temp = dataSrc.concat(dataSource)
        setDataSrc(temp);
        setTotalItem(parseInt(totalItem));
        setTotalPage(parseInt(totalPages));
        setItemsPerPage(parseInt(itemsPerPage));
        setCurentPage(parseInt(currentPage));
        setViewMoreLoading(false);
      }
      else if(searchFilter === 'user') {
        const dataSource = _.get(result, 'data.users.items', []);
        const totalItem = _.get(result, 'data.users.meta.totalItems', 0);
        const totalPages = _.get(result, 'data.users.meta.totalPages', 0);
        const itemsPerPage = _.get(result, 'data.users.meta.perPage', 0);
        const currentPage = _.get(result, 'data.users.meta.currentPage', 0);
        let temp = dataSrc.concat(dataSource)
        setDataSrc(temp);
        setTotalItem(parseInt(totalItem));
        setTotalPage(parseInt(totalPages));
        setItemsPerPage(parseInt(itemsPerPage));
        setCurentPage(parseInt(currentPage));
        setViewMoreLoading(false);
      }
      setLoadingSearch(false)
    }
    catch (err) {
      setLoadingSearch(false)
      setViewMoreLoading(false);
      return err
    }
  }

  useEffect(() => {
    console.log("COME HERE")
    setDataSrc([])
    if(currentPage === 0) setTrigger(!trigger)
    else setCurentPage(0)
  }, [searchFilter, searchValue,  triggerSearch]);

  useEffect(() => {
    console.log('+++++++++++++', searchFilter, searchValue, currentPage)
    if(searchFilter && searchValue) getNewfeed(currentPage);
  }, [currentPage, trigger]);
  return (
    <div className={cx('newFeed-container')}>
      <div className={cx(`newFeed-container-child`)}>
       
        <div className={cx(`newFeed-middle`)}>
            {
              dataSrc?.length <= 0 && loadingSearch? <Spin size="large" style={{margin: '200px 0'}}/> : dataSrc?.length <= 0 && !loadingSearch ? (
                <div style={{width: '100%', display: 'flex', flexDirection: 'column',justifyContent: 'center', alignItems: 'center'}}>
                  <div style={{fontWeight: 'bold', padding: '100px 30px', paddingBottom: '20px', fontSize: '40px'}}>
                    {`No ${searchFilter}s result found for "${searchValue}"`}
                  </div>
                  
                  <img src="https://cdn.dribbble.com/users/88213/screenshots/8560585/media/7263b7aaa8077a322b0f12a7cd7c7404.png?compress=1&resize=400x300"
                    width={400}
                  />
                  <div style={{ padding: '30px 30px', fontSize: '20px' , fontStyle: 'italic'}}>
                    {`Try search for something else`}
                  </div>
                </div>
              ) : searchFilter === 'post' ? dataSrc?.map((item: any, index: any) => {
                return (
                  <>
                    <div key={index}>
                      <Post item={item}/>
                    </div>
                  </>
                  
                )
              }) : searchFilter === 'user' ? 
              <div style={{marginTop: '70px', width: '100%'}}>
                {dataSrc?.map((item: any, index: any) => {
                return (
                    <div key={index} className={cx('user-list-container')}>
                      <div className={cx('user-left')}>
                        <div onClick={() => {
                             history.push(`/profile?userId=${item.userId}`)
                          }}>
                          <Avatar src={item?.avatar} size={60} className={cx('user-avatar')}
                          
                        />
                        </div>
                        
                        <div className={cx('user-info')}> 
                           <div className={cx('name')} onClick={() => {
                             history.push(`/profile?userId=${item.userId}`)
                          }}>{item?.displayName}</div>
                           <div className={cx('address')}>{item?.address?.name}</div>
                           <div className={cx('detail-address')}>{item?.address?.formattedAddress}</div>
                        </div>
                       
                      </div>
                      <div className={cx('user-right')}> 
                        <FakeFollow item={item}/>
                      </div>
                    </div>
                  
                )
              })}
              </div> : null
            }
            {
            totalPage - 1 === currentPage || dataSrc?.length === 0 ? null : (
              <Spin size="large" style={{margin: '15px 0'}}/>
            )}
          </div>
          <div className={cx(`newFeed-right`)}>
              <div className={cx('filter-title')}>
                Search Filter
              </div>

              {/* <div className={cx('filter-options')}> <div className={cx('filter-options')}>  */}
                {/* <div className={cx('option')}>
                  <div className={cx('option-value')}>Posts</div>
                  <IoMdRadioButtonOff size={30} color='#68d1c8' style={{cursor: 'pointer'}}/>
                </div>
                <div className={cx('option')}>
                  <div className={cx('option-value')}>Users</div>
                  <IoMdRadioButtonOff size={30} color='#68d1c8' style={{cursor: 'pointer'}}/>
                </div>
              </div> */}
              
                <div className={cx('filter-options')}>
                  {
                    searchOption.map((item, index) => {
                      return(
                        <div className={cx('option')} key={index}>
                         <div className={cx('option-value')}>{item?.label}</div>
                         {
                           item?.value === searchFilter ?  
                           <IoMdRadioButtonOn size={30} color='#68d1c8' style={{cursor: 'pointer'}}/> :
                          <IoMdRadioButtonOff size={30} color='#68d1c8' style={{cursor: 'pointer'}} onClick={() => {dispatch(setSearchFilter(item?.value))}}/>
                         }
                        </div>
                      )
                    })
                  }
                 </div>

              {/* </div> */}
          </div>
      </div>
    </div>
  );
};

export default SearchDetail;
