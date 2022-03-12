import { Modal } from 'antd';
import { Fragment } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import './style.scss';

const ModalComponent = ({ children, title, onClose, showCloseIcon = true, maskClosable, visible, width}: any) => {
  return (
    <Modal visible={visible} footer={null} wrapClassName='modal-show' closable={false} width={width ?? 565} onCancel={onClose} maskClosable={maskClosable}>
      <Fragment>
        {showCloseIcon && (
          <button onClick={onClose} type="button" className="ant-modal-close">
            <span className="ant-modal-close-x">
              <CloseOutlined />
            </span>
          </button>
        )}
        {title && <div className="modal-show__title">{title}</div>}
        <div className="modal-show__wrap">
          {children}
        </div>
      </Fragment>
    </Modal>
  );
};

export default ModalComponent;
