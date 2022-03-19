import React, { useState, useEffect } from 'react';
import { Upload, message, Button } from 'antd';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { BsMoonStars, BsInfoCircle, BsImages, BsUpload } from 'react-icons/bs';


const UploadLogo = (props: any) => {
  const { className } = props;
  const [file, setFile] = useState<any>([])
  const [imageBase64, setImageBase64] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  function getBase64(img: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  const uploadButton = (
      <div style={{
        display: 'flex', 
        alignContent:'center', 
        alignItems: 'center', 
        justifyContent: 'center',
         flexDirection: 'column', 
         boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
         width: '200px',
         height: '200px',
         cursor: 'pointer'
         }}>
          {loading ? <LoadingOutlined /> : <BsUpload />} {props?.title} 
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
        setLoading(true)
        console.log(info.file, info.fileList);
        if(info.fileList.length === 0) {
          props.setFile(null)
          setLoading(false)
        }
      }
      if (info.file.status === 'done') {
        if(!info.file.name.match(/\.(jpg|jpeg|png|gif|PNG)$/)){
          message.error('Invalid logo image')
          props.setFile(null)
          setLoading(false)
        } 
        else {
          getBase64(info.file.originFileObj, (imageUrl) => {
            setImageBase64(imageUrl)
            setLoading(false)
          });
          message.success(`${info.file.name} file uploaded successfully`);
          props.setFile(info?.file?.originFileObj); 
          setLoading(false)
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    
  };

  console.log(props.file)
  return (
    <Upload {...propsRef}  
      defaultFileList={props.logoUrl} 
      customRequest={handleCustomRequest} 
      // className={className} 
      // className="avatar-uploader"
      name={props.name}  
      maxCount={props.maxCount} 
      disabled={props.disabled}
      // listType="picture-card"
      >
        <div style={{
        display: 'flex', 
        alignContent:'center', 
        alignItems: 'center', 
        justifyContent: 'center',
         flexDirection: 'column', 
         boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
         width: '200px',
         height: '200px',
         cursor: 'pointer'
         }}>
          {imageBase64 && props?.file ? <img src={imageBase64} alt="avatar" style={{ width: '100px', height: 'auto' }} /> : uploadButton}

        </div>
    </Upload>
  );
};

export default UploadLogo;
