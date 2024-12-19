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
        const { props } = this;
        const { group, parentGroup, isRowGroup } = props;

        let $group = group.$group;
        if (!$group) {
            $group = this.context.compileGroup(group, stateTracker);
        }

        this.$group = $group;

        const parentGroupFields = (parentGroup || {}).Fields;

        const rowGroup = isRowGroup ? parentGroup : undefined;
        const colGroup = isRowGroup ? undefined : parentGroup;

        if (!this.variables) {
            this.variables = $group.variables({
                fields: parentGroupFields,
                rowGroup,
                colGroup,
                variables: (parentGroup || {}).Variables
            });
        }

        const dataset = group.dataset;
        let data;

        if (dataset === -1) {
            data = $group.$expression(parentGroupFields, rowGroup, colGroup, this.variables);
        }
        else {
            data = this.context.getDataset(dataset);
        }

        if (data) {
            let { keys } = $group;
            const { filter, sortBy } = $group;
            if (filter) {
                data = data.filter(filter(null, rowGroup, colGroup, this.variables));
            }

            if (keys) {
                let groupKey;
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
            console.error(`Unable to resolve data for ${isRowGroup ? "row" : "col"} group: `, group.name);
        }

        this.setState({ data: data || null });
        this.isDataGrouped = !!$group.keys;
        this.hasMultiKey = ($group.keys || []).length > 1;
    }

    render() {
        const { state: { data }, props, variables: Variables, isDataGrouped, hasMultiKey } = this;
        const { children } = props;
        const keyPropName = hasMultiKey ? "keys" : "key";

        return (
            data &&
            data.map((Fields, i) => {
                const grpData = { Fields, Variables };

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
