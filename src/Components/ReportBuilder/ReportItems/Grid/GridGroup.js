import React, { PureComponent, Fragment } from "react";
import GridRow from "./GridRow";

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

    updateGroupItems = updated => {
        var { group } = this.state;
        if (Array.isArray(updated)) {
            group.children = [...updated];
        }
        this.updateGroup(group);
    };

    updateGroup = (newGroup) => {
        var { index, group } = this.state;
        var { updateParent } = this.props;
        newGroup.children = group.children;
        group = updateParent(newGroup, index);
    }

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
                data: { children, parent, updateParent, addRow: this.addRow, group, updateGroup: this.updateGroup }
            });
        }

        return (
            <Fragment>
                {children &&
                    children.map((item, i) => {
                        var commonProps = {
                            key: i,
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
            </Fragment>
        );
    }
}

export default GridGroup;
