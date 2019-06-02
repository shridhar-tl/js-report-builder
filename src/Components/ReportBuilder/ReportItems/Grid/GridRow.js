import React, { PureComponent } from "react";
import GridCell from "./GridCell";
import "./GridRow.scss";

class GridRow extends PureComponent {
    constructor(props) {
        super(props);
        var { index, rowData, headSpan, rowSpans } = props;
        this.state = { index, rowData, headSpan, rowSpans };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        var { index, rowData, headSpan, rowSpans } = newProps;
        this.setState({ index, rowData, headSpan, rowSpans });
    }

    render() {
        var { columns, parent, updateParent, isDetailsRow, grid } = this.props;
        var { index, rowData, headSpan, rowSpans } = this.state;
        var { style } = rowData;
        return (
            <tr style={style}>
                {rowSpans &&
                    rowSpans.map((s, i) => (
                        <th
                            key={i}
                            rowSpan={s.span}
                            title={s.name || "<<No name given>>"}
                            className="grid-group-head"
                            onContextMenu={e => grid.showRowGroupContext(e, index, s.data, updateParent)}
                        />
                    ))}
                <th
                    colSpan={headSpan}
                    onContextMenu={e => grid.showRowHeaderContext(e, index, parent, updateParent)}
                    className="grid-row-header">
                    {isDetailsRow ? "+" : " "}
                </th>
                {this.repeatColumns(columns)}
            </tr>
        );
    }

    repeatColumns(cols, result) {
        result = result || [];
        for (var col of cols) {
            if (col.type === 1) {
                result.push(this.tdRepeator(result.length, col));
            } else if (col.children.length > 0) {
                this.repeatColumns(col.children, result);
            }
        }
        return result;
    }

    tdRepeator(index, col) {
        var { rowData: { children } = {} } = this.state;
        var { grid, isHeaderRow } = this.props;
        var cellData = children[index];
        if (!cellData) {
            cellData = [];
            children[index] = cellData;
        }
        return (
            <GridCell
                grid={grid}
                key={index}
                index={index}
                isHeaderCell={isHeaderRow}
                colData={col}
                cellData={cellData}
                style={col.style}
                onChange={data => (children[index] = data)}
            />
        ); //ToDo: write contextmenu event
    }
}

export default GridRow;
