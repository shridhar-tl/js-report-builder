import React from "react";
import ItemsBase from "./ItemsBase";

class TextItem extends ItemsBase {
    getStateObject = async () => {
        const { definition } = this.props;
        const defProps = await this.processDefaultProps(definition);
        const { style, tooltip, disabled, clickAction, actionProps } = defProps;
        let { hidden } = defProps;
        let { text } = definition;

        text = text ? await this.tryParseExpression(text) : text;
        hidden = hidden ? await this.tryParseExpression(hidden) : hidden;

        return { style, elType: definition.elType || 'span', text, tooltip, hidden, disabled, clickAction, actionProps };
    };

    renderChild() {
        const { elType: Tag, text, tooltip, style, clickAction, actionProps } = this.state;

        if (!clickAction) {
            return <Tag style={style} title={tooltip} >{text}</Tag>;
        }
        else if (clickAction === "LNK") {
            return <a title={tooltip} href={actionProps} target="_blank" rel="noopener noreferrer"><Tag style={style}>{text}</Tag></a>;
        }
        else {
            return <Tag style={style} title={tooltip} onClick={this.callAction} />;
        }
    }
}

export default TextItem;
