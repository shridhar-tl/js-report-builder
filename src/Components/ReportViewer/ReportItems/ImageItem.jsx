import React from "react";
import ItemsBase from "./ItemsBase";

class ImageItem extends ItemsBase {
    getStateObject = async () => {
        const { definition } = this.props;
        const defProps = await this.processDefaultProps(definition);
        const { style, tooltip, disabled, clickAction, actionProps } = defProps;
        let { hidden } = defProps;
        const { srcMode, autoHide } = definition;
        let { src, altText } = definition;

        src = src ? await this.tryParseExpression(src) : src;
        altText = altText ? await this.tryParseExpression(altText) : altText;

        if (srcMode === 2) {
            // ToDo: based on srcMode take image from resource
        }

        if (src && typeof src.then === "function") {
            src.then(data => {
                this.setState({ src: data });
            });
            src = null;
        }
        else if (!src && autoHide) {
            hidden = true;
        }

        return { style, src, altText, tooltip, hidden, disabled, clickAction, actionProps };
    };

    renderChild() {
        const { src, altText, tooltip, style, disabled, clickAction, actionProps } = this.state;

        if (!clickAction) {
            return <img style={style} src={src} alt={altText} disabled={disabled} title={tooltip} />;
        }
        else if (clickAction === "LNK") {
            return <a title={tooltip} href={actionProps} disabled={disabled} target="_blank" rel="noopener noreferrer"><img style={style} src={src} alt={altText} /></a>;
        }
        else {
            return <img style={style} src={src} alt={altText} disabled={disabled} title={tooltip} onClick={this.callAction} />;
        }
    }
}

export default ImageItem;
