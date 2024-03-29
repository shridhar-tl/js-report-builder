import React, { PureComponent } from "react";
import GridRow from "./GridRow";
import { GridContext, ViewerContext } from "../../Common";
import { ScrollableTable, THead, TBody } from "../../../Common/ScrollableTable/ScrollableTable";
import GridGroup from "./GridGroup";
import "./GridItem.scss";

export default class GridItem extends PureComponent {
    static contextType = ViewerContext;
    constructor(props, context) {
        super(props, context);
        this.commonContext = {
            ...context
        };
    }

    render() {
        const { definition } = this.props;
        const { columns, head, body, style } = definition || {};

        return (
            <GridContext.Provider value={this.commonContext}>
                <ScrollableTable style={style}>
                    <THead>
                        <GridRowRepeator isHeader={true} columns={columns} rows={head} />
                    </THead>
                    <TBody>
                        <GridRowRepeator columns={columns} rows={body} />
                    </TBody>
                </ScrollableTable>
            </GridContext.Provider>
        );
    }
}

class GridRowRepeator extends PureComponent {
    static contextType = GridContext;

    UNSAFE_componentWillMount() {
        const { rowGroupFields, group } = this.props;

        if (group) {
            const rowGroup = function (grpName) {
                return rowGroupFields[grpName];
            };
            const curGroup = rowGroup(group.name);
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
        const { columns, rows = [], isHeader } = this.props;
        let { rowGroupFields } = this.props;

        return rows.map((row, iRow) => {
            if (row.type === 1) {
                return <GridRow key={iRow} isHeader={isHeader} definition={row} rowGroup={this.rowGroup} columns={columns} />;
            } else {
                const { name, children } = row;
                if (!rowGroupFields) {
                    rowGroupFields = {};
                }
                return (
                    <GridGroup key={iRow} isRowGroup={true} group={row} parentGroup={this.rowGroup}>
                        {(fields, index) => (
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
