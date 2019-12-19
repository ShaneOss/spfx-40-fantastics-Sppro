"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_http_1 = require("@microsoft/sp-http");
var MockHttpClient_1 = require("./MockHttpClient");
/**
 * @class
 * Service implementation to get list & list items from current SharePoint site
 */
var SPCalendarService = (function () {
    /**
     * @function
     * Service constructor
     */
    function SPCalendarService(_props, pageContext) {
        this.props = _props;
        this.context = pageContext;
    }
    /**
     * @function
     * Gets the pictures from a SharePoint list
     */
    SPCalendarService.prototype.getItems = function (queryUrl) {
        if (sp_core_library_1.Environment.type === sp_core_library_1.EnvironmentType.Local) {
            //If the running environment is local, load the data from the mock
            return this.getItemsFromMock('1');
        }
        else {
            //Request the SharePoint web service
            return this.context.spHttpClient.get(queryUrl, sp_http_1.SPHttpClient.configurations.v1).then(function (response) {
                return response.json().then(function (responseFormated) {
                    var formatedResponse = { value: [] };
                    //Fetchs the Json response to construct the final items list
                    responseFormated.value.map(function (object, i) {
                        //Tests if the result is a file and not a folder
                        if (object['FileSystemObjectType'] == '0') {
                            var spListItem = {
                                'ID': object["ID"],
                                'Title': object['Title'],
                                'Description': object['Description'],
                                'EventDate': object['EventDate'],
                                'EndDate': object['EndDate'],
                                'Location': object['Location']
                            };
                            formatedResponse.value.push(spListItem);
                        }
                    });
                    return formatedResponse;
                });
            });
        }
    };
    /**
     * @function
     * Gets the pictures list from the mock. This function will return a
     * different list of pics for the lib 1 & 2, and an empty list for the third.
     */
    SPCalendarService.prototype.getItemsFromMock = function (libId) {
        return MockHttpClient_1.default.getListsItems(this.context.pageContext.web.absoluteUrl).then(function () {
            var listData = { value: [] };
            if (libId == '1') {
                listData = {
                    value: [
                        {
                            "ID": "1", "Title": "Barton Dam, Ann Arbor, Michigan", "Description": ""
                        },
                        {
                            "ID": "2", "Title": "Building Atlanta, Georgia", "Description": ""
                        },
                        {
                            "ID": "3", "Title": "Nice day for a swim", "Description": ""
                        },
                        {
                            "ID": "4", "Title": "The plants that never die", "Description": ""
                        },
                        {
                            "ID": "5", "Title": "Downtown Atlanta, Georgia", "Description": ""
                        },
                        {
                            "ID": "6", "Title": "Atlanta traffic", "Description": ""
                        },
                        {
                            "ID": "7", "Title": "A pathetic dog", "Description": ""
                        },
                        {
                            "ID": "8", "Title": "Two happy dogs", "Description": ""
                        },
                        {
                            "ID": "9", "Title": "Antigua, Guatemala", "Description": ""
                        },
                        {
                            "ID": "10", "Title": "Iximche, Guatemala", "Description": ""
                        }
                    ]
                };
            }
            else if (libId == '2') {
                listData = {
                    value: [
                        {
                            "ID": "11", "Title": "Barton Dam, Ann Arbor, Michigan", "Description": ""
                        },
                        {
                            "ID": "12", "Title": "Building Atlanta, Georgia", "Description": ""
                        },
                        {
                            "ID": "13", "Title": "Nice day for a swim", "Description": ""
                        },
                        {
                            "ID": "14", "Title": "The plants that never die", "Description": ""
                        },
                        {
                            "ID": "15", "Title": "Downtown Atlanta, Georgia", "Description": ""
                        },
                        {
                            "ID": "16", "Title": "Atlanta traffic", "Description": ""
                        },
                        {
                            "ID": "17", "Title": "A pathetic dog", "Description": ""
                        },
                        {
                            "ID": "18", "Title": "Two happy dogs", "Description": ""
                        },
                        {
                            "ID": "19", "Title": "Antigua, Guatemala", "Description": ""
                        },
                        {
                            "ID": "20", "Title": "Iximche, Guatemala", "Description": ""
                        }
                    ]
                };
            }
            return listData;
        });
    };
    return SPCalendarService;
}());
exports.SPCalendarService = SPCalendarService;

//# sourceMappingURL=SPCalendarService.js.map
