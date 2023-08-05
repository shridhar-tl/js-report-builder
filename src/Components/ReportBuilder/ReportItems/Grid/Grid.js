import React from "react";
import ReportItemBase from "../ReportItemBase";
import "./Grid.scss";
import GridRow from "./GridRow";
import GridGroup from "./GridGroup";
import { getNestingDepth, getDefaultGridData, getUniqueGroupName } from "../../Common/HelperFunctions";
import ExpressionEditor from "../../Common/ExpressionEditor";
import array from "../../../../Common/linq";
import GroupProperties from "../../Common/GroupProperties";
import { cloneObject } from "../../../../Common/HelperFunctions";
import { BuilderContext, GridContext } from "../../Common/Constants";
import { showContextMenu } from "../../../../lib";

class Grid extends ReportItemBase {
    static contextType = BuilderContext;

    constructor(props) {
        super(props);
        this.state = {
            editedGroup: null,
            data: props.data || getDefaultGridData()
        };
    }
    UNSAFE_componentWillMount() {
        if (!this.props.data) { this.props.onChange(this.state.data); }

        this.sharedProps = {
            builderContext: this.context,
            itemSelected: (e, d, itm) => {
                let { selected = {} } = this.state;
                const { element } = selected;
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
                const menuItems = this.getRowContext({ index, parent, updateParent });
                showContextMenu(e, menuItems);
            },
            showRowGroupContext: (e, index, data, updateParent) => {
                const menuItems = this.getRowGroupContext({ index, data, updateParent });
                showContextMenu(e, menuItems);
            },
            showColHeaderContext: (e, index, parent, realObj) => {
                const menuItems = this.getColContext({ index, parent, realObj });
                showContextMenu(e, menuItems);
            },
            showColGroupContext: (e, index, parent, group, grpSpan) => {
                const menuItems = this.getColGroupContext({ index, parent, group, grpSpan });
                showContextMenu(e, menuItems);
            },
            showCellItemContext: (e, index, data, menuClicked) => {
                const menuItems = this.getCellItemContext({ index, data, menuClicked });
                showContextMenu(e, menuItems);
            }
        };
    }

    showGridContext = (e) => {
        // Need to implement
    };

