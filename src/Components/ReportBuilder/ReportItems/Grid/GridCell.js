import React, { PureComponent } from "react";
import CellItem from "./CellItem";
import ExpressionEditor from "../../Common/ExpressionEditor";
import DraggableHandle from "../../DragDrop/DraggableHandle";
import Droppable from "../../DragDrop/Droppable";
import "./GridCell.scss";
import { GridContext } from "../../Common/Constants";

class GridCell extends PureComponent {
    static contextType = GridContext;

    constructor(props) {
        super(props);
        this.state = { cellData: props.cellData, editMode: false, editedItem: null };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({ cellData: newProps.cellData });
    }

    render() {
        var { index, style, isHeaderCell } = this.props;
        var { editMode, editedItem, selected, cellData } = this.state;
        var CellType = isHeaderCell ? "th" : "td";

        return (
            <Droppable type={["GRID_ITEM", "RPT_ITMS", "RPT_DS_PRPS"]} onItemAdded={this.cellItem_Added}>
                <CellType
                    className={selected ? "selected" : ""}
                    title={index}
                    style={style}
                    onDoubleClick={() => this.beginEdit(-1)}
                    onClick={e => this.cellSelected(null, e)}>
                    {editMode && (
                        <ExpressionEditor
                            className="expression"
                            expression={editedItem.expression || editedItem.data}
                            type={editedItem.itemType}
                            endEdit={this.expressionValueReceived}
                        />
                    )}
                    {!editMode && this.getDataHTML(cellData)}
                </CellType>
            </Droppable>
        );
    }

    expressionValueReceived = (val, type, prop) => {
        if (prop.isCanceled) { this.endEdit(); return; }
        var { editedItem, cellData } = this.state;
        val = (val || "").trim();
        if (!editedItem && val) {
            editedItem = {};
            cellData.push(editedItem);
        }

        if (!editedItem) {
            return;
        }

        if (val) {
            if (type) {
                editedItem.data = val;
                editedItem.itemType = type;
                delete editedItem.expression;
            } else {
                delete editedItem.data;
                delete editedItem.itemType;
                editedItem.expression = val;
            }
        } else {
            this.removeItem(cellData.indexOf(editedItem));
            editedItem = this.cellSelected();
        }

        this.endEdit();
        this.dataChanged(cellData, editedItem);
        return editedItem;
    };

    itemSelected = (e, index, data) => {
        if (!e.selections) {
            e.selections = [];
        }
        e.selections.push({ ctl: this, element: e.currentTarget, data, index });
    };

    cellSelected = (index, e) => {
        var { cellData: data } = this.state;
        if (!e.selections) {
            e.selections = [];
        }
        e.selections.push({ ctl: this, element: e.currentTarget, data, index: index });
        var editedItem = this.props.cellData[index || 0];
        this.props.grid.itemSelected(this, this.props.cellData, editedItem);
        this.changeSelection(true, editedItem);
        return editedItem;
    };

    changeSelection = (isSelected, editedItem) => {
        var state = { selected: !!isSelected };
        if (editedItem) {
            state.editedItem = editedItem;
        }
        this.setState(state);
    };

    removeItem = index => {
        var { cellData } = this.state;
        cellData.splice(index, 1);
        this.dataChanged(cellData);
        // ToDo: need to update the editedItem based on current selection and if required event should be raised to grid
    };

    beginEdit = index => {
        var { cellData } = this.state;

        if (index === -1) {
            index = 0;
            if (!cellData.length) {
                cellData.push({ data: "", itemType: "text" });
            }
        }
        this.setState({ editMode: true, editedItem: cellData[index] });
    };

    endEdit = index => {
        var { editedItem, cellData } = this.state;
        if (!editedItem) {
            return;
        }
        var editedIndex = cellData.indexOf(editedItem);
        if (!editedItem.data && !editedItem.expression && ~editedIndex) {
            this.removeItem(editedIndex);
        }
        this.setState({ editMode: false });
    };

    dataChanged(cellData, editedItem) {
        cellData = [...cellData];
        this.props.onChange(cellData);
        this.setState({ cellData, editedItem });
    }

    cellItem_Added = (item, source) => {
        var { cellData } = this.state;
        var newItem = item;
        if (source.itemType === "RPT_DS_PRPS") {
            newItem = { data: item.key, expression: 'RowGroup.Fields.' + item.path };
        } else if (source.itemType === "RPT_ITMS") {
            switch (source.item.type) {
                case "IMG":
                    newItem = { itemType: "IMG", style: { height: "16px", width: "16px" } };
                    break;
                default:
                    newItem = { itemType: "", style: { height: "16px", width: "16px" } };
                    break;
            }
        }

        cellData.push(newItem);
        this.dataChanged(cellData);
    };

    cellItem_Moved = (item, index) => {
        this.removeItem(index);
    };

    getItemHtml = (d, i) => {
        switch (d.itemType) {
            case "IMG":
                return <img key={i} style={d.style} src={d.src} alt={d.altText} onClick={e => this.itemSelected(e, i, d)} />;

            default:
                return (
                    <CellItem
                        key={i}
                        index={i}
                        text={d.data}
                        itemData={d}
                        selected={this.cellSelected}
                        onRemove={this.removeItem}
                        beginEdit={this.beginEdit}
                        endEdit={this.endEdit}
                        showContext={e => this.showItemContext(e, d, i)}
                    />
                );
        }
    };

    getDataHTML(cellData) {
        return (
            cellData &&
            cellData.map((d, i) => (
                <DraggableHandle itemType="GRID_ITEM" item={d} key={i} index={i} onMoved={this.cellItem_Moved}>
                    {this.getItemHtml(d, i)}
                </DraggableHandle>
            ))
        );
    }

    showItemContext = (e, d, i) => {
        this.context.showCellItemContext(e, i, d, this.menuClicked);
    }

    menuClicked = (index, data, menu) => {
        switch (menu) {
            case "EDIT": this.beginEdit(index); break;
            case "REMOVE": this.removeItem(index); break;
            case "PROPS":
                this.context.builderContext.editExpression(data).then(d => {
                    var { cellData } = this.props;
                    cellData[index] = d;
                    this.dataChanged(cellData, null);
                });
                break;
        }
    }
}

export default GridCell;
