import React, { PureComponent } from 'react';
import { ViewerContext } from '../Common';
import { showContextMenu } from "../../Common/ContextMenu";

class ItemsBase extends PureComponent {
    static contextType = ViewerContext;

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.deallocateTracker = this.context.trackState(async (tracker) => {
            this.stateTracker = tracker;
            try {
                const newState = await this.getStateObject(tracker);
                this.setState(newState);
            } catch (err) {
                this.handleError(err);
            }
        });
    }

    componentWillUnmount() {
        if (this.deallocateTracker) {
            this.deallocateTracker();
        }
    }

    // eslint-disable-next-line complexity
    async processDefaultProps(definition) {
        const { itemType, style, clickAction, } = definition;
        let {
            className,
            tooltip, $tooltip,
            hidden, $hidden,
            disabled, $disabled,


            actionProps, $actionProps
        } = definition;


        if (itemType === "MNU") {
            if (!className) {
                className = "fa fa-ellipsis-v";
            }
        }

        if (tooltip && !$tooltip) {
            $tooltip = await this.tryParseExpression(tooltip, true);
            definition.$tooltip = $tooltip;
        }

        if (typeof $tooltip === "function") {
            tooltip = await this.executeExpr($tooltip);
        }

        if (hidden && !$hidden) {
            $hidden = await this.parseExpr(hidden, true);
            definition.$hidden = $hidden;
        }

        if (typeof $hidden === "function") {
            hidden = await this.executeExpr($hidden);
        }

        if (disabled && !$disabled) {
            $disabled = await this.parseExpr(disabled, true);
            definition.$disabled = $disabled;
        }

        if (typeof $disabled === "function") {
            disabled = await this.executeExpr($disabled);
        }

        if (clickAction) {
            switch (clickAction) {
                case "LNK":
                    if (actionProps && !$actionProps) {
                        $actionProps = await this.tryParseExpression(actionProps, true);
                        definition.$actionProps = $actionProps;
                    }

                    if (typeof $actionProps === "function") {
                        actionProps = await this.executeExpr($actionProps);
                    }
                    break;

                case "FNC":
                    if (actionProps && !$actionProps) {
                        $actionProps = await this.parseExpr(actionProps, true);
                        definition.$actionProps = $actionProps;
                    }

                    this.actionProps = $actionProps;
                    actionProps = null;
                    break;

                case "RST":
                    if (actionProps && !$actionProps) {
                        $actionProps = await this.parseArray(actionProps);
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

    async parseBooleanExpr(definition, propName) {
        let value = definition[propName];
        let $value = definition[`$${propName}`];

        if (value && !$value) {
            $value = await this.parseExpr(value, true);
            definition[`$${propName}`] = $value;
        }

        if (typeof $value === "function") {
            value = this.executeExpr($value);
        }

        return value;
    }

    parseArray(arr) {
        return Promise.all(arr.map(async ap => ({ name: ap.name, value: await this.tryParseExpression(ap.value, true) })));
    }

    async executeArray(arr, reduce) {
        let result = await Promise.all(arr.map(async itm => {
            const { name } = itm;
            let { value } = itm;

            if (typeof value === "function") {
                value = await this.executeExpr(value);
            }

            return { name, value };
        }));
        if (reduce) {
            result = result.reduce((obj, cur) => {
                obj[cur.name] = cur.value;
                return obj;
            }, {});
        }
        return result;
    }

    callAction = async (e) => {
        if (this.state.clickAction === "RST") {
            const newRProps = await this.executeArray(this.actionProps);

            this.context.setReportState(newRProps);
        }
        else if (this.state.clickAction === "FNC") {
            if (typeof this.actionProps === "function") {
                this.executeExpr(this.actionProps);
            }
        }
        else if (this.state.clickAction === "MNU") {
            const menuItems = this.context.getMenuItems(this.actionProps);

            e.preventDefault();
            // As this is a async call, need to secure the current event
            e = { ...e };

            const items = (await Promise.all(menuItems.map(async item => {
                const { expression, icon, label } = item;
                const disabled = await this.parseBooleanExpr(item, "disabled");
                const hidden = await this.parseBooleanExpr(item, "hidden");

                const $expression = await this.parseExpr(expression, true);

                if (hidden === true) {
                    return null;
                }

                return { label, icon, disabled, command: () => { this.executeExpr($expression); } };
            }))).filter(Boolean);

            showContextMenu(e, items);
        }
    };

    async tryParseExpression(item, noExecute) {
        if (typeof item !== "object") { return item; }
        if (item.expression) {
            return await this.parseExpr(item.expression, noExecute);
        }
    }

    async parseExpr(expr, noExecute) {
        if (!expr) { return expr; }

        try {
            const exprFunc = this.context.parseExpr(expr, this.stateTracker);
            if (noExecute) { return exprFunc; }

            return await this.executeExpr(exprFunc);
        } catch (err) {
            console.error('Expression Parse failed:-', expr);
            throw err;
        }
    }

    async executeExpr(exprFunc) {
        if (!exprFunc || typeof exprFunc !== 'function') {
            throw new Error('Expression is not parsed');
        }

        const { execProps: { fields, rowGroup, colGroup, variables } = {} } = this.props;
        return exprFunc(fields, rowGroup, colGroup, variables);
    }

    handleError(error) {
        this.setState({ error });
    }

    renderError() {
        return (<div title={this.state.error}>#Error</div>);
    }

    render() {
        if (this.state.hidden) { return null; }

        if (this.state.error) { return this.renderError(); }

        return this.renderChild();
    }
}

export default ItemsBase;