This package contains a ReportBuilder component which can be used by end users to build custom reports from browser. The output of the ReportBuilder component is the report definition which need to be passed to the ReportViewer component to render the report. You can optionally save this definition for further use.

Notes: This is still in development and not ready for public use. A public usable version of package is expected to be available at the end of July, 2019.

# Live demo:

This component is used in following chrome extension for generating advanced reports and custom gadgets:

https://chrome.google.com/webstore/detail/jira-assistant/momjbjbjpbcbnepbgkkiaofkgimihbii?hl=en

Youtube demo: [Not yet available]

# Installation:

If you have an existing react application, run the following commands to download Report Builder and other dependent packages.

    npm install font-awesome classnames@latest primeflex@latest primeicons@latest primereact@latest moment@latest chart.js@latest jsd-report@latest --save

# Setup

Import the ReportBuilder and ReportViewer components from the package.

    import { initReportBuilder, ReportBuilder, ReportViewer } from "jsd-report";

## initReportBuilder:

This function expects an object with known set of properties and need to be called one time before using the ReportBuilder or ReportViewer component. This function let's you to customize the various components / features in report builder component to suit your needs. If you do not want to customize the builder then you can just pass an empty object.

| Properties              | Type             | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| parameterTypes          | Object           | This property lets you define new parameter types for the report. You can also remove the existing parameter type if you dont want to use some. The key within the object should be an unique identifyer for the parameter and the value should be again an object with label and control properties                                                                                                               |
| datasetTypes            | Object           | This property lets you define new dataset types for the report. You can also remove the existing dataset type if you dont want to use some.                                                                                                                                                                                                                                                                        |
| builtInFields           | Object           | This property lets you pass some constants / profile settings to report builder which can be used by the end user. This property doesn't actually change the behaviour of report in any way, but just lets the end user to use these properties in report expressions to personalize their experience with their profile settings. Some of the examples for such fields are UserDateFormat, UserWorkingDays, etc.. |
| commonFunctions         | Object           | This property lets you to pass some commonly used functions to the report builder so that the end user can directly use these functions instead of writing their own functions. The report builder already provides some set of common functions along with which, you can pass in your own functions.                                                                                                             |
| customFunctions         | boolean          | This property lets you to disable the end user from writing their own custom functions. You can pass the value as false if you want to disable end user from writing their own functions. The default value for this property is true.                                                                                                                                                                             |
| subReports              | Array of objects | This property lets you to pass in the list of reports which are already available for the end users to use as sub report within their own report. You can pass in an array of objects with id and name property.                                                                                                                                                                                                   |
| resolveReportDefinition | Funcion          | This property is mandatory if you are passing "subReports" property. This property should be a function which accepts reportId as parameter and returning a promise object resolving a report definition.                                                                                                                                                                                                          |

### Sample property

    var defaultConfig = {
	    compiler: function (code, sandbox) { return Function(...sandbox, code)(); },
        parameterTypes: {
            ULIST: {
                label: "Users List",
                control: function (props) {
                    return <input type="button" value="Pick users" onClick={this.showUserPopup} />;
                }
            }
            //DDL: false // To remove a inbuilt param type, set appropriate key to false. "DDL" refers to drop down.
        },
        datasetTypes: {
            STL: {
                label: "States list",
                allowEdit: false, // Boolean property to allow the user to edit the dataset properties.
                // When a user tries to add this dataset, this callback will be triggered and would expect a promise in return.
                // You can do required actions in your end based on end user's selection and then resolve the promise with the properties.
                // These properties will be sent back to this callback function as second param when the end user tries to edit the dataset again in future.
                resolveSchema: (name, props, promise) => {

                    promise.resolve(rapidview); // Optionally use this to resolve data of the dataset along with schema

                    return Promise.resolve(props); // Return a promise which should resolve to the schema of the dataset.
                },

                // While the end user tries to preview the report, this callback function would be triggered.
                // Return a promise which resolves the data which can be used by the end user in report.
                resolveData: props => Promise.resolve(rapidview)
            }
        },

        // You can passin some constants which can be used by the end user in expressions.
        builtInFields: {
            // Note: Passing in these fields doesn't change the behaviour of the report untill the end user use it in their report expressions
            UserDateFormat: { value: "dd/MM/yyyy", helpText: "Provides the date format of the current user" },
            UserTimeFormat: { value: "HH:mm:ss" }
        },

        commonFunctions: {
            // Pass in the all the common functions which would be required by the end user
            getMyProfileInfo: {
                helpText:"This function will return profile info.",
                value: function () { return profileInfo; }
            },
        },
        customFunctions: false, // Pass it as false if you done want the end user to write their own functions

        // Pass list of sub reports available for the users
        subReports: [
            {id:1, name:"My sub report 1"},
            {id:2, name:"My sub report 2"}
        ],
        resolveReportDefinition: (reportId) => {
            return Promise.resolve(getReportDefinition(reportId));
        }
    };

    // Initialize the report builder by passing in the configuration
    initReportBuilder(defaultConfig);

## ReportBuilder:

This component can be used in your page where you would like the report builder to be rendered to the end user.

| Params     | Description                                                                                                                                                                                                                                                                                                                                                                            |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| definition | This property lets you pass in the previously saved report definition while the report builder is loaded in edit mode.                                                                                                                                                                                                                                                                 |
| api        | This is a callback function which can be used to get access to some of the api functions                                                                                                                                                                                                                                                                                               |
| onChange   | When the report definition is modified by the end user, this callback would be triggered which can be used to update the report definition in state. Note: For some of the cases report definition would be mutated. So this should not be the only way you save the report definition. Use the available functions inside api to get updated report definition every time for saving. |

### Sample code

    <ReportBuilder
        definition={reportDefinition}
        api={api => (this.builderAPI = api)}
        onChange={data => {this.setState({ reportDefinition: data });}}
    />

## ReportViewer:

This component can be used in your page where you would like the report viewer to be rendered to the end user. Passin the reportDefinition generated by the ReportBuilder component along with default parameter values if any. The preview of report is not implemented internally inside the report builder component to let the user take control of how the end user view preview. So add the report viewer in your page along with builder to let the end user to preview the report they generated.

    <ReportViewer
        definition={reportDefinition}
        api={api => (this.viewerAPI = api)}
        parameterValues={{ param1:"param value", param2: 20 }}
    />
