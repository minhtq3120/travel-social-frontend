import { message } from 'antd';
const windowObj = window as any;

export const checkNotEmptyArr = (array: []) => {
  return Array.isArray(array) && array.length > 0;
};

export const checknotEmtyObject = (obj: object) => {
  return typeof obj === 'object' && obj && Object.keys(obj).length > 0;
};

export const checkNetwork = () => {
  const netId = windowObj.ethereum.networkVersion
    ? +windowObj.ethereum.networkVersion
    : +windowObj.ethereum.chainId;
  if (netId) {
    return netId;
  }
};

export const removeAccents = (str: string) => {
  let AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ",
    "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ",
  ];
  for (let i = 0; i < AccentsMap.length; i++) {
    let re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
    let char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
}

export const getUTCDate = (date: Date) => {
  const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} ${date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`}:${date.getMinutes() > 9 ? date.getMinutes():`0${date.getMinutes()}`} UTC`;
}

const commaNumber = require('comma-number');
export const commaFormat = commaNumber.bindWith(',', '.');
