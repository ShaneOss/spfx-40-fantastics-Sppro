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
 * Bing Translator Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("BingTranslatorStrings");
var sp_loader_1 = require("@microsoft/sp-loader");
//Imports property pane custom fields
var PropertyFieldColorPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPicker");
var BingTranslatorWebPart = (function (_super) {
    __extends(BingTranslatorWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function BingTranslatorWebPart(context) {
        var _this = _super.call(this) || this;
        _this.guid = _this.getGuid();
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(BingTranslatorWebPart.prototype, "dataVersion", {
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
    BingTranslatorWebPart.prototype.render = function () {
        //Define the main DIV container
        var html = "\n    <div id='MicrosoftTranslatorWidget' class='" + this.properties.theme + "' style='color:" + this.properties.color + ";background-color:" + this.properties.backgroundColor + "'></div>\n    ";
        this.domElement.innerHTML = html;
        //Loads the microsoft translator JavaScript from CDN
        sp_loader_1.SPComponentLoader.loadScript('//www.microsofttranslator.com/ajax/v3/WidgetV3.ashx?siteData=ueOIGRSKkd965FeEGM5JtQ**&ctf=False&ui=true&settings=' + this.properties.start + '&from=' + this.properties.language, { globalExportsName: 'bingtranslator' }).then(function () {
        });
    };
    /**
     * @function
     * Generates a GUID
     */
    BingTranslatorWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    BingTranslatorWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    BingTranslatorWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                sp_webpart_base_1.PropertyPaneDropdown('theme', {
                                    label: strings.theme,
                                    options: [
                                        { key: 'Dark', text: 'Dark' },
                                        { key: 'Light', text: 'Light' }
                                    ]
                                }),
                                sp_webpart_base_1.PropertyPaneDropdown('start', {
                                    label: strings.start,
                                    options: [
                                        { key: 'Manual', text: 'Manual' },
                                        { key: 'Auto', text: 'Auto' }
                                    ]
                                }),
                                sp_webpart_base_1.PropertyPaneDropdown('language', {
                                    label: strings.language,
                                    options: [
                                        { key: '', text: 'Auto Detect' },
                                        { key: 'af', text: 'Afrikaans' },
                                        { key: 'ar', text: 'Arabic' },
                                        { key: 'bs-Latn', text: 'Bosnian (latin)' },
                                        { key: 'bg', text: 'Bulgarian' },
                                        { key: 'ca', text: 'Catalan' },
                                        { key: 'zh-CHS', text: 'Simplified Chinese' },
                                        { key: 'zh-CHT', text: 'Traditional Chinese' },
                                        { key: 'yue', text: 'Cantonese (traditional)' },
                                        { key: 'hr', text: 'Croatian' },
                                        { key: 'cs', text: 'Czech' },
                                        { key: 'da', text: 'Danish' },
                                        { key: 'nl', text: 'Dutch' },
                                        { key: 'en', text: 'English' },
                                        { key: 'et', text: 'Estonian' },
                                        { key: 'fj', text: 'Fijian' },
                                        { key: 'fil', text: 'Filipino' },
                                        { key: 'fi', text: 'Finnish' },
                                        { key: 'fr', text: 'French' },
                                        { key: 'de', text: 'German' },
                                        { key: 'el', text: 'Greek' },
                                        { key: 'ht', text: 'Haitian' },
                                        { key: 'he', text: 'Hebrew' },
                                        { key: 'hi', text: 'Hindi' },
                                        { key: 'mww', text: 'Hmong daw' },
                                        { key: 'hu', text: 'Hungarian' },
                                        { key: 'id', text: 'Indonesian' },
                                        { key: 'it', text: 'Italian' },
                                        { key: 'ja', text: 'Japanese' },
                                        { key: 'sw', text: 'Swahili' },
                                        { key: 'tlh', text: 'Klingon' },
                                        { key: 'ko', text: 'Korean' },
                                        { key: 'lv', text: 'Latvian' },
                                        { key: 'lt', text: 'Lithuanian' },
                                        { key: 'mg', text: 'Malagasy' },
                                        { key: 'ms', text: 'Malay' },
                                        { key: 'mt', text: 'Maltese' },
                                        { key: 'yua', text: 'Yucatec Maya' },
                                        { key: 'no', text: 'Norvegian' },
                                        { key: 'otq', text: 'Querétaro Otomi' },
                                        { key: 'fa', text: 'Perse ' },
                                        { key: 'pl', text: 'Polish' },
                                        { key: 'pt', text: 'Portuguese' },
                                        { key: 'ro', text: 'Romanian' },
                                        { key: 'ru', text: 'Russian' },
                                        { key: 'sm', text: 'Samoan' },
                                        { key: 'sr-Cyrl', text: 'Serbian (Cyrillic)' },
                                        { key: 'sr-Latn', text: 'Serbian (latin)' },
                                        { key: 'sk', text: 'Slovak' },
                                        { key: 'sl', text: 'Slovenian' },
                                        { key: 'es', text: 'Spanish' },
                                        { key: 'sv', text: 'Swedish' },
                                        { key: 'ty', text: 'Tahitian' },
                                        { key: 'th', text: 'Thai' },
                                        { key: 'to', text: 'Tongan' },
                                        { key: 'tr', text: 'Turkish' },
                                        { key: 'uk', text: 'Ukrainian' },
                                        { key: 'ur', text: 'Urdu' },
                                        { key: 'vi', text: 'Vietnamese' },
                                        { key: 'cy', text: 'Welsh' }
                                    ]
                                }),
                                PropertyFieldColorPicker_1.PropertyFieldColorPicker('color', {
                                    label: strings.color,
                                    initialColor: this.properties.color,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "bingTranslatorColorField"
                                }),
                                PropertyFieldColorPicker_1.PropertyFieldColorPicker('backgroundColor', {
                                    label: strings.backgroundColor,
                                    initialColor: this.properties.backgroundColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "bingTranslatorBgColorField"
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return BingTranslatorWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = BingTranslatorWebPart;

//# sourceMappingURL=BingTranslatorWebPart.js.map
