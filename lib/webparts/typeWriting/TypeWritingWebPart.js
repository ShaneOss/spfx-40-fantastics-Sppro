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
 * TypeWriting Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("TypeWritingStrings");
//Imports property pane custom fields
var PropertyFieldColorPickerMini_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPickerMini");
var PropertyFieldFontPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontPicker");
var PropertyFieldFontSizePicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontSizePicker");
var TypeWriting = require('typewriting');
var TypeWritingWebPart = (function (_super) {
    __extends(TypeWritingWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function TypeWritingWebPart(context) {
        var _this = _super.call(this) || this;
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        _this.guid = _this.getGuid();
        return _this;
    }
    Object.defineProperty(TypeWritingWebPart.prototype, "dataVersion", {
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
    TypeWritingWebPart.prototype.render = function () {
        var style = "style='padding: 5px;";
        if (this.properties.font != null)
            style += "font-family: " + this.properties.font + ';';
        if (this.properties.fontSize != null)
            style += "font-size: " + this.properties.fontSize + ';';
        if (this.properties.fontColor != null)
            style += "color: " + this.properties.fontColor + ';';
        if (this.properties.backgroundColor != null)
            style += "background-color: " + this.properties.backgroundColor + ';';
        style += "'";
        var html = "<div " + style + " id='" + this.guid + "-typewriting'></div>";
        this.domElement.innerHTML = html;
        var text = this.properties.text;
        if (this.properties.splitLines === true && text != null) {
            var splitted = text.split("\n");
            text = splitted[0];
        }
        if (this.typeWriting != null)
            this.typeWriting = null;
        this.typeWriting = new TypeWriting({
            targetElement: document.getElementById(this.guid + "-typewriting"),
            inputString: text,
            typing_interval: this.properties.typingInterval,
            blink_interval: this.properties.blinkInterval + 'ms',
            cursor_color: this.properties.cursorColor,
        }, function () {
            //console.log("END");
        });
        if (this.properties.splitLines === true && text != null) {
            var splitted2 = this.properties.text.split("\n");
            for (var i = 1; i < splitted2.length; i++) {
                this.typeWriting.rewrite(splitted2[i], function () { });
            }
        }
    };
    /**
     * @function
     * Generates a GUID
     */
    TypeWritingWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    TypeWritingWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    TypeWritingWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                sp_webpart_base_1.PropertyPaneToggle('splitLines', {
                                    label: strings.SplitLines
                                })
                            ]
                        },
                        {
                            groupName: strings.TypeWritingGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneSlider('typingInterval', {
                                    label: strings.TypingInterval,
                                    min: 0,
                                    max: 500,
                                    step: 10
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('blinkInterval', {
                                    label: strings.BlinkInterval,
                                    min: 0,
                                    max: 5000,
                                    step: 50
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('cursorColor', {
                                    label: strings.CursorColor,
                                    initialColor: this.properties.cursorColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'typeWritingCursorColorField'
                                })
                            ]
                        },
                        {
                            groupName: strings.LayoutGroupName,
                            groupFields: [
                                PropertyFieldFontPicker_1.PropertyFieldFontPicker('font', {
                                    label: strings.Font,
                                    useSafeFont: true,
                                    previewFonts: true,
                                    initialValue: this.properties.font,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'typeWritingFontField'
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
                                    key: 'typeWritingFontSizeField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('fontColor', {
                                    label: strings.FontColor,
                                    initialColor: this.properties.fontColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'typeWritingFontColorField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('backgroundColor', {
                                    label: strings.BackgroundColor,
                                    initialColor: this.properties.backgroundColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'typeWritingBgColorField'
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return TypeWritingWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = TypeWritingWebPart;

//# sourceMappingURL=TypeWritingWebPart.js.map
