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
 * News Ticker Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("NewsTickerStrings");
//Imports property pane custom fields
var PropertyFieldCustomList_1 = require("sp-client-custom-fields/lib/PropertyFieldCustomList");
var PropertyFieldColorPickerMini_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPickerMini");
var PropertyFieldFontPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontPicker");
var PropertyFieldFontSizePicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontSizePicker");
var NewsTickerWebPart = (function (_super) {
    __extends(NewsTickerWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function NewsTickerWebPart(context) {
        var _this = _super.call(this) || this;
        _this.guid = _this.getGuid();
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(NewsTickerWebPart.prototype, "dataVersion", {
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
    NewsTickerWebPart.prototype.render = function () {
        var html = '';
        html += "\n<div class=\"news-" + this.guid + " color-" + this.guid + "\">\n\t<span>" + this.properties.title + "</span>\n\t<ul>\n  ";
        for (var i = 0; i < this.properties.items.length; i++) {
            var item = this.properties.items[i];
            if (item['Enable'] != 'false') {
                html += '<li><a href="' + item['Link Url'] + '">' + item['Title'] + '</li>';
            }
        }
        var paused = 'paused';
        if (this.properties.pausedMouseHover === false)
            paused = 'running';
        html += "\n\t</ul>\n</div>\n<style>\n@keyframes ticker {\n\t0%   {margin-top: 0}\n\t25%  {margin-top: -30px}\n\t50%  {margin-top: -60px}\n\t75%  {margin-top: -90px}\n\t100% {margin-top: 0}\n}\n\n.news-" + this.guid + " {\n  box-shadow: inset 0 -15px 30px rgba(0,0,0,0.4), 0 5px 10px rgba(0,0,0,0.5);\n  width: " + this.properties.width + ";\n  height: " + this.properties.height + ";\n  overflow: hidden;\n  border-radius: " + this.properties.borderRadius + "px;\n  padding: 3px;\n  -webkit-user-select: none\n}\n\n.news-" + this.guid + " span {\n  float: left;\n  color: " + this.properties.fontColor + ";\n  padding: 6px;\n  position: relative;\n  top: 1%;\n  border-radius: " + this.properties.borderRadius + "px;\n  box-shadow: inset 0 -15px 30px rgba(0,0,0,0.4);\n  font: " + this.properties.fontSize + " " + this.properties.font + ";\n  -webkit-font-smoothing: antialiased;\n  -webkit-user-select: none;\n  cursor: pointer\n}\n\n.news-" + this.guid + " ul {\n  float: left;\n  padding-left: 20px;\n  animation: ticker " + this.properties.speed + "s cubic-bezier(1, 0, .5, 0) infinite;\n  -webkit-user-select: none\n}\n\n.news-" + this.guid + " ul li {line-height: " + this.properties.height + "; list-style: none }\n\n.news-" + this.guid + " ul li a {\n  color: " + this.properties.fontColorMssg + ";\n  text-decoration: none;\n  font: " + this.properties.fontSizeMssg + " " + this.properties.fontMssg + ";\n  -webkit-font-smoothing: antialiased;\n  -webkit-user-select: none\n}\n\n.news-" + this.guid + " ul:hover { animation-play-state: " + paused + " }\n.news-" + this.guid + " span:hover+ul { animation-play-state: " + paused + " }\n\n/* OTHER COLORS */\n.color-" + this.guid + " { background: " + this.properties.backgroundColor + " }\n</style>\n    ";
        this.domElement.innerHTML = html;
    };
    /**
     * @function
     * Generates a GUID
     */
    NewsTickerWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    NewsTickerWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    NewsTickerWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                PropertyFieldCustomList_1.PropertyFieldCustomList('items', {
                                    label: strings.Items,
                                    value: this.properties.items,
                                    headerText: strings.ManageItems,
                                    fields: [
                                        { id: 'Title', title: 'Title', required: true, type: PropertyFieldCustomList_1.CustomListFieldType.string },
                                        { id: 'Enable', title: 'Enable', required: true, type: PropertyFieldCustomList_1.CustomListFieldType.boolean },
                                        { id: 'Link Url', title: 'Link Url', required: true, hidden: true, type: PropertyFieldCustomList_1.CustomListFieldType.string }
                                    ],
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    context: this.context,
                                    properties: this.properties,
                                    key: 'newsTickerListField'
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('speed', {
                                    label: strings.Speed,
                                    min: 1,
                                    max: 20,
                                    step: 1
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('pausedMouseHover', {
                                    label: strings.PausedMouseHover
                                })
                            ]
                        },
                        {
                            groupName: strings.LayoutGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneTextField('width', {
                                    label: strings.Width
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('height', {
                                    label: strings.Height
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('borderRadius', {
                                    label: strings.BorderRadius,
                                    min: 0,
                                    max: 10,
                                    step: 1
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('backgroundColor', {
                                    label: strings.BackgroundColor,
                                    initialColor: this.properties.backgroundColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'newsTickerBgColorField'
                                })
                            ]
                        },
                        {
                            groupName: strings.TitleGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneTextField('title', {
                                    label: strings.Title
                                }),
                                PropertyFieldFontPicker_1.PropertyFieldFontPicker('font', {
                                    label: strings.Font,
                                    initialValue: this.properties.font,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'newsTickerFontField'
                                }),
                                PropertyFieldFontSizePicker_1.PropertyFieldFontSizePicker('fontSize', {
                                    label: strings.FontSize,
                                    initialValue: this.properties.fontSize,
                                    usePixels: true,
                                    preview: true,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'newsTickerFontSizeField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('fontColor', {
                                    label: strings.FontColor,
                                    initialColor: this.properties.fontColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'newsTickerFontColorField'
                                })
                            ]
                        },
                        {
                            groupName: strings.ItemsGroupName,
                            groupFields: [
                                PropertyFieldFontPicker_1.PropertyFieldFontPicker('fontMssg', {
                                    label: strings.Font,
                                    initialValue: this.properties.fontMssg,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'newsTickerFontMssgField'
                                }),
                                PropertyFieldFontSizePicker_1.PropertyFieldFontSizePicker('fontSizeMssg', {
                                    label: strings.FontSize,
                                    initialValue: this.properties.fontSizeMssg,
                                    usePixels: true,
                                    preview: true,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'newsTickerFontSizeMssgField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('fontColorMssg', {
                                    label: strings.FontColor,
                                    initialColor: this.properties.fontColorMssg,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'newsTickerFontColorMssgField'
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return NewsTickerWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = NewsTickerWebPart;

//# sourceMappingURL=NewsTickerWebPart.js.map
