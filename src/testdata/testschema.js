export const userDaywiseReport = {
    datasets: {
        "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321": {
            type: "JQL",
            props: {
                fields: {},
                filterFields: [],
                outputFields: [
                    {
                        id: "project",
                        name: "Project",
                        custom: false,
                        knownObj: true,
                        type: "project"
                    },
                    {
                        id: "issuekey",
                        name: "Key",
                        custom: false,
                        type: "string"
                    },
                    {
                        id: "summary",
                        name: "Summary",
                        custom: false,
                        type: "string"
                    },
                    {
                        id: "issuetype",
                        name: "Issue Type",
                        custom: false,
                        knownObj: true,
                        type: "issuetype"
                    },
                    {
                        id: "customfield_10042",
                        name: "Story Points",
                        custom: true,
                        type: "number"
                    },
                    {
                        id: "worklog",
                        name: "Log Work",
                        custom: false,
                        isArray: false,
                        type: "worklog"
                    }
                ],
                jql:
                    "worklogAuthor in (@Parameters.userList|currentUser()$) and worklogDate >= @Parameters.DateRange.fromDate|startOfMonth()$ and worklogDate <= @Parameters.DateRange.toDate|endOfMonth()$"
            },
            name: "WorklogSet",
            definition: [
                {
                    set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                    key: "summary",
                    path: "summary",
                    type: "string"
                },
                {
                    set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                    key: "issuetype",
                    path: "issuetype",
                    type: "object",
                    children: [
                        {
                            set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                            key: "self",
                            path: "issuetype.self",
                            type: "string"
                        },
                        {
                            set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                            key: "id",
                            path: "issuetype.id",
                            type: "string"
                        },
                        {
                            set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                            key: "description",
                            path: "issuetype.description",
                            type: "string"
                        },
                        {
                            set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                            key: "iconUrl",
                            path: "issuetype.iconUrl",
                            type: "string"
                        },
                        {
                            set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                            key: "name",
                            path: "issuetype.name",
                            type: "string"
                        },
                        {
                            set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                            key: "subtask",
                            path: "issuetype.subtask",
                            type: "boolean"
                        }
                    ]
                },
                {
                    set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                    key: "project",
                    path: "project",
                    type: "object",
                    children: [
                        {
                            set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                            key: "self",
                            path: "project.self",
                            type: "string"
                        },
                        {
                            set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                            key: "id",
                            path: "project.id",
                            type: "string"
                        },
                        {
                            set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                            key: "key",
                            path: "project.key",
                            type: "string"
                        },
                        {
                            set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                            key: "name",
                            path: "project.name",
                            type: "string"
                        },
                        {
                            set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                            key: "avatarUrls",
                            path: "project.avatarUrls",
                            type: "object",
                            children: [
                                {
                                    set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                                    key: "48x48",
                                    path: "project.avatarUrls.48x48",
                                    type: "string"
                                },
                                {
                                    set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                                    key: "24x24",
                                    path: "project.avatarUrls.24x24",
                                    type: "string"
                                },
                                {
                                    set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                                    key: "16x16",
                                    path: "project.avatarUrls.16x16",
                                    type: "string"
                                },
                                {
                                    set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                                    key: "32x32",
                                    path: "project.avatarUrls.32x32",
                                    type: "string"
                                }
                            ]
                        }
                    ]
                },
                {
                    set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                    key: "worklog",
                    path: "worklog",
                    type: "object",
                    children: [
                        {
                            set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                            key: "startAt",
                            path: "worklog.startAt",
                            type: "number"
                        },
                        {
                            set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                            key: "maxResults",
                            path: "worklog.maxResults",
                            type: "number"
                        },
                        {
                            set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                            key: "total",
                            path: "worklog.total",
                            type: "number"
                        },
                        {
                            set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                            key: "worklogs",
                            path: "worklog.worklogs",
                            type: "array"
                        }
                    ]
                },
                {
                    set: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                    key: "key",
                    path: "key",
                    type: "string"
                }
            ]
        },
        "10725824-7724-4ffa-85de-33b67cc6aafe": {
            type: "FLT",
            id: "10725824-7724-4ffa-85de-33b67cc6aafe",
            name: "flatWorklogSet",
            dependencies: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
            colProps:
                "{\n    'key': true,\n    'summary': 'summary',\n    'issuetype': 'issuetype.name',\n    'issueicon': 'issuetype.iconUrl',\n    'projectName': 'project.name',\n    'parentkey': 'parent.key',\n    'storyPoints': 'storyPoints',\n    'parentsummary': 'parent.fields.summary',\n    '~~worklog': {\n      field: 'worklog.worklogs',\n      spread: false,\n      props: {\n        '...author': function (obj) { return obj.author.name.toLowerCase() },\n        'author': 'author.name',\n        'authorDisplay': 'author.displayName',\n        'authorEmail': 'author.emailAddress',\n        'authorAvatar': 'author.avatarUrls.48x48',\n        'comment': 'comment',\n        'date': function (obj) { return obj.started ? new Date(obj.started) : null },\n        '...yyyyMMdd': function (obj) { return obj.started ? CommonFunctions.formatDate(obj.started, 'yyyyMMdd') : null },\n        'timespent': 'timeSpentSeconds',\n      }\n    }\n  }",
            variables: [],
            filter: ""
        },
        "3aeecbb2-751f-47f7-8f0b-17c2e7a83741": {
            type: "EXP",
            id: "3aeecbb2-751f-47f7-8f0b-17c2e7a83741",
            name: "expressionSet",
            variables: [],
            expression: "",
            dependencies: ["10725824-7724-4ffa-85de-33b67cc6aafe"]
        }
    },
    reportItems: [
        {
            type: "TBL",
            data: {
                columns: [
                    {
                        type: 1,
                        style: {
                            width: "100px"
                        },
                        children: []
                    },
                    {
                        type: 1,
                        style: {
                            width: "100px"
                        },
                        children: []
                    },
                    {
                        type: 1,
                        style: {
                            width: "100px"
                        },
                        children: []
                    },
                    {
                        type: 3,
                        children: [
                            {
                                type: 1,
                                style: {
                                    width: "100px"
                                },
                                children: []
                            }
                        ],
                        keys: [],
                        sortBy: [],
                        filter: [],
                        variables: [],
                        dataset: -1,
                        name: "DayRepeator",
                        expression: "CommonFunctions.getDateRange(Parameters.DateRange.fromDate,Parameters.DateRange.toDate)"
                    },
                    {
                        type: 1,
                        style: {
                            width: "100px"
                        },
                        children: []
                    }
                ],
                head: [
                    {
                        type: 1,
                        style: {
                            height: "25px"
                        },
                        children: [
                            [
                                {
                                    itemType: "text",
                                    data: "Users List"
                                }
                            ],
                            [
                                {
                                    itemType: "text",
                                    data: "Issue type"
                                }
                            ],
                            [
                                {
                                    itemType: "text",
                                    data: "Project name"
                                }
                            ],
                            [
                                {
                                    expression: "ColGroup.Fields.dayAndDate"
                                }
                            ],
                            [
                                {
                                    itemType: "text",
                                    data: "Total"
                                }
                            ]
                        ]
                    }
                ],
                body: [
                    {
                        type: 2,
                        label: "Group c633b23624d2",
                        children: [
                            {
                                type: 1,
                                style: {
                                    height: "25px"
                                },
                                children: [
                                    [
                                        {
                                            expression: "Fields.name"
                                        }
                                    ],
                                    [],
                                    [],
                                    [],
                                    []
                                ]
                            },
                            {
                                type: 3,
                                children: [
                                    {
                                        type: 1,
                                        style: {
                                            height: "25px"
                                        },
                                        children: [
                                            [
                                                {
                                                    expression: "Fields.displayName"
                                                }
                                            ],
                                            [],
                                            [],
                                            [],
                                            []
                                        ],
                                        keys: [],
                                        sortBy: [],
                                        filter: [],
                                        variables: []
                                    },
                                    {
                                        type: 2,
                                        label: "Group 37987dfff5b8",
                                        children: [
                                            {
                                                type: 1,
                                                style: {
                                                    height: "25px"
                                                },
                                                children: [
                                                    [
                                                        {
                                                            expression: "RowGroup.key"
                                                        },
                                                        {
                                                            setId: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                                                            data: "summary",
                                                            type: "string",
                                                            expression: "Fields[0].summary",
                                                            template: "<span> - {0}</span>"
                                                        }
                                                    ],
                                                    [
                                                        {
                                                            setId: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                                                            data: "name",
                                                            type: "string",
                                                            expression: "Fields[0].issuetype"
                                                        }
                                                    ],
                                                    [
                                                        {
                                                            setId: "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
                                                            data: "name",
                                                            type: "string",
                                                            expression: "Fields[0].projectName"
                                                        }
                                                    ],
                                                    [
                                                        {
                                                            expression:
                                                                "array(Fields).sum(function(row){ return ColGroup.Fields.yyyyMMdd == row.yyyyMMdd ? row.worklog.timespent:0}) / 3600"
                                                        }
                                                    ],
                                                    [
                                                        {
                                                            expression:
                                                                "array(Fields).sum(function(row){ return row.worklog.timespent}) / 3600"
                                                        }
                                                    ]
                                                ],
                                                keys: ["Fields.key"],
                                                sortBy: [],
                                                filter: [],
                                                variables: []
                                            }
                                        ],
                                        keys: [
                                            {
                                                expr: "Fields.key"
                                            }
                                        ],
                                        sortBy: "",
                                        filter: "",
                                        variables: [],
                                        dataset: -1,
                                        name: "Tickets",
                                        expression:
                                            "RowGroup('UserGroup').Variables('userWiseWorklog')[Fields.name.toLowerCase()] || []"
                                    }
                                ],
                                keys: [],
                                sortBy: "",
                                filter: "",
                                variables: [],
                                name: "Users",
                                expression: "Fields.users",
                                dataset: -1
                            }
                        ],
                        dataset: -1,
                        keys: [],
                        sortBy: "",
                        filter: "",
                        variables: [
                            {
                                expr: "array(Datasets('flatWorklogSet')).toKeyValuePair('author')",
                                key: "userWiseWorklog"
                            }
                        ],
                        expression: "Parameters.userList",
                        name: "UserGroup"
                    }
                ]
            }
        }
    ],
    parameters: [
        {
            name: "txtText",
            display: "TextFieldSample",
            type: "TXT"
        },
        {
            name: "txtMask",
            display: "Mask field sample",
            type: "MASK"
        },
        {
            name: "txtChkBox",
            display: "Checkbox sample",
            type: "CHK"
        },
        {
            name: "txtInt",
            display: "Integer Sample",
            type: "INT"
        },
        {
            name: "txtNum",
            display: "Number sample",
            type: "NUM"
        },
        {
            name: "txtDDL",
            display: "Dropdown sample",
            type: "DDL"
        },
        {
            name: "txtAC",
            display: "Autocomplete sample",
            type: "AC"
        },
        {
            name: "txtDTE",
            display: "Date sample",
            type: "DTE"
        },
        {
            name: "txtDR",
            display: "Date range sample",
            type: "DR"
        },
        {
            name: "txtFile",
            display: "File browser sample",
            type: "FILE"
        },
        {
            name: "txtMText",
            display: "TextFieldSample",
            type: "TXT",
            allowMultiple: true
        },
        {
            name: "txtMMask",
            display: "Mask field sample",
            type: "MASK",
            allowMultiple: true
        },
        {
            name: "txtMInt",
            display: "Integer Sample",
            type: "INT",
            allowMultiple: true
        },
        {
            name: "txtMNum",
            display: "Number sample",
            type: "NUM",
            allowMultiple: true
        },
        {
            name: "txtMDDL",
            display: "Dropdown sample",
            type: "DDL",
            allowMultiple: true
        },
        {
            name: "txtMAC",
            display: "Autocomplete sample",
            type: "AC",
            allowMultiple: true
        },
        {
            name: "txtMDTE",
            display: "Date sample",
            type: "DTE",
            allowMultiple: true
        },
        {
            name: "txtMFile",
            display: "File browser sample",
            type: "FILE",
            allowMultiple: true
        },
        {
            name: "DateRange",
            display: "Worklog date range",
            type: "DR"
        },
        {
            name: "userList",
            display: "User list",
            type: "UG"
        }
    ],
    queryName: "User daywise report",
    advanced: true,
    dateCreated: "2019-06-05T11:07:16.818Z",
    datasetList: [
        "a77b3ae4-11f8-40b3-aed3-d2c5a1e31321",
        "10725824-7724-4ffa-85de-33b67cc6aafe",
        "3aeecbb2-751f-47f7-8f0b-17c2e7a83741"
    ],
    userScript: "function prepareFlatDataset(worklogset)\n{\n          return [];\n}",
    uniqueId: "7cb61ad6-8ec6-415c-92fe-1e2b9571f699",
    updateId: "5d095090-6795-4c6d-9d5e-b5f29d19a151",
    dateUpdated: "2019-06-05T11:07:16.900Z"
};

