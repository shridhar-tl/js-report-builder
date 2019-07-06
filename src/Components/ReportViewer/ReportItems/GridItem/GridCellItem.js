import React from 'react';
import ItemsBase from '../ItemsBase';

class GridCellItem extends ItemsBase {
    constructor(props) {
        super(props);
    }

    getStateObject = (reportState) => {
        var { definition } = this.props;

        var { style, tooltip, hidden, disabled, clickAction, actionProps } = this.processDefaultProps(definition);
        
        var {
            expression, $expression,
            data: displayValue,
            template
        } = definition;


        if (expression && !$expression) {
            $expression = this.parseExpr(expression, true);
            definition.$expression = $expression;
        }

        if (typeof $expression === "function") {
            try {
                displayValue = this.executeExpr($expression);
            } catch (e) {
                displayValue = "#Error";
                tooltip = e;
            }
        }

        return { style, tooltip, hidden, disabled, clickAction, actionProps, displayValue };
    }

    renderChild() {
        var { tooltip, style, displayValue, clickAction, actionProps } = this.state;

        if (!clickAction) {
            return <span style={style} title={tooltip}>{displayValue}</span>
        }
        else if (clickAction === "LNK") {
            return <a style={style} title={tooltip} href={actionProps} target="_blank">{displayValue}</a>
        }
        else {
            return <span style={style} title={tooltip} onClick={this.callAction}>{displayValue}</span>
        }
    }
}

export default GridCellItem;