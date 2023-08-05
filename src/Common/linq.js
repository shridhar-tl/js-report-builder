/*eslint-disable */
import { clone, cloneArray } from "./HelperFunctions";

const arrayInitFunc = (function () {
    const arrayFunc = function arrayFunc(array) {
        if (!array) {
            throw new Error("No input received. Expected an array.");
        }
        let source = array;

        if (typeof source === "number") {
            source = new Array(source);
        }

        const prototype = function () {
            return source;
        };

        prototype.where = function (clause, maxItems) {
            const newArray = [];

            // The clause was passed in as a Method that return a Boolean
            for (let index = 0; index < source.length && (!maxItems || maxItems > newArray.length); index++) {
                if (clause(source[index], index)) {
                    newArray[newArray.length] = source[index];
                }
            }
            return arrayFunc(newArray);
        };

        prototype.findIndex = function (clause, maxItems) {
            const newArray = [];

            // The clause was passed in as a Method that return a Boolean
            for (let index = 0; index < source.length && (!maxItems || maxItems > newArray.length); index++) {
                if (clause(source[index], index)) {
                    newArray[newArray.length] = index;
                }
            }
            return newArray;
        };

        prototype.select = function (clause, incNull) {
            const newArray = [];

            // The clause was passed in as a Method that returns a Value
            for (let i = 0; i < this.length; i++) {
                const data = clause ? clause(this[i], i) : this[i];
                if (data != null || incNull) {
                    newArray[newArray.length] = data;
                }
            }
            return arrayFunc(newArray);
        };

        prototype.addRange = function (items, startIdx = 0) {
            if (items && Array.isArray(items)) {
                for (let i = 0; i < items.length; i++) {
                    source[startIdx + i] = items[i];
                }
            }
            return prototype;
        };

        prototype.fillWith = function (defaultValue) {
            let len = source.length;
            while (len--) {
                source[len] = clone(defaultValue);
            }
            return prototype;
        };

        prototype.clone = function (deep) {
            source = cloneArray(source, deep);
            return prototype;
        };

        prototype.toArray = function () {
            return source;
        };

        prototype.sortBy = function (clause, desc) {
            return desc ? prototype.orderByDescending(clause) : prototype.orderBy(clause);
        };

        prototype.orderBy = function (clause) {
            const tempArray = [];
            let len = source.length;
            while (len--) {
                tempArray[len] = source[len];
            }

            source = tempArray.sort(function (a, b) {
                const x = parseClause(clause, a);
                const y = parseClause(clause, b);
                return x < y ? -1 : x > y ? 1 : 0;
            });

            return prototype;
        };

        prototype.orderByDescending = function (clause) {
            const tempArray = [];
            let len = source.length;
            while (len--) {
                tempArray[len] = source[len];
            }

            source = tempArray.sort(function (a, b) {
                const x = parseClause(clause, b);
                const y = parseClause(clause, a);
                return x < y ? -1 : x > y ? 1 : 0;
            });

            return prototype;
        };

        prototype.select = function (clause, incNull) {
            const newArray = [];

            // The clause was passed in as a Method that returns a Value
            for (let i = 0; i < this.length; i++) {
                const data = parseClause(clause, this[i], i);
                if (data != null || incNull) {
                    newArray[newArray.length] = data;
                }
            }
            source = newArray;
            return prototype;
        };

        prototype.removeAt = function (index, count) {
            if (index < 0) { return prototype; }
            source.splice(index, count || 1);
            return prototype;
        };

        prototype.removeAll = function (clause) {
            if (typeof clause === "function") {
                arrayFunc(prototype.findIndex(clause))
                    .orderByDescending()()
                    .forEach(i => source.splice(i, 1));
            } else if (Array.isArray(clause)) {
                clause.forEach(function (o) {
                    prototype.remove(o);
                });
            }
            return prototype;
        };

        // Array flattening related methods
        prototype.flattern = function (clause, filter, templ, propPrefix) {
            const $this = source;
            const thisLen = $this.length;
            const resultArray = [];
            for (let i = 0; i < thisLen; i++) {
                const row = $this[i];
                const result = getObject(row, clause, templ ? { ...templ } : {}, propPrefix);
                result.forEach(r => {
                    if (!filter || filter(r)) {
                        resultArray.push(r);
                    }
                });
            }
            source = resultArray;

            return prototype;
        };

        // ToDo: this function can be renamed as "reduceByKey"
        prototype.toKeyValuePair = function (clause, filter, singleOnly) {
            const $this = prototype.groupBy(clause, filter)();
            const result = {};
            for (let i = 0; i < $this.length; i++) {
                const item = $this[i];
                result[`${item.key}`] = singleOnly ? item.values[0] : item.values;
            }
            return result;
        };

        prototype.sum = function (clause) {
            let value = 0;
            let index;
            if (clause) {
                for (index = 0; index < source.length; index++) {
                    value += clause(source[index]) || 0;
                }
            } else {
                for (index = 0; index < source.length; index++) {
                    value += parseFloat(source[index]) || 0;
                }
            }
            return value;
        };

        prototype.first = function (clause) {
            if (clause != null) {
                return source.filter(clause, 1)[0];
            }
            else {
                // If no clause was specified, then return the First element in the Array
                if (source.length > 0) { return source[0]; }
                else { return null; }
            }
        };
        prototype.last = function (clause) {
            if (clause != null) {
                const newArr = source.filter(clause);
                if (newArr.length) {
                    return newArr[newArr.length - 1];
                } else {
                    return null;
                }
            }
            else {
                // If no clause was specified, then return the Last element in the Array
                if (source.length > 0) { return source[source.length - 1]; }
                else { return null; }
            }
        };

        prototype.groupBy = function (clause, filter) {
            const result = [];
            const valObj = {};
            const isClauseString = typeof clause === "string";
            if (isClauseString) {
                const tmp = clause;
                clause = function (obj) {
                    return obj[tmp];
                };
            }

            for (let i = 0; i < source.length; i++) {
                const item = source[i];
                const key = clause(item);
                let keyStr = null;
                if (typeof key === "object") {
                    keyStr = JSON.stringify(key);
                }
                let obj = valObj[keyStr || key];
                if (!obj) {
                    obj = { key: key, values: [] };
                    result.push((valObj[keyStr || key] = obj));
                }
                if (!filter || filter(item)) {
                    obj.values.push(item);
                }
            }

            source = result;
            return prototype;
        };

        prototype.addDistinct = function (item) {
            if (!~source.indexOf(item)) {
                source[source.length] = item;
                return true;
            }
            return false;
        };

        prototype.hasDuplicates = function (clause) {
            const srcLen = source.length - 1;
            let item, lpItem, j;
            if (typeof clause === "function") {
                for (let i = 0; i < srcLen; i++) {
                    item = clause(source[i]);
                    for (j = i + 1; j < srcLen + 1; j++) {
                        lpItem = clause[source[j]];
                        if (item === lpItem) { return true; }
                    }
                }
            }
            else if (typeof clause === "string") {
                for (let a = 0; a < srcLen; a++) {
                    item = source[a][clause];
                    for (j = a + 1; j < srcLen + 1; j++) {
                        lpItem = source[j][clause];
                        if (item === lpItem) { return true; }
                    }
                }
            }
            else {
                for (let x = 0; x < srcLen; x++) {
                    const itm = source[x];
                    if (~source.indexOf(itm, x + 1)) { return true; }
                }
            }

            return false;
        };

        function getObject(row, clause, curItem, propPrefix) {
            propPrefix = propPrefix || "";
            const cols = getColsArr(clause);
            const colsLen = cols.length;
            let returnRaw = false;

            for (let i = 0; i < colsLen; i++) {
                var propName = cols[i];
                let field = clause[propName];
                const repeatOnVal = propName.startsWith("~~");
                if (repeatOnVal) {
                    propName = propName.substring(2);
                }

                if (field === true) {
                    field = propName;
                }

                if (typeof field === "object" && !Array.isArray(field)) {
                    const obj = field;
                    field = field.field;
                    if (!field || field === true) {
                        field = propName;
                    }
                    const spread = obj.spread === true || !propName;
                    const value = getObjVal(row, field);
                    const props = obj.props;
                    let newVal = null;

                    if (value) {
                        if (!repeatOnVal) {
                            newVal = props ? getObject(value, props, spread ? curItem : {}, spread ? propName : "") : value; // ToDo: Need to check
                            if (!spread) {
                                curItem[propPrefix + propName] = newVal;
                            }
                        } else if (Array.isArray(value)) {
                            newVal = props
                                ? arrayFunc(value).flattern(props, null, spread ? curItem : null, spread ? propName : "")()
                                : value;
                            if (!spread) {
                                curItem = newVal.map(nv => {
                                    const ret = { ...curItem, [propPrefix + propName]: nv };
                                    Object.keys(nv).forEach(nvp => {
                                        if (nvp.startsWith("...")) {
                                            ret[nvp.substring(3)] = nv[nvp];
                                            delete nv[nvp];
                                        }
                                    });

                                    return ret;
                                });
                                returnRaw = true;
                            }
                        }
                    }
                } else {
                    curItem[propPrefix + propName] = getObjVal(row, field);
                }
            }
            return returnRaw ? curItem : [curItem];
        }

        function getColsArr(obj) {
            let cols = Object.keys(obj);
            if (cols.filter(c => c.startsWith("~~")).length > 1) {
                throw new Error("#Error: Multiple array recurssion not allowed");
            } // check to see if their are more than one ~~ item
            cols = arrayFunc(cols).orderBy(c => (c.startsWith("~~") ? 2 : 1))(); //sort ~~ at end
            return cols;
        }

        function parseClause(clause, value, param2, param3) {
            if (!clause) {
                return value;
            } else if (typeof clause === "function") {
                return clause(value, param2, param3);
            } else if (typeof clause === "string") {
                if (~clause.indexOf(",")) {
                    const fields = clause.split(",");
                    const result = {};
                    let hasProps = false;
                    let fLen = fields.length;
                    while (fLen--) {
                        const fieldSplit = fields[fLen].trim().split(":");
                        const field = (fieldSplit[1] || fieldSplit[0]).trim();

                        if (field && value[field] !== undefined) {
                            result[fieldSplit[0].trim() || field] = value[field];
                            hasProps = true;
                        }
                    }
                    return hasProps ? result : null;
                } else {
                    return value[clause];
                }
            }
        }

        return prototype;
    };

    arrayFunc.from = function (obj) {
        return arrayFunc(Array.from(obj));
    };
    //arrayFunc.cloneFrom = function (obj, deep) { return arrayFunc(Array.from(obj)); }

    return arrayFunc;
})();
export default arrayInitFunc;

