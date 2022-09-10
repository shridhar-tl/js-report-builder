import React from 'react';
import ItemsBase from './ItemsBase';
import { ReportViewer } from '../../../lib';
import { resolveReport } from '../../../Common/ReportConfig';

class SubReport extends ItemsBase {
    getStateObject = async () => {
        const { definition } = this.props;
        const { style, reportId } = definition;
        let { hidden, $hidden, parameters, $parameters } = definition;

        if (hidden && !$hidden) {
            $hidden = await this.parseExpr(hidden, true);
            definition.$hidden = $hidden;
        }

        if (typeof $hidden === "function") {
            hidden = await this.executeExpr($hidden);
        }

        if (parameters && !$parameters) {
            $parameters = this.parseArray(parameters);
            definition.$parameters = $parameters;
        }

        if (Array.isArray($parameters)) {
            parameters = await this.executeArray($parameters, true);
        }

        if (reportId) {
            resolveReport(reportId).then(definition => this.setState({ definition, isLoading: null }), () => {
                this.setState({ isReportUnavailable: true });
            });
        }

        return { style, hidden, parameters, reportId, isLoading: true };
    };

    renderChild = () => {
        const { parameters, reportId, isLoading, isReportUnavailable, definition, style } = this.state;

        if (!reportId) { return <div>Report is not configured</div>; }
        else if (isLoading) { return <div>Loading report...</div>; }
        else if (isReportUnavailable) { return <div>Report unavailable!</div>; }

        return <ReportViewer style={style} parameterValues={parameters} definition={definition} />;
    };
}

export default SubReport;