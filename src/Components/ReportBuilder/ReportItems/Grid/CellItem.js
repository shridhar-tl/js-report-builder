import React, { PureComponent } from "react";
import "./CellItem.scss";

class CellItem extends PureComponent {
    removeItem = e => {
        e.stopPropagation();
        const { onRemove, index } = this.props;
        onRemove(index);
    }

    beginEdit = () => {
        const { beginEdit, index } = this.props;
        beginEdit(index);
    }

    handleClick = e => {
        const { itemData, index } = this.props;
        if (!e.selections) { e.selections = []; }
        e.selections.push({ ctl: this, element: e.currentTarget, data: itemData, index: index });
        //this.props.selected(index);
    }

    render() {
        const { text, itemData, showContext, dropHndl } = this.props;
        const { style } = itemData;

        return (
            <div className="grid-cell-item">
                <i className="fa fa-times" title="Remove item" onClick={this.removeItem} />
                <span ref={dropHndl.dropConnector} style={style} onContextMenu={showContext}
                    onDoubleClick={this.beginEdit} onClick={this.handleClick}>
                    {text || "<<expr>>"}
                </span>
            </div>
        );
    }
}

export default CellItem;
