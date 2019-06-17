export const userList = [
    {
        name: "Developers",
        users: [
            {
                self: "http://www.example.com/jira/rest/api/2/user?username=shylander",
                name: "shylander",
                displayName: "Shylander"
            },
            {
                self: "http://www.example.com/jira/rest/api/2/user?username=shridhar",
                name: "shridhar",
                displayName: "Shridhar TL"
            },
            {
                self: "http://www.example.com/jira/rest/api/2/user?username=aakash",
                name: "aakash",
                displayName: "Aakash Kumar"
            }
        ]
    }
];

export default {
    JQL: [
        {
            summary: "This is ticket no 1",
            key: "DUMY-1",
            issuetype: {
                self: "",
                id: "1",
                description: "",
                iconUrl: "img.jpg",
                name: "Story",
                subtask: false
            },
            project: {
                self: "",
                id: "",
                key: "PRC-1",
                name: "JiraAssistant",
                avatarUrls: {
                    "48x48": "",
                    "24x24": "",
                    "16x16": "",
                    "32x32": ""
                }
            },
            worklog: {
                startAt: 0,
                maxResults: 3,
                total: 3,
                worklogs: [
                    {
                        self: "http://www.example.com/jira/rest/api/2/issue/10010/worklog/10000",
                        author: {
                            self: "http://www.example.com/jira/rest/api/2/user?username=shridhar",
                            name: "shridhar",
                            displayName: "Shridhar TL"
                        },
                        updateAuthor: {
                            self: "http://www.example.com/jira/rest/api/2/user?username=shridhar",
                            name: "shridhar",
                            displayName: "Shridhar TL"
                        },
                        comment: "I did some work here. 1",
                        updated: "2019-06-13T04:22:37.471+0000",
                        started: "2019-06-13T04:22:37.471+0000",
                        timeSpent: "5h",
                        timeSpentSeconds: 18000,
                        id: "100028",
                        issueId: "10002"
                    },
                    {
                        self: "http://www.example.com/jira/rest/api/2/issue/10010/worklog/10000",
                        author: {
                            self: "http://www.example.com/jira/rest/api/2/user?username=shylander",
                            name: "shylander",
                            displayName: "Shylander"
                        },
                        updateAuthor: {
                            self: "http://www.example.com/jira/rest/api/2/user?username=shylander",
                            name: "shylander",
                            displayName: "Shylander"
                        },
                        comment: "I did some work here. 2",
                        updated: "2019-06-13T04:22:37.471+0000",
                        started: "2019-06-13T04:22:37.471+0000",
                        timeSpent: "3h 20m",
                        timeSpentSeconds: 12000,
                        id: "100028",
                        issueId: "10002"
                    },
                    {
                        self: "http://www.example.com/jira/rest/api/2/issue/10010/worklog/10000",
                        author: {
                            self: "http://www.example.com/jira/rest/api/2/user?username=aakash",
                            name: "aakash",
                            displayName: "Aakash Kumar"
                        },
                        updateAuthor: {
                            self: "http://www.example.com/jira/rest/api/2/user?username=aakash",
                            name: "aakash",
                            displayName: "Aakash Kumar"
                        },
                        comment: "I did some work here. 3",
                        updated: "2019-06-13T04:22:37.471+0000",
                        started: "2019-06-13T04:22:37.471+0000",
                        timeSpent: "4h 10m",
                        timeSpentSeconds: 15000,
                        id: "100028",
                        issueId: "10002"
                    }
                ]
            }
        },
        {
            summary: "This is ticket no 1",
            key: "DUMY-2",
            issuetype: {
                self: "",
                id: "2",
                description: "",
                iconUrl: "",
                name: "Story",
                subtask: false
            },
            project: {
                self: "",
                id: "",
                key: "PRC-1",
                name: "",
                avatarUrls: {
                    "48x48": "",
                    "24x24": "",
                    "16x16": "",
                    "32x32": ""
                }
            },
            worklog: {
                startAt: 0,
                maxResults: 3,
                total: 3,
                worklogs: [
                    {
                        self: "http://www.example.com/jira/rest/api/2/issue/10010/worklog/10000",
                        author: {
                            self: "http://www.example.com/jira/rest/api/2/user?username=fred",
                            name: "fred",
                            displayName: "Fred F. User",
                            active: false
                        },
                        updateAuthor: {
                            self: "http://www.example.com/jira/rest/api/2/user?username=fred",
                            name: "fred",
                            displayName: "Fred F. User",
                            active: false
                        },
                        comment: "I did some work here. 1",
                        updated: "2019-06-13T04:22:37.471+0000",
                        started: "2019-06-13T04:22:37.471+0000",
                        timeSpent: "5h",
                        timeSpentSeconds: 18000,
                        id: "100028",
                        issueId: "10002"
                    },
                    {
                        self: "http://www.example.com/jira/rest/api/2/issue/10010/worklog/10000",
                        author: {
                            self: "http://www.example.com/jira/rest/api/2/user?username=fred",
                            name: "fred",
                            displayName: "Fred F. User",
                            active: false
                        },
                        updateAuthor: {
                            self: "http://www.example.com/jira/rest/api/2/user?username=fred",
                            name: "fred",
                            displayName: "Fred F. User",
                            active: false
                        },
                        comment: "I did some work here. 2",
                        updated: "2019-06-13T04:22:37.471+0000",
                        started: "2019-06-13T04:22:37.471+0000",
                        timeSpent: "3h 20m",
                        timeSpentSeconds: 12000,
                        id: "100028",
                        issueId: "10002"
                    },
                    {
                        self: "http://www.example.com/jira/rest/api/2/issue/10010/worklog/10000",
                        author: {
                            self: "http://www.example.com/jira/rest/api/2/user?username=fred",
                            name: "fred",
                            displayName: "Fred F. User",
                            active: false
                        },
                        updateAuthor: {
                            self: "http://www.example.com/jira/rest/api/2/user?username=fred",
                            name: "fred",
                            displayName: "Fred F. User",
                            active: false
                        },
                        comment: "I did some work here. 3",
                        updated: "2019-06-13T04:22:37.471+0000",
                        started: "2019-06-13T04:22:37.471+0000",
                        timeSpent: "4h 10m",
                        timeSpentSeconds: 15000,
                        id: "100028",
                        issueId: "10002"
                    }
                ]
            }
        },
        {
            summary: "This is ticket no 1",
            key: "DUMY-3",
            issuetype: {
                self: "",
                id: "3",
                description: "",
                iconUrl: "",
                name: "Story",
                subtask: false
            },
            project: {
                self: "",
                id: "",
                key: "PRC-1",
                name: "",
                avatarUrls: {
                    "48x48": "",
                    "24x24": "",
                    "16x16": "",
                    "32x32": ""
                }
            },
            worklog: {
                startAt: 0,
                maxResults: 3,
                total: 3,
                worklogs: [
                    {
                        self: "http://www.example.com/jira/rest/api/2/issue/10010/worklog/10000",
                        author: {
                            self: "http://www.example.com/jira/rest/api/2/user?username=fred",
                            name: "fred",
                            displayName: "Fred F. User",
                            active: false
                        },
                        updateAuthor: {
                            self: "http://www.example.com/jira/rest/api/2/user?username=fred",
                            name: "fred",
                            displayName: "Fred F. User",
                            active: false
                        },
                        comment: "I did some work here. 1",
                        updated: "2019-06-13T04:22:37.471+0000",
                        started: "2019-06-13T04:22:37.471+0000",
                        timeSpent: "5h",
                        timeSpentSeconds: 18000,
                        id: "100028",
                        issueId: "10002"
                    },
                    {
                        self: "http://www.example.com/jira/rest/api/2/issue/10010/worklog/10000",
                        author: {
                            self: "http://www.example.com/jira/rest/api/2/user?username=fred",
                            name: "fred",
                            displayName: "Fred F. User",
                            active: false
                        },
                        updateAuthor: {
                            self: "http://www.example.com/jira/rest/api/2/user?username=fred",
                            name: "fred",
                            displayName: "Fred F. User",
                            active: false
                        },
                        comment: "I did some work here. 2",
                        updated: "2019-06-13T04:22:37.471+0000",
                        started: "2019-06-13T04:22:37.471+0000",
                        timeSpent: "3h 20m",
                        timeSpentSeconds: 12000,
                        id: "100028",
                        issueId: "10002"
                    },
                    {
                        self: "http://www.example.com/jira/rest/api/2/issue/10010/worklog/10000",
                        author: {
                            self: "http://www.example.com/jira/rest/api/2/user?username=fred",
                            name: "fred",
                            displayName: "Fred F. User",
                            active: false
                        },
                        updateAuthor: {
                            self: "http://www.example.com/jira/rest/api/2/user?username=fred",
                            name: "fred",
                            displayName: "Fred F. User",
                            active: false
                        },
                        comment: "I did some work here. 3",
                        updated: "2019-06-13T04:22:37.471+0000",
                        started: "2019-06-13T04:22:37.471+0000",
                        timeSpent: "4h 10m",
                        timeSpentSeconds: 15000,
                        id: "100028",
                        issueId: "10002"
                    }
                ]
            }
        }
    ]
};
