import { Input, Table } from 'antd';
import classNames from 'classnames/bind';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import emptyImg from 'src/assets/icon/empty-img-default.png';
import BaseButton from 'src/components/Button';
import RenderSearch from 'src/components/render-search/RenderSearch';
import { baseUrlExplorer } from 'src/constant/urlConfig';
import { getAllPools } from 'src/services/pool-service';
import styles from 'src/styles/PoolManagement.module.scss';
import { commaFormat, removeAccents } from 'src/utils/utils';

const cx = classNames.bind(styles);

const PoolManagement = (props: any) => {
 

  return (
    <React.Fragment>
      <div>
        Hello
      </div>
    </React.Fragment>
  );
};

export default PoolManagement;
