import React from 'react';
import './UploadCamera.scss';
import { PlusOutlined } from '@ant-design/icons';

UploadCamera.propTypes = {
    
};

function UploadCamera(props) {
    return (
        <div className='upload-camera-container'>
            <div className='box-camera-upload'>
                <PlusOutlined/>
                <span>Thêm camera</span>
            </div>
        </div>
    );
}

export default UploadCamera;
