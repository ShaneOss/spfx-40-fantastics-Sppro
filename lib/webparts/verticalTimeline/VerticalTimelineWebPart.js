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
 * Vertical Timeline Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("VerticalTimelineStrings");
var SPCalendarService_1 = require("./SPCalendarService");
//Imports property pane custom fields
var PropertyFieldSPListQuery_1 = require("sp-client-custom-fields/lib/PropertyFieldSPListQuery");
var PropertyFieldIconPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldIconPicker");
var PropertyFieldColorPickerMini_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPickerMini");
var $ = require("jquery");
var VerticalTimelineWebPart = (function (_super) {
    __extends(VerticalTimelineWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function VerticalTimelineWebPart(context) {
        var _this = _super.call(this) || this;
        _this.guid = _this.getGuid();
        _this.timelineAnimate = _this.timelineAnimate.bind(_this);
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(VerticalTimelineWebPart.prototype, "dataVersion", {
        /**
         * @function
         * Gets WP data version
         */
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @function
     * Renders HTML code
     */
    VerticalTimelineWebPart.prototype.render = function () {
        var _this = this;
        if (this.properties.query == null || this.properties.query == '') {
            //Display select a list message
            this.domElement.innerHTML = "\n        <div class=\"ms-MessageBar\">\n          <div class=\"ms-MessageBar-content\">\n            <div class=\"ms-MessageBar-icon\">\n              <i class=\"ms-Icon ms-Icon--Info\"></i>\n            </div>\n            <div class=\"ms-MessageBar-text\">\n              " + strings.ErrorSelectList + "\n            </div>\n          </div>\n        </div>\n      ";
            return;
        }
        var html = '';
        html += "\n<style>\n.bg-primary, .bg-success, .bg-info, .bg-warning, .bg-danger, .bg-muted {\n  color: white; height: 40px;\n  }\n  .bg-primary .page-header, .bg-success .page-header, .bg-info .page-header, .bg-warning .page-header, .bg-danger .page-header, .bg-muted .page-header {\n    color: white; }\n\n.bg-primary {\n  background-color: #32b9b1; }\n\n.bg-success {\n  background-color: #51be38; }\n\n.bg-info {\n  background-color: #5bc0de; }\n\n.bg-warning {\n  background-color: #ef9544; }\n\n.bg-danger {\n  background-color: #f05a5b; }\n\n.bg-muted {\n  background-color: #bbbbbb; }\n\n.panel {\n  border: 0; }\n  .panel .panel-body {\n    padding: 20px; }\n  .panel-body {\n    background-color: " + this.properties.backgroundColor + ";\n    color: " + this.properties.color + "\n  }\n\n.panel-heading .panel-toggle {\n  background: #f9fafa; }\n.panel-heading .panel-title {\n  font-size: 18px; }\n\n.timeline {\n  list-style: none;\n  position: relative;\n  max-width: 1200px;\n  padding: 20px;\n  margin: 0 auto;\n  overflow: hidden; }\n  .timeline:after {\n    content: \"\";\n    position: absolute;\n    top: 0;\n    left: 50%;\n    margin-left: -2px;\n    background-color: rgba(0, 0, 0, 0.2);\n    height: 100%;\n    width: 4px;\n    border-radius: 2px;\n    display: block; }\n  .timeline .timeline-row {\n    padding-left: 50%;\n    position: relative;\n    z-index: 10; }\n    .timeline .timeline-row .timeline-time {\n      position: absolute;\n      right: 50%;\n      top: 31px;\n      text-align: right;\n      margin-right: 40px;\n      font-size: 16px;\n      line-height: 1.3;\n      font-weight: 600; }\n      .timeline .timeline-row .timeline-time small {\n        display: block;\n        color: #999999;\n        text-transform: uppercase;\n        opacity: 0.75;\n        font-size: 11px;\n        font-weight: 400; }\n    .timeline .timeline-row .timeline-icon {\n      position: absolute;\n      top: 30px;\n      left: 50%;\n      margin-left: -20px;\n      width: 40px;\n      height: 40px;\n      border-radius: 50%;\n      background-color: #eeeeee;\n      text-align: center;\n      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);\n      overflow: hidden;\n      padding: 3px;\n      color: white;\n      font-size: 14px;\n      z-index: 100; }\n      .timeline .timeline-row .timeline-icon > div {\n        border-radius: 50%;\n        line-height: 34px;\n        font-size: 16px; }\n    .timeline .timeline-row .timeline-content {\n      margin-left: 40px;\n      position: relative;\n      background-color: white;\n      color: #333333; }\n      .timeline .timeline-row .timeline-content:after {\n        content: \"\";\n        position: absolute;\n        top: 48px;\n        left: -41px;\n        height: 4px;\n        width: 40px;\n        background-color: rgba(0, 0, 0, 0.2);\n        z-index: -1; }\n      .timeline .timeline-row .timeline-content .panel-body {\n        padding: 15px 15px 2px;\n        position: relative;\n        z-index: 10; }\n      .timeline .timeline-row .timeline-content h2 {\n        font-size: 22px;\n        margin-bottom: 12px;\n        margin-top: 0;\n        line-height: 1.2; }\n      .timeline .timeline-row .timeline-content p {\n        margin-bottom: 15px; }\n      .timeline .timeline-row .timeline-content img {\n        margin-bottom: 15px; }\n      .timeline .timeline-row .timeline-content blockquote {\n        border-color: #eeeeee; }\n        .timeline .timeline-row .timeline-content blockquote footer, .timeline .timeline-row .timeline-content blockquote small, .timeline .timeline-row .timeline-content blockquote .small, .timeline .timeline-row .timeline-content blockquote.blockquote-reverse footer, .timeline .timeline-row .timeline-content blockquote.blockquote-reverse small, .timeline .timeline-row .timeline-content blockquote.blockquote-reverse .small {\n          color: #999999; }\n      .timeline .timeline-row .timeline-content .video-container {\n        position: relative;\n        padding-bottom: 56.25%;\n        padding-top: 30px;\n        height: 0;\n        margin-bottom: 15px;\n        overflow: hidden; }\n        .timeline .timeline-row .timeline-content .video-container iframe, .timeline .timeline-row .timeline-content .video-container object, .timeline .timeline-row .timeline-content .video-container embed {\n          position: absolute;\n          top: 0;\n          left: 0;\n          width: 100%;\n          height: 100%; }\n    .timeline .timeline-row:nth-child(odd) {\n      padding-left: 0;\n      padding-right: 50%; }\n      .timeline .timeline-row:nth-child(odd) .timeline-time {\n        right: auto;\n        left: 50%;\n        text-align: left;\n        margin-right: 0;\n        margin-left: 40px; }\n      .timeline .timeline-row:nth-child(odd) .timeline-content {\n        margin-right: 40px;\n        margin-left: 0; }\n        .timeline .timeline-row:nth-child(odd) .timeline-content:after {\n          left: auto;\n          right: -41px; }\n  .timeline.animated .timeline-row .timeline-content {\n    opacity: 0;\n    left: 20px;\n    -webkit-transition: all 0.8s;\n    -moz-transition: all 0.8s;\n    transition: all 0.8s; }\n  .timeline.animated .timeline-row:nth-child(odd) .timeline-content {\n    left: -20px; }\n  .timeline.animated .timeline-row.active .timeline-content {\n    opacity: 1;\n    left: 0; }\n  .timeline.animated .timeline-row.active:nth-child(odd) .timeline-content {\n    left: 0; }\n\n@media (max-width: 1200px) {\n  .timeline {\n    padding: 15px 10px; }\n    .timeline:after {\n      left: 28px; }\n    .timeline .timeline-row {\n      padding-left: 0;\n      margin-bottom: 16px; }\n      .timeline .timeline-row .timeline-time {\n        position: relative;\n        right: auto;\n        top: 0;\n        text-align: left;\n        margin: 0 0 6px 56px; }\n        .timeline .timeline-row .timeline-time strong {\n          display: inline-block;\n          margin-right: 10px; }\n      .timeline .timeline-row .timeline-icon {\n        top: 52px;\n        left: -2px;\n        margin-left: 0; }\n      .timeline .timeline-row .timeline-content {\n        margin-left: 56px;\n        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);\n        position: relative; }\n        .timeline .timeline-row .timeline-content:after {\n          right: auto !important;\n          left: -20px !important;\n          top: 32px; }\n      .timeline .timeline-row:nth-child(odd) {\n        padding-right: 0; }\n        .timeline .timeline-row:nth-child(odd) .timeline-time {\n          position: relative;\n          right: auto;\n          left: auto;\n          top: 0;\n          text-align: left;\n          margin: 0 0 6px 56px; }\n        .timeline .timeline-row:nth-child(odd) .timeline-content {\n          margin-right: 0;\n          margin-left: 55px; }\n    .timeline.animated .timeline-row:nth-child(odd) .timeline-content {\n      left: 20px; }\n    .timeline.animated .timeline-row.active:nth-child(odd) .timeline-content {\n      left: 0; } }\n\n</style>\n    ";
        this.domElement.innerHTML = html;
        var picturesListService = new SPCalendarService_1.SPCalendarService(this.properties, this.context);
        //Load the list of pictures from the current lib
        var queryUrl = this.properties.query;
        picturesListService.getItems(queryUrl).then(function (response) {
            var responseVal = response.value;
            if (responseVal == null || responseVal.length == 0) {
                _this.domElement.innerHTML = "\n              <div class=\"ms-MessageBar ms-MessageBar--error\">\n                <div class=\"ms-MessageBar-content\">\n                  <div class=\"ms-MessageBar-icon\">\n                    <i class=\"ms-Icon ms-Icon--ErrorBadge\"></i>\n                  </div>\n                  <div class=\"ms-MessageBar-text\">\n                    " + strings.ErrorNoItems + "\n                  </div>\n                </div>\n              </div>\n            ";
                return;
            }
            var outputHtml = '';
            outputHtml += "\n              <div class=\"timeline animated\">\n          ";
            responseVal.map(function (object, i) {
                //Render the item
                var eventDate = object.EventDate;
                var dateEvent = new Date(eventDate);
                outputHtml += "\n                 <div class=\"timeline-row\">\n                  <div class=\"timeline-time\">\n                    <small>" + dateEvent.toDateString() + "</small>" + dateEvent.toLocaleTimeString() + "\n                  </div>\n                  <div class=\"timeline-icon\">\n                    <div class=\"bg-primary\">\n                      <i style=\"font-size: 20px;padding-top: 2px;\" class=\"ms-Icon " + _this.properties.icon + "\" aria-hidden=\"true\"></i>\n                    </div>\n                  </div>\n                  <div class=\"panel timeline-content\">\n                    <div class=\"panel-body\">\n                      <h2>\n                        " + object.Title + "\n                      </h2>\n                      <p>\n                        " + object.Description + "\n                      </p>\n                    </div>\n                  </div>\n                </div>\n            ";
            });
            outputHtml += '</div>';
            _this.domElement.innerHTML += outputHtml;
            _this.timelineAnimate();
        });
        $('#pageContent').scroll(function () {
            _this.timelineAnimate();
        });
    };
    VerticalTimelineWebPart.prototype.timelineAnimate = function () {
        $(".timeline.animated .timeline-row").each(function (i) {
            var bottom_of_object, bottom_of_window;
            bottom_of_object = $(this).position().top + $(this).outerHeight();
            bottom_of_window = $('#pageContent').scrollTop() + $('#pageContent').height();
            if (bottom_of_window > bottom_of_object) {
                return $(this).addClass("active");
            }
        });
    };
    /**
     * @function
     * Generates a GUID
     */
    VerticalTimelineWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    VerticalTimelineWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    VerticalTimelineWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    displayGroupsAsAccordion: true,
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyFieldSPListQuery_1.PropertyFieldSPListQuery('query', {
                                    label: '',
                                    query: this.properties.query,
                                    includeHidden: false,
                                    baseTemplate: 106,
                                    orderBy: PropertyFieldSPListQuery_1.PropertyFieldSPListQueryOrderBy.Title,
                                    showOrderBy: true,
                                    showMax: true,
                                    showFilters: true,
                                    max: 100,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    context: this.context,
                                    properties: this.properties,
                                    key: 'verticalTimelineQueryField'
                                })
                            ]
                        },
                        {
                            groupName: strings.LayoutGroupName,
                            groupFields: [
                                PropertyFieldIconPicker_1.PropertyFieldIconPicker('icon', {
                                    label: strings.icon,
                                    initialValue: this.properties.icon,
                                    orderAlphabetical: true,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'verticalTimelineIconField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('color', {
                                    label: strings.color,
                                    initialColor: this.properties.color,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'verticalTimelineColorField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('backgroundColor', {
                                    label: strings.backgroundColor,
                                    initialColor: this.properties.backgroundColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'verticalTimelineBgColorField'
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return VerticalTimelineWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = VerticalTimelineWebPart;

//# sourceMappingURL=VerticalTimelineWebPart.js.map
