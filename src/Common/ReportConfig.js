import "./extensions";
import array from "./linq";
import inbuiltFunctions from "./CommonFunctions";
import inbuiltDatasets from "./DatasetTypes";

export function initReportBuilder(config) {
    var { parameterTypes, datasetTypes, builtInFields, commonFunctions } = config;
    initParamTypes(parameterTypes);
    initDatasetTypes(datasetTypes);
    initBuiltinFields(builtInFields);
    initCommonFunctions(commonFunctions);
    return Promise.resolve({ parameterTypes: getParamTypes(true) });
}

// #region Parameter related functions

const inbuiltParamTypes = [
    { label: "Text", value: "TXT" },
    { label: "Masked Text", value: "MASK", handleMultivalue: true },
    { label: "Checkbox", value: "CHK", displayHandled: true, supportMultiValue: false },
    //{ label: "Yes / No Slider", value: "YNS", supportMultiValue: false },
    { label: "Integer", value: "INT", handleMultivalue: true },
    { label: "Number", value: "NUM", handleMultivalue: true },
    { label: "Dropdown", value: "DDL" },
    { label: "Autocomplete", value: "AC" },
    { label: "Date", value: "DTE" },
    { label: "Date Range", value: "DR", handleMultivalue: true },
    { label: "File browser", value: "FILE" }
];

var paramTypes = [...inbuiltParamTypes];

export function getParamTypes(reduced) {
    if (!reduced) {
        return paramTypes;
    } else {
        return getParamTypes().reduce((obj, param) => {
            obj[param.value] = param;
            return obj;
        }, {});
    }
}

function initParamTypes(parameterTypes) {
    if (parameterTypes) {
        paramTypes = [...inbuiltParamTypes];
        var $params = array(paramTypes);
        // ToDo: Check for duplicate / existing parameters and override. Allow changing label alone

        Object.keys(parameterTypes).forEach(k => {
            var param = parameterTypes[k];
            if (param === false) {
                $params.removeAll(p => p.value === k);
                return;
            } else if (!param.label || !param.control) {
                console.error("Custom parameter type expect mandatory properties of label and control", param);
                return;
            }

            paramTypes.push({
                value: k,
                label: param.label,
                control: param.control,
                displayHandled: param.displayHandled,
                supportMultiValue: param.supportMultiValue
            });
        });
    }
}

// #endregion

// #region Dataset related functions
var datasetTypes = [...inbuiltDatasets];

export function getDatasetTypes(reduced) {
    if (!reduced) {
        return datasetTypes;
    } else {
        return datasetTypes.reduce((obj, param) => {
            obj[param.type] = param;
            return obj;
        }, {});
    }
}

function initDatasetTypes(customTypes) {
    if (customTypes) {
        datasetTypes = [...inbuiltDatasets];
        var $datasetTypes = array(datasetTypes);
        // ToDo: Check for duplicate / existing datasets and override. Allow changing label alone

        Object.keys(customTypes).forEach(k => {
            var ds = customTypes[k];

            if (ds === false) {
                $datasetTypes.removeAll(p => p.value === k);
                return;
            }

            var { label, resolveSchema, resolveData } = ds;

            if (!label || !resolveSchema || !resolveData) {
                console.error("Custom dataset type expect mandatory properties of label, resolveSchema and resolveData", ds);
                return;
            }

            datasetTypes.push({
                type: k,
                label: label,
                resolveSchema: resolveSchema,
                resolve: function({ dataset, parameters, parameterTemplate }, getDatasetData) {
                    //Also received in first param, commonFunctions, myFunctions
                    var { props } = dataset;
                    return resolveData(props, parameters, { parameterTemplate, getDatasetData });
                }
            });
        });
    }
}

// #endregion

// #region Builtin fields
var builtInFields = [];

export function getBuiltInFields() {
    return builtInFields;
}

function initBuiltinFields(fields) {
    if (fields) {
        builtInFields = Object.keys(fields).map(k => {
            var field = fields[k];
            return {
                field: k,
                helpText: field.helpText,
                value: field.value
            };
        });
    }
}

// #endregion

// #region Common inbuilt functions

var commonFuncs = [...inbuiltFunctions];

export function getCommonFunctions(reduced) {
    if (!reduced) {
        return commonFuncs;
    } else {
        return commonFuncs.reduce((obj, val) => {
            obj[val.name] = val.value;
            return obj;
        }, {});
    }
}

function initCommonFunctions(funcs) {
    if (funcs) {
        commonFuncs = [...inbuiltFunctions];
        Object.keys(funcs).forEach(k => {
            commonFuncs.push({
                name: k,
                helpText: funcs.helpText,
                value: funcs.value
            });
        });
    }
}

// #endregion
