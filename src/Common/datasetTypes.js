import array from "./linq";
import { compileExpression, compileVariables } from "./Compiler";

var inbuiltDatasets = [
    /*{ type: 'JQL', label: 'JQL search result' },
    { type: 'PLS', label: 'Project list' },
    { type: 'STS', label: 'Status list' },
    { type: 'ITL', label: 'Issue type list' },*/
    { type: "HTP", label: "Online dataset (http request)", resolve: resolve_HTP },
    { type: "FIL", label: "File dataset (CSV, EXCEL or JSON files)", resolve: resolve_FIL },
    { type: "STC", label: "Static dataset (manually input value in a table)", resolve: resolve_STC },
    { type: "FLT", label: "Flatern dataset (generate dataset by flatening other dataset)", resolve: resolve_FLT },
    { type: "EXP", label: "Expression dataset (generate dataset using other dataset)", resolve: resolve_EXP }
];

export default inbuiltDatasets;

function resolve_FLT(props, getDatasetData) {
    return new Promise(function(resolve, reject) {
        try {
            var { dataset, parameters, commonFunctions, myFunctions, getDataset } = props;
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
    return new Promise(function(resolve, reject) {
        try {
            resolve({});
        } catch (err) {
            reject(err);
        }
    });
}

function resolve_FIL(props, getDatasetData) {
    return new Promise(function(resolve, reject) {
        try {
            resolve({});
        } catch (err) {
            reject(err);
        }
    });
}

function resolve_HTP() {
    return new Promise(function(resolve, reject) {
        try {
            resolve({});
        } catch (err) {
            reject(err);
        }
    });
}

function resolve_STC() {
    return new Promise(function(resolve, reject) {
        try {
            resolve({});
        } catch (err) {
            reject(err);
        }
    });
}
