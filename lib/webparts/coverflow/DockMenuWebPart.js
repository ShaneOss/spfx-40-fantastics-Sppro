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
 * Coverflow Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("dockMenuStrings");
//Imports property pane custom fields
var PropertyFieldCustomList_1 = require("sp-client-custom-fields/lib/PropertyFieldCustomList");
var PropertyFieldFontPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontPicker");
var PropertyFieldFontSizePicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontSizePicker");
var PropertyFieldColorPickerMini_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPickerMini");
var PropertyFieldAlignPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldAlignPicker");
//Loads external CSS
require('../../css/coverflow/coverflow.scss');
//Loads external JS libs
require('jquery');
require('jqueryui');
var $ = require("jquery");
require('coverflow');
require('interpolate');
require('touchSwipe');
//require('jqueryreflection');
var DockMenuWebPart = (function (_super) {
    __extends(DockMenuWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function DockMenuWebPart(context) {
        var _this = _super.call(this) || this;
        _this.guid = _this.getGuid();
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(DockMenuWebPart.prototype, "dataVersion", {
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
    DockMenuWebPart.prototype.render = function () {
        var _this = this;
        var html = '<div class="photos" style="position: relative; width: 100%;" id="' + this.guid + '-bigCarousel">';
        if (this.properties.items != null) {
            this.properties.items.map(function (item) {
                if (item != null && item.Enabled != "false") {
                    html += '<div><img class="cover" src="' + item.Picture + '" data-name="' + item.Title + '"/>';
                    if (_this.properties.textPanelEnable != false) {
                        var content = item.Title;
                        var linkUrl = item['Link Url'];
                        var linkText = item['Link Text'];
                        if (linkUrl && linkUrl != '' && linkUrl != 'undefined') {
                            content += "&nbsp;<a style='color: " + _this.properties.textPanelFontColor + "' href='" + linkUrl + "'>";
                            var dataText = linkText;
                            if (dataText == null || dataText == '')
                                dataText = strings.ReadMore;
                            content += dataText;
                            content += "</a>";
                        }
                        if (_this.properties.shadow === false) {
                            html += '<div style=\'position: absolute; bottom: 0px; min-height: 50px; line-height: 50px; left: 0; width: 100%; color: ' + _this.properties.textPanelFontColor + '; background-color: ' + _this.properties.textPanelBackgroundColor + '; font-family: ' + _this.properties.textPanelFont + '; font-size: ' + _this.properties.textPanelFontSize + '; text-align: ' + _this.properties.textPanelAlign + ' \'><span style="padding: 8px">' + content + '</span></div>';
                        }
                        else {
                            html += '<div style=\'position: absolute; top: 190px; min-height: 50px; line-height: 50px; left: 0; width: 100%; color: ' + _this.properties.textPanelFontColor + '; background-color: ' + _this.properties.textPanelBackgroundColor + '; font-family: ' + _this.properties.textPanelFont + '; font-size: ' + _this.properties.textPanelFontSize + '; text-align: ' + _this.properties.textPanelAlign + ' \'><span style="padding: 8px">' + content + '</span></div>';
                        }
                    }
                    html += '</div>';
                }
            });
        }
        html += '</div>';
        this.domElement.innerHTML = html;
        this.renderContents();
    };
    DockMenuWebPart.prototype.renderContents = function () {
        if ($('#' + this.guid + '-bigCarousel') != null) {
            if (this.properties.shadow === true && $.fn.reflect) {
                $('#' + this.guid + '-bigCarousel .cover').reflect();
            }
            $('#' + this.guid + '-bigCarousel').coverflow({
                easing: this.properties.easing,
                duration: this.properties.duration,
                index: 3,
                width: 320,
                height: 240,
                visible: 'density',
                density: this.properties.density,
                innerOffset: this.properties.innerOffset,
                innerScale: this.properties.innerScale,
                selectedCss: { opacity: 1 },
                outerCss: { opacity: .1 },
                confirm: function () {
                },
                change: function (event, cover) {
                }
            });
        }
    };
    /**
     * @function
     * Generates a GUID
     */
    DockMenuWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    DockMenuWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    DockMenuWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    displayGroupsAsAccordion: true,
                    groups: [
                        {
                            groupName: strings.DataGroupName,
                            groupFields: [
                                PropertyFieldCustomList_1.PropertyFieldCustomList('items', {
                                    label: strings.DataFieldLabel,
                                    value: this.properties.items,
                                    headerText: "Manage Items",
                                    fields: [
                                        { id: 'Title', title: 'Title', required: true, type: PropertyFieldCustomList_1.CustomListFieldType.string },
                                        { id: 'Enabled', title: 'Enabled', required: true, type: PropertyFieldCustomList_1.CustomListFieldType.boolean },
                                        { id: 'Picture', title: 'Picture', required: true, type: PropertyFieldCustomList_1.CustomListFieldType.picture },
                                        //{ title: 'Picture', required: true, type: CustomListFieldType.picture },
                                        { id: 'Link Url', title: 'Link Url', required: false, type: PropertyFieldCustomList_1.CustomListFieldType.string, hidden: true },
                                        { id: 'Link Text', title: 'Link Text', required: false, type: PropertyFieldCustomList_1.CustomListFieldType.string, hidden: true }
                                    ],
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    context: this.context,
                                    properties: this.properties,
                                    key: "coverflowListField"
                                })
                            ]
                        },
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneToggle('shadow', {
                                    label: strings.Shadow,
                                }),
                                sp_webpart_base_1.PropertyPaneDropdown('duration', {
                                    label: strings.SpeedFieldLabel,
                                    options: [
                                        { key: 'slow', text: 'slow' },
                                        { key: 'normal', text: 'normal' },
                                        { key: 'fast', text: 'fast' }
                                    ]
                                }),
                                sp_webpart_base_1.PropertyPaneDropdown('easing', {
                                    label: strings.Easing,
                                    options: [
                                        { key: 'swing', text: 'swing' },
                                        { key: 'linear', text: 'linear' },
                                        { key: 'jswing', text: 'jswing' },
                                        { key: 'easeInQuad', text: 'easeInQuad' },
                                        { key: 'easeInCubic', text: 'easeInCubic' },
                                        { key: 'easeInQuart', text: 'easeInQuart' },
                                        { key: 'easeInQuint', text: 'easeInQuint' },
                                        { key: 'easeInSine', text: 'easeInSine' },
                                        { key: 'easeInExpo', text: 'easeInExpo' },
                                        { key: 'easeInCirc', text: 'easeInCirc' },
                                        { key: 'easeInElastic', text: 'easeInElastic' },
                                        { key: 'easeInBack', text: 'easeInBack' },
                                        { key: 'easeInBounce', text: 'easeInBounce' },
                                        { key: 'easeOutQuad', text: 'easeOutQuad' },
                                        { key: 'easeOutCubic', text: 'easeOutCubic' },
                                        { key: 'easeOutQuart', text: 'easeOutQuart' },
                                        { key: 'easeOutQuint', text: 'easeOutQuint' },
                                        { key: 'easeOutSine', text: 'easeOutSine' },
                                        { key: 'easeOutExpo', text: 'easeOutExpo' },
                                        { key: 'easeOutCirc', text: 'easeOutCirc' },
                                        { key: 'easeOutElastic', text: 'easeOutElastic' },
                                        { key: 'easeOutBack', text: 'easeOutBack' },
                                        { key: 'easeOutBounce', text: 'easeOutBounce' },
                                        { key: 'easeInOutQuad', text: 'easeInOutQuad' },
                                        { key: 'easeInOutCubic', text: 'easeInOutCubic' },
                                        { key: 'easeInOutQuart', text: 'easeInOutQuart' },
                                        { key: 'easeInOutQuint', text: 'easeInOutQuint' },
                                        { key: 'easeInOutSine', text: 'easeInOutSine' },
                                        { key: 'easeInOutExpo', text: 'easeInOutExpo' },
                                        { key: 'easeInOutCirc', text: 'easeInOutCirc' },
                                        { key: 'easeInOutElastic', text: 'easeInOutElastic' },
                                        { key: 'easeInOutBack', text: 'easeInOutBack' },
                                        { key: 'easeInOutBounce', text: 'easeInOutBounce' }
                                    ]
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('density', {
                                    label: strings.Density,
                                    min: 0,
                                    max: 4,
                                    step: 0.1
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('innerOffset', {
                                    label: strings.InnerOffset,
                                    min: 0,
                                    max: 200,
                                    step: 1
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('innerScale', {
                                    label: strings.InnerScale,
                                    min: 0,
                                    max: 1,
                                    step: 0.1
                                })
                            ]
                        }
                    ]
                },
                {
                    header: {
                        description: strings.PropertyPageTextPanel
                    },
                    groups: [
                        {
                            groupName: strings.TextPanelGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneToggle('textPanelEnable', {
                                    label: strings.TextPanelEnableFieldLabel
                                }),
                                PropertyFieldAlignPicker_1.PropertyFieldAlignPicker('textPanelAlign', {
                                    label: strings.TextPanelAlignFieldLabel,
                                    initialValue: this.properties.textPanelAlign,
                                    onPropertyChanged: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "coverflowAlignField"
                                }),
                                PropertyFieldFontPicker_1.PropertyFieldFontPicker('textPanelFont', {
                                    label: strings.TextPanelFontFieldLabel,
                                    initialValue: this.properties.textPanelFont,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "coverflowFontField"
                                }),
                                PropertyFieldFontSizePicker_1.PropertyFieldFontSizePicker('textPanelFontSize', {
                                    label: strings.TextPanelFontSizeFieldLabel,
                                    initialValue: this.properties.textPanelFontSize,
                                    usePixels: true,
                                    preview: true,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "coverflowFontSizeField"
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('textPanelFontColor', {
                                    label: strings.TextPanelFontColorFieldLabel,
                                    initialColor: this.properties.textPanelFontColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "coverflowFontColorField"
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('textPanelBackgroundColor', {
                                    label: strings.TextPanelBackgroundColorFieldLabel,
                                    initialColor: this.properties.textPanelBackgroundColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "coverflowBackgroundColorField"
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return DockMenuWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = DockMenuWebPart;

//# sourceMappingURL=DockMenuWebPart.js.map
