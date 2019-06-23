import React from "react";
import ReportItemBase from "../ReportItemBase";
import "./Grid.scss";
import GridRow from "./GridRow";
import GridGroup from "./GridGroup";
import { getNestingDepth, getDefaultGridData, getUniqueGroupName } from "../../Common/HelperFunctions";
import ExpressionEditor from "../../Common/ExpressionEditor";
import { Menu } from "primereact/menu";
import array from "../../../../Common/linq";
import GroupProperties from "../../Common/GroupProperties";
import { cloneObject } from "../../../../Common/HelperFunctions";
import { BuilderContext, GridContext } from "../../Common/Constants";

class Grid extends ReportItemBase {
    static contextType = BuilderContext

    constructor(props) {
        super(props);
        this.state = {
            editedGroup: null,
            data: props.data || getDefaultGridData()
        };
    }
    componentWillMount() {
        this.sharedProps = {
            builderContext: this.context,
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
                this.rowContext.toggle(e);
            },
            showRowGroupContext: (e, index, data, updateParent) => {
                e.preventDefault();
                this.setState({ contextData: { index, data, updateParent } });
                this.rowGroupContext.toggle(e);
            },
            showColHeaderContext: (e, index, parent, realObj) => {
                e.preventDefault();
                this.setState({ contextData: { index, parent, realObj } });
                this.colContext.toggle(e);
            },
            showColGroupContext: (e, index, parent, group, grpSpan) => {
                e.preventDefault();
                this.setState({ contextData: { index, parent, group, grpSpan } });
                this.colGroupContext.toggle(e);
            },
            showCellItemContext: (e, index, data, menuClicked) => {
                e.preventDefault();
                this.setState({ contextData: { index, data, menuClicked } });
                this.cellItemContext.toggle(e);
            }
        };
    }

    showGridContext = (e) => {

    }

    RowContext = () => {
        var { contextData = {} } = this.state;
        var { index = 0, parent = [], updateParent } = contextData;

        var data = parent;
        var isRootParent = Array.isArray(data);

        if (!isRootParent) {
            data = data.children;
        }

        var insertRow = above => {
            if (above) {
                data.splice(index, 0, {
                    type: 1,
                    style: {},
                    children: array(data.length)
                        .fillWith([])
                        .toArray()
                });
            } else {
                data.splice(index + 1, 0, { type: 1, style: {}, children: [] });
            }
            updateParent(data);
        };

        var removeRow = function () {
            data.splice(index, 1);
            updateParent(data);
        };

        var insertGroup = function () {
            var curRow = data[index];
            data[index] = { type: 3, name: getUniqueGroupName(), children: [curRow] };
            updateParent(data);
        };

        var menuModel = [
            {
                label: "Insert row",
                items: [
                    {
                        label: "Above" + (isRootParent ? "" : " (Inside group)"),
                        //icon: "pi pi-fw pi-plus",
                        command: () => {
                            insertRow(true);
                        }
                    },
                    {
                        label: "Below" + (isRootParent ? "" : " (Inside group)"),
                        //icon: "pi pi-fw pi-plus",
                        command: () => {
                            insertRow();
                        }
                    }
                ]
            },
            { separator: true },
            {
                label: "Delete row",
                icon: "fa fa-trash",
                command: () => {
                    removeRow();
                }
            },
            {
                label: "Insert group",
                icon: "fa fa-plus",
                command: () => {
                    insertGroup();
                }
            }
        ];

        return <Menu model={menuModel} popup={true} ref={el => (this.rowContext = el)} />;
    };

    gridDataChanged() {
        var stateData = cloneObject(this.state.data, true);
        this.setState({ data: stateData });
        this.props.onChange(stateData);
    }

    processAllRows = action => {
        var { head, body, footer } = this.state.data;

        var processRow = row => {
            var { type, children } = row;
            if (type === 1) {
                action(children);
            } else {
                children.forEach(processRow);
            }
        };

        if (head) {
            head.forEach(processRow);
        }
        if (body) {
            body.forEach(processRow);
        }
        if (footer) {
            footer.forEach(processRow);
        }

        this.gridDataChanged();
    };

    ColContext = () => {
        var { contextData = {} } = this.state;
        var { index = 0, parent = [], realObj } = contextData;

        var data = parent;
        var isRootParent = Array.isArray(data);

        if (!isRootParent) {
            data = data.children;
        }

        var insertColumn = before => {
            var insertAt = index + (before ? 0 : 1);
            data.splice(insertAt, 0, {
                type: 1,
                style: {}
            });

            this.processAllRows(c => c.splice(insertAt, 0, []));
        };

        var removeCol = () => {
            var idx = data.indexOf(realObj);
            data.splice(idx, 1);
            this.processAllRows(c => c.splice(index, 1));
        };

        var insertGroup = () => {
            var idx = data.indexOf(realObj);
            var curData = data[idx];
            data[idx] = { type: 3, name: getUniqueGroupName(), children: [curData] };
            this.gridDataChanged();
        };

        var menuModel = [
            {
                label: "Insert column",
                items: [
                    {
                        label: isRootParent ? "Before" : "Inside group before",
                        //icon: "pi pi-fw pi-plus",
                        command: () => {
                            insertColumn(true);
                        }
                    },
                    {
                        label: isRootParent ? "After" : "Inside group after",
                        //icon: "pi pi-fw pi-plus",
                        command: () => {
                            insertColumn();
                        }
                    }
                ]
            },
            { separator: true },
            {
                label: "Delete column",
                icon: "fa fa-trash",
                disabled: data.length <= 1,
                command: () => {
                    removeCol();
                }
            },
            {
                label: "Insert group",
                icon: "fa fa-plus",
                command: () => {
                    insertGroup();
                }
            }
        ];
        return <Menu model={menuModel} popup={true} ref={el => (this.colContext = el)} />;
    };

    RowGroupContext = () => {
        var { contextData = {} } = this.state;
        var { data = {} } = contextData;
        var { group, addRow, removeGroup, insertGroup, updateGroup } = data;

        var editGroup = () => {
            this.setState({ editedGroup: group, updateGroup });
        };

        var menuModel = [
            {
                label: "Insert row",
                items: [
                    {
                        label: "Above group",
                        //icon: "pi pi-fw pi-plus",
                        command: () => {
                            addRow(true, true);
                        }
                    },
                    {
                        label: "Below group",
                        //icon: "pi pi-fw pi-plus",
                        command: () => {
                            addRow(false, true);
                        }
                    }
                ]
            },
            {
                label: "Add row group",
                items: [
                    {
                        label: "Parent group",
                        //icon: "pi pi-fw pi-plus",
                        command: () => {
                            insertGroup(true);
                        }
                    },
                    {
                        label: "Child group",
                        //icon: "pi pi-fw pi-plus",
                        command: () => {
                            insertGroup();
                        }
                    }
                ]
            },

            { separator: true },

            {
                label: "Delete group",
                icon: "fa fa-trash",
                command: () => {
                    removeGroup();
                }
            },
            {
                label: "Group properties",
                icon: "fa fa-trash",
                command: () => {
                    editGroup();
                }
            }
        ];
        return <Menu model={menuModel} popup={true} ref={el => (this.rowGroupContext = el)} />;
    };

    ColGroupContext = () => {
        var { contextData = {} } = this.state;
        var { index = 0, parent = [], group, grpSpan } = contextData;
        var columns = parent;
        if (columns && !Array.isArray(columns)) {
            columns = parent.children;
        }

        var editGroup = () => {
            this.setState({ editedGroup: group }); // Need to set updateGroup function to save group details
        };

        var insertColumn = after => {
            var realIdx = columns.indexOf(group);
            realIdx += after ? 1 : 0;

            columns.splice(realIdx, 0, {
                type: 1,
                style: {}
            });

            this.processAllRows(c => c.splice(index + (after ? grpSpan : 0), 0, []));
        };

        var insertGroup = parent => {
            var realIdx = columns.indexOf(group);
            if (parent) {
                columns[realIdx] = { type: 2, name: getUniqueGroupName(), children: [group] };
            } else {
                var children = group.children;
                group.children = [{ type: 3, name: getUniqueGroupName(), children }];
            }

            this.gridDataChanged();
        };

        var removeGroup = () => {
            var realIdx = columns.indexOf(group);
            columns.splice(realIdx, 1, ...group.children);

            this.gridDataChanged();
        };

        var menuModel = [
            {
                label: "Insert column",
                items: [
                    {
                        label: "Before group",
                        //icon: "pi pi-fw pi-plus",
                        command: () => {
                            insertColumn();
                        }
                    },
                    {
                        label: "After group",
                        //icon: "pi pi-fw pi-plus",
                        command: () => {
                            insertColumn(true);
                        }
                    }
                ]
            },
            {
                label: "Add column group",
                items: [
                    {
                        label: "Parent group",
                        //icon: "pi pi-fw pi-plus",
                        command: () => {
                            insertGroup(true);
                        }
                    },
                    {
                        label: "Child group",
                        //icon: "pi pi-fw pi-plus",
                        command: () => {
                            insertGroup();
                        }
                    }
                ]
            },

            { separator: true },

            {
                label: "Delete group",
                icon: "fa fa-trash",
                command: () => {
                    removeGroup();
                }
            },
            {
                label: "Group properties",
                icon: "fa fa-trash",
                command: () => {
                    editGroup();
                }
            }
        ];
        return <Menu model={menuModel} popup={true} ref={el => (this.colGroupContext = el)} />;
    };

    CellItemContext = () => {
        var { contextData: { index, data, menuClicked } = {} } = this.state;

        var menuData = [
            {
                label: "Edit item",
                icon: "fa fa-edit",
                command: () => menuClicked(index, data, "EDIT")

            },
            {
                label: "Remove item",
                icon: "fa fa-trash",
                command: () => menuClicked(index, data, "REMOVE")

            },
            {
                label: "Properties",
                icon: "fa fa-trash",
                command: () => menuClicked(index, data, "PROPS")

            }
        ];

        return <Menu model={menuData} popup={true} ref={el => (this.cellItemContext = el)} />
    }

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
                key: item._uniqueId,
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
            }
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
        data = { ...data };
        this.setState({ data });
        this.props.onChange(data);
        return updated;
    };
    updateHeadRows = (head, index) => this.updateRows(head, index, "head");
    updateBodyRows = (body, index) => this.updateRows(body, index, "body");
    updateFooterRows = (body, index) => this.updateRows(body, index, "footer");

    getColumns = (colGrpDepth, maxDepth, columns, result = []) => {
        var index = 0;
        var pendingGrps = [];

        result.push(
            <tr key={result.length}>
                {!result.length && (
                    <th
                        className="builder-head-col"
                        rowSpan={colGrpDepth}
                        colSpan={maxDepth}
                        onContextMenu={this.showGridContext}>
                        #
                    </th>
                )}
                {columns.map((c, i) => {
                    var parent;
                    if (c.$parent) {
                        parent = c.$parent;
                        c = c.chi;
                    } else {
                        parent = columns;
                    }

                    if (c.type === 1) {
                        return (
                            <th
                                key={i + index}
                                title={i + index}
                                className="builder-head-col"
                                rowSpan={colGrpDepth}
                                onContextMenu={e => this.sharedProps.showColHeaderContext(e, i + index, parent, c)}
                            />
                        );
                    } else {
                        array(pendingGrps).addRange(
                            c.children.map(ic => {
                                return { chi: ic, $parent: c };
                            }),
                            i + index
                        );
                        var cspan = this.getNestedCellsCount(c.children);
                        //index += cspan - 1;
                        return (
                            <th
                                key={i}
                                title={"Group: " + c.name}
                                className="builder-head-grp"
                                colSpan={cspan}
                                onContextMenu={e => this.sharedProps.showColGroupContext(e, i + index, parent, c, cspan)}
                            />
                        );
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

    updateGroup = group => {
        var { updateGroup } = this.state;
        updateGroup(group);
        this.setState({ updateGroup: null, editedGroup: null });
    };

    getGroupProperties() {
        var { editedGroup } = this.state;
        if (!editedGroup) {
            return null;
        }
        return (
            <GroupProperties
                group={editedGroup}
                onChange={this.updateGroup}
                onHide={() => {
                    this.setState({ updateGroup: null, editedGroup: null });
                }}
            />
        );
    }

    render() {
        var { data } = this.state; // Type 1 - Row, 2- Group, 3 - detail group?
        var { columns, head, body, footer } = data;
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
                        {head && head.length > 0 && (
                            <thead className="jsr-grid-head">
                                {this.getRows(head, grid, columns, maxDepth, this.updateHeadRows, true)}
                            </thead>
                        )}
                        {body && body.length > 0 && (
                            <tbody className="jsr-grid-body">
                                {this.getRows(body, grid, columns, maxDepth, this.updateBodyRows, false)}
                            </tbody>
                        )}
                        {footer && footer.length > 0 && (
                            <tfoot className="jsr-grid-footer">
                                {this.getRows(footer, grid, columns, maxDepth, this.updateFooterRows, false)}
                            </tfoot>
                        )}
                    </table>
                )}
            </GridContext.Consumer>
        );

        return super.renderBase(
            expressionEditor,
            <GridContext.Provider key="1" value={this.sharedProps}>
                <this.RowContext />
                <this.RowGroupContext />
                <this.ColContext />
                <this.ColGroupContext />
                <this.CellItemContext />
                {table}
            </GridContext.Provider>,
            this.getGroupProperties()
        );
    }
}

export default Grid;
