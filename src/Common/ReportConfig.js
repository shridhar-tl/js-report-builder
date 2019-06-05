import array from "./linq";

export function initReportBuilder(config) {
    var { parameterTypes, datasetTypes, builtInFields, commonFunctions } = config;
    initParamTypes(parameterTypes);
    initDatasetTypes(datasetTypes);
    initBuiltinFields(builtInFields);
    initCommonFunctions(commonFunctions);
}

// #region Parameter related functions

const inbuiltParamTypes = [
    { label: "Text", value: "TXT" },
    { label: "Checkbox", value: "CHK" },
    { label: "Yes / No Slider", value: "YNS" },
    { label: "Integer", value: "INT" },
    { label: "Number", value: "NUM" },
    { label: "Dropdown", value: "DDL" },
    { label: "Autocomplete", value: "AC" },
    { label: "Date", value: "DTE" },
    { label: "Date Range", value: "DR" }
];

var paramTypes = [...inbuiltParamTypes];

export function getParamTypes() {
    return paramTypes;
}

function initParamTypes(parameterTypes) {
    if (parameterTypes) {
        var paramsList = [...inbuiltParamTypes];
        var $params = array(paramsList);
        // ToDo: Check for duplicate / existing parameters and override. Allow changing label alone
        Object.keys(parameterTypes).forEach(k => {
            var param = parameterTypes[k];
            if (param === false) {
                $params.removeAll(p => p.value === k);
                return;
            } else if (!param.label || !param.control) {
                return;
            }

            paramsList.push({
                value: k,
                label: param.label,
                control: param.control
            });
        });
        paramTypes = paramsList;
    }
}

// #endregion

function initDatasetTypes(datasetTypes) {}

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
var commonFuncs = [];

export function getCommonFunctions() {
    return commonFuncs;
}

function initCommonFunctions(funcs) {
    if (funcs) {
        commonFuncs = Object.keys(funcs).map(k => {
            return {
                field: k,
                helpText: funcs.helpText,
                value: funcs.value
            };
        });
    }
}

// #endregion
