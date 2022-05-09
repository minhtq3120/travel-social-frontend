import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { Upload, message, Button } from 'antd';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { BsMoonStars, BsInfoCircle, BsImages, BsUpload } from 'react-icons/bs';
import {AiOutlinePlus, AiOutlinePlusCircle} from 'react-icons/ai'
const UploadLogo = memo(
  (props: any) => {
    const { className, setUploaded } = props;
    const [file, setFile] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    function getBase64(img: any, callback: any) {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img);
    }


    const handleCustomRequest = ({ onSuccess }: any) => {
      onSuccess('ok');
    };
    let propsRef = {
      name: 'file',
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      headers: {
        authorization: 'authorization-text'
      },
      beforeUpload: (file: any) => {
        if (props?.createPostType) {
          const isValid = file?.name.match(
            /\.(jpg|jpeg|png|gif|PNG|mp4|3gp|3gpp|mov|wmv|flv|m3u8|avi)$/
          );
          if (!isValid) {
            message.error(`file must be image or video`);
            return Upload.LIST_IGNORE;
          }
        } else {
          const isValid = file?.name.match(/\.(jpg|jpeg|png|gif|PNG)$/);
          if (!isValid) {
            message.error(`Invalid logo image`);
            return Upload.LIST_IGNORE;
          }
        }
      },
      onChange(info: any) {
        if (info.file.status !== 'uploading') {
          setLoading(true);
          console.log(info.file, info.fileList);
          
            
          if (props?.setFileList){
            props.setFileList(info.fileList);
          }
          
          let temp: any = []
            info.fileList?.map(async (item) => {
            return await getBase64(item?.originFileObj, (imageUrl) => {
                temp.push({
                  uid: item.uid,
                  imageUrl
                });
                props.setImageBase64Arr(temp);
            });
          })
          if (info.fileList.length === 0) {
            props.setFile(null);
            setLoading(false);
          }
        }
        if (info.file.status === 'done') {
          if (
            !info.file.name.match(/\.(jpg|jpeg|png|gif|PNG)$/) ||
            (props?.createPostType &&
              !info.file?.name.match(/\.(jpg|jpeg|png|gif|PNG|mp4|3gp|3gpp|mov|wmv|flv|m3u8|avi)$/))
          ) {
            props.setFile(null);
            setLoading(false);
          } else {
            
            message.success(`${info.file.name} file uploaded successfully`);
            setUploaded(true);
            props.setFile(info?.file?.originFileObj);
            setLoading(false);
          }
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
        setUploaded(true);
      }
    };

    const listPropsRef = useMemo(() => {
      return propsRef;
    }, []);

    return (
      <Upload
        {...listPropsRef}
        defaultFileList={props.logoUrl}
        customRequest={handleCustomRequest}
        // className={className}
        // className="avatar-uploader"
        name={props.name}
        maxCount={props.maxCount}
        disabled={props.disabled}
        // listType="picture-card"
        listType={props.listType}
        >
        {props?.imageBase64Arr ? (
          <img
              src={
              props?.imageBase64Arr[0]?.imageUrl
              }
              alt="img"
              style={props?.coverStyle ? props?.coverStyle : {width: '150px', height:'150px', borderRadius: '50%', padding: '5px'}}
          />
        ) : (

          <AiOutlinePlusCircle  size={100} style={{cursor: 'pointer'}}/>
        //   <div
        //     style={{
        //       // display: 'flex',
        //       // alignContent: 'center',
        //       // alignItems: 'center',
        //       // justifyContent: 'center',
        //       // flexDirection: 'row',
        //       // width: '500px',
        //       // height: '200px',
        //       // cursor: 'pointer'
        //     }}>
        //     {/* {imageBase64 && props?.file ? (
        //       <img src={imageBase64} alt="avatar" style={{ width: '100px', height: 'auto' }} />
        //     ) : ( */}
              
        //    )} 
        //     </div>
        )}
      </Upload>
    );
  },
  // (prevProps: any, nextProps: any) => {
  //   return (
  //     prevProps.setfile === nextProps.setfile &&
  //     prevProps.file === nextProps.file &&
  //     prevProps.setFileList === nextProps.setfileList &&
  //     prevProps.fileList === nextProps.fileList
  //   );
  // }
);

export default UploadLogo;
