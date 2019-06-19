import React, { PureComponent } from "react";
import { getParamTypes } from "../../../Common/ReportConfig";
import "./ReportParameters.scss";
import Button from "../../Common/Button";
import InputParameter from "../../Common/InputParameter";
import { ViewerContext } from '../Common'

class ReportParameters extends PureComponent {
    static contextType = ViewerContext;

    constructor(props) {
        super(props);
        var { definition, values } = props;
        var { datasets, parameters } = definition;
        this.parameters = parameters;
        this.datasets = datasets;
        this.paramTypes = getParamTypes(true);
        this.state = { values: this.validateParameters({ ...values }) };
    }

    parameterValueChanged = (param, value) => {
        var { values } = this.state;
        values[param.name] = value;
        values = { ...values };
        var state = this.validateParameters(values);
        this.setState(state);
    };

    validateParameters(values) {
        var { definition, values } = this.props;
        var { datasets, parameters } = definition;
        var paramLen = parameters.length;
        var paramErrors = {};
        var isParamsValid = true;

        while (paramLen--) {
            var paramDef = parameters[paramLen];
            var { name, allowNulls, allowMultiple } = paramDef;
            if (allowNulls) { continue; }
            var paramValue = values[name];

            if (!paramValue) { isParamsValid = false; }
            else if (allowMultiple && Array.isArray(paramValue)) {
                if (paramValue.length) { isParamsValid = false; }
            }
        }

        return { values, paramErrors, isParamsValid };
    }

    saveParameters = () => {
        var { values } = this.state;
        this.props.onChange(values);
    };

    getParameterControl = (param, i) => {
        var { display, name, type, allowNulls } = param;
        var { values } = this.state;
        var paramType = this.paramTypes[type];

        if (!paramType) {
            console.error("Unknown parameter type: ", type);
            return null;
        }

        var { control, displayHandled } = paramType;

        var Control = control || InputParameter;

        return (
            <div key={i} className="p-xl-3 p-lg-4 p-md-5 p-nogutter param">
                {!displayHandled && <div className={"label" + (allowNulls ? "" : " mandatory")}><label>{display}</label></div>}
                <div className="control">
                    <Control
                        definition={param}
                        handleMultivalue={paramType.handleMultivalue}
                        value={values[name]}
                        onChange={this.parameterValueChanged}
                        resolveDataset={this.context.resolveDataset}
                    />
                </div>
            </div>
        );
    };

    render() {
        var { parameters, state } = this;
        var { values, isParamsValid } = state;

        return (
            <div className="params-container">
                <div className="p-grid params-list">
                    {parameters.map(this.getParameterControl)}
                    <div style={{ clear: "both" }} />
                </div>
                <div className="footer">
                    <Button type="success" label="Done" disabled={!isParamsValid} onClick={this.saveParameters} />
                </div>
            </div>
        );
    }
}

export default ReportParameters;
