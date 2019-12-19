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
 * @file ArcTextWebPart.ts
 * ArcText JQuery Plugin adaptation as a web part for the SharePoint Framework (SPfx)
 *
 * @copyright 2016 Olivier Carpentier
 * Released under MIT licence
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("arcTextStrings");
//Loads the property pane custom fields
var PropertyFieldColorPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPicker");
var PropertyFieldFontPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontPicker");
var PropertyFieldFontSizePicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontSizePicker");
//Loads JQuery & Arctext Javascript libraries
var $ = require("jquery");
require('arctext');
/**
 * @class
 * ArcText Web Part
 */
var ArcTextWebPart = (function (_super) {
    __extends(ArcTextWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function ArcTextWebPart(context) {
        var _this = _super.call(this) || this;
        //Inits the WebParts GUID
        _this.guid = _this.getGuid();
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        _this.renderContents = _this.renderContents.bind(_this);
        return _this;
    }
    Object.defineProperty(ArcTextWebPart.prototype, "dataVersion", {
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
    ArcTextWebPart.prototype.render = function () {
        //Defines the main DIV container with output HTML code
        this.domElement.innerHTML = "<div style='text-align: " + this.properties.align + "; font-family: " + this.properties.font + "; font-size: " + this.properties.size + "; color: " + this.properties.color + ";'><h3 class=\"arcText\" id=\"" + (this.guid + '-arc') + "\">" + this.properties.text + "</h3></div>";
        this.renderContents();
    };
    /**
     * @function
     * Renders JavaScript JQuery calls
     */
    ArcTextWebPart.prototype.renderContents = function () {
        $('#' + this.guid + '-arc').arctext({
            radius: this.properties.radius,
            rotate: this.properties.rotateLetters,
            dir: this.properties.reverse === true ? -1 : 1
        });
    };
    /**
     * @function
     * Generates a GUID
     */
    ArcTextWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    ArcTextWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    ArcTextWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    displayGroupsAsAccordion: true,
                    groups: [
                        {
                            groupName: strings.EffectGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneTextField('text', {
                                    label: strings.TextFieldLabel,
                                    multiline: false
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('radius', {
                                    label: strings.RadiusFieldLabel,
                                    min: 1,
                                    max: 1500,
                                    step: 1,
                                    showValue: true
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('rotateLetters', {
                                    label: strings.RotateLetterFieldLabel
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('reverse', {
                                    label: strings.DirectionFieldLabel
                                }),
                                sp_webpart_base_1.PropertyPaneDropdown('align', {
                                    label: strings.AlignFieldLabel,
                                    options: [
                                        { key: 'left', text: strings.AlignLeft },
                                        { key: 'center', text: strings.AlignCenter },
                                        { key: 'right', text: strings.AlignRight }
                                    ]
                                })
                            ]
                        },
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyFieldFontPicker_1.PropertyFieldFontPicker('font', {
                                    label: strings.FontFieldLabel,
                                    useSafeFont: true,
                                    previewFonts: true,
                                    initialValue: this.properties.font,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "arcTextFontField"
                                }),
                                PropertyFieldFontSizePicker_1.PropertyFieldFontSizePicker('size', {
                                    label: strings.FontSizeFieldLabel,
                                    usePixels: true,
                                    preview: true,
                                    initialValue: this.properties.size,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "arcTextFontSizeField"
                                }),
                                PropertyFieldColorPicker_1.PropertyFieldColorPicker('color', {
                                    label: strings.ColorFieldLabel,
                                    initialColor: this.properties.color,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "arcTextColorField"
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return ArcTextWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = ArcTextWebPart;

//# sourceMappingURL=ArcTextWebPart.js.map
