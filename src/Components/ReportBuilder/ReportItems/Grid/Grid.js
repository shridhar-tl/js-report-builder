import React, { createContext } from "react";
import ReportItemBase from "../ReportItemBase";
import "./Grid.scss";
import GridRow from "./GridRow";
import GridGroup from "./GridGroup";
import { getNestingDepth, getDefaultGridData } from "../../Common/HelperFunctions";
import ExpressionEditor from "../../Common/ExpressionEditor";
import { contextMenu, Menu, Item, Separator, Submenu, IconFont } from "react-contexify";
import array from "../../../../Common/linq";
import "react-contexify/dist/ReactContexify.min.css";
import GroupProperties from "../../Common/GroupProperties";

export const GridContext = createContext({});

class Grid extends ReportItemBase {
    constructor(props) {
        super(props);
        this.state = {
            editedGroup: null,
            data: props.data || getDefaultGridData()
        };
    }

    sharedProps = {
        itemSelected: (e, d, itm) => {
            var { selected = {} } = this.state;
            var { element } = selected;
            if (element) {
                element.changeSelection();
            }
            selected = { element: e, cellData: d };
            if (itm) {
                selected.cellItem = itm;
            }
            this.setState({ selected });
        },
        showRowHeaderContext: (e, index, parent, updateParent) => {
            e.preventDefault();
            this.setState({ contextData: { index, parent, updateParent } });
            contextMenu.show({
                id: "rowContext",
                event: e
            });
        },
        showRowGroupContext: (e, index, data, updateParent) => {
            e.preventDefault();
            this.setState({ contextData: { index, data, updateParent } });
            contextMenu.show({
                id: "groupContext",
                event: e
            });
        },
        headerUpdated: head => {
            this.setState({ head });
        },
        bodyUpdated: body => {
            this.setState({ body });
        }
    };

    RowContext = () => {
        var { contextData = {} } = this.state;
        var { index = 0, parent = [], updateParent } = contextData;

        var data = parent;
        var isRootParent = Array.isArray(data);

        if (!isRootParent) {
            data = data.children;
        }

        var addRowAbove = function (inParent) {
            data.splice(index, 0, {
                type: 1,
                style: {},
                children: array(data.length)
                    .fillWith([])
                    .toArray()
            });
            updateParent(data);
        };

        var addRowBelow = function (inParent) {
            data.splice(index + 1, 0, { type: 1, style: {}, children: [] });
            updateParent(data);
        };

        var removeRow = function () {
            data.splice(index, 1);
            updateParent(data);
        };

        var insertGroup = function () { };

        if (isRootParent) {
            return (
                <Menu key="rowContext" id="rowContext">
                    <Submenu label="Insert row">
                        <Item onClick={() => addRowAbove()}>Above</Item>
                        <Item onClick={() => addRowBelow()}>Below</Item>
                    </Submenu>
                    <Item onClick={removeRow}>
                        <IconFont className="fa fa-trash" /> Delete row
                    </Item>
                    <Item onClick={insertGroup}>
                        <IconFont className="fa fa-plus" /> Insert group
                    </Item>
                </Menu>
            );
        } else {
            return (
                <Menu key="rowContext" id="rowContext">
                    <Submenu label="Insert row">
                        <Item onClick={() => addRowAbove()}>Inside group above</Item>
                        <Item onClick={() => addRowBelow()}>Inside group below</Item>
                        <Separator />
                        <Item disabled={index !== 0} onClick={() => addRowAbove(true)}>
                            Outside group above
                        </Item>
                        <Item disabled={index + 1 !== data.length} onClick={() => addRowBelow(true)}>
                            Outside group below
                        </Item>
                    </Submenu>
                    <Item onClick={removeRow}>
                        <IconFont className="fa fa-trash" /> Delete row
                    </Item>
                    <Separator />
                    <Submenu label="Add row group">
                        <Item onClick={() => insertGroup()}>Parent group</Item>
                        <Item onClick={() => this.drawBox("blue")}>Child group</Item>
                        <Separator />
                        <Item onClick={() => this.drawBox("blue")}>Adjecent above...</Item>
                        <Item onClick={() => this.drawBox("blue")}>Adjecent below...</Item>
                    </Submenu>
                </Menu>
            );
        }
    };

    GroupContext = () => {
        var { contextData = {} } = this.state;
        var { index = 0, data = {}, updateParent } = contextData;
        var { parent, children, group, addRow, removeGroup, updateGroup } = data;
        var editGroup = () => {
            this.setState({ editedGroup: group, updateGroup });
        }
        return (
            <Menu id="groupContext">
                <Submenu label="Insert row">
                    <Item onClick={() => addRow(true, true)}>Above group</Item>
                    <Item onClick={() => addRow(false, true)}>Below group</Item>
                    <Separator />
                    <Item onClick={() => addRow(true, false)}>Inside group - On top</Item>
                    <Item onClick={() => addRow(false, false)}>Inside group - at bottom</Item>
                </Submenu>
                <Item onClick={removeGroup}>Delete group</Item>
                <Separator />
                <Submenu label="Add row group">
                    <Item onClick={() => this.drawBox("blue")}>Parent group</Item>
                    <Item onClick={() => this.drawBox("blue")}>Child group</Item>
                    <Separator />
                    <Item onClick={() => this.drawBox("blue")}>Adjecent above...</Item>
                    <Item onClick={() => this.drawBox("blue")}>Adjecent below...</Item>
                </Submenu>
                <Item onClick={editGroup}>Group properties</Item>
            </Menu>
        );
    };

