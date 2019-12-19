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
 * Image Color Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("ImageColorStrings");
//Imports property pane custom fields
var PropertyFieldPicturePicker_1 = require("sp-client-custom-fields/lib/PropertyFieldPicturePicker");
var ImageColorWebPart = (function (_super) {
    __extends(ImageColorWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function ImageColorWebPart(context) {
        var _this = _super.call(this) || this;
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(ImageColorWebPart.prototype, "dataVersion", {
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
    ImageColorWebPart.prototype.render = function () {
        if (this.properties.image == null || this.properties.image == '') {
            var error = "\n        <div class=\"ms-MessageBar\">\n          <div class=\"ms-MessageBar-content\">\n            <div class=\"ms-MessageBar-icon\">\n              <i class=\"ms-Icon ms-Icon--Info\"></i>\n            </div>\n            <div class=\"ms-MessageBar-text\">\n              " + strings.ErrorSelectImage + "\n            </div>\n          </div>\n        </div>\n      ";
            this.domElement.innerHTML = error;
            return;
        }
        var html = '';
        html += "\n    <style>\n[class^=\"blend\"] img {\n  mix-blend-mode: luminosity;\n}\n[class^=\"blend\"]:before {\n  position: absolute;\n  z-index: 3;\n  background: rgba(0, 0, 0, 0.4);\n  color: #fff;\n  padding: 0.2em;\n  font-size: 14px;\n}\n[class^=\"blend\"]:after {\n  display: block;\n  content: '';\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  -webkit-filter: contrast(1.3);\n  filter: contrast(1.3);\n  mix-blend-mode: hue;\n}\n[class^=\"blend\"][class*=\"-dark\"] img {\n  mix-blend-mode: darken;\n}\n[class^=\"blend\"][class*=\"-dark\"]:after {\n  mix-blend-mode: lighten !important;\n}\n[class^=\"blend\"][class*=\"-light\"] img {\n  mix-blend-mode: lighten;\n}\n[class^=\"blend\"][class*=\"-light\"]:after {\n  mix-blend-mode: darken !important;\n}\n[class^=\"blend\"][class*=\"-red\"] {\n  background: #E50914;\n}\n[class^=\"blend\"][class*=\"-red\"]:after {\n  mix-blend-mode: hard-light;\n  -webkit-filter: contrast(0.6) saturate(120%) brightness(1.2);\n  filter: contrast(0.6) saturate(120%) brightness(1.2);\n}\n[class^=\"blend\"][class*=\"-red\"][class*=\"-dark\"]:after {\n  mix-blend-mode: lighten !important;\n  -webkit-filter: contrast(1.1) !important;\n  filter: contrast(1.1) !important;\n}\n[class^=\"blend\"][class*=\"-red\"][class*=\"-light\"]:after {\n  mix-blend-mode: color-dodge !important;\n  -webkit-filter: saturate(400%) contrast(1.5);\n  filter: saturate(400%) contrast(1.5);\n}\n[class^=\"blend\"][class*=\"-red\"]:after {\n  background: #E50914;\n}\n[class^=\"blend\"][class*=\"-red\"]:after {\n  background: #282581;\n}\n[class^=\"blend\"][class*=\"-orange\"] {\n  background: #FCA300;\n}\n[class^=\"blend\"][class*=\"-orange\"][class*=\"-dark\"]:after {\n  mix-blend-mode: darken !important;\n}\n[class^=\"blend\"][class*=\"-orange\"][class*=\"-light\"]:after {\n  mix-blend-mode: hue !important;\n  -webkit-filter: saturate(400%) contrast(1.5);\n  filter: saturate(400%) contrast(1.5);\n}\n[class^=\"blend\"][class*=\"-orange\"]:after {\n  background: #FCA300;\n}\n[class^=\"blend\"][class*=\"-blue\"] {\n  background: #0066BF;\n}\n[class^=\"blend\"][class*=\"-blue\"]:not([class*=\"-dark\"]):not([class*=\"-light\"]):after {\n  mix-blend-mode: hard-light;\n  -webkit-filter: brightness(0.6);\n  filter: brightness(0.6);\n}\n[class^=\"blend\"][class*=\"-blue\"][class*=\"-dark\"]:after {\n  mix-blend-mode: darken !important;\n}\n[class^=\"blend\"][class*=\"-blue\"]:after {\n  background: #0066BF;\n}\n[class^=\"blend\"][class*=\"-blue\"]:after {\n  background: #93EF90;\n}\n[class^=\"blend\"][class*=\"-yellow\"] {\n  background: #FEDD31;\n}\n[class^=\"blend\"][class*=\"-yellow\"]:not([class*=\"-dark\"]):not([class*=\"-light\"]):after {\n  -webkit-filter: brightness(3.5);\n  filter: brightness(3.5);\n  mix-blend-mode: soft-light;\n}\n[class^=\"blend\"][class*=\"-yellow\"][class*=\"-dark\"]:after {\n  mix-blend-mode: color-dodge !important;\n  -webkit-filter: hue-rotate(70deg);\n  filter: hue-rotate(70deg);\n}\n[class^=\"blend\"][class*=\"-yellow\"][class*=\"-light\"] {\n  background: #000000;\n}\n[class^=\"blend\"][class*=\"-yellow\"][class*=\"-light\"]:after {\n  mix-blend-mode: color !important;\n  -webkit-filter: brightness(3) hue-rotate(93deg) contrast(2) saturate(150);\n  filter: brightness(3) hue-rotate(93deg) contrast(2) saturate(150);\n}\n[class^=\"blend\"][class*=\"-yellow\"]:after {\n  background: #FEDD31;\n}\n[class^=\"blend\"][class*=\"-yellow\"]:after {\n  background: #EF3CB4;\n}\n[class^=\"blend\"][class*=\"-purple\"] {\n  background: #BC6D14;\n}\n[class^=\"blend\"][class*=\"-purple\"]:not([class*=\"-dark\"]):not([class*=\"-light\"]) {\n  background: rebeccapurple;\n}\n[class^=\"blend\"][class*=\"-purple\"]:not([class*=\"-dark\"]):not([class*=\"-light\"]):after {\n  mix-blend-mode: darken !important;\n}\n[class^=\"blend\"][class*=\"-purple\"][class*=\"-dark\"] {\n  background: #B10AFF;\n}\n[class^=\"blend\"][class*=\"-purple\"][class*=\"-dark\"]:after {\n  mix-blend-mode: soft-light !important;\n  -webkit-filter: saturate(100);\n  filter: saturate(100);\n}\n[class^=\"blend\"][class*=\"-purple\"][class*=\"-light\"]:after {\n  background: #A37FC7;\n  -webkit-filter: saturate(520%) brightness(10.5) contrast(350) !important;\n  filter: saturate(520%) brightness(10.5) contrast(350) !important;\n}\n[class^=\"blend\"][class*=\"-purple\"]:after {\n  background: #BC6D14;\n}\n[class^=\"blend\"][class*=\"-purple\"]:after {\n  background: #ACFCEE;\n}\n[class^=\"blend\"][class*=\"-green\"] {\n  background: #11C966;\n}\n[class^=\"blend\"][class*=\"-green\"]:not([class*=\"-dark\"]):not([class*=\"-light\"]):after {\n  mix-blend-mode: soft-light;\n}\n[class^=\"blend\"][class*=\"-green\"][class*=\"-light\"]:after {\n  mix-blend-mode: color-dodge !important;\n  -webkit-filter: saturate(100%) brightness(0.8) contrast(160%);\n  filter: saturate(100%) brightness(0.8) contrast(160%);\n}\n[class^=\"blend\"][class*=\"-green\"]:after {\n  background: #11C966;\n}\n[class^=\"blend\"][class*=\"-green\"]:after {\n  background: #2D3181;\n}\n[class^=\"blend\"][class*=\"-pink\"] {\n  background: #EA4C89;\n}\n[class^=\"blend\"][class*=\"-pink\"][class*=\"-dark\"]:after {\n  background: #1D0E14;\n}\n[class^=\"blend\"][class*=\"-pink\"][class*=\"-light\"]:after {\n  background: #FF468D;\n  mix-blend-mode: lighten !important;\n  -webkit-filter: contrast(1) saturate(250%) !important;\n  filter: contrast(1) saturate(250%) !important;\n}\n[class^=\"blend\"][class*=\"-pink\"]:after {\n  background: #EA4C89;\n}\n[class^=\"blend\"][class*=\"-pink\"]:after {\n  background: #EA4C89;\n}\n[class^=\"blend\"][class*=\"-blue-yellow\"]:not([class*=\"-dark\"]):not([class*=\"-light\"]) {\n  background: linear-gradient(to top left, #55ACEE, #FEDD31);\n}\n[class^=\"blend\"][class*=\"-blue-yellow\"][class*=\"-dark\"]:after {\n  mix-blend-mode: hard-light !important;\n}\n[class^=\"blend\"][class*=\"-blue-yellow\"][class*=\"-light\"]:after {\n  mix-blend-mode: hard-light !important;\n  -webkit-filter: none;\n  filter: none;\n}\n[class^=\"blend\"][class*=\"-blue-yellow\"]:after {\n  background: linear-gradient(to top left, #55ACEE, #FEDD31) !important;\n}\n[class^=\"blend\"][class*=\"-pink-yellow\"]:not([class*=\"-dark\"]):not([class*=\"-light\"]) {\n  background: linear-gradient(to bottom right, #FAA6FB, #FBBC05) !important;\n}\n[class^=\"blend\"][class*=\"-pink-yellow\"][class*=\"-dark\"]:after {\n  mix-blend-mode: hue !important;\n  -webkit-filter: none !important;\n  filter: none !important;\n}\n[class^=\"blend\"][class*=\"-pink-yellow\"][class*=\"-light\"]:after {\n  mix-blend-mode: hard-light !important;\n  -webkit-filter: none !important;\n  filter: none !important;\n}\n[class^=\"blend\"][class*=\"-pink-yellow\"]:after {\n  background: linear-gradient(to top left, #FAA6FB, #FBBC05) !important;\n}\n[class^=\"blend\"][class*=\"-red-blue\"]:not([class*=\"-dark\"]):not([class*=\"-light\"]) {\n  background: linear-gradient(to bottom right, #3993E2, #E2544B);\n}\n[class^=\"blend\"][class*=\"-red-blue\"]:not([class*=\"-dark\"]):not([class*=\"-light\"]):after {\n  -webkit-filter: none;\n  filter: none;\n  mix-blend-mode: hard-light;\n}\n[class^=\"blend\"][class*=\"-red-blue\"][class*=\"-dark\"]:after {\n  mix-blend-mode: hard-light !important;\n  -webkit-filter: none !important;\n  filter: none !important;\n}\n[class^=\"blend\"][class*=\"-red-blue\"][class*=\"-light\"]:after {\n  mix-blend-mode: screen !important;\n  -webkit-filter: saturate(300%) brightness(1.2) !important;\n  filter: saturate(300%) brightness(1.2) !important;\n}\n[class^=\"blend\"][class*=\"-red-blue\"]:after {\n  background: linear-gradient(to bottom right, #3993E2, #E2544B);\n}\n    </style>\n    ";
        var fColor = this.properties.color;
        if (fColor == null)
            fColor = '';
        var fAlt = this.properties.alt;
        if (fAlt == null)
            fAlt = '';
        var fLinkText = this.properties.linkText;
        if (fLinkText == null)
            fLinkText = '';
        if (this.properties.linkUrl != null && this.properties.linkUrl != '')
            html += '<a href="' + this.properties.linkUrl + '" alt="' + fLinkText + '">';
        html += '<div><div class="' + fColor + '">';
        html += '<img src="' + this.properties.image + '" style="width: 100%" alt="' + fAlt + '" title="' + fAlt + '"/>';
        html += '</div></div>';
        if (this.properties.linkUrl != null && this.properties.linkUrl != '')
            html += '</a>';
        this.domElement.innerHTML = html;
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    ImageColorWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                PropertyFieldPicturePicker_1.PropertyFieldPicturePicker('image', {
                                    label: strings.Image,
                                    initialValue: this.properties.image,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    context: this.context,
                                    properties: this.properties,
                                    key: "imageColorPictureField"
                                }),
                                sp_webpart_base_1.PropertyPaneDropdown('color', {
                                    label: strings.Color,
                                    options: [
                                        { key: 'blend-blue', text: 'blend-blue' },
                                        { key: 'blend-blue-dark', text: 'blend-blue-dark' },
                                        { key: 'blend-blue-light', text: 'blend-blue-light' },
                                        { key: 'blend-orange', text: 'blend-orange' },
                                        { key: 'blend-orange-dark', text: 'blend-orange-dark' },
                                        { key: 'blend-orange-light', text: 'blend-orange-light' },
                                        { key: 'blend-red', text: 'blend-red' },
                                        { key: 'blend-red-dark', text: 'blend-red-dark' },
                                        { key: 'blend-red-light', text: 'blend-red-light' },
                                        { key: 'blend-green', text: 'blend-green' },
                                        { key: 'blend-green-dark', text: 'blend-green-dark' },
                                        { key: 'blend-green-light', text: 'blend-green-light' },
                                        { key: 'blend-yellow', text: 'blend-yellow' },
                                        { key: 'blend-yellow-dark', text: 'blend-yellow-dark' },
                                        { key: 'blend-yellow-light', text: 'blend-yellow-light' },
                                        { key: 'blend-purple', text: 'blend-purple' },
                                        { key: 'blend-purple-dark', text: 'blend-purple-dark' },
                                        { key: 'blend-purple-light', text: 'blend-purple-light' },
                                        { key: 'blend-pink', text: 'blend-pink' },
                                        { key: 'blend-pink-dark', text: 'blend-pink-dark' },
                                        { key: 'blend-pink-light', text: 'blend-pink-light' },
                                        { key: 'blend-blue-yellow', text: 'blend-blue-yellow' },
                                        { key: 'blend-blue-yellow-dark', text: 'blend-blue-yellow-dark' },
                                        { key: 'blend-blue-yellow-light', text: 'blend-blue-yellow-light' },
                                        { key: 'blend-pink-yellow', text: 'blend-pink-yellow' },
                                        { key: 'blend-pink-yellow-dark', text: 'blend-pink-yellow-dark' },
                                        { key: 'blend-pink-yellow-light', text: 'blend-pink-yellow-light' },
                                        { key: 'blend-red-blue', text: 'blend-red-blue-dark' },
                                        { key: 'blend-red-blue-dark', text: 'blend-red-blue-dark' },
                                        { key: 'blend-red-blue-light', text: 'blend-red-blue-light' }
                                    ]
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('alt', {
                                    label: strings.Alt
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('linkText', {
                                    label: strings.LinkText
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('linkUrl', {
                                    label: strings.LinkUrl
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return ImageColorWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = ImageColorWebPart;

//# sourceMappingURL=ImageColorWebPart.js.map
