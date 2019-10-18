import React, { PureComponent } from 'react';
import { ViewerContext } from '../Common';
import { showContextMenu } from "../../Common/ContextMenu";

class ItemsBase extends PureComponent {
    static contextType = ViewerContext;

    constructor(props) {
        super(props);
        this.state = {};
    }

    UNSAFE_componentWillMount() {
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
            itemType, className,
            tooltip, $tooltip,
            hidden, $hidden,
            disabled, $disabled,
            style,

            clickAction, actionProps, $actionProps
        } = definition;


        if (itemType === "MNU") {
            if (!className) {
                className = "fa fa-ellipsis-v";
            }
        }

        if (tooltip && !$tooltip) {
            $tooltip = this.tryParseExpression(tooltip, true);
            definition.$tooltip = $tooltip;
        }

        if (typeof $tooltip === "function") {
            tooltip = this.executeExpr($tooltip);
        }

        if (hidden && !$hidden) {
            $hidden = this.parseExpr(hidden, true);
            definition.$hidden = $hidden;
        }

        if (typeof $hidden === "function") {
            hidden = this.executeExpr($hidden);
        }

        if (disabled && !$disabled) {
            $disabled = this.parseExpr(disabled, true);
            definition.$disabled = $disabled;
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
                        $actionProps = this.parseArray(actionProps);
                        definition.$actionProps = $actionProps;
                    }

                    this.actionProps = $actionProps;
                    actionProps = null;
                    break;

                default: this.actionProps = actionProps; break;
            }
        }

        return { className, style, tooltip, hidden, disabled, clickAction, actionProps };
    }

    parseBooleanExpr(definition, propName) {
        let value = definition[propName];
        let $value = definition["$" + propName];

        if (value && !$value) {
            $value = this.parseExpr(value, true);
            definition["$" + propName] = $value;
        }

        if (typeof $value === "function") {
            value = this.executeExpr($value);
        }

        return value;
    }

    parseArray(arr) {
        return arr.map(ap => { return { name: ap.name, value: this.tryParseExpression(ap.value, true) } });
    }

    executeArray(arr, reduce) {
        var result = arr.map(itm => {
            var { name, value } = itm;

            if (typeof value === "function") {
                value = this.executeExpr(value);
            }

            return { name, value };
        });
        if (reduce) {
            result = result.reduce((obj, cur) => {
                obj[cur.name] = cur.value;
                return obj;
            }, {});
        }
        return result;
    }

    callAction = (e) => {
        if (this.state.clickAction === "RST") {
            var newRProps = this.executeArray(this.actionProps);

            this.context.setReportState(newRProps);
        }
        else if (this.state.clickAction === "FNC") {
            if (typeof this.actionProps === "function") {
                this.executeExpr(this.actionProps);
            }
        }
        else if (this.state.clickAction === "MNU") {
            const menuItems = this.context.getMenuItems(this.actionProps);

            const items = menuItems.map(item => {
                const { expression, icon, label } = item;
                const disabled = this.parseBooleanExpr(item, "disabled");
                const hidden = this.parseBooleanExpr(item, "hidden");

                const $expression = this.parseExpr(expression, true);

                if (hidden === true) {
                    return null;
                }

                return { label, icon, disabled, command: () => { this.executeExpr($expression); } };
            }).filter(Boolean);

            showContextMenu(e, items);
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