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
 * Audio Equalizer Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("AudioEqualizerStrings");
//Imports the property pane custom fields
var PropertyFieldColorPickerMini_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPickerMini");
var PropertyFieldDimensionPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldDimensionPicker");
//Loads JQuery, Reverseorder & equalizer JavaScript libs
var $ = require("jquery");
require('reverseorder');
require('equalizer');
/**
 * @class
 * Audio Equalizer Web Part
 */
var AudioEqualizerWebPart = (function (_super) {
    __extends(AudioEqualizerWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function AudioEqualizerWebPart(context) {
        var _this = _super.call(this) || this;
        _this.guid = _this.getGuid();
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(AudioEqualizerWebPart.prototype, "dataVersion", {
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
    AudioEqualizerWebPart.prototype.render = function () {
        //Defines the output HTML code width HTML5 audio player & CSS styles
        var html = "\n    <div class=\"" + this.guid + " equalizer\"></div>\n    <audio controls loop id=\"" + this.guid + "\">\n        <source src=\"" + this.properties.audio + "\" type='" + this.properties.audioType + "'>\n    </audio>\n    <style>\n.equalizer\n{\n\tposition: relative;\n\tmargin:0 auto;\n\tmargin-top: 40px;\n\tfloat:left;\n}\n.equalizer_bar\n{\n\tfloat: left;\n}\n.equalizer_bar_component\n{\n\tfloat: left;\n\twidth: 100%;\n}\n    </style>\n    ";
        this.domElement.innerHTML = html;
        var width = Number(this.properties.dimension.width.replace("px", "").replace("%", ""));
        var height = Number(this.properties.dimension.height.replace("px", "").replace("%", ""));
        //Calls the Equalizer JavaScript plugin init method
        $('#' + this.guid).equalizer({
            width: width,
            height: height,
            color: this.properties.color,
            color1: this.properties.color1,
            color2: this.properties.color2,
            bars: this.properties.bars,
            barMargin: this.properties.barMargin,
            components: this.properties.components,
            componentMargin: this.properties.componentMargin,
            frequency: this.properties.frequency,
            refreshTime: this.properties.refreshTime // refresh time of animation - default is 100
        });
    };
    /**
     * @function
     * Generates a GUID
     */
    AudioEqualizerWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    AudioEqualizerWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    AudioEqualizerWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    displayGroupsAsAccordion: false,
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneTextField('audio', {
                                    label: strings.audio
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('audioType', {
                                    label: strings.audioType
                                }),
                                PropertyFieldDimensionPicker_1.PropertyFieldDimensionPicker('dimension', {
                                    label: strings.dimension,
                                    initialValue: this.properties.dimension,
                                    preserveRatio: true,
                                    preserveRatioEnabled: true,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    disabled: false,
                                    onGetErrorMessage: null,
                                    deferredValidationTime: 0,
                                    key: 'audioEqualizerDimensionFieldId'
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('bars', {
                                    label: strings.bars,
                                    min: 1,
                                    max: 40,
                                    step: 1
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('barMargin', {
                                    label: strings.barMargin,
                                    min: 1,
                                    max: 10,
                                    step: 0.5
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('components', {
                                    label: strings.components,
                                    min: 1,
                                    max: 20,
                                    step: 1
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('componentMargin', {
                                    label: strings.componentMargin,
                                    min: 1,
                                    max: 10,
                                    step: 0.5
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('frequency', {
                                    label: strings.frequency,
                                    min: 0,
                                    max: 20,
                                    step: 1
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('refreshTime', {
                                    label: strings.refreshTime,
                                    min: 1,
                                    max: 1000,
                                    step: 10
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('color', {
                                    label: strings.color,
                                    initialColor: this.properties.color,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "audioEqualizerColorField"
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('color1', {
                                    label: strings.color1,
                                    initialColor: this.properties.color1,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "audioEqualizerColor1Field"
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('color2', {
                                    label: strings.color2,
                                    initialColor: this.properties.color2,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "audioEqualizerColor2Field"
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return AudioEqualizerWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = AudioEqualizerWebPart;

//# sourceMappingURL=AudioEqualizerWebPart.js.map
