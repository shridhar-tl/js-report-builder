import React, { PureComponent } from "react";
import { getParamTypes } from "../../../Common/ReportConfig";
import "./ReportParameters.scss";
import Button from "../../Common/Button";
import InputParameter from "../../Common/InputParameter";
import { ViewerContext } from '../Common';

class ReportParameters extends PureComponent {
    static contextType = ViewerContext;

    constructor(props) {
        super(props);
        const { definition, values } = props;
        const { datasets, parameters } = definition;
        this.parameters = parameters;
        this.datasets = datasets;
        this.paramTypes = getParamTypes(true);
        this.state = this.validateParameters({ ...values });
    }

    parameterValueChanged = (param, value) => {
        let { values } = this.state;
        const existingValue = values[param.name];
        if (existingValue === value) { return; }
        values[param.name] = value;
        values = { ...values };
        const state = this.validateParameters(values);
        this.setState(state);
    };

    validateParameters(values) {
        const { definition } = this.props;
        const { parameters } = definition;
        let paramLen = parameters.length;
        const paramErrors = {};
        let isParamsValid = true;

        while (paramLen--) {
            const paramDef = parameters[paramLen];
            const { name, allowNulls, allowMultiple } = paramDef;
            if (allowNulls) { continue; }
            const paramValue = values[name];

            if (!paramValue) { isParamsValid = false; break; }
            else if (allowMultiple && Array.isArray(paramValue)) {
                if (!paramValue.length) { isParamsValid = false; break; }
            }
        }

        return { values, paramErrors, isParamsValid };
    }

    saveParameters = () => {
        const { values } = this.state;
        this.props.onChange(values);
    };

    getParameterControl = (param, i) => {
        const { display, name, type, allowNulls } = param;
        const { values } = this.state;
        const paramType = this.paramTypes[type];

        if (!paramType) {
            console.error("Unknown parameter type: ", type);
            return null;
        }

        const { control, displayHandled } = paramType;

        const Control = control || InputParameter;

        return (
            <div key={i} className="p-xl-3 p-lg-4 p-md-5 p-nogutter param">
                {!displayHandled && <div className={`label${allowNulls ? "" : " mandatory"}`}><label>{display}</label></div>}
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
        const { parameters, state } = this;
        const { isParamsValid } = state;

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
