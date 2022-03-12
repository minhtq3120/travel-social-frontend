import React, { useState } from "react";
import classNames from 'classnames/bind';

import styles from 'src/styles/FloatingLabel.module.scss';
const cx = classNames.bind(styles);
import "./index.css";

const FloatLabel = (props: any) => {
  const [focus, setFocus] = useState(false);
  const { children, label, value } = props;

  const labelClass =
    focus || (value && value.length > 0) ? "label label-float" : "label";

  return (
    <div
      className='float-label'
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      {children}
      <label className="label label-float">{label}</label>
    </div>
  );
};

export default FloatLabel;
