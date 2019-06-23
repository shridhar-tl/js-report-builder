import React from 'react';
import ReportItemBase from './ReportItemBase';

class ImageItem extends ReportItemBase {
    render() {
        return super.renderBase(<img alt="Image Url not set" style={{ width: '80px', height: '50px' }} />);
    }
}

export default ImageItem;