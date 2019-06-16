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
        var { definition: data } = props;
        this.state = { data: data || { reportItems: [], datasets: {}, parameters: [] } };
        this.sharedProps = {
            getDatasetList: includeExpressionDS => {
                var { datasets, datasetList } = data;
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
            getDataset: id => this.state.data.datasets[id],
            selectControl: (selElement, elementData) => {
                this.setState({ selElement, elementData });
            },
            getState: itemName => (itemName ? this.state[itemName] : this.state)
        };
    }

    componentDidMount() {
        var { api } = this.props;
        if (api) {
            api(this.externalApi);
        }
    }

    externalApi = {
        getReportDefinition: () => this.state.data
    };

    itemSelected = e => {
        var { selections } = e;
        if (selections) {
            this.setState({ selections });
            delete e.selections;
        }
    };

    render() {
        var { data, selections } = this.state;
        return (
            <BuilderContext.Provider value={this.sharedProps}>
                <div className="report-builder">
                    <div className="report-controls-cntr">
                        <ReportControls
                            data={data}
                            selectedItems={selections}
                            onChange={d => {
                                this.setState({ data: d });
                                if (this.props.onChange) {
                                    this.props.onChange(d);
                                }
                            }}
                        />
                    </div>
                    <div className="report-display-cntr" onClick={this.itemSelected}>
                        <ReportDisplay
                            items={data.reportItems}
                            onChange={d => {
                                data.reportItems = d;
                                if (this.props.onChange) {
                                    this.props.onChange(data);
                                }
                            }}
                        />
                    </div>
                </div>
            </BuilderContext.Provider>
        );
    }
}

export default DragDropContext(HTML5Backend)(ReportBuilder);
