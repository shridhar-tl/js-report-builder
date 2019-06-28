import React, { PureComponent } from "react";
import "./ExpressionEditor.scss";

class ExpressionEditor extends PureComponent {
    constructor(props) {
        super();
        var { expression, type } = props;
        this.state = { expression, type, validation: this.validateExpression(expression) };
    }

    componentDidMount() {
        this.inputField.focus();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        var { expression, type } = nextProps;
        this.setState({ expression, type });
    }

    expressionChanged = e => {
        this.isChanged = true;
        var expression = e.currentTarget.value;
        var value = expression.trim();
        var type;
        var validation = null;
        if (!value.startsWith("=") && !this.props.isStrict) {
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
        // ToDo: validation need to be implemented
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
        var { expression, type, validation } = field || this.state;
        if (field) {
            this.setState({ expression, type });
        }
        endEdit(expression, type, field ? { isCanceled: true } : { validation, isCanceled: !this.isChanged });

        this.disableBlurEvent = true;
        this.inputField.blur();
        delete this.disableBlurEvent;
    };

    render() {
        var { disabled, placeholder, style, className } = this.props;
        var { expression, type } = this.state;

        var useTextarea = true; // Revisit: may need to use "multiline" property instead

        if (!type && expression && !expression.startsWith("=")) {
            expression = "=" + expression;
        }

        return (
            <div className="expression-editor">
                {useTextarea ? (
                    <textarea
                        style={style}
                        disabled={disabled}
                        placeholder={placeholder}
                        value={expression || ""}
                        className={className}
                        ref={input => {
                            this.inputField = input;
                        }}
                        onChange={this.expressionChanged}
                        onKeyDown={this.validateKeys}
                        onBlur={() => this.endEdit()}
                    />
                ) : (
                        <input
                            style={style}
                            disabled={disabled}
                            placeholder={placeholder}
                            type="text"
                            value={expression || ""}
                            className={className}
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
