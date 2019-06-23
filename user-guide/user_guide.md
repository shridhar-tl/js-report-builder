# Report Builder

Report builder is a ui component which lets the end user to develop reports from browser. Report Builder can be used to develop almost any kind of report based on the technical skill of the enduser. Some of the core components of report builder are as follows

## Built-in fields:

Built-in fields are some of the constant values which can be used in report expressions. A common example for a built-in fields are user preferences like User Date format, which can be used in expressions to format any date the user would like to view it through out the site. Report builder does not provide any default built-in fields, but provides an option to customize it so that the developer can add project specific fields.

## Utility functions:

Utility functions are set of pure functions which lets the user to use it in expressions to do some common tasks. This utility functions are further classified as Common functions and My functions. Common functions are by default provided by report builder which are common for all the reports. Report builder also allows the user to write their own functions and use it in expressions which are classified under My functions. Report builder by default provides set of common functions and also lets the developer to add project specific common functionalities as pure functions.

## Parameters:

Parameters are the primary way through which end user interact with report to provide input to the report. Parameters support input through multiple type of form fields like textbox / masked text or numeric input through textbox, selection of items through dropdown or autocomplete, date or date range selection through calendar, boolean value checkbox and selection of file as well. Other than default type of parameters, Report builder also supports custom parameter types using which developer can introduce project specific custom input to reports.

## Datasets:

Datasets are the collection of data maintained as javascript objects. This datasource can be used by the tables to bind data in tabular format along with groups, and also can be used by expression to resolve a specific value. The source of dataset can be from various ways like through http request, from files, through expressions, etc. Along with predefined dataset types, Report builder also supports custom dataset types using which developer can introduce project specific custom dataset types to reports.

## Report UI Items:

Report items are the visual elements which is the core component of the report. You can drag and drop any report item to the report display section of the report and customize it later.

## Resources:

Report builder allows the user to store some static files like images along with report so that those resources can be used while render of the report.
