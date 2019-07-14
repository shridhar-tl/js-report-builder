import React, { PureComponent } from "react";
import { BuilderContext } from "./Constants";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";

class SelectDataset extends PureComponent {
    static contextType = BuilderContext;
    constructor(props) {
        super(props);
        this.state = { value: props.value };
    }

    componentDidMount() {
        var { value, multiselect, includeExprDS } = this.props;
        var datasets = this.context.getDatasetList(!!includeExprDS);
        if (!value) {
            value = [];
        }
        var selItems = multiselect ? datasets.filter(ds => value.indexOf(ds.id) >= 0) : datasets.filter(ds => ds.id === value)[0];
        this.setState({ datasets, selItems });
    }

    selectionChanged = e => {
        this.setState({ selItems: e.value });
        var { onChange, multiselect } = this.props;
        if (onChange) {
            onChange(multiselect ? e.value.map(v => v.id) : (e.value || {}).id);
        }
    };

    render() {
        var { multiselect } = this.props;
        var { datasets = [], selItems } = this.state;

        if (multiselect) {
            return <MultiSelect appendTo={document.body} optionLabel="name" value={selItems} options={datasets} onChange={this.selectionChanged} />;
        } else {
            return <Dropdown appendTo={document.body} optionLabel="name" value={selItems} options={datasets} onChange={this.selectionChanged} />;
        }
    }
}

export default SelectDataset;
