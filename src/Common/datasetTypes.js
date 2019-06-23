import array from "./linq";
import { compileExpression, compileVariables } from "./Compiler";

var inbuiltDatasets = [
    { type: "HTP", label: "Online dataset (http request)", resolve: resolve_HTP, disabled: true },
    { type: "FIL", label: "File dataset (CSV, EXCEL or JSON files)", resolve: resolve_FIL, disabled: true },
    { type: "STC", label: "Static dataset (manually input value in a table)", resolve: resolve_STC, disabled: true },
    { type: "FLT", label: "Flatern dataset (generate dataset by flatening other dataset)", resolve: resolve_FLT },
    { type: "EXP", label: "Expression dataset (generate dataset using other dataset)", resolve: resolve_EXP }
];

export default inbuiltDatasets;

function resolve_FLT(props, getDatasetData) {
    return new Promise(function (resolve, reject) {
        try {
            var { dataset, parameters, commonFunctions, myFunctions } = props;
            var { colProps, dependencies: dsId, filter, variables } = dataset;
            var $filter = filter ? compileExpression(filter)(commonFunctions, myFunctions, parameters, getDatasetData) : null;
            var $colProps = null;

            if (~colProps.indexOf("function") || ~colProps.indexOf("=>")) {
                $colProps = compileExpression(colProps)(commonFunctions, myFunctions, parameters, getDatasetData)();
            } else {
                $colProps = JSON.parse(colProps);
            }

            var srcDSData = getDatasetData(dsId);
            if (!srcDSData) {
                reject("Source dataset is not available / valid");
                return;
            }

            var result = array(srcDSData).flattern($colProps)();

            if ($filter && result && result.length) {
                var $variables = compileVariables(
                    variables,
                    { parameters, commonFunctions, myFunctions, datasets: getDatasetData },
                    true
                );
                result = result.filter(r => $filter(r, undefined, undefined, $variables));
            }

            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}

function resolve_EXP(props, getDatasetData) {
    return new Promise(function (resolve, reject) {
        try {
            resolve({});
        } catch (err) {
            reject(err);
        }
    });
}

function resolve_FIL(props, getDatasetData) {
    return new Promise(function (resolve, reject) {
        try {
            resolve({});
        } catch (err) {
            reject(err);
        }
    });
}

function resolve_HTP() {
    return new Promise(function (resolve, reject) {
        try {
            resolve({});
        } catch (err) {
            reject(err);
        }
    });
}

function resolve_STC() {
    return new Promise(function (resolve, reject) {
        try {
            resolve({});
        } catch (err) {
            reject(err);
        }
    });
}

export function getDatasetDefinition(data, datasetId, path) {
    if (!data) {
        return undefined;
    }
    if (Array.isArray(data)) {
        data = data[0];
    }
    return getItems(data, datasetId, path);
}

function getItems(obj, set, prefix) {
    if (!obj) {
        return null;
    }
    let items = Object.keys(obj);
    if (prefix) {
        prefix += ".";
    } else {
        prefix = "";
    }
    return items.map(key => {
        let type = getItemType(obj[key]);
        if (!type) {
            return null;
        }
        let path = prefix + key;
        var childrens;

        if (type === "object") {
            childrens = getItems(obj[key], set, path);
        } else if (type === "array") {
            path += "[0]";
            childrens = getDatasetDefinition(obj[key], set, path);
        }

        let itm = { set, key, path, type, children: childrens };

        if (!itm.children || itm.children.length === 0) {
            delete itm.children;
        }

        //itm.hasChild = itm.type === 'object' && Object.keys(obj[item]).length > 0;
        return itm;
    });
}

function getItemType(item) {
    if (item == null) {
        return;
    }
    if (Array.isArray(item)) {
        return "array";
    }
    if (item instanceof Date) {
        return "date";
    }
    return (typeof item).toLowerCase();
}
