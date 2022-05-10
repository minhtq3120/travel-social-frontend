import React, { useState, useEffect, useCallback } from 'react';
import { List, message, Avatar, Skeleton, Divider, Button, Spin, Form, Input, Modal } from 'antd';
import VirtualList from 'rc-virtual-list';
import { followId, getFollowers, getFollowing, unfollowId } from 'src/services/follow-service';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FiSend } from 'react-icons/fi';

const fakeDataUrl =
  'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
const ContainerHeight = 500;

import { io } from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { NotificationAction } from 'src/pages/Layout/layout';

import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import { sleep } from 'src/containers/Newfeed/Newfeed';
import { ChatEngine } from 'react-chat-engine'
import styles from 'src/styles/SearchBar.module.scss';
import { ChatFeed, Message } from 'react-chat-ui'
 

import classNames from 'classnames/bind';
import { RiHashtag } from 'react-icons/ri';
import { getRecentsChat } from 'src/services/chat-service';
import moment from 'moment';
import { searchAllUser, searchEverything } from 'src/services/search-service';
import { useHistory } from 'react-router-dom';
import { setHashtagSearch, setSearchValue } from 'src/redux/WalletReducer';

const cx = classNames.bind(styles);

const SearchBar = (props: any) => {
  const [form] = Form.useForm();
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


  const [data2, setData2] = useState<any>([]);
  const [totalItem2, setTotalItem2] = useState(0);
  const [totalPage2, setTotalPage2] = useState(0);
  const [textSearch2, setTextSearch2] = useState('');
  const [itemsPerPage2, setItemsPerPage2] = useState(5);
  const [currentPage2, setCurentPage2] = useState(0);

  const history = useHistory()
  const dispatch = useDispatch()
  const socket: any = useSelector((state: RootState) => state.wallet.socket);

  const appendData =  async (keyword: string, page?: number) => {
    let params =  {
        keyword,
        perPage: 20
    }
    const result = await searchEverything(params)
    if(result) {
      if(keyword[0] !== '#'){
            const dataSource = _.get(result, 'data.users.items', []);
            const totalItem = _.get(result, 'data.users.meta.totalItems', 0);
            const totalPages = _.get(result, 'data.users.meta.totalPages', 0);
            const itemsPerPage = _.get(result, 'data.users.meta.perPage', 0);
            const currentPage = _.get(result, 'data.users.meta.currentPage', 0);
                // let temp = data.concat(dataSource)
                setData(dataSource);
                setTotalItem(parseInt(totalItem));
                setTotalPage(parseInt(totalPages));
                setItemsPerPage(parseInt(itemsPerPage));
                setCurentPage(parseInt(currentPage));

            }
            else {
                const dataSource = _.get(result, 'data.hashtags.items', []);
                const totalItem = _.get(result, 'data.hashtags.meta.totalItems', 0);
                const totalPages = _.get(result, 'data.hashtags.meta.totalPages', 0);
                const itemsPerPage = _.get(result, 'data.hashtags.meta.perPage', 0);
                const currentPage = _.get(result, 'data.hashtags.meta.currentPage', 0);
                    // let temp = data.concat(dataSource)
                    setData2(dataSource);
                    setTotalItem2(parseInt(totalItem));
                    setTotalPage2(parseInt(totalPages));
                    setItemsPerPage2(parseInt(itemsPerPage));
                    setCurentPage2(parseInt(currentPage));
            }
      }
      

      
    
  };

  useEffect(() => {
    if(props?.keyword?.length > 0) appendData(props?.keyword, currentPage);
    else setData([])
  }, [currentPage, props?.keyword]);

    const handleFinish = async (values) => {
      try {
        return;
      } catch (err) {
        return err;
      }
    };
    const ListSearchs = () => {
     return (
        <div  style={{width: '100%',height: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center',alignContent:'flex-start', overflowY: 'scroll', overflowX: 'hidden'}} >
           {
               props?.keyword.length > 0 && data.length === 0 && data2.length === 0? (
                   <div>
                       No user found!
                   </div>
               ) :  props?.keyword[0] !== '#' ? (
                   <>
                   {
                        data.map((item: any, index: any) => (
                            <div className={cx('search-user-container')} key={index} onClick={() => {
                                history.push(`/profile?userId=${item.userId}`)
                                props.setKeyword('')
                            }}>
                                <div className={cx('search-user-info')}>
                                    <Avatar src={item?.avatar} size={50}/>
                                    <div className={cx('name')}>{item?.displayName}</div>
                                </div>
                                {/* <div className={cx('checkbox-right')}>
                                    {
                                        props?.userSelected.filter((i) => i.userId === item.userId)?.length > 0 ? (
                                            <MdOutlineCheckBox size={25} style={{color: '#68d1c8', cursor: 'pointer'}} 
                                                onClick={() => {
                                                    let temp = props.userSelected.filter((it) => it.userId !== item.userId) 
                                                    props?.setUserSelected(temp)
                                                }}
                                            />
                                        ) : (
                                            <MdOutlineCheckBoxOutlineBlank size={25} style={{color: '#68d1c8', cursor: 'pointer'}}
                                                onClick={() => {
                                                    props?.setUserSelected([...props?.userSelected, item])
                                                }}
                                            />
                                        )
                                    }
                                    
                                </div> */}

                            </div>
                        ))
                        }
                        {/* {
                        totalPage - 1 === currentPage || data?.length === 0 ? null : (
                            <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
                                <Spin size="large" style={{margin: '15px 0', padding: '5px 0'}}/>
                            </div>  
                        )} */}
                    </>
               )  : (
                   <>
                   {
                        data2.map((item: any, index: any) => (
                            <div className={cx('search-user-container')} key={index} onClick={() => {
                                console.log(item)
                                dispatch(setHashtagSearch(item))
                                if(props?.keyword?.length > 0) dispatch(setSearchValue(props?.keyword))
                                 history.push(`/hashtagDetail?hashtag=%23${item?.hashtag?.slice(1, item?.hashtag?.length)}`)
                                props.setKeyword('')
                            }}>
                                <div className={cx('search-user-info')}>
                                    <div className={cx('hashtag-icon-container')}>
                                        <RiHashtag  size={30} className={cx('hashtag-icon')}/>
                                    </div>
                                    <div className={cx('hashtag-info')}>
                                        <div className={cx('hashtag-name')}>{item?.hashtag}</div>
                                        <div className={cx('hashtag-posts')}>{item?.popular} posts</div>
                                    </div>
                                    
                                </div>

                            </div>
                        ))
                        }
                        {/* {
                        totalPage - 1 === currentPage || data?.length === 0 ? null : (
                            <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
                                <Spin size="large" style={{margin: '15px 0', padding: '5px 0'}}/>
                            </div   >  
                        )} */}
                    </>
               )
           }
            
        </div>
     )
    }


  return (
    <div className={cx(`search-container`)}>
        {/* <div className={cx('search-header')}>
            <Form
                form={form}
                className={cx('search-form')}
                layout="vertical"
                autoComplete="off"
                onFinish={handleFinish}
            >
            <Form.Item 
                name="search"
                className={cx(`input`)}
                rules={[
                    ({ getFieldValue }) => ({
                    validator(_, value: string) {
                        return Promise.resolve()
                    }
                    })
                ]}
                >
                <Input
                    type='text'
                    placeholder='Find someone...'
                    className={cx('seach-input')}
                    onChange={(e) => {
                        setKeyword(e.target.value)
                    }}
                />
                </Form.Item>
            </Form>
        </div> */}

        <div className={cx('search-body')}>
            <ListSearchs />
        </div>
        
    </div>
  )

};

export default SearchBar