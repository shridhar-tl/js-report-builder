import React, { PureComponent } from "react";
import GridRow from "./GridRow";
import { getUniqueGroupName } from "../../Common/HelperFunctions";

class GridGroup extends PureComponent {
    constructor(props) {
        super(props);
        const { index, group, headSpan, rowSpans = [] } = props;
        this.state = { index, group, headSpan, rowSpans };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { index, group, headSpan, rowSpans } = newProps;
        this.setState({ index, group, headSpan, rowSpans });
    }

    getRowsCount(children) {
        if (!Array.isArray(children)) {
            return 0;
        }

        let count = 0;
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
        const { group } = this.state;
        if (Array.isArray(updated)) {
            group.children = [...updated];
        }
        else if (updated && typeof updated === "object") {
            group.children[index] = updated;
        }
        this.updateGroup(group);
    };

    updateGroup = newGroup => {
        const { updateParent } = this.props;
        newGroup.children = this.state.group.children;
        updateParent(newGroup, this.state.index);
    };

    insertGroup = isParent => {
        const { group } = this.state;
        const { parent, updateParent } = this.props;
        if (isParent) {
            let rows = parent;
            if (rows && !Array.isArray(rows)) {
                rows = parent.children;
            }

            const idx = rows.indexOf(group);
            rows[idx] = { type: 2, name: getUniqueGroupName(), children: [group] };
            updateParent(rows[idx], idx);
        } else {
            const children = group.children;
            group.children = [{ type: 3, name: getUniqueGroupName(), children: children }];
            this.updateGroup(group);
        }
    };

    removeGroup = () => {
        const { group } = this.state;
        const { parent } = this.props;

        let arr = parent;
        let isFirstLevelGrp = true;
        if (arr && !Array.isArray(arr)) {
            arr = parent.children;
            isFirstLevelGrp = false;
        }

        const idx = arr.indexOf(group);
        arr.splice(idx, 1, ...group.children);
        if (isFirstLevelGrp) {
            this.props.updateParent(arr[0], 0);
        } else {
            this.props.updateParent(arr);
        }
    };

    addRow = (above, inParent) => {
        const { parent, updateParent } = this.props;
        let { index } = this.state;
        const { children } = this.state.group;

        const row = { type: 1, style: {}, children: [] };

        if (inParent) {
            if (!above) {
                index += 1;
            }
            const arr = parent.children || parent;
            arr.splice(index, 0, row);
            updateParent(row, index);
        } else {
            index = above ? 0 : children.length;
            children.splice(index, 0, row);
            this.updateGroupItems(children);
        }
    };

    childrenChanged = (data, index) => {
        const { index: groupIndex, updateParent, onChange = updateParent } = this.props;
        let { group } = this.props;
        let { children } = group;
        children = [...children];
        children[index] = data;
        group = { ...group, children };
        onChange(group, groupIndex);
    };

    render() {
        const { columns, isHeaderRow, parent, updateParent } = this.props;
        const { group, rowSpans = [] } = this.state;
        let { headSpan } = this.state;
        const { children, type, name } = group;
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
                        const commonProps = {
                            key: item._uniqueId,
                            index: i,
                            parent: group,
                            columns,
                            headSpan,
                            isHeaderRow,
                            rowSpans: !i ? rowSpans : [],
                            grid: this.props.grid,
                            updateParent: this.updateGroupItems,
                            onChange: this.childrenChanged
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
