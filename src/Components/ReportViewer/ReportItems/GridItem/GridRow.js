import React, { PureComponent } from "react";
import GridGroup from "./GridGroup";
import { GridContext } from "../../Common";
import ImageItem from "../ImageItem";
import GridCellItem from "./GridCellItem";

export default class GridRow extends PureComponent {
    static contextType = GridContext;

    render() {
        var { definition, columns, isHeader, rowGroup } = this.props;
        var { style, children } = definition;

        return (
            <tr style={style}>
                <GridCellRepeater isHeader={isHeader} rowGroup={rowGroup} columns={columns} cells={children} />
            </tr>
        );
    }
}

class GridCellRepeater extends PureComponent {
    static contextType = GridContext;

    UNSAFE_componentWillMount() {
        var { colGroupFields, group } = this.props;

        if (group) {
            var colGroup = function (grpName) {
                return colGroupFields[grpName];
            };

            var curGroup = colGroup(group.name);
            this.fields = curGroup.Fields;
            this.variables = curGroup.Variables;
            colGroup.Fields = this.fields;
            colGroup.Variables = this.variables;
            colGroup.key = curGroup.key;
            colGroup.keys = curGroup.keys;
            colGroup.values = curGroup.values;
            this.colGroup = colGroup;
        }
    }

    render() {
        var { cellStartIndex = 0, columns, cells, isHeader, colGroupFields, rowGroup } = this.props;

        return columns.map((column, icolumn) => {
            var { type } = column;
            var bIndex = cellStartIndex + icolumn; // ToDo: correction required in this index

            if (type === 1) {
                return (
                    <GridCell
                        key={icolumn}
                        colGroup={this.colGroup}
                        rowGroup={rowGroup}
                        isHeader={isHeader}
                        column={column}
                        cell={cells[bIndex]}
                    />
                );
            } else {
                var { children, name } = column;

                if (!colGroupFields) {
                    colGroupFields = {};
                }

                return (
                    <GridGroup key={icolumn} group={column} parentGroup={this.colGroup}>
                        {(fields, i, _rowGroup, colGroup) => (
                            <GridCellRepeater
                                key={i}
                                colGroupFields={{ ...colGroupFields, [name]: fields }}
                                rowGroup={rowGroup}
                                isHeader={isHeader}
                                cellStartIndex={bIndex}
                                columns={children}
                                cells={cells}
                                group={column}
                            />
                        )}
                    </GridGroup>
                );
            }
        });
    }
}

class GridCell extends PureComponent {
    static contextType = GridContext;

    constructor(props) {
        super(props);
        var { isHeader } = props;
        this.cellType = isHeader ? "th" : "td";
    }

    componentWillMount() {
        var { colGroup, rowGroup } = this.props;

        var fields = (rowGroup || {}).Fields;
        var variables = (rowGroup || {}).Variables;

        this.execProps = { fields, rowGroup, colGroup, variables };
    }

    render() {
        var {
            cellType: CellType,
            props: { cell }
        } = this;

        return (
            <CellType>
                {cell.map((c, i) => {
                    switch ((c.itemType || "").toLowerCase()) {
                        case "":
                        case "expression":
                        case "text":
                            return <GridCellItem key={i} definition={c} execProps={this.execProps} />
                        case "img":
                            return <ImageItem key={i} definition={c} execProps={this.execProps} />
                        default:
                            return <span key={i} title="Unsupported element found inside grid cell">#Error: Unsupported</span>
                    }
                })}
            </CellType>
        );
    }
}