export function getObjVal(row, prop) {
    if (typeof prop === "string") {
        const split = prop.split(".");
        let value = row[split[0]];
        for (let j = 1; value && j < split.length; j++) {
            value = value[split[j]];
        }
        return value;
    } else if (typeof prop === "function") {
        return prop(row);
    }
}

/*
var initializor = function (prototype) {
    var ref = getProtoFunc();

    var funcs = Object.getOwnPropertyNames(ref);
    for (var funcName of funcs) {
        if (!prototype[funcName]) {
            prototype[funcName] = ref[funcName];
        }
    }
}

function getProtoFunc() {
    var prototype = {};
    prototype.selectMany = function (clause) {
        var r = [];
        for (var i = 0; i < this.length; i++) {
            r = r.concat(clause(this[i]));
        }
        return r;
    }
    prototype.Count = function (clause) {
        if (clause == null) {
            return this.length;
        }
        else {
            return this.where(clause).length;
        }
    }
    prototype.Distinct = function (clause) {
        var item;
        var dict = {};
        var retVal = [];
        for (var i = 0; i < this.length; i++) {
            item = clause ? clause(this[i]) : this[i];
            if (dict[item] == null) {
                dict[item] = true;
                retVal[retVal.length] = item;
            }
        }
        dict = null;
        return retVal;
    }
    prototype.DistinctObj = function (clause) {
        var item;
        var retVal = [];
        //var linq = retVal;
        for (var i = 0; i < this.length; i++) {
            item = clause ? clause(this[i]) : this[i];

            var keys = Object.keys(item);
            if (!retVal.Any(function (d) {
                var match = true;
                for (var i = 0; i < keys.length; i++) {
                    match = match && d[keys[i]] == item[keys[i]];
                }
                return match;
            })) {
                retVal[retVal.length] = item;
            }
        }
        return retVal;
    }
    prototype.Avg = function (clause) {
        var value = 0;
        var count = 0;
        if (clause) {
            for (var index = 0; index < this.length; index++) {
                var val = parseFloat(clause(this[index]));
                if (val || val === 0) { value = value + val; count++; }
            }
        } else {
            for (var index = 0; index < this.length; index++) {
                var val = parseFloat(this[index]);
                if (val || val === 0) { value = value + val; count++; }
            }
        }
        return count ? value / count : 0;
    }
    function prepareAgreData(data) {
        if (data && data instanceof Date) {
            return data.getTime();
        } else { return data; }
    }
    prototype.Max = function (clause) {
        var value = 0;
        if (clause) {
            for (var index = 0; index < this.length; index++) {
                var newVal = clause(this[index]) || 0;
                if (prepareAgreData(newVal) > prepareAgreData(value))
                    value = newVal;
            }
        } else {
            for (var index = 0; index < this.length; index++) {
                var newVal = this[index] || 0;
                if (prepareAgreData(newVal) > prepareAgreData(value))
                    value = newVal;
            }
        }
        return value;
    }
    prototype.Min = function (clause) {
        var value = 0;
        if (clause) {
            for (var index = 0; index < this.length; index++) {
                var newVal = clause(this[index]) || 0;
                if (prepareAgreData(newVal) < prepareAgreData(value))
                    value = newVal;
            }
        } else {
            for (var index = 0; index < this.length; index++) {
                var newVal = this[index] || 0;
                if (prepareAgreData(newVal) < prepareAgreData(value))
                    value = newVal;
            }
        }
        return value;
    }
    prototype.Any = function (clause) {
        if (typeof clause === "function") {
            for (var index = 0; index < this.length; index++) {
                if (clause(this[index], index)) { return true; }
            }
            return false;
        }
        else if (clause) {
            return this.indexOf(clause) >= 0;
        }
        else { return this.length > 0; }
    }
    prototype.All = function (clause) {
        for (var index = 0; index < this.length; index++) {
            if (!clause(this[index], index)) { return false; }
        }
        return true;
    }
    prototype.Reverse = function () {
        var retVal = [];
        for (var index = this.length - 1; index > -1; index--)
            retVal[retVal.length] = this[index];
        return retVal;
    }
    prototype.ElementAt = function (index) {
        return this[index];
    }
    prototype.FirstIndexOf = function (predicate) {
        for (var index = 0; index < this.length; index++) {
            if (predicate(this[index], index)) {
                return index;
            }
        }
        return -1;
    }
    prototype.Concat = function (array) {
        return this.concat(array);
    }
    prototype.Intersect = function (secondArray, clause) {
        var clauseMethod;
        if (clause != undefined) {
            clauseMethod = clause;
        } else {
            clauseMethod = function (item, index, item2, index2) { return item == item2; };
        }

        var sa = secondArray.items || secondArray;

        var result = [];
        for (var a = 0; a < this.length; a++) {
            for (var b = 0; b < sa.length; b++) {
                if (clauseMethod(this[a], a, sa[b], b)) {
                    result[result.length] = this[a];
                }
            }
        }
        return result;
    }
    prototype.DefaultIfEmpty = function (defaultValue) {
        if (this.length == 0) {
            return defaultValue;
        }
        return this;
    }
    prototype.ElementAtOrDefault = function (index, defaultValue) {
        if (index >= 0 && index < this.length) {
            return this[index];
        }
        return defaultValue;
    }
    prototype.FirstOrDefault = function (defaultValue, clause) {
        return this.First(clause) || defaultValue;
    }
    prototype.LastOrDefault = function (defaultValue, clause) {
        return this.Last(clause) || defaultValue;
    }
    prototype.ForEach = function (clause) {
        var total = this.length;
        for (var index = 0; index < total; index++) {
            clause(this[index], index, {
                prev: this[index - 1],
                next: this[index + 1],
                count: total,
                isLast: index == total - 1,
                isFirst: index === 0
            })
        }
        return this;
    }
    prototype.ToString = function (str) {
        str = str || ',';
        var returnVal = "";
        for (var index = 0; index < this.length; index++) {
            var val = this[index];
            if (val && ("" + val).length > 0)
                returnVal += str + val;
        }
        return returnVal.length ? returnVal.substring(str.length) : "";
    };
    prototype.Remove = function (item) {
        //if (!item) return false;
        var i = this.indexOf(item);
        if (i < 0) { return false; }
        return this.splice(i, 1);
    };
    prototype.RemoveAt = function (index, count) {
        if (index < 0) return false;
        return this.splice(index, count || 1);
    };
    prototype.RemoveAll = function (clause) {
        var arr = this;
        if (typeof clause === "function") { this.RemoveAll(this.where(clause)); }
        else if (Array.isArray(clause)) { clause.ForEach(function (o) { arr.Remove(o); }); }
        return arr;
    };
    prototype.Add = function (item) {
        this.push(item);
        return item;
    };
    prototype.InsertAt = function (index, item) {
        this.splice(index, 0, item);
        return item;
    };
    prototype.InsertRangeAt = function (index, items) {
        this.splice(index, 0, ...items);
        return this;
    };

    prototype.AddDistinctRange = function (items) {
        if (items) {
            for (var i = 0; i < items.length; i++) {
                this.AddDistinct(items[i]);
            }
        }
        return this;
    };
    prototype.Replace = function (item, newItem) {
        var idx = this.indexOf(item);
        if (idx != -1) this[idx] = newItem;
        return this;
    };
    prototype.Clone = function (items) {
        var result = [];
        for (var i = 0; i < this.length; i++) {
            result[i] = this[i];
        }
        if (items && items.length > 0) {
            for (var i = 0; i < items.length; i++) {
                result[result.length] = items[i];
            }
        }
        return result;
    };
    prototype.NotIn = function (items, condition) {
        if (!items || (Array.isArray(items) && items.length === 0)) { return this; }
        var ignoreCase = condition === true;
        if (ignoreCase) { items = items.select(function (item) { return typeof item === "string" ? item.toLowerCase() : item; }); }
        if (condition && typeof condition != "function") { condition = null; }

        if (Array.isArray(items)) {
            if (!condition) {
                return this.where(function (itm) {
                    if (ignoreCase && typeof itm === 'string') { itm = itm.toLowerCase(); }

                    return items.indexOf(itm) === -1
                });
            }
            else {
                return this.where(function (itm) { return !items.Any(function (excl) { return condition(itm, excl); }); });
            }
        }
        else {

        }
    }
    prototype.In = function (items, condition) {
        if (!items || (Array.isArray(items) && items.length === 0)) { return this; }
        var ignoreCase = condition === true;
        if (ignoreCase) { items = items.select(function (item) { return typeof item === "string" ? item.toLowerCase() : item; }); }
        if (condition && typeof condition != "function") { condition = null; }

        if (Array.isArray(items)) {
            if (!condition) {
                return this.where(function (itm) {
                    if (ignoreCase && typeof itm === 'string') { itm = itm.toLowerCase(); }

                    return items.indexOf(itm) > -1
                });
            }
            else {
                return this.where(function (itm) { return items.Any(function (excl) { return condition(itm, excl); }); });
            }
        }
        else {

        }
    }
    prototype.Skip = function (index) {
        if (index < 0) { index = 0; }
        var result = [];
        for (var i = index; i < this.length; i++) {
            result.Add(this[i]);
        }
        return result;
    }
    prototype.Take = function (count) {
        var result = [];
        for (var i = 0; i < this.length && i < count; i++) {
            result.Add(this[i]);
        }
        return result;
    }
    prototype.Union = function (clause) {
        var result = [];
        if (!clause) {
            clause = this;
        }
        else if (Array.isArray(clause)) { // This if condition should not be merged with below condition
            result = this;
        }

        if (Array.isArray(clause)) {
            for (var i = 0; i < clause.length; i++) {
                result.addRange(clause[i]);
            }
        }
        else {
            this.ForEach(function (item, idx) {
                var newList = clause(item, idx);
                if (newList) {
                    result.addRange(newList);
                }
            });
        }
        return result;
    }
    prototype.remove = function (func) {
        if (typeof func == "function") {
            for (var i = 0; i < this.length; i++) {
                if (func(this[i])) {
                    this.splice(i, 1);
                    return true;
                }
            }
        }
        else {
            var index = this.indexOf(func);
            if (index > -1) {
                this.splice(index, 1);
                return true;
            }
        }
    }
    prototype.Contains = function (val) {
        return this.indexOf(val) > -1;
    }
    prototype.ContainsAny = function (arr) {
        var $this = this;
        if (arr && Array.isArray(arr)) {
            return arr.Any(function (obj) { return $this.indexOf(obj) >= 0; });
        }
        else { return false; }
    }
    prototype.InnerJoin = function (rightArray, onClause) {
        var result = [];

        for (var i = 0; i < this.length; i++) {
            var left = this[i];
            var matches = rightArray.where(function (right) { return onClause(left, right); });
            if (matches.length > 0) {
                matches.ForEach(function (right) {
                    result.Add({ left: left, right: right });
                });
            }
        }

        return result;
    }

    prototype.LeftJoin = function (rightArray, onClause) {
        var result = [];

        for (var i = 0; i < this.length; i++) {
            var left = this[i];
            var matches = rightArray.where(function (right) { return onClause(left, right); });
            if (matches.length === 0) { result.Add({ left: left, right: null }); }
            else {
                matches.ForEach(function (right) {
                    result.Add({ left: left, right: right });
                });
            }
        }

        return result;
    }

    prototype.RightJoin = function (rightArray, onClause) {
        var result = [];

        for (var i = 0; i < rightArray.length; i++) {
            var right = rightArray[i];
            var leftMatches = this.where(function (left) { return onClause(left, right); });
            if (leftMatches.length === 0) { result.Add({ left: null, right: right }); }
            else {
                leftMatches.ForEach(function (left) {
                    result.Add({ left: left, right: right });
                });
            }
        }

        return result;
    }


    return prototype;
}
*/
