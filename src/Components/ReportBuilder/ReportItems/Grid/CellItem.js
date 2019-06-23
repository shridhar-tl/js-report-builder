import React, { PureComponent } from "react";
import "./CellItem.scss";

class CellItem extends PureComponent {
    render() {
        var { text, index, itemData, showContext } = this.props;
        var { style } = itemData;
        return (
            <div className="grid-cell-item">
                <i
                    className="fa fa-times"
                    onClick={e => {
                        e.stopPropagation();
                        this.props.onRemove(index);
                    }}
                    title="Remove item"
                />
                {
                    <span style={style}
                        onClick={e => {
                            if (!e.selections) { e.selections = []; }
                            e.selections.push({ ctl: this, element: e.currentTarget, data: itemData, index: index });
                            //this.props.selected(index);
                        }}
                        onContextMenu={showContext}
                        onDoubleClick={() => this.props.beginEdit(index)}>
                        {text || "<<expr>>"}
                    </span>
                }
            </div>
        );
    }
}

export default CellItem;
