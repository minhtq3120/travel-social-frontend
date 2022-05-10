import { Button, Form, Input, List, notification, Spin, Tag, Tooltip } from 'antd';
import classNames from 'classnames/bind';
import React, { useCallback, useEffect, useState } from 'react';
import styles from 'src/styles/Staking.module.scss';
import { SearchOutlined } from '@ant-design/icons';
import { BsThreeDots, BsPersonCircle,BsFlag } from 'react-icons/bs';
import { AiOutlineHeart , AiOutlineShareAlt} from 'react-icons/ai';
import { FaRegComment, FaRegHeart, FaShareAlt,FaRegShareSquare , FaLocationArrow, FaHeart} from 'react-icons/fa';
import ReactHashtag from "react-hashtag";
import ImageGallery from 'react-image-gallery';
import { Slide, Fade } from 'react-slideshow-image';
import "react-slideshow-image/dist/styles.css";
import ReactPlayer from 'react-player';
import AwesomeSlider from 'react-awesome-slider';
import moment from 'moment';
import { getLikeOfPots, likePost, unLikePost } from 'src/services/like-service';
import Modal from 'antd/lib/modal/Modal';
import { followId, unfollowId } from 'src/services/follow-service';
import _ from 'lodash'
import { commentToPost, getCommentsOfPost, getReplyOfComment, replyToComment } from 'src/services/comment-service';
import VirtualList from 'rc-virtual-list';
import Avatar from 'antd/lib/avatar/avatar';
import { sleep } from 'src/containers/Newfeed/Newfeed';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import { getPostDetail } from 'src/services/post-service';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { SEND_NOTIFICATION } from 'src/components/Notification/Notification';
import { NotificationAction } from '../Layout/layout';
import InfinityList from 'src/components/InfinityScroll/InfinityScroll';
import { getListPool, getSignature, getStakingDataByAddress } from 'src/services/pool-service';
import { injectedConnector, msnToken, staking, STAKING_ADDRESS } from 'src/constant/contract-service';
import Web3 from 'web3';
import { AiOutlineArrowDown, AiOutlineClockCircle, AiFillQuestionCircle} from 'react-icons/ai';
import { ReactComponent as Coin } from 'src/assets/coin.svg';

import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
 

import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { notificationError, notificationSuccess } from '../Login/Login';
const web3 = new Web3;

const cx = classNames.bind(styles);
const ContainerHeight = 850;

const MAX_INT = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

export const secondsToDhms = (seconds) => {
seconds = Number(seconds);
let d = Math.floor(seconds / (3600*24));
let h = Math.floor(seconds % (3600*24) / 3600);
let m = Math.floor(seconds % 3600 / 60);
let s = Math.floor(seconds % 60);

let dDisplay = d > 0 ? d + (d == 1 ? " ngày " : " ngày ") : "";
let hDisplay = h > 0 ? h + (h == 1 ? " giờ " : " giờ ") : "";
let mDisplay = m > 0 ? m + (m == 1 ? " phút " : " phút ") : "";
let sDisplay = s > 0 ? s + (s == 1 ? " giây" : " giây") : "";
return dDisplay + hDisplay + mDisplay + sDisplay;
}

