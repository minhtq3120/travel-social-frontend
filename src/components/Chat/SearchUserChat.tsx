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
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { NotificationAction } from 'src/pages/Layout/layout';

import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import { sleep } from 'src/containers/Newfeed/Newfeed';
import { ChatEngine } from 'react-chat-engine'
import styles from 'src/styles/Search.module.scss';
import { ChatFeed, Message } from 'react-chat-ui'
 

import classNames from 'classnames/bind';
import { MdOutlineCheckBoxOutlineBlank, MdOutlineCheckBox } from 'react-icons/md';
import { getRecentsChat } from 'src/services/chat-service';
import moment from 'moment';
import { searchAllUser } from 'src/services/search-service';

const cx = classNames.bind(styles);

const Search = (props: any) => {
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
  const [trigger, setTrigger] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isModalVisibleNewChat, setIsModalVisiblNewChat] = useState(false);
  const [keyword, setKeyword] = useState<any>('')
  const [loadingSearchUser, setLoadingSearchUser] = useState(false)

  const handleCancel = () => {
        setIsModalVisiblNewChat(false)
    };


  const socket: any = useSelector((state: RootState) => state.wallet.socket);

  const appendData =  async (keyword: string, page?: number) => {
    let params =  {
        keyword,
        // perPage: 1000,
        filter: 'all',
        page
    }

    const result = await searchAllUser(params)
    if(result) {
      const dataSource = _.get(result, 'data.items', []);
      const totalItem = _.get(result, 'data.meta.totalItems', 0);
      const totalPages = _.get(result, 'data.meta.totalPages', 0);
      const itemsPerPage = _.get(result, 'data.meta.perPage', 0);
      const currentPage = _.get(result, 'data.meta.currentPage', 0);
        let temp = data.concat(dataSource)
      setData(temp);
      setTotalItem(parseInt(totalItem));
      setTotalPage(parseInt(totalPages));
      setItemsPerPage(parseInt(itemsPerPage));
      setCurentPage(parseInt(currentPage));

    }
    
  };
  console.log(data)
  useEffect(() => {
      console.log("===========",data?.length)
    if(keyword?.length > 0) appendData(keyword, currentPage);
    else setData([])
  }, [currentPage, keyword]);


    const handleFinish = async (values) => {
      try {
        return;
      } catch (err) {
        return err;
      }
    };
    const ListSearchs = useCallback(() => {
     return (
        <div  ref={scrollRef } style={{width: '100%',height: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center',alignContent:'flex-start', overflowY: 'scroll', overflowX: 'hidden'}} >
           {
               keyword.length > 0 && data.length === 0 ? (
                   <>
                   </>
               ) : (
                   <>
                   {
                        data.map((item: any, index: any) => (
                            <div className={cx('search-user-container')} key={index}>
                                <div className={cx('search-user-info')}>
                                    <Avatar src={item?.avatar} />
                                    <div className={cx('name')}>{item?.displayName}</div>
                                </div>
                                <div className={cx('checkbox-right')}>
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
                                    
                                </div>

                            </div>
                        ))
                        }
                        {
                        totalPage - 1 === currentPage || data?.length === 0 || (totalPage === 0 && currentPage === 0) ? null : (
                            <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
                                <Spin size="large" style={{margin: '15px 0', padding: '5px 0'}}/>
                            </div>  
                        )}
                    </>
               )
           }
            
        </div>
     )
    }, [data, props?.userSelected])

    const Nextt = useCallback(() => {
        return (
            props?.userSelected?.length > 0 ?
        <div className={cx('send')}onClick={() => {
            props.handleCreateChat(props.userSelected)
            props.setIsModalVisiblNewChat(false)
            props.setUserSelected([])
            }} >
            <div className={cx('send-text')}>Next</div>
        </div>: null
        )
    }, [props?.userSelected])


  return (
    <div className={cx(`search-container`)}>
        <Nextt />

        <div className={cx('search-header')}>
            <Form
                form={form}
                className={cx('search-form')}
                layout="vertical"
                autoComplete="off"
                onFinish={handleFinish}
            >
            <Form.Item 
                name="search"
                label={`To: `}
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
                        setData([])
                        setCurentPage(0)
                        setKeyword(e.target.value)
                    }}
                />
                </Form.Item>
            </Form>
        </div>

        <div className={cx('search-body')}>
            <ListSearchs />
        </div>
        
    </div>
  )

};

export default Search