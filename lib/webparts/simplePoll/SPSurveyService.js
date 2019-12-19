"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_http_1 = require("@microsoft/sp-http");
var MockHttpClient_1 = require("./MockHttpClient");
/**
 * @class
 * Service implementation to get list & list items from current SharePoint site
 */
var SPSurveyService = (function () {
    /**
     * @function
     * Service constructor
     */
    function SPSurveyService(_props, pageContext) {
        this.props = _props;
        this.context = pageContext;
    }
    SPSurveyService.prototype.getResults = function (surveyListId, question, choices) {
        var restUrl = this.context.pageContext.web.absoluteUrl;
        restUrl += "/_api/Web/Lists(guid'";
        restUrl += surveyListId;
        restUrl += "')/items?$select=" + question + "&$top=9999";
        return this.context.spHttpClient.get(restUrl, sp_http_1.SPHttpClient.configurations.v1).then(function (response) {
            return response.json().then(function (responseFormated) {
                var res = [];
                for (var c = 0; c < choices.length; c++)
                    res[c] = 0;
                var collection = responseFormated.value;
                for (var i = 0; i < collection.length; i++) {
                    var vote = collection[i][question];
                    var qIndex = choices.indexOf(vote);
                    res[qIndex]++;
                }
                return res;
            });
        });
    };
    SPSurveyService.prototype.postVote = function (surveyListId, question, choice) {
        var _this = this;
        return this.getListName(surveyListId).then(function (listName) {
            var restUrl = _this.context.pageContext.web.absoluteUrl;
            restUrl += "/_api/Web/Lists(guid'";
            restUrl += surveyListId;
            restUrl += "')/items";
            var item = {
                "__metadata": { "type": _this.getItemTypeForListName(listName) },
                "Title": "newItemTitle"
            };
            item[question] = choice;
            var options = {
                headers: {
                    "odata-version": "3.0",
                    "Accept": "application/json"
                },
                body: JSON.stringify(item),
                webUrl: _this.context.pageContext.web.absoluteUrl
            };
            return _this.context.spHttpClient.post(restUrl, sp_http_1.SPHttpClient.configurations.v1, options).then(function (response) {
                return response.json().then(function (responseFormated) {
                    return true;
                });
            });
        });
    };
    SPSurveyService.prototype.getListName = function (listId) {
        var restUrl = this.context.pageContext.web.absoluteUrl;
        restUrl += "/_api/Web/Lists(guid'";
        restUrl += listId;
        restUrl += "')?$select=Title";
        var options = {
            headers: {
                "odata-version": "3.0",
                "Accept": "application/json"
            }
        };
        return this.context.spHttpClient.get(restUrl, sp_http_1.SPHttpClient.configurations.v1, options).then(function (response) {
            return response.text().then(function (responseFormated) {
                var iTitle = responseFormated.indexOf("<d:Title>");
                var newStr = responseFormated.slice(iTitle + 9, responseFormated.length);
                newStr = newStr.slice(0, newStr.indexOf("</d:Title>"));
                return newStr;
            });
        });
    };
    SPSurveyService.prototype.getItemTypeForListName = function (name) {
        return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + "ListItem";
    };
    SPSurveyService.prototype.getVoteForUser = function (surveyListId, question, userEmail) {
        var restUrl = this.context.pageContext.web.absoluteUrl;
        restUrl += "/_api/Web/Lists(guid'";
        restUrl += surveyListId;
        restUrl += "')/items?$expand=Author&$select=" + question + ",Author/EMail&$top=999";
        return this.context.spHttpClient.get(restUrl, sp_http_1.SPHttpClient.configurations.v1).then(function (response) {
            return response.json().then(function (responseFormated) {
                var formatedResponse = { value: [] };
                //Fetchs the Json response to construct the final items list
                responseFormated.value.map(function (object, i) {
                    var authorEmail = object['Author'].EMail;
                    if (authorEmail == userEmail) {
                        var spListItem = {
                            'ID': '',
                            'Title': object[question]
                        };
                        formatedResponse.value.push(spListItem);
                    }
                });
                return formatedResponse;
            });
        });
    };
    /**
     * @function
     * Gets the survey questions from a SharePoint list
     */
    SPSurveyService.prototype.getQuestions = function (surveyListId) {
        if (sp_core_library_1.Environment.type === sp_core_library_1.EnvironmentType.Local) {
            //If the running environment is local, load the data from the mock
            return this.getItemsFromMock('1');
        }
        else {
            //Request the SharePoint web service
            var restUrl = this.context.pageContext.web.absoluteUrl;
            restUrl += "/_api/Web/Lists(guid'";
            restUrl += surveyListId;
            restUrl += "')/fields?$filter=(CanBeDeleted%20eq%20true)&$top=1";
            return this.context.spHttpClient.get(restUrl, sp_http_1.SPHttpClient.configurations.v1).then(function (response) {
                return response.json().then(function (responseFormated) {
                    var formatedResponse = { value: [] };
                    //Fetchs the Json response to construct the final items list
                    responseFormated.value.map(function (object, i) {
                        //Tests if the result is a file and not a folder
                        var spListItem = {
                            'ID': object["ID"],
                            'Title': object['Title'],
                            'StaticName': object['StaticName'],
                            'TypeAsString': object['TypeAsString'],
                            'Choices': object['Choices']
                        };
                        formatedResponse.value.push(spListItem);
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
    SPSurveyService.prototype.getItemsFromMock = function (libId) {
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
    return SPSurveyService;
}());
exports.SPSurveyService = SPSurveyService;

//# sourceMappingURL=SPSurveyService.js.map
