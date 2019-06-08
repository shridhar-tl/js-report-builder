import React, { PureComponent } from "react";
import ReportParameters from "./ReportParameters/ReportParameters";
import ReportDisplay from "./ReportDisplay/ReportDisplay";
import "./ReportViewer.scss";

class ReportViewer extends PureComponent {
    constructor(props) {
        super(props);
        var { definition, defaultParameters = {} } = props;
        this.state = { definition, defaultParameters, parameterValues: { ...defaultParameters } };
    }

    componentDidMount() {
        this.initParameters();
    }

    initParameters() {
        var {
            definition: { parameters }
        } = this.state;
        if (parameters && parameters.length > 0) {
            this.setState({ hasParameters: true, showParameters: true });
        }
    }

    updateParameters = () => {};

    render() {
        var { showParameters, parameterValues, definition } = this.state;
        //var { } = definition;

        return (
            <div>
                {showParameters && (
                    <ReportParameters definition={definition} values={parameterValues} onChange={this.updateParameters} />
                )}
                {!showParameters && <ReportDisplay definition={definition} />}
            </div>
        );
    }
}

export default ReportViewer;