export default {
    datasets: {
        "55a63c7a-bda9-4959-99d0-a90f7e926069": {
            type: "JQL",
            props: {
                fields: {},
                filterFields: [
                    {
                        id: "status",
                        name: "Status",
                        custom: false,
                        clauseName: "status",
                        knownObj: true,
                        type: "status",
                        operator: "{0} != {1}",
                        value: "Closed"
                    }
                ],
                outputFields: [
                    {
                        id: "assignee",
                        name: "Assignee",
                        custom: false,
                        knownObj: true,
                        type: "user"
                    },
                    {
                        id: "creator",
                        name: "Creator",
                        custom: false,
                        knownObj: true,
                        type: "user"
                    },
                    {
                        id: "status",
                        name: "Status",
                        custom: false,
                        knownObj: true,
                        type: "status"
                    },
                    {
                        id: "summary",
                        name: "Summary",
                        custom: false,
                        type: "string"
                    },
                    {
                        id: "project",
                        name: "Project",
                        custom: false,
                        knownObj: true,
                        type: "project"
                    },
                    {
                        id: "resolution",
                        name: "Resolution",
                        custom: false,
                        knownObj: true,
                        type: "resolution"
                    }
                ],
                jql: 'status != "Closed"'
            },
            name: "jiraTickets",
            definition: [
                {
                    set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                    key: "summary",
                    path: "summary",
                    type: "string"
                },
                {
                    set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                    key: "creator",
                    path: "creator",
                    type: "object",
                    children: [
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "self",
                            path: "creator.self",
                            type: "string"
                        },
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "name",
                            path: "creator.name",
                            type: "string"
                        },
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "key",
                            path: "creator.key",
                            type: "string"
                        },
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "accountId",
                            path: "creator.accountId",
                            type: "string"
                        },
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "emailAddress",
                            path: "creator.emailAddress",
                            type: "string"
                        },
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "avatarUrls",
                            path: "creator.avatarUrls",
                            type: "object",
                            children: [
                                {
                                    set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                                    key: "48x48",
                                    path: "creator.avatarUrls.48x48",
                                    type: "string"
                                },
                                {
                                    set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                                    key: "24x24",
                                    path: "creator.avatarUrls.24x24",
                                    type: "string"
                                },
                                {
                                    set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                                    key: "16x16",
                                    path: "creator.avatarUrls.16x16",
                                    type: "string"
                                },
                                {
                                    set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                                    key: "32x32",
                                    path: "creator.avatarUrls.32x32",
                                    type: "string"
                                }
                            ]
                        },
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "displayName",
                            path: "creator.displayName",
                            type: "string"
                        },
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "active",
                            path: "creator.active",
                            type: "boolean"
                        },
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "timeZone",
                            path: "creator.timeZone",
                            type: "string"
                        },
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "accountType",
                            path: "creator.accountType",
                            type: "string"
                        }
                    ]
                },
                {
                    set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                    key: "project",
                    path: "project",
                    type: "object",
                    children: [
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "self",
                            path: "project.self",
                            type: "string"
                        },
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "id",
                            path: "project.id",
                            type: "string"
                        },
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "key",
                            path: "project.key",
                            type: "string"
                        },
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "name",
                            path: "project.name",
                            type: "string"
                        },
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "projectTypeKey",
                            path: "project.projectTypeKey",
                            type: "string"
                        },
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "simplified",
                            path: "project.simplified",
                            type: "boolean"
                        },
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "avatarUrls",
                            path: "project.avatarUrls",
                            type: "object",
                            children: [
                                {
                                    set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                                    key: "48x48",
                                    path: "project.avatarUrls.48x48",
                                    type: "string"
                                },
                                {
                                    set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                                    key: "24x24",
                                    path: "project.avatarUrls.24x24",
                                    type: "string"
                                },
                                {
                                    set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                                    key: "16x16",
                                    path: "project.avatarUrls.16x16",
                                    type: "string"
                                },
                                {
                                    set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                                    key: "32x32",
                                    path: "project.avatarUrls.32x32",
                                    type: "string"
                                }
                            ]
                        }
                    ]
                },
                {
                    set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                    key: "status",
                    path: "status",
                    type: "object",
                    children: [
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "self",
                            path: "status.self",
                            type: "string"
                        },
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "description",
                            path: "status.description",
                            type: "string"
                        },
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "iconUrl",
                            path: "status.iconUrl",
                            type: "string"
                        },
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "name",
                            path: "status.name",
                            type: "string"
                        },
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "id",
                            path: "status.id",
                            type: "string"
                        },
                        {
                            set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                            key: "statusCategory",
                            path: "status.statusCategory",
                            type: "object",
                            children: [
                                {
                                    set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                                    key: "self",
                                    path: "status.statusCategory.self",
                                    type: "string"
                                },
                                {
                                    set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                                    key: "id",
                                    path: "status.statusCategory.id",
                                    type: "number"
                                },
                                {
                                    set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                                    key: "key",
                                    path: "status.statusCategory.key",
                                    type: "string"
                                },
                                {
                                    set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                                    key: "colorName",
                                    path: "status.statusCategory.colorName",
                                    type: "string"
                                },
                                {
                                    set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                                    key: "name",
                                    path: "status.statusCategory.name",
                                    type: "string"
                                }
                            ]
                        }
                    ]
                },
                {
                    set: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                    key: "key",
                    path: "key",
                    type: "string"
                }
            ]
        },
        "1405c96f-837d-48eb-82c8-cea5b3a26917": {
            type: "EXP",
            id: "1405c96f-837d-48eb-82c8-cea5b3a26917",
            name: "fsgfsd",
            variables: [],
            dependencies: [],
            expression: "fthrtyrt"
        },
        "830a9f3d-bbbf-4d84-8856-739d0bb1179c": {
            type: "FLT",
            id: "830a9f3d-bbbf-4d84-8856-739d0bb1179c",
            name: "flaterndataset",
            variables: [
                {
                    expr: "filter expression 1",
                    key: "filter variable 1"
                },
                {
                    expr: "expression 2",
                    key: "variable_2"
                }
            ],
            dependencies: "55a63c7a-bda9-4959-99d0-a90f7e926069",
            filter: "filter expression",
            colProps: '{\n"prop1":"myprop1"\n}'
        }
    },
    reportItems: [
        {
            type: "TBL",
            data: {
                columns: [
                    {
                        type: 1,
                        style: {
                            width: "100px"
                        },
                        children: []
                    },
                    {
                        type: 1,
                        style: {
                            width: "100px"
                        },
                        children: []
                    },
                    {
                        type: 2,
                        name: "Group 3a4d26380e49",
                        children: [
                            {
                                type: 3,
                                children: [
                                    {
                                        type: 1,
                                        style: {
                                            width: "100px"
                                        },
                                        children: []
                                    },
                                    {
                                        type: 1,
                                        style: {
                                            width: "100px"
                                        },
                                        children: []
                                    }
                                ]
                            },
                            {
                                type: 1,
                                style: {
                                    width: "100px"
                                },
                                children: []
                            }
                        ]
                    },
                    {
                        type: 1,
                        style: {
                            width: "100px"
                        },
                        children: []
                    }
                ],
                head: [
                    {
                        type: 1,
                        style: {
                            height: "25px"
                        },
                        children: [
                            [
                                {
                                    itemType: "text",
                                    data: "Header"
                                }
                            ],
                            [],
                            [],
                            [],
                            [],
                            []
                        ]
                    }
                ],
                body: [
                    {
                        type: 2,
                        name: "Modified_row_group",
                        children: [
                            {
                                type: 1,
                                style: {
                                    height: "25px"
                                },
                                children: [
                                    [
                                        {
                                            itemType: "text",
                                            data: "ParentGroup testing"
                                        }
                                    ],
                                    [],
                                    [],
                                    [],
                                    [],
                                    []
                                ]
                            },
                            {
                                type: 3,
                                children: [
                                    {
                                        type: 1,
                                        style: {
                                            height: "25px"
                                        },
                                        children: [
                                            [
                                                {
                                                    data: "=",
                                                    expression: "Testing",
                                                    template: "<b>{0}</b>"
                                                },
                                                {
                                                    itemType: "text",
                                                    data: "=SomeField"
                                                }
                                            ],
                                            [],
                                            [
                                                {
                                                    itemType: "text",
                                                    data: "Multiple Records check"
                                                }
                                            ],
                                            [
                                                {
                                                    itemType: "text",
                                                    data: "Inside col group"
                                                }
                                            ],
                                            [
                                                {
                                                    itemType: "text",
                                                    data: "Second outside group"
                                                }
                                            ],
                                            []
                                        ]
                                    },
                                    {
                                        type: 1,
                                        style: {
                                            height: "25px"
                                        },
                                        children: [
                                            [
                                                {
                                                    itemType: "text",
                                                    data: "New testing"
                                                },
                                                {
                                                    itemType: "text",
                                                    data: "Details group"
                                                }
                                            ],
                                            [
                                                {
                                                    itemType: "prop",
                                                    setId: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                                                    data: "summary",
                                                    type: "string",
                                                    expression: "RowGroup.Fields.summary"
                                                }
                                            ],
                                            [],
                                            [],
                                            [],
                                            []
                                        ]
                                    }
                                ],
                                keys: [""],
                                variables: [],
                                dataset: "55a63c7a-bda9-4959-99d0-a90f7e926069"
                            },
                            {
                                type: 1,
                                style: {
                                    height: "25px"
                                },
                                children: [
                                    [
                                        {
                                            itemType: "text",
                                            data: "Parent Group"
                                        }
                                    ],
                                    [
                                        {
                                            itemType: "prop",
                                            setId: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                                            data: "key",
                                            type: "string",
                                            expression: "RowGroup.Fields.key"
                                        }
                                    ],
                                    [],
                                    [],
                                    [],
                                    []
                                ]
                            }
                        ],
                        dataset: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                        keys: [
                            "",
                            {
                                expr: "grtp expression 2"
                            },
                            {
                                expr: "grtp expression 3"
                            }
                        ],
                        variables: [
                            {
                                expr: "variable expression 1",
                                key: "variable_1"
                            },
                            {
                                expr: "variable expression 2",
                                key: "variable_2"
                            },
                            {
                                expr: "variable expression 3",
                                key: "variable_3"
                            }
                        ],
                        filter: "filter dataset expression",
                        sortBy: "sort dataset expression"
                    },
                    {
                        type: 1,
                        style: {
                            height: "25px"
                        },
                        children: [
                            [
                                {
                                    itemType: "text",
                                    data: "No Group"
                                }
                            ],
                            [
                                {
                                    itemType: "prop",
                                    setId: "55a63c7a-bda9-4959-99d0-a90f7e926069",
                                    data: "creator",
                                    type: "object",
                                    expression: "RowGroup.Fields.creator"
                                }
                            ],
                            [],
                            [],
                            [],
                            []
                        ]
                    }
                ]
            }
        },
        {
            type: "HLN"
        }
    ],
    queryName: "SampleAdvancedReport",
    advanced: true,
    uniqueId: "a3e541f6-ca51-453b-b885-4671cb626d2f",
    dateCreated: "2019-05-26T14:04:07.031Z",
    updateId: "729ddebe-9c45-4926-8d0a-f1bf47d447ba",
    dateUpdated: "2019-05-26T14:04:07.043Z",
    parameters: [
        {
            name: "dateRange",
            type: "DR",
            display: "Worklogs between"
        },
        {
            name: "reportHeader",
            display: "Reoport Header",
            type: "TXT"
        }
    ],
    datasetList: [
        "55a63c7a-bda9-4959-99d0-a90f7e926069",
        "1405c96f-837d-48eb-82c8-cea5b3a26917",
        "830a9f3d-bbbf-4d84-8856-739d0bb1179c"
    ],
    userScript: "function MyFunc(){\n\n}\n\nfunction MyFunc2(){\n\n\n}"
};
