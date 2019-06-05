import React, { PureComponent } from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import "./ReportBuilder.scss";
import ReportControls from "./ReportControls/ReportControls";
import ReportDisplay from "./ReportDisplay/ReportDisplay";
import { BuilderContext } from "./Common/Constants";
import array from "../../Common/linq";

class ReportBuilder extends PureComponent {
    constructor(props) {
        super();
        var { data } = props;
        this.state = { data: data || { reportItems: [], datasets: {}, parameters: [] } };
        var { datasets, datasetList } = data;
        this.sharedProps = {
            data,
            getDatasetList: includeExpressionDS => {
                var list = array(
                    datasetList.map(id => {
                        var ds = datasets[id];
                        return { id, name: ds.name };
                    })
                ).sortBy("name")();

                if (includeExpressionDS) {
                    list.push({ id: -1, name: "<<Expression>>" });
                }
                return list;
            },
            getDataset: id => datasets[id],
            selectControl: (selElement, elementData) => {
                this.setState({ selElement, elementData });
            },
            getState: itemName => (itemName ? this.state[itemName] : this.state)
        };
    }

    itemSelected = e => {
        var { selections } = e;
        if (selections) {
            this.setState({ selections });
            delete e.selections;
        }
    };

    getReportDefinition = () => this.state.data;

    render() {
        var { data, selections } = this.state;
        return (
            <BuilderContext.Provider value={this.sharedProps}>
                <div className="report-builder">
                    <div className="report-controls-cntr">
                        <ReportControls data={data} datasets={data.datasets} selectedItems={selections} />
                    </div>
                    <div className="report-display-cntr" onClick={this.itemSelected}>
                        <ReportDisplay items={data.reportItems} />
                    </div>
                </div>
            </BuilderContext.Provider>
        );
    }
}

export default DragDropContext(HTML5Backend)(ReportBuilder);
