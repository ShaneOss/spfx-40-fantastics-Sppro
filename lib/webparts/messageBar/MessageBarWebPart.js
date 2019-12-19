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
 * Message Bar Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("MessageBarStrings");
//Imports property pane custom fields
var PropertyFieldColorPickerMini_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPickerMini");
var PropertyFieldFontPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontPicker");
var PropertyFieldFontSizePicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontSizePicker");
var PropertyFieldIconPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldIconPicker");
var PropertyFieldRichTextBox_1 = require("sp-client-custom-fields/lib/PropertyFieldRichTextBox");
var MessageBarWebPart = (function (_super) {
    __extends(MessageBarWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function MessageBarWebPart(context) {
        var _this = _super.call(this) || this;
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(MessageBarWebPart.prototype, "dataVersion", {
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
    MessageBarWebPart.prototype.render = function () {
        var style = "style='";
        if (this.properties.font != null)
            style += "font-family: " + this.properties.font + ';';
        if (this.properties.fontSize != null)
            style += "font-size: " + this.properties.fontSize + ';';
        if (this.properties.fontColor != null)
            style += "color: " + this.properties.fontColor + ';';
        if (this.properties.backgroundColor != null)
            style += "background-color: " + this.properties.backgroundColor + ';';
        style += "'";
        var html = '';
        if (this.properties.enabled != false) {
            html += '<div ' + style + '>';
            html += ' <div class="ms-MessageBar-content">';
            html += '   <table border="0" cellspacing="0" cellpadding="0"><tr>';
            html += '   <td align="top" valign="middle"><div class="ms-MessageBar-icon" style="padding-left: 10px;">';
            html += '     <i class="ms-Icon ' + this.properties.icon + '" style="font-size: ' + this.properties.fontSize + '"></i>';
            html += '   </div></td>';
            html += '   <td align="top" valign="middle"><div class="">';
            html += this.properties.text;
            html += '   </div></td>';
            html += '   </tr></table>';
            html += '  </div>';
            html += '</div>';
        }
        this.domElement.innerHTML = html;
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    MessageBarWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                sp_webpart_base_1.PropertyPaneToggle('enabled', {
                                    label: strings.Enabled
                                }),
                                PropertyFieldIconPicker_1.PropertyFieldIconPicker('icon', {
                                    label: strings.Icon,
                                    initialValue: this.properties.icon,
                                    orderAlphabetical: true,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'messageBarIconField'
                                }),
                                PropertyFieldRichTextBox_1.PropertyFieldRichTextBox('text', {
                                    label: strings.Text,
                                    initialValue: this.properties.text,
                                    inline: false,
                                    minHeight: 100,
                                    mode: 'basic',
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'messageBarRichTextBoxField'
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
                                    key: 'messageBarFontField'
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
                                    key: 'messageBarFontSizeField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('fontColor', {
                                    label: strings.FontColor,
                                    initialColor: this.properties.fontColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'messageBarFontColorField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('backgroundColor', {
                                    label: strings.BackgroundColor,
                                    initialColor: this.properties.backgroundColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'messageBarBgColorField'
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return MessageBarWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = MessageBarWebPart;

//# sourceMappingURL=MessageBarWebPart.js.map
