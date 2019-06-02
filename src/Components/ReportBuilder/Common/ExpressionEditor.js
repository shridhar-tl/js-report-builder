import React, { PureComponent } from "react";
import "./ExpressionEditor.scss";

class ExpressionEditor extends PureComponent {
    constructor(props) {
        super();
        var { expression, type } = props;
        this.state = { expression, type };
    }

    componentDidMount() {
        this.inputField.focus();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        var { expression, type } = nextProps;
        this.setState({ expression, type });
    }

    expressionChanged = e => {
        var expression = e.currentTarget.value;
        var value = expression.trim();
        var type;
        var validation = null;
        if (!value.startsWith("=")) {
            type = "text";
        } else {
            validation = this.validateExpression(value);
        }
        var { onChange } = this.props;
        if (onChange) {
            onChange(value, type, validation);
        }
        this.setState({ expression, type, validation });
    };

    validateExpression(expression) {
        return { isValid: true, errors: [] };
    }

    validateKeys = e => {
        var { keyCode } = e;
        var { multiline, wordWrap } = this.props;
        if (keyCode === 13 && (!multiline || wordWrap)) {
            // When Enter key is pressed
            this.endEdit();
            e.preventDefault();
            e.stopPropagation();
        } else if (keyCode === 27) {
            // When Esc key is pressed
            this.endEdit(this.props);
        }
    };

    endEdit = field => {
        var { endEdit, disabled } = this.props;

        if (!endEdit || disabled || this.disableBlurEvent) {
            return;
        }

        if (!endEdit) {
            return;
        }
        var { expression, type } = field || this.state;
        if (field) {
            this.setState({ expression, type });
        }
        endEdit(expression, type);

        this.disableBlurEvent = true;
        this.inputField.blur();
        delete this.disableBlurEvent;
    };

    render() {
        var { disabled, placeholder } = this.props;
        var { expression, type } = this.state;

        var useTextarea = true; // Revisit: may need to use "multiline" property instead

        if (!type && expression && !expression.startsWith("=")) {
            expression = "=" + expression;
        }

        return (
            <div className="expression-editor">
                {useTextarea ? (
                    <textarea
                        disabled={disabled}
                        placeholder={placeholder}
                        value={expression || ""}
                        className={this.props.className}
                        ref={input => {
                            this.inputField = input;
                        }}
                        onChange={this.expressionChanged}
                        onKeyDown={this.validateKeys}
                        onBlur={() => this.endEdit()}
                    />
                ) : (
                    <input
                        disabled={disabled}
                        placeholder={placeholder}
                        type="text"
                        value={expression || ""}
                        className={this.props.className}
                        ref={f => {
                            this.inputField = f;
                        }}
                        onChange={this.expressionChanged}
                        onKeyDown={this.validateKeys}
                        onBlur={() => this.endEdit()}
                    />
                )}
            </div>
        );
    }
}

export default ExpressionEditor;
