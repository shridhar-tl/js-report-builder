import React from 'react';
import ReportItemBase from '../ReportItemBase';
import TextProperties from './TextProperties';

class TextItem extends ReportItemBase {
    constructor(props) {
        super(props, TextProperties);
    }

    render() {
        let { text } = this.state.definition;

        if (typeof text === "object") {
            text = "<<expr>>";
        }
        return super.renderBase(<span>{text || "<<Text not set>>"}</span>);
    }
}

export default TextItem;