    getRowContext(contextData) {
        const { index = 0, parent = [], updateParent } = contextData;

        let data = parent;
        const isRootParent = Array.isArray(data);

        if (!isRootParent) {
            data = data.children;
        }

        const insertRow = above => {
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

        const removeRow = function () {
            data.splice(index, 1);
            updateParent(data);
        };

        const insertGroup = function () {
            const curRow = data[index];
            data[index] = { type: 3, name: getUniqueGroupName(), children: [curRow] };
            updateParent(data);
        };

        const menuModel = [
            {
                label: "Insert row",
                items: [
                    {
                        label: `Above${isRootParent ? "" : " (Inside group)"}`,
                        //icon: "pi pi-fw pi-plus",
                        command: () => {
                            insertRow(true);
                        }
                    },
                    {
                        label: `Below${isRootParent ? "" : " (Inside group)"}`,
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
        return menuModel;
    }

    gridDataChanged() {
        const stateData = cloneObject(this.state.data, true);
        this.setState({ data: stateData });
        this.props.onChange(stateData);
    }

    processAllRows = action => {
        const { head, body, footer } = this.state.data;

        const processRow = row => {
            const { type, children } = row;
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

    getColContext = (contextData) => {
        const { index = 0, parent = [], realObj } = contextData;

        let data = parent;
        const isRootParent = Array.isArray(data);

        if (!isRootParent) {
            data = data.children;
        }

        const insertColumn = before => {
            const insertAt = index + (before ? 0 : 1);
            data.splice(insertAt, 0, {
                type: 1,
                style: {}
            });

            this.processAllRows(c => c.splice(insertAt, 0, []));
        };

        const removeCol = () => {
            const idx = data.indexOf(realObj);
            data.splice(idx, 1);
            this.processAllRows(c => c.splice(index, 1));
        };

        const insertGroup = () => {
            const idx = data.indexOf(realObj);
            const curData = data[idx];
            data[idx] = { type: 3, name: getUniqueGroupName(), children: [curData] };
            this.gridDataChanged();
        };

        return [
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
    };

    getRowGroupContext = (contextData) => {
        const { data = {} } = contextData;
        const { group, addRow, removeGroup, insertGroup, updateGroup } = data;

        const editGroup = () => {
            this.setState({ editedGroup: group, updateGroup });
        };

        const menuModel = [
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

        return menuModel;
    };

    getColGroupContext = (contextData) => {
        const { index = 0, parent = [], group, grpSpan } = contextData;
        let columns = parent;
        if (columns && !Array.isArray(columns)) {
            columns = parent.children;
        }

        const editGroup = () => {
            this.setState({ editedGroup: group }); // Need to set updateGroup function to save group details
        };

        const insertColumn = after => {
            let realIdx = columns.indexOf(group);
            realIdx += after ? 1 : 0;

            columns.splice(realIdx, 0, {
                type: 1,
                style: {}
            });

            this.processAllRows(c => c.splice(index + (after ? grpSpan : 0), 0, []));
        };

        const insertGroup = parent => {
            const realIdx = columns.indexOf(group);
            if (parent) {
                columns[realIdx] = { type: 2, name: getUniqueGroupName(), children: [group] };
            } else {
                const children = group.children;
                group.children = [{ type: 3, name: getUniqueGroupName(), children }];
            }

            this.gridDataChanged();
        };

        const removeGroup = () => {
            const realIdx = columns.indexOf(group);
            columns.splice(realIdx, 1, ...group.children);

            this.gridDataChanged();
        };

        return [
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
    };

    getCellItemContext = ({ index, data = {}, menuClicked } = {}) => [
        {
            label: "Edit item",
            icon: "fa fa-edit",
            disabled: data.itemType === "IMG",
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

    expressionChanged = (value, type, validation) => {
        const { selected } = this.state;
        const { element } = selected || {};
        if (!element) {
            return;
        }
        selected.cellItem = element.expressionValueReceived(value, type, validation); //ToDo: Call the value change event of grid cell component
    };

    getRows(parent, grid, columns, headSpan, updateParent, isHeaderRow) {
        return parent.map((item, i) => {
            const commonProps = {
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
        let { data } = this.state;
        data = { ...data };
        if (!Array.isArray(updated)) {
            // When group is updated
            let fields = data[field];
            fields = [...fields];
            updated = { ...updated };
            fields[index] = updated;
            data[field] = fields;
        } else {
            data[field] = updated = [...updated]; // When rows are updated
        }
        this.setState({ data });
        this.props.onChange(data);
        return updated;
    };
    updateHeadRows = (head, index) => this.updateRows(head, index, "head");
    updateBodyRows = (body, index) => this.updateRows(body, index, "body");
    updateFooterRows = (body, index) => this.updateRows(body, index, "footer");

    getColumns = (colGrpDepth, maxDepth, columns, result = []) => {
        const index = 0;
        const pendingGrps = [];

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
                    let parent;
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
                                className="builder-head-col"
                                rowSpan={colGrpDepth}
                                onContextMenu={e => this.sharedProps.showColHeaderContext(e, i + index, parent, c)}
                            />
                        );
                    } else {
                        array(pendingGrps).addRange(
                            c.children.map(ic => ({ chi: ic, $parent: c })),
                            i + index
                        );
                        const cspan = this.getNestedCellsCount(c.children);
                        //index += cspan - 1;
                        return (
                            <th
                                key={i}
                                title={`Group: ${c.name}`}
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
        const { updateGroup } = this.state;
        updateGroup(group);
        this.setState({ updateGroup: null, editedGroup: null });
    };

    getGroupProperties() {
        const { editedGroup } = this.state;
        if (!editedGroup) {
            return null;
        }
        return (
            <GroupProperties key="grpPps"
                group={editedGroup}
                onChange={this.updateGroup}
                onHide={() => {
                    this.setState({ updateGroup: null, editedGroup: null });
                }}
            />
        );
    }

    render() {
        const { data } = this.state; // Type 1 - Row, 2- Group, 3 - detail group?
        const { columns, head, body, footer } = data;
        const { selected } = this.state;
        const { cellItem = {} } = selected || {};

        let maxDepth = getNestingDepth(head);
        const maxDepthBody = getNestingDepth(body);
        if (maxDepthBody > maxDepth) {
            maxDepth = maxDepthBody;
        }

        const colGrpDepth = getNestingDepth(columns);

        const builderHeader = <thead className="jsr-builder-head">{this.getColumns(colGrpDepth, maxDepth, columns)}</thead>;

        const expressionEditor = (
            <div key="0" className="jsr-expr-container inline">
                <div className="field">
                    <ExpressionEditor
                        disabled={!selected}
                        multiline={true}
                        expression={cellItem.itemType ? cellItem.data : cellItem.expression}
                        type={cellItem.itemType}
                        endEdit={this.expressionChanged}
                    />
                </div>
            </div>
        );

        const table = (
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
                {table}
            </GridContext.Provider>,
            this.getGroupProperties()
        );
    }
}

export default Grid;
