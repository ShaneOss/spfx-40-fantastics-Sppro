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
 * RSS Reader Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("RssReaderStrings");
//Imports property pane custom fields
var PropertyFieldColorPickerMini_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPickerMini");
var PropertyFieldFontPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontPicker");
var PropertyFieldFontSizePicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontSizePicker");
var $ = require("jquery");
require('moment');
require('feedek');
var RssReaderWebPart = (function (_super) {
    __extends(RssReaderWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function RssReaderWebPart(context) {
        var _this = _super.call(this) || this;
        _this.guid = _this.getGuid();
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(RssReaderWebPart.prototype, "dataVersion", {
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
    RssReaderWebPart.prototype.render = function () {
        var html = '<div id="' + this.guid + '"></div>';
        html += "\n<style>\n.feedEkList{width:100%; list-style:none outside none;background-color: " + this.properties.backgroundColor + "; border:0px solid #D3CAD7; padding:4px 6px; color:#3E3E3E;}\n.feedEkList li{border-bottom:1px solid #D3CAD7; padding:5px;}\n.feedEkList li:last-child{border-bottom:none;}\n.itemTitle a{font-weight:bold; color:" + this.properties.fontColor + " !important; font-size:" + this.properties.fontSize + "; font-family:" + this.properties.font + "; text-decoration:none }\n.itemTitle a:hover{ text-decoration:underline }\n.itemDate{font-size:11px;color:#AAAAAA;}\n</style>\n    ";
        this.domElement.innerHTML = html;
        $('#' + this.guid).FeedEk({
            FeedUrl: this.properties.feedUrl,
            MaxCount: this.properties.maxCount,
            ShowDesc: this.properties.showDesc,
            ShowPubDate: this.properties.showPubDate,
            DescCharacterLimit: this.properties.descCharacterLimit,
            TitleLinkTarget: this.properties.titleLinkTarget,
            DateFormat: this.properties.dateFormat,
            DateFormatLang: this.properties.dateFormatLang
        });
    };
    /**
     * @function
     * Generates a GUID
     */
    RssReaderWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    RssReaderWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    RssReaderWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                sp_webpart_base_1.PropertyPaneTextField('feedUrl', {
                                    label: strings.feedUrl
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('maxCount', {
                                    label: strings.maxCount,
                                    min: 1,
                                    max: 100,
                                    step: 1
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('showPubDate', {
                                    label: strings.showPubDate
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('showDesc', {
                                    label: strings.showDesc
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('descCharacterLimit', {
                                    label: strings.descCharacterLimit,
                                    min: 1,
                                    max: 500,
                                    step: 1
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('titleLinkTarget', {
                                    label: strings.titleLinkTarget
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('dateFormat', {
                                    label: strings.dateFormat
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('dateFormatLang', {
                                    label: strings.dateFormatLang
                                })
                            ]
                        },
                        {
                            groupName: strings.LayoutGroupName,
                            groupFields: [
                                PropertyFieldFontPicker_1.PropertyFieldFontPicker('font', {
                                    label: strings.font,
                                    initialValue: this.properties.font,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'rssReaderFontField'
                                }),
                                PropertyFieldFontSizePicker_1.PropertyFieldFontSizePicker('fontSize', {
                                    label: strings.fontSize,
                                    initialValue: this.properties.fontSize,
                                    usePixels: true,
                                    preview: true,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'rssReaderFontSizeField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('fontColor', {
                                    label: strings.fontColor,
                                    initialColor: this.properties.fontColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'rssReaderFontColorField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('backgroundColor', {
                                    label: strings.backgroundColor,
                                    initialColor: this.properties.backgroundColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'rssReaderBgColorField'
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return RssReaderWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = RssReaderWebPart;

//# sourceMappingURL=RssReaderWebPart.js.map
