import { Input } from 'antd';
import React from 'react';
import './RenderSearch.scss';
import {AiOutlineSearch } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
const { Search } = Input;
const RenderSearch = (props) => {
  const searchValue: any = useSelector((state: RootState) => state.wallet.searchValue);


  const { 
    onSearch = () => {} ,
    onChange = () => {},
    handleEnter = () => {},
    placeholder
  } = props;
  const handleOnChange = (event: any) => {
    onChange(event.target.value);
  }
  return (
    <div
      className="render-search"
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: 'auto',
      }}>
      <Input
        placeholder={placeholder}
        // onSearch={(val: string) => {
        //   onSearch(val);
        // }}
        suffix={<AiOutlineSearch size={20}/>}
        onPressEnter={props?.handlePressEnterSearch}
        onChange={handleOnChange}
        defaultValue={localStorage.getItem('searchValue') || ''}
        style={{ width: '400px', padding: '10px', paddingLeft: '30px', borderRadius: '30px' }}
        
      />
    </div>
  );
};
export default RenderSearch;
