import React, { PureComponent } from 'react';
import { ViewerContext } from '../Common';

class ItemsBase extends PureComponent {
    static contextType = ViewerContext;

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        try {
            var newState = this.getStateObject();
            this.setState(newState);
        } catch (err) {
            this.handleError(err)
        }
    }

    tryParseExpression(item) {
        if (typeof item !== "object") { return item; }
        if (item.expression) {
            return this.parseExpr(item.expression);
        }
    }

    parseExpr(expr) {
        if (!expr) { return expr; }

        if (typeof expr === "boolean") { return expr; }
        if (typeof expr !== "string") { return; }

        if (expr === "true") { return true; }
        else if (expr === "false") { return false; }

        var exprFunc = this.context.compileExpression(expr);

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
            <div>

            </div>
        );
    }

    render() {
        if (this.state.hidden) { return null; }

        if (this.error) { return this.renderError(); }

        return this.renderChild();
    }
}

export default ItemsBase;