import React from "react";
import ItemsBase from "./ItemsBase";

class ImageItem extends ItemsBase {
    getStateObject = () => {
        var { definition: { srcMode, src, altText, tooltip, hidden, disabled, style } } = this.props;

        src = this.tryParseExpression(src);
        altText = this.tryParseExpression(altText);
        tooltip = this.tryParseExpression(tooltip);
        hidden = this.parseExpr(hidden);
        disabled = this.parseExpr(disabled);

        if (srcMode === 2) {
            // ToDo: based on srcMode take image from resource
        }

        return { style, src, altText, tooltip, hidden, disabled };
    }

    renderChild = () => {
        var { src, altText, tooltip, disabled, style } = this.state;
        return <img style={style} src={src} alt={altText} disabled={disabled} title={tooltip} />;
    }
}

export default ImageItem;
