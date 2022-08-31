import array, { getObjVal } from "./linq";

let compiler = function () { console.error("Script Compiler is not initialized!!"); }
let parser = function () { console.error("Script Parser is not initialized!!"); return { isValid: true }; }
let handleScriptExecution = true;

export function setCompilerOptions(comp, prsr, selfHandleScriptExecution) {
    if (typeof comp === "function") {
        compiler = comp;
    }

    if (typeof prsr === "function") {
        parser = prsr;
    }

    handleScriptExecution = selfHandleScriptExecution !== true;
}

export function setParser(prsr) {
}

export function parseScript(script) {
    return parser(script);
}

export function compileGroup(group, props) {
    let { filter, keys, sortBy, variables, dataset, expression } = group;

    // ToDo: sortby should not be an array. need to check in old implementation
    if (sortBy && Array.isArray(sortBy) && !sortBy.length) {
        sortBy = null;
    }

    // keys should not be an empty array.
    if (keys && Array.isArray(keys) && !keys.length) {
        keys = null;
    }

    var $expression = dataset === -1 && expression ? compileExpression(expression, props) : undefined;
    var $filter = filter ? compileExpression(getWrapperFunction(filter), props) : undefined;
    var $keys = keys ? keys.map(f => compileExpression(f.expr, props)) : undefined;
    var $sortBy = sortBy ? compileExpression(getWrapperFunction(sortBy), props) : undefined;
    var $variables = compileVariables(variables, props);
    var varFunc = (function (varObj) {
        if (!varObj) {
            return function () { return function () { } }
        }
        return function (props) {
            var keysList = Object.keys(varObj);
            var valueObj = keysList.reduce((obj, varName) => {
                obj["$" + varName] = varObj[varName](props.fields, props.rowGroup, props.colGroup, props.variables);
                return obj;
            }, {});

            var $varFunc = function (varName) {
                return valueObj["$" + varName];
            };

            // This may cause setting some readonly properties like name to function
            //keysList.forEach(k => ($varFunc[k] = valueObj["$" + k]));

            return $varFunc;
        };
    })($variables);

    var $group = { name: group.name, $expression, filter: $filter, keys: $keys, sortBy: $sortBy, variables: varFunc };
    group.$group = $group;
    return $group;
}

export function wrapWithFunction(obj) {
    /*return Object.keys(obj).reduce(
        (func, prop) => {
            func[prop] = obj[prop];
            return func;
        },
        propName => obj[propName]
    );*/

    return propName => obj[propName];
}

/*function compileEntity(e, prop) {
    if (e) {
        if (Array.isArray(e)) {
            if (e.length) {
                
            }
        }
        else {
            return compileExpression(e);
        }
    }
}*/

const sandbox = ["window",
    "global",
    "document",
    "navigator",
    "Function",
    "localStorage",
    "sessionStorage",
    "history",
    "Element",
    "Event",
    "location",
    "screen",
    "locationbar",
    "alert",
    "blur",
    "clearInterval",
    "clearTimeout",
    "close",
    "confirm",
    "focus",
    "getComputedStyle",
    "getSelection",
    "matchMedia",
    "moveBy",
    "moveTo",
    "open",
    "print",
    "prompt",
    "resizeBy",
    "resizeTo",
    "scroll",
    "scrollBy",
    "scrollTo",
    "setInterval",
    "setTimeout",
    "stop",
    "$",
    " jQuery",
    "console"]

export function compileExpression(expression, props) {
    if (!handleScriptExecution) {
        return compiler(expression, props, { sandbox, array, getObjVal });
    }

    try {
        var isNoWrap = props && props.noWrap === true;
        var exprToCompile = expression;

        let isAsync = exprToCompile.includes('await ');

        if (!isNoWrap) {
            exprToCompile = "return " + (isAsync ? 'async ' : '') + "function(Fields,RowGroup,ColGroup,Variables){ var Field = function(key){return getObjVal(Fields,key);}; return " +
                exprToCompile +
                ";}";
            isAsync = false;
        }

        exprToCompile = "'use strict'; return " + (isAsync ? 'async ' : '') + "function(CommonFunctions,MyFunctions,Parameters,Datasets,array,getObjVal,ReportState,setReportState) { " + exprToCompile + " }";

        var result = compiler(exprToCompile, sandbox, props);

        //var result = func();
        if (props) {
            var { commonFunctions, myFunctions, parameters, datasets, $this, setReportState, getReportState } = props;
            if ($this) {
                result = result.bind($this);
            }
            result = result(commonFunctions, myFunctions, parameters, datasets, array, getObjVal, getReportState, setReportState);
        }
        return result;
    } catch (err) {
        console.error("Expression Parse Error:- '" + expression + "'", err);
    }
}

export function compileVariables(variables, props, initVars) {
    return variables
        ? variables.reduce((vars, v) => {
            var value = compileExpression(v.expr, props);
            if (initVars) {
                value = value();
            }
            vars[v.key] = value;
            return vars;
        }, {})
        : undefined;
}

function getWrapperFunction(expr) {
    var fieldFunc = (expr || "").indexOf("Field(") >= 0 ? "Field=function(key){return getObjVal(Fields,key)};" : "";
    return "function(Fields){ " + fieldFunc + " return " + expr + "; }";
}
