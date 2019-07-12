import React from 'react';
import ReportItemBase from '../ReportItemBase';
import ImageProperties from './ImageProperties';

class ImageItem extends ReportItemBase {
    constructor(props) {
        super(props, ImageProperties);
    }

    render() {
        var { src, altText } = this.state.definition;

        if (typeof altText !== "string") {
            altText = src ? ((typeof src === "string") ? (altText ? "Alt text will be evaluated at runtime" : "Alt text not set")
                : "Image Url will be evaluated at runtime") : "Image Url not set";
        }

        return super.renderBase(<img alt={altText} style={{ width: '80px', height: '50px' }} />);
    }
}

export default ImageItem;