    expressionChanged = (value, type, validation) => {
        var { selected } = this.state;
        var { element } = selected || {};
        if (!element) {
            return;
        }
        selected.cellItem = element.expressionValueReceived(value, type, validation); //ToDo: Call the value change event of grid cell component
    };

    getRows(parent, grid, columns, headSpan, updateParent, isHeaderRow) {
        return parent.map((item, i) => {
            var commonProps = {
                key: i,
                index: i,
                grid,
                headSpan,
                columns,
                parent,
                isHeaderRow,
                updateParent
            };
            if (item.type === 1) {
                return <GridRow rowData={item} {...commonProps} />;
            } else {
                return <GridGroup group={item} {...commonProps} />;
            } // ToDo: Implement details group
        });
    }

    updateRows = (updated, index, field) => {
        var { data } = this.state;

        if (!Array.isArray(updated)) {
            // When group is updated
            var fields = data[field];
            updated = { ...updated };
            fields[index] = updated;
        } else {
            data[field] = updated = [...updated]; // When rows are updated
        }

        this.setState({ data: { ...data } });
        return updated;
    };
    updateHeadRows = (head, index) => this.updateRows(head, index, "head");
    updateBodyRows = (body, index) => this.updateRows(body, index, "body");

    getColumns = (colGrpDepth, maxDepth, columns, result = []) => {
        var index = 0;
        var pendingGrps = [];

        result.push(
            <tr key={result.length}>
                {!result.length && (
                    <th className="builder-head-col" rowSpan={colGrpDepth} colSpan={maxDepth}>
                        #
                    </th>
                )}
                {columns.map((c, i) => {
                    if (c.type === 1) {
                        return <th key={i + index} title={i + index} className="builder-head-col" rowSpan={colGrpDepth} />;
                    } else {
                        array(pendingGrps).addRange(c.children, i + index);
                        var cspan = this.getNestedCellsCount(c.children);
                        index += cspan - 1;
                        return <th key={i} title={i} className="builder-head-grp" colSpan={cspan} />;
                    }
                })}
            </tr>
        );
        return pendingGrps.length ? this.getColumns(colGrpDepth - 1, null, pendingGrps, result) : result;
    };

    getNestedCellsCount(arr, count = 0) {
        arr.forEach((c, i) => {
            if (c.type === 1) {
                count++;
            } else {
                count += this.getNestedCellsCount(c.children);
            }
        });
        return count;
    }

    updateGroup = (group) => {
        var { updateGroup } = this.state;
        updateGroup(group);
        this.setState({ updateGroup: null, editedGroup: null });
    }

    getGroupProperties() {
        var { editedGroup } = this.state;
        if (!editedGroup) { return null; }
        return <GroupProperties group={editedGroup} onChange={this.updateGroup} onHide={() => { this.setState({ updateGroup: null, editedGroup: null }); }}></GroupProperties>
    }

    render() {
        var { data } = this.state; // Type 1 - Row, 2- Group, 3 - detail group?
        var { columns, head, body } = data;
        var { selected } = this.state;
        var { cellItem = {} } = selected || {};

        var maxDepth = getNestingDepth(head);
        var maxDepthBody = getNestingDepth(body);
        if (maxDepthBody > maxDepth) {
            maxDepth = maxDepthBody;
        }

        var colGrpDepth = getNestingDepth(columns);

        var builderHeader = <thead className="jsr-builder-head">{this.getColumns(colGrpDepth, maxDepth, columns)}</thead>;

        var expressionEditor = (
            <div key="0" className="jsr-expr-container inline">
                <div className="status">
                    f<sub>x</sub>
                </div>
                <div className="field">
                    <ExpressionEditor
                        disabled={!selected}
                        multiline={true}
                        wordWrap={true}
                        expression={cellItem.itemType ? cellItem.data : cellItem.expression}
                        type={cellItem.itemType}
                        endEdit={this.expressionChanged}
                    />
                </div>
            </div>
        );

        var table = (
            <GridContext.Consumer>
                {grid => (
                    <table className="jsr-grid">
                        {builderHeader}
                        <thead className="jsr-grid-head">
                            {this.getRows(head, grid, columns, maxDepth, this.updateHeadRows, true)}
                        </thead>
                        <tbody className="jsr-grid-body">
                            {this.getRows(body, grid, columns, maxDepth, this.updateBodyRows, false)}
                        </tbody>
                    </table>
                )}
            </GridContext.Consumer>
        );

        return super.renderBase(
            expressionEditor,
            <GridContext.Provider key="1" value={this.sharedProps}>
                <this.RowContext />
                <this.GroupContext />
                {table}
            </GridContext.Provider>,
            this.getGroupProperties()
        );
    }
}

export default Grid;
