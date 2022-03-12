import { Input } from 'antd';
import React from 'react';
import './RenderSearch.scss';

interface Props {
  onSearch?: (val: string) => void;
  onChange?: (val: string) => void;
  placeholder?: string;
}
const { Search } = Input;
const RenderSearch: React.FC<Props> = (props) => {
  const { 
    onSearch = () => {} ,
    onChange = () => {},
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
      <Search
        placeholder={placeholder}
        onSearch={(val: string) => {
          onSearch(val);
        }}
        onChange={handleOnChange}
        style={{ width: 400, padding: 20, borderRadius: 10 }}
        
      />
    </div>
  );
};
export default RenderSearch;
