import { Button } from 'antd';
import React from 'react';
import './../styles/components/Button.scss';

interface Props {
  value: any;
  className: any;
  disabled: any;
  onClick: () => void;
  loadingProp?: boolean;
  parentClass?: string;
}

const BaseButton = (props: Props) => {
  const { value, className, disabled, onClick, loadingProp = false, parentClass } = props;

  return (
    <div className={`${parentClass} parent-button`}>
      <Button onClick={onClick} disabled={disabled} className={className} loading={loadingProp}>
        {value}
      </Button>
    </div>
  );
};

export default BaseButton;
