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
 * Text Rotator Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("TextRotatorStrings");
//Imports property pane custom fields
var PropertyFieldColorPickerMini_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPickerMini");
var PropertyFieldFontPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontPicker");
var PropertyFieldFontSizePicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontSizePicker");
var PropertyFieldAlignPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldAlignPicker");
//Loads external JS lib
var $ = require("jquery");
require('morphext');
//Loads CSS
require('../../css/animate/animate.scss');
require('../../css/morphext/morphext.scss');
var TextRotatorWebPart = (function (_super) {
    __extends(TextRotatorWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function TextRotatorWebPart(context) {
        var _this = _super.call(this) || this;
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        _this.guid = _this.getGuid();
        return _this;
    }
    Object.defineProperty(TextRotatorWebPart.prototype, "dataVersion", {
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
    TextRotatorWebPart.prototype.render = function () {
        var style = "style='";
        if (this.properties.align != null)
            style += "text-align: " + this.properties.align + ";";
        if (this.properties.font != null)
            style += "font-family: " + this.properties.font + ';';
        if (this.properties.fontSize != null)
            style += "font-size: " + this.properties.fontSize + ';';
        if (this.properties.fontColor != null)
            style += "color: " + this.properties.fontColor + ';';
        if (this.properties.backgroundColor != null)
            style += "background-color: " + this.properties.backgroundColor + ';';
        style += "'";
        var html = "<div " + style + " id='" + this.guid + "-TextRotator'>" + this.properties.text + "</div>";
        this.domElement.innerHTML = html;
        this.renderContent();
    };
    TextRotatorWebPart.prototype.renderContent = function () {
        $('#' + this.guid + "-TextRotator").Morphext({
            // The [in] animation type. Refer to Animate.css for a list of available animations.
            animation: this.properties.effect,
            // An array of phrases to rotate are created based on this separator. Change it if you wish to separate the phrases differently (e.g. So Simple | Very Doge | Much Wow | Such Cool).
            separator: "\n",
            // The delay between the changing of each phrase in milliseconds.
            speed: this.properties.duration,
            complete: function () {
                // Called after the entrance animation is executed.
            }
        });
    };
    /**
     * @function
     * Generates a GUID
     */
    TextRotatorWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    TextRotatorWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    TextRotatorWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                        { key: 'bounce', text: "bounce" },
                                        { key: 'flash', text: "flash" },
                                        { key: 'pulse', text: "pulse" },
                                        { key: 'rubberBand', text: "rubberBand" },
                                        { key: 'shake', text: "shake" },
                                        { key: 'headShake', text: "headShake" },
                                        { key: 'swing', text: "swing" },
                                        { key: 'tada', text: "tada" },
                                        { key: 'wobble', text: "wobble" },
                                        { key: 'jello', text: "jello" },
                                        { key: 'bounceIn', text: "bounceIn" },
                                        { key: 'bounceInDown', text: "bounceInDown" },
                                        { key: 'bounceInLeft', text: "bounceInLeft" },
                                        { key: 'bounceInRight', text: "bounceInRight" },
                                        { key: 'bounceInUp', text: "bounceInUp" },
                                        { key: 'bounceOut', text: "bounceOut" },
                                        { key: 'bounceOutDown', text: "bounceOutDown" },
                                        { key: 'bounceOutLeft', text: "bounceOutLeft" },
                                        { key: 'bounceOutRight', text: "bounceOutRight" },
                                        { key: 'bounceOutUp', text: "bounceOutUp" },
                                        { key: 'fadeIn', text: "fadeIn" },
                                        { key: 'fadeInDown', text: "fadeInDown" },
                                        { key: 'fadeInDownBig', text: "fadeInDownBig" },
                                        { key: 'fadeInLeft', text: "fadeInLeft" },
                                        { key: 'fadeInLeftBig', text: "fadeInLeftBig" },
                                        { key: 'fadeInRight', text: "fadeInRight" },
                                        { key: 'fadeInRightBig', text: "fadeInRightBig" },
                                        { key: 'fadeInUp', text: "fadeInUp" },
                                        { key: 'fadeInUpBig', text: "fadeInUpBig" },
                                        { key: 'fadeOut', text: "fadeOut" },
                                        { key: 'fadeOutDown', text: "fadeOutDown" },
                                        { key: 'fadeOutDownBig', text: "fadeOutDownBig" },
                                        { key: 'fadeOutLeft', text: "fadeOutLeft" },
                                        { key: 'fadeOutLeftBig', text: "fadeOutLeftBig" },
                                        { key: 'fadeOutRight', text: "fadeOutRight" },
                                        { key: 'fadeOutRightBig', text: "fadeOutRightBig" },
                                        { key: 'fadeOutUp', text: "fadeOutUp" },
                                        { key: 'fadeOutUpBig', text: "fadeOutUpBig" },
                                        { key: 'flipInX', text: "flipInX" },
                                        { key: 'flipInY', text: "flipInY" },
                                        { key: 'flipOutX', text: "flipOutX" },
                                        { key: 'flipOutY', text: "flipOutY" },
                                        { key: 'lightSpeedIn', text: "lightSpeedIn" },
                                        { key: 'lightSpeedOut', text: "lightSpeedOut" },
                                        { key: 'rotateIn', text: "rotateIn" },
                                        { key: 'rotateInDownLeft', text: "rotateInDownLeft" },
                                        { key: 'rotateInDownRight', text: "rotateInDownRight" },
                                        { key: 'rotateInUpLeft', text: "rotateInUpLeft" },
                                        { key: 'rotateInUpRight', text: "rotateInUpRight" },
                                        { key: 'rotateOut', text: "rotateOut" },
                                        { key: 'rotateOutDownLeft', text: "rotateOutDownLeft" },
                                        { key: 'rotateOutDownRight', text: "rotateOutDownRight" },
                                        { key: 'rotateOutUpLeft', text: "rotateOutUpLeft" },
                                        { key: 'rotateOutUpRight', text: "rotateOutUpRight" },
                                        { key: 'hinge', text: "hinge" },
                                        { key: 'rollIn', text: "rollIn" },
                                        { key: 'rollOut', text: "rollOut" },
                                        { key: 'zoomIn', text: "zoomIn" },
                                        { key: 'zoomInDown', text: "zoomInDown" },
                                        { key: 'zoomInLeft', text: "zoomInLeft" },
                                        { key: 'zoomInRight', text: "zoomInRight" },
                                        { key: 'zoomInUp', text: "zoomInUp" },
                                        { key: 'zoomOut', text: "zoomOut" },
                                        { key: 'zoomOutDown', text: "zoomOutDown" },
                                        { key: 'zoomOutLeft', text: "zoomOutLeft" },
                                        { key: 'zoomOutRight', text: "zoomOutRight" },
                                        { key: 'zoomOutUp', text: "zoomOutUp" },
                                        { key: 'slideInDown', text: "slideInDown" },
                                        { key: 'slideInLeft', text: "slideInLeft" },
                                        { key: 'slideInRight', text: "slideInRight" },
                                        { key: 'slideInUp', text: "slideInUp" },
                                        { key: 'slideOutDown', text: "slideOutDown" },
                                        { key: 'slideOutLeft', text: "slideOutLeft" },
                                        { key: 'slideOutRight', text: "slideOutRight" },
                                        { key: 'slideOutUp', text: "slideOutUp" }
                                    ]
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('duration', {
                                    label: strings.Duration,
                                    min: 0,
                                    max: 5000,
                                    step: 100
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
                                    key: 'textRotatorAlignField'
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
                                    key: 'textRotatorFontField'
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
                                    key: 'textRotatorFontSizeField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('fontColor', {
                                    label: strings.FontColor,
                                    initialColor: this.properties.fontColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'textRotatorFontColorField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('backgroundColor', {
                                    label: strings.BackgroundColor,
                                    initialColor: this.properties.backgroundColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'textRotatorBgColorField'
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return TextRotatorWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = TextRotatorWebPart;

//# sourceMappingURL=TextRotatorWebPart.js.map
