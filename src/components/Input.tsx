import { Form, Input } from 'antd';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import styles from 'src/styles/InputBase.module.scss';
import { SearchOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);
const InputBase = (props: any) => {
  const { 
    label, 
    name, 
    type, 
    placeholder, 
    formItemProps, 
    isShowIcon = false, 
    stylePadding = false, 
    onKeyDownValue = () => {},
    handleClickSearch = () => {},
    onChange = () => {}
 } = props;
  const [inputValue, setInputValue] = useState('');
  const handleOnkeyDown = (event: any) => {
    if (event.keyCode === 13) {
      onKeyDownValue(event.target.value)
    }
  }
  const handleOnChangeInput = (event: any) => {
    setInputValue(event.target.value);
    onChange(event.target.value)
  }
  const handleClickSearchIcon = () => {
    handleClickSearch(inputValue);
  }
  return (
    <React.Fragment>
      <Form.Item label={label} name={name} rules={formItemProps} className={stylePadding && cx('form-item-style')}>
        <Input 
          type={type} 
          placeholder={placeholder} 
          className={cx('base-input')} 
          onKeyDown={(event) => handleOnkeyDown(event)}
          onChange={(event) => handleOnChangeInput(event)}
        />
        {isShowIcon && <SearchOutlined className={cx('search-icon')} onClick={handleClickSearchIcon} />}
      </Form.Item>
    </React.Fragment>
  );
};

export default InputBase;
