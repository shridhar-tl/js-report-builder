import React from 'react';
import ItemsBase from '../ItemsBase';

class GridCellItem extends ItemsBase {
    getStateObject = async (reportState) => {
        var { definition } = this.props;

        var { className, style, tooltip, hidden, disabled, clickAction, actionProps } = await this.processDefaultProps(definition);

        var {
            expression, $expression,
            data: displayValue,
            // template
        } = definition;

        if (expression && !$expression) {
            $expression = this.parseExpr(expression, true);
            definition.$expression = $expression;
        }

        if (typeof $expression === "function") {
            try {
                displayValue = await this.executeExpr($expression);
            } catch (e) {
                displayValue = "#Error";
                tooltip = e;
            }
        }

        return { className, style, tooltip, hidden, disabled, clickAction, actionProps, displayValue };
    }

    renderChild() {
        const { tooltip, className, style, displayValue, clickAction, actionProps } = this.state;

        if (!clickAction) {
            return <span className={className} style={style} title={tooltip}>{displayValue}</span>
        }
        else if (clickAction === "LNK") {
            return <a style={style} title={tooltip} href={actionProps} target="_blank" rel="noopener noreferrer">{displayValue}</a>
        }
        else {
            return <span className={className} style={style} title={tooltip} onClick={this.callAction}>{displayValue}</span>
        }
    }
}

export default GridCellItem;