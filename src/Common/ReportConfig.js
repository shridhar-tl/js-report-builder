import "./extensions";
import array from "./linq";
import inbuiltFunctions, { setHttpProxy } from "./CommonFunctions";
import inbuiltDatasets from "./DatasetTypes";
import { setCompilerOptions } from "./Compiler";

export const options = { useExternalDnDProvider: false };

export function initReportBuilder(config) {
    const { parameterTypes, datasetTypes, builtInFields, commonFunctions, subReports, resolveReportDefinition, resolveHttpRequest, compiler, parser, selfHandleScriptExecution } = config;
    options.useExternalDnDProvider = config.useExternalDnDProvider === true;
    setCompilerOptions(compiler, parser, selfHandleScriptExecution);
    setHttpProxy(resolveHttpRequest);

    initParamTypes(parameterTypes);
    initDatasetTypes(datasetTypes);
    initBuiltinFields(builtInFields);
    initCommonFunctions(commonFunctions);
    initSubReports(subReports, resolveReportDefinition);
    return Promise.resolve({ parameterTypes: getParamTypes(true) });
}

// #region Parameter related functions

const inbuiltParamTypes = [
    { label: "Text", value: "TXT", allowedValidations: ["regex", "keyfilter", "length"] },
    { label: "Masked Text", value: "MASK", handleMultivalue: true, allowedValidations: ["regex", "keyfilter", "length"] },
    { label: "Checkbox", value: "CHK", displayHandled: true, supportMultiValue: false },
    //{ label: "Yes / No Slider", value: "YNS", supportMultiValue: false },
    { label: "Integer", value: "INT", handleMultivalue: true, allowedValidations: ["range"] },
    { label: "Number", value: "NUM", handleMultivalue: true, allowedValidations: ["range"] },
    { label: "Dropdown", value: "DDL", allowedValidations: ["length"] },
    { label: "Autocomplete", value: "AC", allowedValidations: ["length"] },
    { label: "Date", value: "DTE", allowedValidations: ["daterange"] },
    { label: "Date Range", value: "DR", handleMultivalue: true, allowedValidations: ["daterange"] },
    { label: "File browser", value: "FILE", supportDefaultValue: false, allowedValidations: ["length", "filetypes"] }
];

export const supportedFileTypes = [
    { value: 1, label: "All known images", type: "image/*" },
    { value: 2, label: "JSON Files", type: ".json" },
    { value: 3, label: "CSV Files", type: ".csv" },
    { value: 4, label: "Excel documents", type: ".xlsx,.xls" }
];

let paramTypes = [...inbuiltParamTypes];

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
        const $params = array(paramTypes);
        // ToDo: Check for duplicate / existing parameters and override. Allow changing label alone

        Object.keys(parameterTypes).forEach(k => {
            const param = parameterTypes[k];
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
let datasetTypes = [...inbuiltDatasets];

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
        const $datasetTypes = array(datasetTypes);
        // ToDo: Check for duplicate / existing datasets and override. Allow changing label alone

        Object.keys(customTypes).forEach(k => {
            const ds = customTypes[k];

            if (ds === false) {
                $datasetTypes.removeAll(p => p.type === k);
                return;
            }

            if (ds === true) {
                const idx = $datasetTypes.findIndex(p => p.type === k)[0];
                if (idx >= 0) {
                    const dsToOrder = datasetTypes[idx];
                    datasetTypes.splice(idx, 1);
                    datasetTypes.push(dsToOrder);
                    return;
                }
            }

            const { label, allowEdit, resolveSchema, resolveData } = ds;

            if (!label || !resolveSchema || !resolveData) {
                console.error("Custom dataset type expect mandatory properties of label, resolveSchema and resolveData", ds);
                return;
            }

            datasetTypes.push({
                type: k,
                label,
                allowEdit,
                resolveSchema: resolveSchema,
                resolve: function ({ dataset, parameters, parameterTemplate }, getDatasetData) {
                    //Also received in first param, commonFunctions, myFunctions
                    const { props } = dataset;
                    return resolveData(props, parameters, { parameterTemplate, getDatasetData });
                }
            });
        });
    }
}

// #endregion

// #region Builtin fields
let builtInFields = [];

export function getBuiltInFields() {
    return builtInFields;
}

function initBuiltinFields(fields) {
    if (fields) {
        builtInFields = Object.keys(fields).map(k => {
            const field = fields[k];
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

let commonFuncs = [...inbuiltFunctions];

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
            array(commonFuncs).removeAll(f => f.name === k); // Remove inbuild function with same name
            commonFuncs.push({
                name: k,
                helpText: funcs[k].helpText,
                value: funcs[k].value
            });
        });
    }
}

// #endregion

// #region Builder template

const defaultDefinition = { reportItems: [], datasets: {}, datasetList: [], parameters: [] };

const reportDefinition = { ...defaultDefinition };

export function getDefaultRptDefinition() {
    return reportDefinition;
}

export const myFuncPlaceholder = `// Write your own functions here and you can use it in expressions like MyFunctions.yourFunctionName('param value')
// Mutating parameters, any existing datasets or objects would result in an unexpected behaviour.

this.yourFunction1 = function yourFunction1(param1) {
  return param1;
}

this.yourFunction2 = function yourFunction2(paramA, paramB) {
  return paramA + paramB;
}`;

// #endregion

// #region Sub Reports

let subReportsList = [];
let resolveReportDefinition = null;

export function getReportsList(definition) {
    if (Array.isArray(subReportsList)) {
        return Promise.resolve(subReportsList);
    }
    else {
        return subReportsList(definition).then(prepareReportsList);
    }
}

function prepareReportsList(subReports) {
    return subReports.map(r => {
        const { id, name } = r;
        if (!id || !name) { throw new Error("id & name properties are expected in subReports"); }
        return { id, name };
    });
}

export function resolveReport(reportId) {
    return resolveReportDefinition(reportId).then(def => {
        if (!def) {
            this.setState({ reportError: "Unable to fetch report details" });
            console.error("Report definition was not resolved");
            return;
        }

        return def;
    });
}

function initSubReports(subReports, resolver) {
    if (!subReports) { return; }
    if (!Array.isArray(subReports) && typeof subReports !== "function") { throw new Error("'subReports' must resolve an array of objects with id & name properties"); }
    if (typeof resolver !== "function") { throw new Error("Expecting 'resolveReportDefinition' to be a function resolving report definition"); }
    resolveReportDefinition = resolver;
    if (Array.isArray(subReports)) {
        subReportsList = prepareReportsList(subReports);
    }
    else {
        subReportsList = subReports;
    }
}

// #endregion