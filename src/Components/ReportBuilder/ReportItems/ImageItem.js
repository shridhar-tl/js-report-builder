import React from 'react';
import ReportItemBase from './ReportItemBase';

class ImageItem extends ReportItemBase {
    render() {
        return super.renderBase(<img src="test.jpg" alt="" />);
    }
}

export default ImageItem;