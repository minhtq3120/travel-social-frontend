import React, { useState, useEffect } from 'react';
import { Upload, message, Button } from 'antd';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

const UploadLogo = (props: any) => {
  const { className } = props;
  const [file, setFile] = useState<any>([])
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);

  function getBase64(img: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
  

  const handleCustomRequest = ({onSuccess}: any) => {onSuccess('ok')};

  let propsRef = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text'
    },
    beforeUpload: (file: any) => {
      const isValid = file?.name.match(/\.(jpg|jpeg|png|gif|PNG)$/);
      if (!isValid) {
        message.error(`Invalid logo image`);
        return Upload.LIST_IGNORE
      }
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
        if(info.fileList.length === 0) {
          props.setFile(null)
        }
      }
      if (info.file.status === 'done') {
        if(!info.file.name.match(/\.(jpg|jpeg|png|gif|PNG)$/)){
          message.error('Invalid logo image')
          props.setFile(null)
        } 
        else {
          message.success(`${info.file.name} file uploaded successfully`);
          props.setFile(info?.file?.originFileObj); 
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    
  };
  return (
    <Upload {...propsRef}  
      defaultFileList={props.logoUrl} 
      customRequest={handleCustomRequest} 
      className={className} 
      name={props.name}  
      maxCount={props.maxCount} 
      disabled={props.disabled}
      listType="picture-card"
      >
      {/* <Button style={{ borderRadius: '100px' }} 
              icon={<UploadOutlined />} 
              disabled={props.disabled}
      > */}
        {props?.title || 'Upload'}
      {/* </Button> */}
    </Upload>
  );
};

export default UploadLogo;
