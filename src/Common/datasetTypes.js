import array from "./linq";
import { compileExpression, compileVariables } from "./Compiler";
import { httpRequest } from "./CommonFunctions";

var inbuiltDatasets = [
    { type: "HTP", label: "Online dataset (http request)", resolve: resolve_HTP },
    { type: "FLT", label: "Flatern dataset (generate dataset by flatening other dataset)", resolve: resolve_FLT },
    { type: "EXP", label: "Expression dataset (generate dataset using other dataset)", resolve: resolve_EXP },
    { type: "FIL", label: "File dataset (CSV, EXCEL or JSON files)", resolve: resolve_FIL, disabled: true },
    { type: "STC", label: "Static dataset (manually input value in a table)", resolve: resolve_STC, disabled: true }
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

function resolve_HTP(props, getDatasetData) {
    return new Promise(function (resolve, reject) {
        try {
            var { dataset, parameters, commonFunctions, myFunctions } = props;
            var { url, method, body, params, headers } = dataset;

            var parseExpr = function (expr) {
                if (!expr) { return expr; }

                return compileExpression(expr, {
                    commonFunctions, myFunctions, datasets: getDatasetData, parameters
                })();
            }

            var tryParseExpression = function (item) {
                if (typeof item !== "object") { return item; }
                if (item.expression) {
                    var pfunc = parseExpr(item.expression);
                    if (typeof pfunc === "function") {
                        return pfunc();
                    }
                    else {
                        return pfunc;
                    }
                }
            }

            url = tryParseExpression(url);

            var data;

            if (method !== "GET" && !!body) {
                data = tryParseExpression(body);
            }

            if (!data && params && params.length > 0) {
                data = params.reduce((obj, cur) => {
                    var { name, value } = cur;
                    value = tryParseExpression(value);
                    obj[name] = value;
                    return obj;
                }, {});
            }

            if (headers && headers.length > 0) {
                headers = headers.reduce((obj, cur) => {
                    var { name, value } = cur;
                    value = tryParseExpression(value);
                    obj[name] = value;
                    return obj;
                }, {});
            } else {
                headers = null;
            }

            resolve(httpRequest(method, url, data, headers));
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

    let obj = data;
    data = null;

    if (Array.isArray(obj)) {
        data = obj;
        obj = obj[0];
    }

    return getItems(obj, datasetId, path, data);
}

function getItems(obj, set, prefix, dataset) {
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
        let curProp = obj[key];
        if (!curProp && dataset) {
            curProp = (array(dataset).first(d => !!d[key]) || {})[key];
        }

        let type = getItemType(curProp);
        if (!type) {
            return null;
        }

        let path = prefix + key;
        var childrens;

        if (type === "object") {
            childrens = getItems(curProp, set, path);
        } else if (type === "array") {
            path += "[0]";
            childrens = getDatasetDefinition(curProp, set, path);
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
        return "unknown";
    }
    if (Array.isArray(item)) {
        return "array";
    }
    if (item instanceof Date) {
        return "date";
    }
    return (typeof item).toLowerCase();
}
