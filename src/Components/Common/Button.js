import React, { PureComponent } from "react";
import { Button as PrimeButton } from "primereact/button";

const buttonTypes = {
    danger: "p-button-danger",
    success: "p-button-success",
    secondary: "p-button-secondary",
    warning: "p-button-warning",
    info: "p-button-info",
    primary: "",
    default: ""
};

class Button extends PureComponent {
    render() {
        var { type, className, rounded } = this.props;
        var btnClass = buttonTypes[type] || "";
        if (rounded) {
            btnClass += " p-button-rounded ";
        }
        className = className || "";
        var props = { ...this.props, className: btnClass + " " + className };
        return <PrimeButton {...props} />;
    }
}

export default Button;
