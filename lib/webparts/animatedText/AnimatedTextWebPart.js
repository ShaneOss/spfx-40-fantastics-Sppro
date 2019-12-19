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
 * Animated Text Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("AnimatedTextStrings");
//Imports the property pane custom fields
var PropertyFieldColorPickerMini_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPickerMini");
var PropertyFieldFontPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontPicker");
var PropertyFieldFontSizePicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontSizePicker");
var PropertyFieldAlignPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldAlignPicker");
//Loads external JS libs
var $ = require("jquery");
require('letterfx');
//Loads external CSS
require('../../css/letterfx/letterfx.scss');
/**
 * @class
 * AnimatedText Web Part
 */
var AnimatedTextWebPart = (function (_super) {
    __extends(AnimatedTextWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function AnimatedTextWebPart(context) {
        var _this = _super.call(this) || this;
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        //Inits the WebParts GUID
        _this.guid = _this.getGuid();
        return _this;
    }
    Object.defineProperty(AnimatedTextWebPart.prototype, "dataVersion", {
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
    AnimatedTextWebPart.prototype.render = function () {
        //Defines the main DIV container
        var style = "style='padding: 5px;";
        if (this.properties.align != null)
            style += "text-align: " + this.properties.align + ';';
        if (this.properties.font != null)
            style += "font-family: " + this.properties.font + ';';
        if (this.properties.fontSize != null)
            style += "font-size: " + this.properties.fontSize + ';';
        if (this.properties.fontColor != null)
            style += "color: " + this.properties.fontColor + ';';
        if (this.properties.backgroundColor != null)
            style += "background-color: " + this.properties.backgroundColor + ';';
        style += "'";
        var html = "<div " + style + " id='" + this.guid + "-AnimatedText'>" + this.properties.text + "</div>";
        this.domElement.innerHTML = html;
        this.renderContent();
    };
    /**
     * @function
     * Renders Javascript content
     */
    AnimatedTextWebPart.prototype.renderContent = function () {
        //Calls the LetterFX JQuery plugin init method with properties
        $('#' + this.guid + "-AnimatedText").letterfx({
            "fx": this.properties.effect != null ? this.properties.effect : "spin",
            "backwards": this.properties.effectDirection == "backwards" ? true : false,
            "timing": this.properties.timing != null ? this.properties.timing : 50,
            "fx_duration": this.properties.duration != null ? this.properties.duration + "ms" : "1000ms",
            "letter_end": this.properties.letterEnd != null ? this.properties.letterEnd : "restore",
            "element_end": this.properties.elementEnd != null ? this.properties.elementEnd : "restore"
        });
    };
    /**
     * @function
     * Generates a GUID
     */
    AnimatedTextWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    AnimatedTextWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    AnimatedTextWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                sp_webpart_base_1.PropertyPaneTextField('text', {
                                    label: strings.Text,
                                    multiline: true
                                }),
                                sp_webpart_base_1.PropertyPaneDropdown('effect', {
                                    label: strings.Effet,
                                    options: [
                                        { key: 'spin', text: 'spin' },
                                        { key: 'fade', text: 'fade' },
                                        { key: 'grow', text: 'grow' },
                                        { key: 'smear', text: 'smear' },
                                        { key: 'fall', text: 'fall' },
                                        { key: 'swirl', text: 'swirl' },
                                        { key: 'wave', text: 'wave' },
                                        { key: 'fly-top', text: 'fly-top' },
                                        { key: 'fly-bottom', text: 'fly-bottom' },
                                        { key: 'fly-left', text: 'fly-left' },
                                        { key: 'fly-right', text: 'fly-right' }
                                    ]
                                }),
                                sp_webpart_base_1.PropertyPaneDropdown('effectDirection', {
                                    label: strings.Direction,
                                    options: [
                                        { key: 'forward', text: 'forward' },
                                        { key: 'backwards', text: 'backwards' }
                                    ]
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('timing', {
                                    label: strings.Timing,
                                    min: 0,
                                    max: 100,
                                    step: 1
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('duration', {
                                    label: strings.Duration,
                                    min: 0,
                                    max: 2000,
                                    step: 50
                                }),
                                sp_webpart_base_1.PropertyPaneDropdown('letterEnd', {
                                    label: strings.LetterEnd,
                                    options: [
                                        { key: 'restore', text: 'restore' },
                                        { key: 'stay', text: 'stay' },
                                        { key: 'destroy', text: 'destroy' },
                                        { key: 'rewind', text: 'rewind' }
                                    ]
                                }),
                                sp_webpart_base_1.PropertyPaneDropdown('elementEnd', {
                                    label: strings.ElementEnd,
                                    options: [
                                        { key: 'restore', text: 'restore' },
                                        { key: 'stay', text: 'stay' },
                                        { key: 'destroy', text: 'destroy' }
                                    ]
                                })
                            ]
                        },
                        {
                            groupName: strings.LayoutGroupName,
                            groupFields: [
                                PropertyFieldAlignPicker_1.PropertyFieldAlignPicker('align', {
                                    label: strings.Align,
                                    initialValue: this.properties.align,
                                    onPropertyChanged: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "animatedTextAlignField"
                                }),
                                PropertyFieldFontPicker_1.PropertyFieldFontPicker('font', {
                                    label: strings.Font,
                                    useSafeFont: true,
                                    previewFonts: true,
                                    initialValue: this.properties.font,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "animatedTextFontField"
                                }),
                                PropertyFieldFontSizePicker_1.PropertyFieldFontSizePicker('fontSize', {
                                    label: strings.FontSize,
                                    usePixels: true,
                                    preview: true,
                                    initialValue: this.properties.fontSize,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "animatedTextFontSizeField"
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('fontColor', {
                                    label: strings.FontColor,
                                    initialColor: this.properties.fontColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "animatedTextFontColorField"
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('backgroundColor', {
                                    label: strings.BackgroundColor,
                                    initialColor: this.properties.backgroundColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "animatedTextBgColorField"
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return AnimatedTextWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = AnimatedTextWebPart;

//# sourceMappingURL=AnimatedTextWebPart.js.map
