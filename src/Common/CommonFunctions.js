import moment from "moment";

var inbuiltFunctions = [
    {
        name: "getDateRange",
        helpText: "Returns an array with the list of available dates between the provided from and to date",
        value: getDateRange
    },
    {
        name: "formatDate",
        helpText: "",
        value: formatDate
    },
    {
        name: "isBetween",
        helpText: "",
        value: isBetween
    },
    {
        name: "formatStr",
        helpText: "",
        value: formatStr
    },
    {
        name: "numPad",
        helpText: "",
        value: numPad
    }
];

export default inbuiltFunctions;

function getDateRange(fromDate, toDate) {
    return getDateArray(fromDate, toDate).map(d => {
        var dayOfWeek = d.getDay();
        var today = moment(d)
            .startOf("day")
            .toDate();

        return {
            yyyyMMdd: formatDate(d, "yyyyMMdd"),
            dayAndDate: formatDate(d, "DDD, dd"),
            dayOfWeek,
            date: d,
            today,
            todayInMS: today.getTime(),
            isWeekEnd: dayOfWeek === 6 || dayOfWeek === 0
            //isHoliday: this.$utils.isHoliday(d)
        };
    });
}

function getDateArray(startDate, endDate) {
    var interval = 1;
    var retVal = [];
    var current = new Date(startDate.getTime());
    var currentTime = current.getTime();
    var endTime = endDate.getTime();

    while (currentTime <= endTime) {
        retVal.push(new Date(currentTime));
        current = addDays(current, interval);
        currentTime = current.getTime();
    }

    return retVal;
}

function addDays(date, days) {
    date = convertToDate(date);
    var dat = new Date(date.getTime());
    dat.setDate(dat.getDate() + days);
    return dat;
}

var SHORT_MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var FULL_MONTH_NAMES = [
    "January",
    "Febraury",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

var TINY_DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
var SHORT_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var FULL_DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function convertToDate(value) {
    return new Date(value);
}

function formatDate(value, format) {
    value = convertToDate(value);
    var yyyy = value.getFullYear();
    var mm = value.getMonth() < 9 ? "0" + (value.getMonth() + 1) : value.getMonth() + 1; // getMonth() is zero-based
    var dd = value.getDate() < 10 ? "0" + value.getDate() : value.getDate();
    var hh = value.getHours() < 10 ? "0" + value.getHours() : value.getHours();
    var min = value.getMinutes() < 10 ? "0" + value.getMinutes() : value.getMinutes();
    var ss = value.getSeconds() < 10 ? "0" + value.getSeconds() : value.getSeconds();

    if (format) {
        return (
            format
                .replace("yyyy", yyyy)
                .replace("yy", yyyy)
                .replace("MMMM", FULL_MONTH_NAMES[mm - 1])
                .replace("MMM", SHORT_MONTH_NAMES[mm - 1])
                .replace("MM", mm)
                //.replace("M", mm - 0) // This cause issue in the month of march as M in march is replaced
                .replace("DDDD", FULL_DAY_NAMES[value.getDay()])
                .replace("DDD", SHORT_DAY_NAMES[value.getDay()])
                .replace("dddd", FULL_DAY_NAMES[value.getDay()])
                .replace("ddd", SHORT_DAY_NAMES[value.getDay()])
                .replace("DD", TINY_DAY_NAMES[value.getDay()])
                .replace("dd", dd)
                //.replace("d", dd - 0) // For safety this was also removed
                .replace("HH", hh)
                .replace("H", hh - 0)
                .replace("hh", hh > 12 ? (hh - 12).pad(2) : hh)
                //.replace("h", hh > 12 ? hh - 12 : hh) // This also cause issue
                .replace("mm", min)
                .replace("ss", ss)
                .replace("tt", hh >= 12 ? "PM" : "AM")
            //.replace("t", hh >= 12 ? "P" : "A")
        );
    } else {
        return ""
            .concat(yyyy)
            .concat(mm)
            .concat(dd)
            .concat(hh)
            .concat(min)
            .concat(ss);
    }
}

function formatStr(str, args) {
    if (args && !Array.isArray(args)) {
        args = [args];
    }
    for (var i = 0; i < args.length; i++) {
        str = str.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
    }
    return str;
}

function numPad(number, size) {
    var s = String(number);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
}

function isBetween(value, from, to) {
    if (typeof from !== "number") {
        from = new Date(from).getTime();
    }
    if (typeof to !== "number") {
        to = new Date(to).getTime();
    }
    if (typeof value !== "number") {
        value = new Date(value).getTime();
    }

    return from <= value && value <= to;
}
