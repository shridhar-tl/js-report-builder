import React from "react";
import ItemsBase from "./ItemsBase";

class ImageItem extends ItemsBase {
    getStateObject = () => {
        var { definition } = this.props;

        var { style, tooltip, hidden, disabled, clickAction, actionProps } = this.processDefaultProps(definition);
        var { srcMode, src, altText } = definition;

        src = this.tryParseExpression(src);
        altText = this.tryParseExpression(altText);

        if (srcMode === 2) {
            // ToDo: based on srcMode take image from resource
        }

        return { style, src, altText, tooltip, hidden, disabled, clickAction, actionProps };
    }

    renderChild() {
        var { src, altText, tooltip, style, disabled, displayValue, clickAction, actionProps } = this.state;

        if (!clickAction) {
            return <img style={style} src={src} alt={altText} disabled={disabled} title={tooltip} />
        }
        else if (clickAction === "LNK") {
            return <a title={tooltip} href={actionProps} disabled={disabled} target="_blank" rel="noopener noreferrer"><img style={style} src={src} alt={altText} /></a>
        }
        else {
            return <img style={style} src={src} alt={altText} disabled={disabled} title={tooltip} onClick={this.callAction} />
        }
    }
}

export default ImageItem;
