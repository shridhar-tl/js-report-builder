import { clone as _clone, UUID as _UUID } from "../../../Common/HelperFunctions";

export const clone = _clone;
export const UUID = _UUID;

function maxDepth(a) {
    let maxVal = Number.MIN_VALUE;
    let item;

    a.forEach(val => {
        val = val.type > 1 ? val.children : null;
        const depth = getNestingDepth(val);
        if (depth > maxVal) {
            maxVal = depth;
            item = val;
        }
    });

    return item;
}

export function getNestingDepth(a, count = 0) {
    return Array.isArray(a) ? getNestingDepth(maxDepth(a), count + 1) : count;
}

export function getDefaultGridData() {
    return {
        columns: [
            { type: 1, children: [], style: { width: "100px" } },
            { type: 1, children: [], style: { width: "100px" } },
            { type: 1, children: [], style: { width: "100px" } }
        ],
        head: [{ type: 1, children: [] }],
        body: [{ type: 1, children: [] }, { type: 1, children: [] }, { type: 1, children: [] }]
    };
}

export function getUniqueGroupName() {
    return `Group${getUniqueId()}`;
}

export function getUniqueId() {
    return UUID.generate().split("-")[4];
}

/*
// ToDo: need to check if this is used
export function repeatColumns(cols, colParent, item, parent, repeator) {
    var result = [];
    for (var col of cols) {
        col.$parent = cols;
        if (col.type === 1) {
            result.push(repeator(getGlobalIndex(col, colParent || cols), col, colParent, item, parent));
        }
        else if (col.children.length > 0) {
            var subcols = repeatColumns(col.children, col, item, parent, repeator);
            array(result).addRange(subcols);
        }
    }
    return result;
}

export function getGlobalIndex(item, parent) {
    if (!parent) { return 0; }
    let items = parent.children || parent;
    let curIdx = items.indexOf(item);
    for (let i = 0; i < curIdx; i++) {
        curIdx += getChildItemsCount(items[i]) - 1;
    }
    return curIdx + getGlobalIndex(parent, parent.$parent);
}

export function getChildItemsCount(item) {
    if (!item || item.type === 1) { return 1; }
    let count = 0;
    let items = item.children;
    for (let i = 0; i < items.length; i++) {
        count += getChildItemsCount(items[i]);
    }
    return count;
}

// Need to check if used
export function repeatRows(items, parent, headerCell, repeator) {
    var { data: { columns } } = this.state;
    var result = [];
    for (var item of items) {
        item.$parent = items;
        if (item.type === 1) {
            result.push(<tr>{headerCell}{repeatColumns(columns, columns, item, parent, repeator)}</tr>);
        }
        else if (item.children.length > 0) {
            array(result).addRange(this.repeatRows(item.children, item, headerCell, repeator));
        }
    }

    return result;
}
*/