const StakingPage = (props: any) => {

    const walletAccount = useSelector((state: RootState) => state.wallet.account) || localStorage.getItem('account');
    const [signature, setSignature] = useState('')
    const { account : ac, library, chainId , activate, deactivate} = useWeb3React();

    const [isModalVisibleStake, setisModalVisibleStake] = useState(false)
    const [allowance, setAllowance] = useState('')
    const [form] = Form.useForm();
    const [stakedValue, setStakedValue] = useState('')
    const [checkAllowMSN, setCheckAllowMSN] = useState<boolean>(false);

    const [yourStakeData, setYourStakeData] = useState<any>(null)

  const [pool, setPool] = useState<any>(null)

  const getListPoolActive =  async () => {

    const result = await getListPool()
    if(result) {
      const dataSource = _.get(result, 'data', null);
        if(dataSource) setPool(dataSource)
    }
    
  };


//   useEffect(() => {
//     if(walletAccount && walletAccount?.length > 0) activate(injectedConnector, undefined, true);
//   }, [walletAccount, ac])

  useEffect(() => {
    if(yourStakeData?.maxStake) form.setFieldsValue({maxStake: yourStakeData?.maxStake})
  }, [yourStakeData])

  useEffect(() => {
    getListPoolActive()
  }, []);



    const handleFinish = async (values) => {
        try {
            let amountToWei = await web3.utils.toWei(String(values?.amount), 'ether')
            let maxStakeToWei= await web3.utils.toWei(String(values?.maxStake), 'ether')
            const stake = await handleStake(0, maxStakeToWei, amountToWei , values?.signature)
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        form.setFieldsValue({signature})
    }, [signature])

    const checkAllowance = async (walletAddress: string) => {
        const contract = await msnToken();
        const allowance = await contract.allowance(walletAddress, STAKING_ADDRESS)
        const number = await Web3.utils.hexToNumberString(allowance._hex);

        setAllowance(number)
    }

    useEffect(() => {
       if(walletAccount && ac) {
           checkAllowance(walletAccount)        
            getStakingData()
        }
        else setYourStakeData(null)
    }, [walletAccount, ac])
     useEffect(() => {
        if(allowance?.length > 0 && stakedValue?.length > 0){
            let compare = new BigNumber(String(allowance)).minus(web3.utils.toWei(String(stakedValue), 'ether'));
            setCheckAllowMSN(compare.s === -1 || allowance === '0');
        }
       
    }, [allowance, stakedValue]);


    useEffect(() => {
        if(form.getFieldValue('amount')) setStakedValue(form.getFieldValue('amount'))
    }, [form.getFieldValue('amount')])

    const getSignatureFromBE = async() => {
        try {
            if(walletAccount && ac) {
                const payload = {
                    poolId: 0,
                    walletAddress: walletAccount
                }
                const signature = await getSignature(payload)
                const result = _.get(signature, 'data', []);

                setSignature(result?.signature)
            }
            
        } 
        catch (err) {
            console.log(err)
        }
    }
    
     const getStakingData = async() => {
        try {
            if(walletAccount && ac) {
                const payload = {
                    walletAddress: walletAccount
                }
                const signature = await getStakingDataByAddress(payload)
                const result = _.get(signature, 'data', []);

                setYourStakeData(result)
            }
            
        } 
        catch (err) {
            console.log(err)
        }
    }
    
    const Voucher = [
    {
      id:1,
      title: "1000 điểm",
      days: '50 ngày',
      img: "https://vinhhaitravel.vn/Media/Sliders/1.jpg"
    },
     {
      id:2,
      title: "3000 điểm",
      days: '100 ngày',
      img: "http://dulichdaiduong.vn/upload/voucher-du-lich-he-sieu-tiet-kiem-vi-vu-bon-phuong-troi-cung-du-lich-dai-duong.jpg"
    },
     {
      id:3,
      title: "7000 điểm",
      days: '200 ngày',
      
      img: "https://cattour.vn/images/upload/images/voucher/voucher-1.png"
    },
     {
      id:4,
      title: "10000 điểm",
      days: '365 ngày',
      img: "https://www.tugo.com.vn/wp-content/uploads/Voucher-815x459.jpg"
    },
  ]

    const handleStake = async (poolId: number, maxAmount: string, amount: string, signature: number) => {
        try {
        const contract = await staking();
        const stake = await contract
            .deposit(poolId, maxAmount, amount, signature)
            .then(async (res: any) => {
            const rs = await res.wait();
            notificationSuccess('stake thành công')
            });
        } catch (error: any) {
            if (error && (error?.code === 4001 || error?.message === 'User rejected the transaction')) {
                notificationError('Bạn đã từ chối giao dịch')
            } else {
                notificationError('Đã xảy ra lỗi')
            }
        }
    };

    const handleApproveMSN = async (spender: string) => {
        try {
        const contract = await msnToken();
      const approve = await contract
            .approve(spender, MAX_INT)
            .then(async (res: any) => {
            const rs = await res.wait();
            notification.success({
                message: 'stake success full',
                duration: 7,
                className: 'toast__message toast__message__success',
                style: {
                width: '450px'
                },
            });
            });
        } catch (error: any) {
            if (error && (error?.code === 4001 || error?.message === 'User rejected the transaction')) {
                notification.error({
                message: 'You declined the action in your wallet',
                duration: 7,
                className: 'toast__message toast__message__error',
                });
            } else {
                notification.error({
                message: 'Something went wrong',
                duration: 7,
                className: 'toast__message toast__message__error',
                });
            }
        }
    };
    const StakeForm = () => {
        return (
            <div className={cx('stakeinfo-container')}>
            <div className={cx('stakeData-container')}>
                <div className={cx('title')}>
                    Thông tin stake của bạn
                </div>
                <div className={cx('staked')}>
                    <div className={cx('staked-title')}>Tổng lượng stake: </div>
                    <div className={cx('staked-value')}>{yourStakeData ? (
                        <div className={cx('value')} style={{display: 'flex', flex: 'row', justifyContent:'center', alignItems: 'center'}}>
                                <Coin
                                style={{height: '30px', width: '30px', borderRadius: '50%', marginRight: '5px'}}
                                />{`${parseFloat(yourStakeData?.yourStaked).toFixed(2)} MSN` || `----`}
                            </div>
                    ): null}</div>
                </div>

                <div className={cx('staked')}>
                    <div className={cx('staked-title')}>
                        <div>lượng stake tổi thiểu</div>
                        <Tooltip placement="topLeft" title={"dựa vào lần stake cuối cùng của bạn"}>
                          <AiFillQuestionCircle color='#68d1c8' size={20} style={{margin: '0 5px'}}/>
                        </Tooltip>
                    </div>
                    
                    <div className={cx('staked-value')}>{yourStakeData ? (
                        <div className={cx('value')} style={{display: 'flex', flex: 'row', justifyContent:'center', alignItems: 'center'}}>
                                <Coin
                                style={{height: '30px', width: '30px', borderRadius: '50%', marginRight: '5px'}}
                                />{`${parseFloat(yourStakeData?.minInvestment).toFixed(2)} MSN` || `----`}
                            </div>
                    ) : null}</div>
                </div>

                <div className={cx('staked')}>
                    <div className={cx('staked-title')}>Lần đầu stake: </div>
                    <div className={cx('staked-value')}>{moment.unix(Number(yourStakeData?.joinTime)).format('YYYY-MM-DD HH:mm')}</div>
                </div>
                <div className={cx('staked')}>
                   <div className={cx('staked-title')}>Lần gần nhất stake: </div>
                    <div className={cx('staked-value')}>{moment.unix(Number(yourStakeData?.updatedTime)).format('YYYY-MM-DD HH:mm')}</div>
                </div>

            </div>    

             <div className={cx('stakeform-container')}>
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    onFinish={handleFinish}
                    className={cx('forn')}
                     style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start' , justifyContent: 'flex-start'}}

                >
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center' , justifyContent: 'flex-start'}}>
                        <div style={{fontWeight: 'bold', padding: '10px'}}>Lượng stake tối đa</div><div style={{color: 'red'}}>(*)</div>
                    </div>
                    <Form.Item 
                        name="maxStake"
                        rules={[
                            ({ getFieldValue }) => ({
                            validator(_, value: string) {
                                return Promise.resolve()
                            }
                            })
                        ]}
                        // initialValue={200000}
                        >
                        <Input
                            type='number'
                            className={cx('seach-input')}
                            style={{borderRadius: '20px', padding: '10px', paddingLeft: '20px', width: '400px'}}
                            onChange={(e) => {
                            }}
                            disabled={true}
                            
                        />
                        </Form.Item>


                     <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center' , justifyContent: 'flex-start'}}>
                        <div style={{fontWeight: 'bold', padding: '10px'}}>Lượng stake </div><div style={{color: 'red'}}>(*)</div>
                    </div>
                <Form.Item 
                    name="amount"
                    className={cx('formitem')}
                    rules={[
                        ({ getFieldValue }) => ({
                        validator(_, value: string) {
                            return Promise.resolve()
                        }
                        })
                    ]}
                    >
                    <Input
                        type='number'
                        className={cx('seach-input')}
                        style={{borderRadius: '20px', padding: '10px', paddingLeft: '20px', width: '400px'}}
                        onChange={(e) => {
                            // setStakedValue(e.target.value)
                        }}
                    />
                    </Form.Item>
                    <div style={{width: '400px' ,display: 'flex', flexDirection: 'row', alignItems: 'center' , justifyContent: 'space-between'}}>
                        <Button className={cx('btn-stake')} onClick={() => {
                            if(walletAccount && walletAccount?.length >0)checkAllowance(walletAccount)
                            if(form.getFieldValue('amount')?.length > 0)setStakedValue(form.getFieldValue('amount'))
                            else setStakedValue('')
                        }}
                        // disabled={!stakedValue || stakedValue?.length <= 0 ? true : false}
                        // style={{backgroundColor: !stakedValue || stakedValue?.length <= 0  ? 'grey' : '#68d1c8', borderColor: !stakedValue || stakedValue?.length  <=0 ? 'grey' : '#68d1c8'}}
                        >
                        Check allowance
                        </Button>
                        {/* <Button className={cx('btn-stake')} onClick={() => {
                               if(walletAccount) handleApproveMSN(walletAccount)
                            }}

                            disabled={(!stakedValue || stakedValue?.length <= 0) || !checkAllowMSN  ? true : false}
                             style={{backgroundColor: !stakedValue || stakedValue?.length <= 0 || !checkAllowMSN ? 'grey' : '#68d1c8', borderColor: !stakedValue || stakedValue?.length  <= 0 || !checkAllowMSN ? 'grey' : '#68d1c8'}}
                            >
                            
                            Approve now
                        </Button> */}
                    
                    </div>
                    
                    

                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center' , justifyContent: 'flex-start'}}>
                            <div style={{fontWeight: 'bold', padding: '10px'}}>Chữ ký</div><div style={{color: 'red'}}>(*)</div>
                        </div>
                        <Form.Item 
                            name="signature"
                            rules={[
                                ({ getFieldValue }) => ({
                                validator(_, value: string) {
                                    return Promise.resolve()
                                }
                                })
                            ]}
                            initialValue={signature}
                            >
                            <Input
                                type='string'
                                className={cx('seach-input')}
                                style={{borderRadius: '20px', padding: '10px', paddingLeft: '20px', width: '400px'}}
                                onChange={(e) => {
                                }}
                                disabled={true}
                               
                            />
                            </Form.Item>
                        
                        <Form.Item>
                     <div style={{width: '400px' ,display: 'flex', flexDirection: 'row', alignItems: 'center' , justifyContent: 'space-between'}}>
                            <Button className={cx('btn-stake')} onClick={() => {
                                if(walletAccount) handleApproveMSN(walletAccount)
                                }}

                                disabled={(!stakedValue || stakedValue?.length <= 0) || !checkAllowMSN  ? true : false}
                                style={{backgroundColor: !stakedValue || stakedValue?.length <= 0 || !checkAllowMSN ? 'grey' : '#68d1c8', borderColor: !stakedValue || stakedValue?.length  <= 0 || !checkAllowMSN ? 'grey' : '#68d1c8'}}
                                >
                                
                                Approve now
                            </Button>
                            <Button className={cx('btn-stake')} htmlType="submit" disabled={(!stakedValue || stakedValue?.length <= 0) || checkAllowMSN  ? true : false}
                                style={{backgroundColor: !stakedValue || stakedValue?.length <= 0 || checkAllowMSN ? 'grey' : '#68d1c8', borderColor: !stakedValue || stakedValue?.length <= 0 || checkAllowMSN ? 'grey' : '#68d1c8'}}>
                                Stake now
                            </Button>
                        </div>

                            
                        </Form.Item>

                </Form>

                
            </div> 
            </div>

        )
    }
    return (
        <>
        {
            !pool ? null :
                <div className={cx('staking-container')}>
                    <div className={cx('pool-container')}>
                        <div className={cx('totalstaked')}>
                            <div className={cx('name')}>
                                Tổng lượng stake
                            </div>
                            <div className={cx('value')} style={{display: 'flex', flex: 'row', justifyContent:'center', alignItems: 'center'}}>
                                <Coin
                                style={{height: '30px', width: '30px', borderRadius: '50%', marginRight: '5px'}}
                                />{parseFloat(pool?.totalStaked).toFixed(2)} MSN
                            </div>

                        </div>
                        <div className={cx('pool-lockduration')}>
                            <div className={cx('name')}>
                                Thời gian khóa
                            </div>
                            <div className={cx('value')}>
                                {secondsToDhms(pool?.lockDuration)}
                            </div>
                        </div>
                        <div className={cx('pool-apr')}>
                            <div className={cx('name')}>
                                APR (%)
                            </div>
                            <div className={cx('value')}>
                            {pool?.apr}%
                            </div>
                        </div>
                        <div className={cx('pool-apr')}>
                            <div className={cx('name')}>
                                Điểm / Lượng stake của bạn
                            </div>
                            <div className={cx('value')}>
                            {yourStakeData?.yourStaked ? `${parseFloat(yourStakeData?.yourStaked).toFixed(0)} điểm` : `---`}
                            </div>
                        </div>
                        <div className={cx('pool-apr')}>
                            <div className={cx('name')}>
                                Thời gian đã stake
                            </div>
                            <div className={cx('value')}>
                            {yourStakeData?.yourStaked ? `${moment.duration(moment().startOf('day').diff(moment.unix(Number(yourStakeData?.joinTime)))).days()} Ngày` :`---`}
                            </div>
                        </div>
                        {
                        !walletAccount || !ac ?  (
                                <Button className={cx('btn-stake')} onClick={() => {
                                    }}>
                                    Connect Wallet
                                </Button>
                            ) : (
                                <Button className={cx('btn-stake')} onClick={() => {
                                        getSignatureFromBE()
                                        getStakingData()
                                        setisModalVisibleStake(true)
                                    }}>
                                    Stake now
                                </Button>
                            )
                        }
                    </div>

                    

                    <div className={cx('voucher-container')}>
                        
                        <div className={cx(`travel-type`)} >
                            {
                            Voucher.map((item) => {
                                return (
                                    // selectedTravelWith !== item.id ? (
                                        <div key={item?.id} className={cx('type-container')} onClick={() => {}}>
                                        <img src={item.img} className={cx('type-img')}/>
                                        <div className={cx('type-text')}>
                                            {item?.title}
                                        </div>
                                        </div>
                                    // ) : (
                                    // <div key={item?.id} className={cx('type-container-selected')} onClick={() => {setSelectedTravelWith('')}}>
                                    //     <img src={item.img} className={cx('type-img')}/>
                                    //     <div className={cx('type-text')}>
                                    //         {item?.title}
                                    //     </div>
                                    // </div>
                                    // )
                                
                                )
                            })
                            }
                        </div>
                        {/* <div className={cx('left')}>

                         </div>   

                        <div className={cx('right')}>
                        <div className={cx('voucher-detail-container')}>
                            <div className={cx('voucher-img')}>     
                                <img src={`https://vinhhaitravel.vn/Media/Sliders/1.jpg`} className={cx('img')}/>
                            </div>

                            <div className={cx('voucher-info')}>
                                <div className={cx('point')}>
                                    3000 điểm
                                </div>

                                <div className={cx('time')}>
                                    250 ngày
                                </div>
                            </div>
                        </div>
                        <div className={cx('voucher-detail-container')}>
                            <div className={cx('voucher-img')}>     
                                <img src={`http://dulichdaiduong.vn/upload/voucher-du-lich-he-sieu-tiet-kiem-vi-vu-bon-phuong-troi-cung-du-lich-dai-duong.jpg`} className={cx('img')}/>
                            </div>

                            <div className={cx('voucher-info')}>
                                <div className={cx('point')}>
                                    2000 điểm
                                </div>

                                <div className={cx('time')}>
                                    150 ngày 
                                </div>
                            </div>
                        </div>
                        <div className={cx('voucher-detail-container')}>
                            <div className={cx('voucher-img')}>     
                                <img src={`https://cattour.vn/images/upload/images/voucher/voucher-1.png`} className={cx('img')}/>
                            </div>

                            <div className={cx('voucher-info')}>
                                <div className={cx('point')}>
                                    500 điểm
                                </div>

                                <div className={cx('time')}>
                                    60 ngày
                                </div>
                            </div>
                        </div>
                         <div className={cx('voucher-detail-container')}>
                            <div className={cx('voucher-img')}>     
                                <img src={`https://www.tugo.com.vn/wp-content/uploads/Voucher-815x459.jpg`} className={cx('img')}/>
                            </div>

                            <div className={cx('voucher-info')}>
                                <div className={cx('point')}>
                                    200 điểm
                                </div>

                                <div className={cx('time')}>
                                    30 ngày
                                </div>
                            </div>
                        </div>
                        
                    </div>*/}
                        </div> 
                        
                </div>
        }

         <Modal visible={isModalVisibleStake} footer={null} onCancel={() => {setisModalVisibleStake(false)}} style={{borderRadius: '20px', padding: '0px !important'}} width={500} closable={false} bodyStyle={{padding: '0'}}>
            <StakeForm />
        </Modal>
        </>
  );
};

export default StakingPage;
