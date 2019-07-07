import { PureComponent } from "react";
import { GridContext } from "../../Common";
import array from "../../../../Common/linq";

export default class GridGroup extends PureComponent {
    static contextType = GridContext;

    constructor(props, isRowGroup) {
        super(props);
        this.isRowGroup = isRowGroup;
    }

    UNSAFE_componentWillMount() {
        this.disposeTracker = this.context.trackState(this.setComponentState.bind(this));
    }

    componentWillUnmount() {
        if (this.disposeTracker) {
            this.disposeTracker();
        }
    }

    setComponentState(stateTracker) {
        var { props } = this;
        var { group, parentGroup, isRowGroup } = props;

        var $group = group.$group;
        if (!$group) {
            $group = this.context.compileGroup(group, stateTracker);
        }

        this.$group = $group;

        var parentGroupFields = (parentGroup || {}).Fields;

        var rowGroup = isRowGroup ? parentGroup : undefined;
        var colGroup = isRowGroup ? undefined : parentGroup;

        if (!this.variables) {
            this.variables = $group.variables({
                fields: parentGroupFields,
                rowGroup,
                colGroup,
                variables: (parentGroup || {}).Variables
            });
        }

        var dataset = group.dataset;
        var data;

        if (dataset === -1) {
            data = $group.$expression(parentGroupFields, rowGroup, colGroup, this.variables);
        }
        else {
            data = this.context.getDataset(dataset);
        }

        if (data) {
            var { filter, keys, sortBy } = $group;
            if (filter) {
                data = data.filter(filter(null, rowGroup, colGroup, this.variables));
            }

            if (keys) {
                var groupKey;
                if (keys.length === 1) {
                    keys = keys[0];
                    groupKey = f => keys(f, rowGroup, colGroup, this.variables);
                } else {
                    groupKey = f => keys.map(k => k(f, rowGroup, colGroup, this.variables));
                }
                data = array(data).groupBy(groupKey)();
            }

            if (sortBy) {
                if (typeof sortBy === "function") {
                    data = array(data).sortBy(sortBy(null, rowGroup, colGroup, this.variables))();
                }
                else if (typeof sortBy === "string") {
                    data = array(data).sortBy(f => f[sortBy])();
                }
            }
        } else {
            console.error("Unable to resolve data for " + (isRowGroup ? "row" : "col") + " group: ", group.name);
        }

        this.setState({ data: data || null });
        this.isDataGrouped = !!$group.keys;
        this.hasMultiKey = ($group.keys || []).length > 1;
    }

    render() {
        var { state: { data }, props, variables: Variables, isDataGrouped, hasMultiKey } = this;
        var { children } = props;
        var keyPropName = hasMultiKey ? "keys" : "key";

        return (
            data &&
            data.map((Fields, i) => {
                var grpData = { Fields, Variables };

                if (isDataGrouped) {
                    grpData.Fields = Fields.values;
                    grpData[keyPropName] = Fields.key;
                    grpData.values = Fields.values;
                }
                return children(grpData, grpData.Fields._uniqueId);
            })
        );
    }
}
