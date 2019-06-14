import React, { PureComponent, createContext } from "react";
import GridRow from "./GridRow";
import { GridContext, ViewerContext } from "../../Common";
import GridGroup from "./GridGroup";
import "./GridItem.scss";

export default class GridItem extends PureComponent {
    static contextType = ViewerContext;

    constructor(props) {
        super(props);
    }

    compiledExpressions = { columns: [], headCells: {}, bodyCells: {} };

    UNSAFE_componentWillMount() {
        this.commonContext = {
            ...this.context,
            getCompiledColumn: index => this.compiledExpressions.columns[index],
            compileGroup: this.context.compileGroup,
            compileExpression: this.context.compileExpression
        };

        this.headerContext = {
            ...this.commonContext
        };

        this.bodyContext = {
            ...this.commonContext
        };

        var {
            definition: {
                data: { columns }
            }
        } = this.props;
        this.compileColumns(this.compiledExpressions.columns, columns);
    }

    compileColumns(result, cols, $groups) {
        cols.forEach(col => {
            if (col.type === 1) {
                var colGroup = (function(result, $groups) {
                    var obj = {};
                    //obj[$groups.name] = $groups;
                    var grpFunc = function(grpId) {
                        return obj[grpId];
                    };
                    grpFunc.Fields = $groups;
                    return grpFunc;
                })(result, $groups);
                var $compiled = { $groups, colGroup }; // ToDo: newely add expression to show hide columns
                // ToDo: add "getGroup" as a function to find only previously added and current group
                result.push($compiled);
            } else {
                this.compileGroup(result, col, $groups ? [...$groups] : []);
            }
        });
    }

    compileGroup(result, group, $groups) {
        var $compiled = this.commonContext.compileGroup(group);
        $groups.push($compiled);
        var { children } = group;
        if (children && children.length) {
            this.compileColumns(result, children, $groups);
        }
    }

    render() {
        var { definition } = this.props;
        var { data } = definition;
        var { columns, head, body } = data;

        return (
            <table>
                <thead>
                    <GridContext.Provider value={this.headerContext}>
                        <GridRowRepeator isHeader={true} columns={columns} rows={head} />
                    </GridContext.Provider>
                </thead>
                <tbody>
                    <GridContext.Provider value={this.bodyContext}>
                        <GridRowRepeator columns={columns} rows={body} />
                    </GridContext.Provider>
                </tbody>
            </table>
        );
    }
}

class GridRowRepeator extends PureComponent {
    static contextType = GridContext;

    UNSAFE_componentWillMount() {
        var { rowGroupFields, group } = this.props;
        var rowGroup;

        if (group) {
            rowGroup = function(grpName) {
                return rowGroupFields[grpName];
            };
            var curGroup = rowGroup(group.name);
            this.fields = curGroup.Fields;
            this.variables = curGroup.Variables;
            rowGroup.Fields = this.fields;
            rowGroup.Variables = this.variables;
            rowGroup.key = curGroup.key;
            rowGroup.keys = curGroup.keys;
            rowGroup.values = curGroup.values;
            this.rowGroup = rowGroup;
        }
    }

    render() {
        var { columns, rows, isHeader, rowGroupFields } = this.props;
        return rows.map((row, iRow) => {
            if (row.type === 1) {
                return <GridRow key={iRow} isHeader={isHeader} definition={row} rowGroup={this.rowGroup} columns={columns} />;
            } else {
                var { name, children } = row;
                if (!rowGroupFields) {
                    rowGroupFields = {};
                }
                return (
                    <GridGroup
                        key={iRow}
                        isRowGroup={true}
                        isHeader={isHeader}
                        group={row}
                        columns={columns}
                        rowGroupFields={rowGroupFields}
                        parentGroup={this.rowGroup}>
                        {(fields, index, rowGroup, colGroup) => (
                            <GridRowRepeator
                                key={index}
                                isHeader={isHeader}
                                columns={columns}
                                rows={children}
                                group={row}
                                rowGroupFields={{ ...rowGroupFields, [name]: fields }}
                            />
                        )}
                    </GridGroup>
                );
            }
        });
    }
}
