import React, { PureComponent } from "react";
import GridCell from "./GridCell";
import "./GridRow.scss";

class GridRow extends PureComponent {
    constructor(props) {
        super(props);
        const { index, rowData, headSpan, rowSpans } = props;
        this.state = { index, rowData, headSpan, rowSpans };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { index, rowData, headSpan, rowSpans } = newProps;
        this.setState({ index, rowData, headSpan, rowSpans });
    }

    render() {
        const { columns, parent, updateParent, isDetailsRow, grid } = this.props;
        const { index, rowData, headSpan, rowSpans } = this.state;
        const { style } = rowData;
        return (
            <tr style={style}>
                {rowSpans &&
                    rowSpans.map(s => (
                        <th
                            key={s._uniqueId}
                            rowSpan={s.span}
                            title={`${s.name || "<<No name given>>"} (${s.data.group.type === 2 ? "Parent" : "Details"} group)`}
                            className="grid-group-head"
                            onContextMenu={e => grid.showRowGroupContext(e, index, s.data, updateParent)}
                        />
                    ))}
                <th
                    colSpan={headSpan}
                    onContextMenu={e => grid.showRowHeaderContext(e, index, parent, updateParent)}
                    className="grid-row-header">
                    {rowSpans && (isDetailsRow ? <i className="fa fa-bars" /> : "+")}
                </th>
                {this.repeatColumns(columns)}
            </tr>
        );
    }

    repeatColumns(cols, result) {
        result = result || [];
        for (const col of cols) {
            if (col.type === 1) {
                result.push(this.tdRepeator(result.length, col));
            } else if (col.children.length > 0) {
                this.repeatColumns(col.children, result);
            }
        }
        return result;
    }

    cellDataChanged = (cellData, index) => {
        const { updateParent, onChange = updateParent, index: parentIndex } = this.props;
        let { rowData } = this.props;
        let { children = [] } = rowData || {};
        children = [...children];
        children[index] = cellData;
        rowData = { ...rowData, children };
        onChange(rowData, parentIndex);
    };

    tdRepeator(index, col) {
        const { rowData: { children } = {} } = this.state;
        const { grid, isHeaderRow } = this.props;
        let cellData = children[index];
        if (!cellData) {
            cellData = [];
            children[index] = cellData;
        }
        return (
            <GridCell
                grid={grid}
                key={col._uniqueId}
                index={index}
                isHeaderCell={isHeaderRow}
                colData={col}
                cellData={cellData}
                style={col.style}
                onChange={this.cellDataChanged}
            />
        ); //ToDo: write contextmenu event
    }
}

export default GridRow;
