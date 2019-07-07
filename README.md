This package contains a ReportBuilder component which can be used by end users to build custom reports from browser. The output of the ReportBuilder component is the report definition which need to be passed to the ReportViewer component to generate the report. You can optionally save this definition for further use.

Notes: This is still in development and not ready for public use. A public usable version of package is expected to be available at the end of July, 2019.

#Live demo:
This component is used in following chrome extension for generating advanced reports and custom gadgets:

https://chrome.google.com/webstore/detail/jira-assistant/momjbjbjpbcbnepbgkkiaofkgimihbii?hl=en

Youtube demo: [Not yet available]

#Installation:
If you have an existing application, run the following commands to download Report Builder and other dependent packages.

npm install font-awesome classnames primeflex primeicons primereact moment jsd-report --save

#Setup
Import the ReportBuilder and ReportViewer components from the package.

import { initReportBuilder, ReportBuilder, ReportViewer } from "jsd-report";

##initReportBuilder:
This function need to be called one time before using the ReportBuilder or ReportViewer component with appropriate properties. This function let's you to customize the various components / features in report builder component to suit your needs.

##ReportBuilder:

##ReportViewer:
