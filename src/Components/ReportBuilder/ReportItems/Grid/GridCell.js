import React, { PureComponent } from "react";
import CellItem from "./CellItem";
import ExpressionEditor from "../../Common/ExpressionEditor";
import Sortable from "../../DragDrop/Sortable";
import { GridContext } from "../../Common/Constants";
import classNames from "classnames";
import "./GridCell.scss";

const rxIsValidName = /^[A-Za-z_]+[A-Za-z0-9_]*$/;

const gridCellAccepts = ["GRID_ITEM", "RPT_CMPN", "RPT_DS_PRPS", "RPT_PARM"];

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
        var { style, isHeaderCell } = this.props;
        var { editMode, editedItem, selected, cellData } = this.state;
        var CellType = isHeaderCell ? "th" : "td";

        return (
            <Sortable items={cellData} moduleName="GridCell" itemType="GRID_ITEM" accepts={gridCellAccepts}
                useCustomContainer onItemAdded={this.cellItem_Added} onChange={this.updateCellData}>
                {(renderItems, dropProps) => (
                    <CellType
                        className={classNames({ "drop-active": dropProps.isActive, selected })}
                        style={style}
                        onDoubleClick={() => this.beginEdit(-1)}
                        onClick={e => this.cellSelected(null, e)}>
                        {editMode && (
                            <ExpressionEditor
                                className="grid-cell-expression"
                                expression={editedItem.expression || editedItem.data}
                                type={editedItem.itemType}
                                noGroups={true}
                                endEdit={this.expressionValueReceived}
                            />
                        )}
                        {!editMode && renderItems(this.getItemHtml)}
                    </CellType>
                )}

            </Sortable>
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
        this.updateCellData(cellData, editedItem);
    }

    updateCellData = (cellData, editedItem) => {
        this.props.onChange(cellData);
        this.setState({ cellData, editedItem });
    }

    cellItem_Added = (source) => {
        var { cellData } = this.state;
        const { item } = source;

        let newItem = item;

        if (source.itemType === "RPT_DS_PRPS") {
            newItem = { data: "[" + item.key + "]", expression: rxIsValidName.test(item.path) ? 'Fields.' + item.path : "Field('" + item.path + "')" };
        }
        else if (source.itemType === "RPT_PARM") {
            newItem = { data: "$[" + item.display + "]", expression: 'Parameters.' + item.name };
        }
        else if (source.itemType === "RPT_CMPN") {
            switch (item.type) {
                case "IMG":
                    newItem = { itemType: "IMG", style: { height: "20px", width: "20px" } };
                    break;
                case "MNU":
                    newItem = { itemType: "MNU", style: {} };
                    break;
                default:
                    newItem = { itemType: "", style: {} };
                    break;
            }
        }

        cellData.push(newItem);
        this.dataChanged(cellData);
    };

    cellItem_Moved = (item, index) => {
        this.removeItem(index);
    };

    getItemHtml = (d, i, dropHndl) => {
        switch (d.itemType) {
            case "IMG":
                return <img key={i} ref={dropHndl.dropConnector} style={d.style} alt=""
                    onClick={e => this.itemSelected(e, i, d)} onContextMenu={e => this.showItemContext(e, d, i)} />;

            case "MNU":
                return <span key={i} ref={dropHndl.dropConnector} style={d.style} className="fa fa-ellipsis-v"
                    onClick={e => this.itemSelected(e, i, d)} onContextMenu={e => this.showItemContext(e, d, i)} />;

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
                        dropHndl={dropHndl}
                        showContext={e => this.showItemContext(e, d, i)}
                    />
                );
        }
    };

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
                }, () => { /* No need to handle this. This is to avoid unhandled rejection error */ });
                break;
            default: break;
        }
    }
}

export default GridCell;
