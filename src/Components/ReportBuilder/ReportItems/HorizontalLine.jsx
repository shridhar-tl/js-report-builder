import React from 'react';
import ReportItemBase from './ReportItemBase';

class HorizontalLineItem extends ReportItemBase {
    render() {
        return super.renderBase(<hr />);
    }
}

export default HorizontalLineItem;