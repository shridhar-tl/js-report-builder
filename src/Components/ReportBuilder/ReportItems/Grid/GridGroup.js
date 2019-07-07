import React, { PureComponent } from "react";
import GridRow from "./GridRow";
import { getUniqueGroupName } from "../../Common/HelperFunctions";

class GridGroup extends PureComponent {
    constructor(props) {
        super(props);
        var { index, group, headSpan, rowSpans = [] } = props;
        this.state = { index, group, headSpan, rowSpans };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        var { index, group, headSpan, rowSpans } = newProps;
        this.setState({ index, group, headSpan, rowSpans });
    }

    getRowsCount(children) {
        if (!Array.isArray(children)) {
            return 0;
        }

        var count = 0;
        children.forEach(e => {
            if (e.type === 1) {
                count++;
            } else {
                count += this.getRowsCount(e.children);
            }
        });
        return count;
    }

    updateGroupItems = (updated, index) => {
        var { group } = this.state;
        if (Array.isArray(updated)) {
            group.children = [...updated];
        }
        else if (updated && typeof updated === "object") {
            group.children[index] = updated;
        }
        this.updateGroup(group);
    };

    updateGroup = newGroup => {
        var { index, group } = this.state;
        var { updateParent } = this.props;
        newGroup.children = group.children;
        group = updateParent(newGroup, index);
    };

    insertGroup = isParent => {
        var { group } = this.state;
        var { parent, updateParent } = this.props;
        if (isParent) {
            var rows = parent;
            if (rows && !Array.isArray(rows)) {
                rows = parent.children;
            }

            var idx = rows.indexOf(group);
            rows[idx] = { type: 2, name: getUniqueGroupName(), children: [group] };
            updateParent(rows[idx], idx);
        } else {
            var children = group.children;
            group.children = [{ type: 3, name: getUniqueGroupName(), children: children }];
            this.updateGroup(group);
        }
    };

    removeGroup = () => {
        var { group } = this.state;
        var { parent } = this.props;

        var arr = parent;
        var isFirstLevelGrp = true;
        if (arr && !Array.isArray(arr)) {
            arr = parent.children;
            isFirstLevelGrp = false;
        }

        var idx = arr.indexOf(group);
        arr.splice(idx, 1, ...group.children);
        if (isFirstLevelGrp) {
            this.props.updateParent(arr[0], 0);
        } else {
            this.props.updateParent(arr);
        }
    };

    addRow = (above, inParent) => {
        var { parent, updateParent } = this.props;
        var { group, index } = this.state;
        var { children } = group;

        var row = { type: 1, style: {}, children: [] };

        if (inParent) {
            if (!above) {
                index += 1;
            }
            var arr = parent.children || parent;
            arr.splice(index, 0, row);
            updateParent(row, index);
        } else {
            index = above ? 0 : children.length;
            children.splice(index, 0, row);
            this.updateGroupItems(children);
        }
    };

    render() {
        var { columns, isHeaderRow, parent, updateParent } = this.props;
        var { group, headSpan, rowSpans = [] } = this.state;
        var { children, type, name } = group;
        headSpan = headSpan - 1;

        if (children) {
            // && type === 2 ToDo: add this condition to remove details group from the rows
            rowSpans.push({
                name,
                span: this.getRowsCount(children),
                data: {
                    children,
                    parent,
                    updateParent,
                    addRow: this.addRow,
                    group,
                    updateGroup: this.updateGroup,
                    insertGroup: this.insertGroup,
                    removeGroup: this.removeGroup
                }
            });
        }

        return (
            <>
                {children &&
                    children.map((item, i) => {
                        var commonProps = {
                            key: item._uniqueId,
                            index: i,
                            parent: group,
                            columns,
                            headSpan,
                            isHeaderRow,
                            rowSpans: !i ? rowSpans : [],
                            grid: this.props.grid,
                            updateParent: this.updateGroupItems
                        };
                        if (item.type === 1) {
                            return <GridRow isDetailsRow={type === 3} rowData={item} {...commonProps} />;
                        } else {
                            return <GridGroup group={item} {...commonProps} />;
                        } // ToDo: Implement details group
                    })}
            </>
        );
    }
}

export default GridGroup;
