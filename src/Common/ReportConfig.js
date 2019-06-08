import array from "./linq";
import moment from "moment";

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
var inbuiltFunctions = [
    {
        name: "getDateRange",
        helpText: "Returns an array with the list of available dates between the provided from and to date",
        value: (fromDate, toDate) => {
            return getDateArray(fromDate, toDate).map(d => {
                var dayOfWeek = d.getDay();
                var today = moment(d)
                    .startOf("day")
                    .toDate();

                return {
                    yyyyMMdd: d.format("yyyyMMdd"),
                    dayAndDate: d.format("DDD, dd"),
                    dayOfWeek,
                    date: d,
                    today,
                    todayInMS: today.getTime(),
                    isWeekEnd: dayOfWeek === 6 || dayOfWeek === 0
                    //isHoliday: this.$utils.isHoliday(d)
                };
            });
        }
    }
];

function getDateArray(startDate, endDate) {
    var interval = 1;
    var retVal = [];
    var current = new Date(startDate.getTime());

    while (current <= endDate) {
        retVal.push(new Date(current.getTime()));
        current = current.addDays(interval);
    }

    return retVal;
}

var commonFuncs = [...inbuiltFunctions];

export function getCommonFunctions() {
    return commonFuncs;
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
