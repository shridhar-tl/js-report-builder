import React, { PureComponent } from "react";
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import "./ExpressionEditor.scss";
import Button from "../../Common/Button";

const preIconStyle = { height: "32px", padding: "0px", fontSize: "19px" };
const inputStyle = { minHeight: "32px", height: "32px" };
const buttonStyle = { minHeight: "32px" };

class ExpressionEditor extends PureComponent {
    constructor(props) {
        super();
        var { expression, type, autoDetect } = props;

        if (typeof expression === "object") {
            type = null;
            expression = expression.expression;
        }
        else if (autoDetect) { type = "text"; }

        if (!type && (expression !== null && expression !== undefined)) { expression = "=" + expression; }

        this.state = { expression, type, validation: this.validateExpression(expression) };
    }

    componentDidMount() {
        this.inputField?.focus();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        var { expression, type, autoDetect, isStrict } = nextProps;

        if (typeof expression === "object") {
            type = null;
            expression = expression.expression;
        }
        else if (autoDetect && !isStrict) { type = "text"; }

        var { expression: oldExpression, type: oldType } = this.state;

        if (!type && (expression !== null && expression !== undefined)) { expression = "=" + expression; }

        if (oldExpression && (expression || "").trim() === oldExpression.trim()) { expression = oldExpression; }

        if (expression !== oldExpression || type !== oldType) {
            this.setState({ expression, type });
        }
    }

    expressionChanged = e => {
        this.isChanged = true;
        var expression = e.target.value;
        var value = expression.trim();
        var type;
        var validation = { isValid: true };
        if (!value.startsWith("=") && !this.props.isStrict) {
            type = "text";
        } else {
            if (value.startsWith("=")) { value = value.substring(1).trim(); }
            validation = this.validateExpression(value);
            if (this.props.autoDetect && !this.props.isStrict) {
                value = { expression: value };
            }
        }

        this.setState({ expression, type, validation }, () => {
            var { onChange } = this.props;
            if (onChange) {
                onChange(value, type, validation);
            }
        });
    };

    validateExpression(expression) {
        // ToDo: validation need to be implemented
        return { isValid: true, errors: [] };
    }

    validateKeys = e => {
        var { keyCode } = e;
        var { wordWrap } = this.props;

        if (keyCode === 13 && wordWrap !== true) {
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
        expression = (expression || "").trim();

        if (!type) {
            expression = expression.substring(1).trim();
        }

        endEdit(expression, type, field ? { isCanceled: true } : { validation, isCanceled: !this.isChanged });

        this.disableBlurEvent = true;
        this.inputField.blur();
        delete this.disableBlurEvent;
    };

    onBlur = () => this.endEdit();
    setRef = (field) => this.inputField = field;

    render() {
        const { disabled, style = inputStyle, className, isStrict, noGroups } = this.props;
        let { placeholder } = this.props;
        let { expression, type, validation: { isValid } = {} } = this.state;

        if (!placeholder && !noGroups) {
            placeholder = isStrict ? "provide an expression here..." : "provide a value or expression here...";
        }

        const useTextarea = true; // Revisit: may need to use "multiline" property instead

        let hasValue = !!expression;

        if (!type && expression) {
            if (!expression.startsWith("=")) {
                expression = "=" + expression;
                hasValue = true;
            }
            else {
                hasValue = expression.length > 1;
            }
        }

        const inputProps = {
            style,
            disabled,
            placeholder,
            value: expression || "",
            className,
            ref: this.setRef,
            onChange: this.expressionChanged,
            onKeyDown: this.validateKeys,
            onBlur: this.onBlur
        };

        const inputField = useTextarea ? <InputTextarea autoResize {...inputProps} /> : <InputText type="text" {...inputProps} />;

        if (noGroups) {
            return inputField;
        }

        return (
            <div className="expression-editor">
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon" style={preIconStyle}>
                        <i className={"fa " + (!isStrict && type ? "fa-font" : "fa-code")} />
                    </span>
                    {inputField}
                    <Button type={(hasValue ? (isValid ? "success" : "danger") : null)}
                        title="Edit expression in a seperate popup"
                        style={buttonStyle} icon="fa fa-external-link" />
                </div>
            </div>
        );
    }
}

export default ExpressionEditor;
