import React, { PureComponent } from 'react';
import { ViewerContext } from '../Common';

class ItemsBase extends PureComponent {
    static contextType = ViewerContext;

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        this.deallocateTracker = this.context.trackState((tracker) => {
            this.stateTracker = tracker;
            try {
                var newState = this.getStateObject(tracker);
                this.setState(newState);
            } catch (err) {
                this.handleError(err)
            }
        });
    }

    componentWillUnmount() {
        if (this.deallocateTracker) {
            this.deallocateTracker();
        }
    }

    processDefaultProps(definition) {
        var {
            tooltip, $tooltip,
            hidden, $hidden,
            disabled, $disabled,
            style,

            clickAction, actionProps, $actionProps
        } = definition;


        if (tooltip && !$tooltip) {
            $tooltip = this.tryParseExpression(tooltip, true);
            definition.$tooltip = $tooltip;
        }

        if (hidden && !$hidden) {
            $hidden = this.parseExpr(hidden, true);
            definition.$hidden = $hidden;
        }

        if (disabled && !$disabled) {
            $disabled = this.parseExpr(disabled, true);
            definition.$disabled = $disabled;
        }

        if (typeof $tooltip === "function") {
            tooltip = this.executeExpr($tooltip);
        }

        if (typeof $hidden === "function") {
            hidden = this.executeExpr($hidden);
        }

        if (typeof $disabled === "function") {
            disabled = this.executeExpr($disabled);
        }

        if (clickAction) {
            switch (clickAction) {
                case "LNK":
                    if (actionProps && !$actionProps) {
                        $actionProps = this.tryParseExpression(actionProps, true);
                        definition.$actionProps = $actionProps;
                    }

                    if (typeof $actionProps === "function") {
                        actionProps = this.executeExpr($actionProps);
                    }
                    break;

                case "FNC":
                    if (actionProps && !$actionProps) {
                        $actionProps = this.parseExpr(actionProps, true);
                        definition.$actionProps = $actionProps;
                    }

                    this.actionProps = $actionProps;
                    actionProps = null;
                    break;

                case "RST":
                    if (actionProps && !$actionProps) {
                        $actionProps = actionProps.map(ap => { return { name: ap.name, value: this.tryParseExpression(ap.value, true) } });
                        definition.$actionProps = $actionProps;
                    }

                    this.actionProps = $actionProps;
                    actionProps = null;
                    break;

                default: /* do nothing */ break;
            }
        }

        return { style, tooltip, hidden, disabled, clickAction, actionProps };
    }

    callAction = () => {
        if (this.state.clickAction === "RST") {
            var newRProps = this.actionProps.map(itm => {
                var { name, value } = itm;

                if (typeof value === "function") {
                    value = this.executeExpr(value);
                }

                return { name, value };
            });

            this.context.setReportState(newRProps);
        }
        else if (this.state.clickAction === "FNC") {
            if (typeof this.actionProps === "function") {
                this.executeExpr(this.actionProps);
            }
        }
    }

    tryParseExpression(item, noExecute) {
        if (typeof item !== "object") { return item; }
        if (item.expression) {
            return this.parseExpr(item.expression, noExecute);
        }
    }

    parseExpr(expr, noExecute) {
        var exprFunc = this.context.parseExpr(expr, this.stateTracker);
        if (noExecute) { return exprFunc; }

        return this.executeExpr(exprFunc);
    }

    executeExpr(exprFunc) {
        var { execProps: { fields, rowGroup, colGroup, variables } = {} } = this.props;
        return exprFunc(fields, rowGroup, colGroup, variables);
    }

    handleError(err) {
        this.error = err;
    }

    renderError() {
        return (
            <div title={this.error}>#Error</div>
        );
    }

    render() {
        if (this.state.hidden) { return null; }

        if (this.error) { return this.renderError(); }

        return this.renderChild();
    }
}

export default ItemsBase;