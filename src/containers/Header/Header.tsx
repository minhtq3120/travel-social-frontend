import React, { useState } from "react";
import classNames from 'classnames/bind';

import styles from 'src/styles/Header.module.scss';
import RenderSearch from "src/components/render-search/RenderSearch";
import Logo from 'src/assets/MadLogo.png';
import { HeartOutlined, HomeOutlined, MessageOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { BsPersonCircle } from 'react-icons/bs';
import { Input } from "antd";

const cx = classNames.bind(styles);
const { Search } = Input;

const HeaderContainer = (props: any) => {
  const handleOnChange = (event: any) => {
    console.log(event.target.value);
  }

  const onSearch = async (value: string) => {
    const params = {
      // keyword: removeAccents(value)
    };
    console.log(value)
    // await Promise.all([getList(params), setTextSearch(value)]);
  };


  return (
    <div className={cx('header-container')}>
      <img className={cx('header-logo')} src={Logo} alt="logo" />
      <div className={cx(`header-search`)}>
        <RenderSearch 
          onSearch={onSearch}
          onChange={onSearch} 
          placeholder={'Search..'}
        />
      </div>
     
      {/* <div className={cx('header-search')}>
        <Search
          placeholder={`Search...`}
          className={cx('search')}
          onSearch={(val: string) => {
            onSearch(val);
          }}
          onChange={handleOnChange}
          style={{ width: 400, padding: 20, borderRadius: 10 }}
        />
      </div> */}
      
      <div className={cx('header-icon')}>
        <div className={cx('icon-chat')}>
          <HomeOutlined style={{ fontSize: '30px', margin: '0 10px'}}/>
          <MessageOutlined style={{ fontSize: '30px', margin: '0 10px' }}/>
          <PlusSquareOutlined style={{ fontSize: '30px', margin: '0 10px' }}/>
          <HeartOutlined style={{ fontSize: '30px', margin: '0 10px' }}/>
        </div>
        <div className={cx('icon-profile')}>
          <BsPersonCircle style={{ fontSize: '30px', margin: '0 10px', cursor: 'pointer'}}/>
      
        </div>
      </div>
    </div>
  );
};

export default HeaderContainer;
