"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file
 * Simple Poll Web Part React JSX component.
 *
 * Contains JSX code to render the web part with HTML templates.
 *
 * Author: Olivier Carpentier
 */
var React = require("react");
var Spinner_1 = require("office-ui-fabric-react/lib/Spinner");
var Dialog_1 = require("office-ui-fabric-react/lib/Dialog");
var Label_1 = require("office-ui-fabric-react/lib/Label");
var Button_1 = require("office-ui-fabric-react/lib/Button");
var strings = require("SimplePollStrings");
var SPSurveyService_1 = require("../SPSurveyService");
var SimplePoll_module_scss_1 = require("../SimplePoll.module.scss");
var Chart = require('chartjs');
/**
 * @class
 * Defines Simple Poll web part class.
 */
var SimplePollWebPartHost = (function (_super) {
    __extends(SimplePollWebPartHost, _super);
    /**
     * @function
     * Simple Poll web part contructor.
     */
    function SimplePollWebPartHost(props, context) {
        var _this = _super.call(this, props, context) || this;
        //Save the context
        _this.myPageContext = props.context;
        _this.guid = _this.getGuid();
        //Init the component state
        _this.state = {
            loaded: false,
            viewResults: false,
            resultsLoaded: false,
            alreadyVote: false,
            choices: [],
            question: '',
            questionInternalName: '',
            existingAnswer: '',
            popupOpened: false,
            popupErrorOpened: false,
            selectedValue: '',
            results: []
        };
        _this.viewResults = _this.viewResults.bind(_this);
        _this.viewResultsBack = _this.viewResultsBack.bind(_this);
        _this.vote = _this.vote.bind(_this);
        _this.closeVote = _this.closeVote.bind(_this);
        _this.closeError = _this.closeError.bind(_this);
        _this.onVoteChanged = _this.onVoteChanged.bind(_this);
        _this.loadQuestions = _this.loadQuestions.bind(_this);
        return _this;
    }
    ;
    /**
     * @function
     * JSX Element render method
     */
    SimplePollWebPartHost.prototype.render = function () {
        var _this = this;
        if (this.props.surveyList == null || this.props.surveyList == '') {
            //Display select a list message
            return (React.createElement("div", { className: "ms-MessageBar" },
                React.createElement("div", { className: "ms-MessageBar-content" },
                    React.createElement("div", { className: "ms-MessageBar-icon" },
                        React.createElement("i", { className: "ms-Icon ms-Icon--Info" })),
                    React.createElement("div", { className: "ms-MessageBar-text" }, strings.ErrorSelectList))));
        }
        else {
            if (this.state.loaded == false) {
                //Display the loading spinner with the Office UI Fabric Spinner control
                return (React.createElement("div", { className: SimplePoll_module_scss_1.default.SimplePoll },
                    React.createElement("div", { className: SimplePoll_module_scss_1.default.workingOnItSpinner },
                        React.createElement(Spinner_1.Spinner, { type: Spinner_1.SpinnerType.normal }))));
            }
            else if (this.state.choices.length == 0) {
                //Display message no items
                return (React.createElement("div", { className: "ms-MessageBar ms-MessageBar--error" },
                    React.createElement("div", { className: "ms-MessageBar-content" },
                        React.createElement("div", { className: "ms-MessageBar-icon" },
                            React.createElement("i", { className: "ms-Icon ms-Icon--ErrorBadge" })),
                        React.createElement("div", { className: "ms-MessageBar-text" }, strings.ErrorNoItems))));
            }
            else {
                //Display the items list
                return (React.createElement("div", null,
                    React.createElement(Dialog_1.Dialog, { type: Dialog_1.DialogType.close, isOpen: this.state.popupOpened, title: strings.ThankYou, onDismiss: this.closeVote, containerClassName: '', isDarkOverlay: true, isBlocking: false },
                        React.createElement("div", null,
                            React.createElement("div", null,
                                React.createElement(Label_1.Label, null, strings.Recorded)),
                            React.createElement("div", { style: { paddingTop: '20px' } },
                                React.createElement(Button_1.Button, { onClick: this.closeVote, buttonType: Button_1.ButtonType.primary }, strings.OK)))),
                    React.createElement(Dialog_1.Dialog, { type: Dialog_1.DialogType.close, isOpen: this.state.popupErrorOpened, title: strings.Error, onDismiss: this.closeError, containerClassName: '', isDarkOverlay: true, isBlocking: false },
                        React.createElement("div", null,
                            React.createElement("div", null,
                                React.createElement(Label_1.Label, null, strings.SelectVote)),
                            React.createElement("div", { style: { paddingTop: '20px' } },
                                React.createElement(Button_1.Button, { onClick: this.closeError, buttonType: Button_1.ButtonType.primary }, strings.OK)))),
                    React.createElement("div", { style: { display: this.state.viewResults === true ? 'block' : 'none' } },
                        React.createElement("canvas", { id: this.guid + '-chart', width: "300", height: "300" }),
                        React.createElement("br", null),
                        React.createElement("input", { type: 'button', value: strings.Back, style: { color: 'white' }, onClick: this.viewResultsBack, className: 'ms-Button ms-Button--primary' })),
                    React.createElement("div", { style: { display: this.state.viewResults === true ? 'none' : 'block' } },
                        React.createElement("div", { style: { paddingBottom: '10px', fontFamily: this.props.font, fontSize: this.props.size, color: this.props.color } }, this.state.question),
                        this.state.alreadyVote === true ? React.createElement("div", { style: { color: 'green', paddingBottom: '10px' } },
                            React.createElement("strong", null, strings.AlreadyVote)) : '',
                        React.createElement("div", { style: { lineHeight: '28px' } }, this.state.choices.map(function (answer, i) {
                            return (React.createElement("div", null,
                                React.createElement("input", { type: 'radio', defaultChecked: answer == _this.state.selectedValue ? true : false, "aria-checked": answer == _this.state.selectedValue ? true : false, onChange: _this.onVoteChanged, disabled: _this.state.alreadyVote, name: _this.guid, value: answer }),
                                " ",
                                answer));
                        })),
                        React.createElement("div", { style: { paddingTop: '20px' } },
                            this.state.alreadyVote != true ?
                                React.createElement("input", { type: 'button', onClick: this.vote, disabled: this.state.alreadyVote, style: { color: 'white' }, value: strings.Vote, className: 'ms-Button ms-Button--primary' })
                                : '',
                            this.state.alreadyVote != true && this.props.forceVoteToViewResults === false ?
                                React.createElement("input", { type: 'button', value: strings.ViewResults, onClick: this.viewResults, className: 'ms-Button' })
                                :
                                    this.state.alreadyVote != true ?
                                        ''
                                        :
                                            React.createElement("input", { type: 'button', value: strings.ViewResults, onClick: this.viewResults, style: { color: 'white' }, className: 'ms-Button ms-Button--primary' })))));
            }
        }
    };
    SimplePollWebPartHost.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    SimplePollWebPartHost.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    SimplePollWebPartHost.prototype.onVoteChanged = function (elm) {
        this.state.selectedValue = elm.currentTarget.value;
        //this.setState(this.state);
    };
    SimplePollWebPartHost.prototype.vote = function (elm) {
        var _this = this;
        //Check if a value has been selected
        if (this.state.selectedValue == null || this.state.selectedValue == '') {
            this.state.popupErrorOpened = true;
            this.setState(this.state);
        }
        else {
            var listService = new SPSurveyService_1.SPSurveyService(this.props, this.myPageContext);
            listService.postVote(this.props.surveyList, this.state.questionInternalName, this.state.selectedValue).then(function (response) {
                _this.state.popupOpened = true;
                _this.state.resultsLoaded = false;
                _this.state.results = [];
                _this.setState(_this.state);
            });
        }
    };
    SimplePollWebPartHost.prototype.closeError = function () {
        this.state.popupErrorOpened = false;
        this.setState(this.state);
    };
    SimplePollWebPartHost.prototype.closeVote = function () {
        this.state.popupOpened = false;
        this.state.alreadyVote = true;
        this.setState(this.state);
    };
    SimplePollWebPartHost.prototype.viewResultsBack = function (elm) {
        this.state.viewResults = false;
        this.setState(this.state);
    };
    SimplePollWebPartHost.prototype.viewResults = function (elm) {
        var _this = this;
        this.state.viewResults = true;
        if (this.state.resultsLoaded != true) {
            this.state.loaded = false;
            this.setState(this.state);
            var listService = new SPSurveyService_1.SPSurveyService(this.props, this.myPageContext);
            listService.getResults(this.props.surveyList, this.state.questionInternalName, this.state.choices).then(function (num) {
                _this.state.results = num;
                _this.state.loaded = true;
                _this.setState(_this.state);
                _this.loadChart();
            });
        }
        else {
            this.setState(this.state);
        }
    };
    SimplePollWebPartHost.prototype.getColors = function (choices) {
        var res = [];
        for (var c = 0; c < choices.length; c++) {
            res.push(this.getRandomInitialsColor(c));
        }
        return res;
    };
    SimplePollWebPartHost.prototype.getRandomInitialsColor = function (index) {
        var num = index % 13;
        switch (num) {
            case 0: return 'darkBlue';
            case 1: return 'lightGreen';
            case 2: return 'orange';
            case 3: return 'teal';
            case 4: return 'red';
            case 5: return 'green';
            case 6: return 'purple';
            case 7: return 'darkGreen';
            case 8: return 'lightPink';
            case 9: return 'pink';
            case 10: return 'magenta';
            case 11: return 'black';
            case 12: return 'yellow';
            case 13: return 'blue';
            default: return 'blue';
        }
    };
    SimplePollWebPartHost.prototype.loadChart = function () {
        var colors = this.getColors(this.state.choices);
        if (this.props.chartType == 'pie') {
            var data = {
                labels: this.state.choices,
                datasets: [
                    {
                        data: this.state.results,
                        backgroundColor: colors,
                        hoverBackgroundColor: colors
                    }
                ]
            };
            var options = {
                responsive: false,
                cutoutPercentage: 0,
                animation: {
                    animateRotate: true,
                    animateScale: true
                },
                title: {
                    display: true,
                    text: this.state.question,
                    position: 'top',
                    fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    fontSize: 18,
                    fontColor: "#666"
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        fontColor: "#666",
                        fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                        fontSize: 12
                    }
                }
            };
            var ctx = document.getElementById(this.guid + '-chart');
            new Chart(ctx, {
                type: 'pie',
                data: data,
                options: options
            });
        }
        else {
            var data2 = {
                labels: this.state.choices,
                datasets: [
                    {
                        data: this.state.results,
                        backgroundColor: colors,
                        hoverBackgroundColor: colors
                    }
                ]
            };
            var options2 = {
                responsive: false,
                title: {
                    display: true,
                    text: this.state.question,
                    position: 'top',
                    fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    fontSize: 12,
                    fontColor: "#666"
                },
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                            display: true
                        }],
                    yAxes: [{
                            display: true
                        }]
                }
            };
            var ctx2 = document.getElementById(this.guid + '-chart');
            new Chart(ctx2, {
                type: 'horizontalBar',
                data: data2,
                options: options2
            });
        }
        this.state.resultsLoaded = true;
        this.setState(this.state);
    };
    SimplePollWebPartHost.prototype.loadQuestions = function (props) {
        var _this = this;
        if (props.surveyList == null || props.surveyList == '')
            return;
        //Request the survey questions
        var listService = new SPSurveyService_1.SPSurveyService(props, this.myPageContext);
        listService.getQuestions(props.surveyList).then(function (response) {
            var responseVal = response.value;
            if (responseVal == null || responseVal.length == 0)
                return;
            var item = responseVal[0];
            _this.state.choices = item.Choices;
            _this.state.question = item.Title;
            _this.state.questionInternalName = item.StaticName;
            //Request the existing votes to get current user voting status
            listService.getVoteForUser(props.surveyList, item.StaticName, _this.myPageContext.pageContext.user.loginName).then(function (responseVote) {
                var responseVoteVal = responseVote.value;
                if (responseVoteVal.length > 0) {
                    _this.state.alreadyVote = true;
                    _this.state.selectedValue = responseVoteVal[0].Title;
                }
                else
                    _this.state.alreadyVote = false;
                _this.state.loaded = true;
                _this.setState(_this.state);
            });
        });
    };
    /**
     * @function
     * Function called when the component did mount
     */
    SimplePollWebPartHost.prototype.componentDidMount = function () {
        this.loadQuestions(this.props);
    };
    /**
     * @function
     * Function called when the web part properties has changed
     */
    SimplePollWebPartHost.prototype.componentWillReceiveProps = function (nextProps) {
        this.state.resultsLoaded = false;
        this.state.results = [];
        this.setState(this.state);
        this.loadQuestions(nextProps);
    };
    /**
     * @function
     * Function called when the component has been rendered (ie HTML code is ready)
     */
    SimplePollWebPartHost.prototype.componentDidUpdate = function (prevProps, prevState) {
        //his.loadQuestions();
    };
    return SimplePollWebPartHost;
}(React.Component));
exports.default = SimplePollWebPartHost;

//# sourceMappingURL=SimplePollWebPartHost.js.map
