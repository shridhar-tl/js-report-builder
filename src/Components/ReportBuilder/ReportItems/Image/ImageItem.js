import React from 'react';
import ReportItemBase from '../ReportItemBase';
import ImageProperties from './ImageProperties';

class ImageItem extends ReportItemBase {
    constructor(props) {
        super(props);
        var { data } = props;
        if (!data) { data = {}; }
        this.state = { definition: { ...data } };
    }

    render() {
        var { definition, showPropsDialog } = this.state;
        var { src, altText } = definition;
        if (typeof altText !== "string") {
            altText = src ? ((typeof src === "string") ? (altText ? "Alt text will be evaluated at runtime" : "Alt text not set")
                : "Image Url will be evaluated at runtime") : "Image Url not set";
        }

        return super.renderBase(
            <>
                <img alt={altText} style={{ width: '80px', height: '50px' }} />
                {showPropsDialog && <ImageProperties definition={definition} onChange={this.saveProperties} onHide={this.hideProperties} />}
            </>);
    }
}

export default ImageItem;