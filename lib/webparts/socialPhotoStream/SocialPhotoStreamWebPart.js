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
 * Social Photo Stream Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("SocialPhotoStreamStrings");
var PropertyFieldDimensionPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldDimensionPicker");
var $ = require("jquery");
require('socialStream');
var SocialPhotoStreamWebPart = (function (_super) {
    __extends(SocialPhotoStreamWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function SocialPhotoStreamWebPart(context) {
        var _this = _super.call(this) || this;
        _this.guid = _this.getGuid();
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(SocialPhotoStreamWebPart.prototype, "dataVersion", {
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
    SocialPhotoStreamWebPart.prototype.render = function () {
        var html = ''; //
        html += "\n<style>\n.socialstream {\n  width: 100%;\n  margin: 0 auto;\n  display: block;\n  padding: 0px;\n  display: table;\n}\n\n.socialstream li {\n  width: " + this.properties.dimension.width + ";\n  height: " + this.properties.dimension.height + ";\n  list-style: none;\n  float: left;\n  margin-right: " + this.properties.spacing + "px;\n  margin-bottom: " + this.properties.spacing + "px;\n}\n\n.socialstream li img {\n  width: " + this.properties.dimension.width + ";\n  height: " + this.properties.dimension.height + ";\n}\n</style>\n    ";
        html += '<div id="' + this.guid + '" class="socialstream"></div>';
        this.domElement.innerHTML = html;
        $('#' + this.guid).socialstream({
            socialnetwork: this.properties.network,
            limit: this.properties.limit,
            username: this.properties.userName,
            overlay: this.properties.overlay,
            accessToken: this.properties.accessKey,
            apikey: false
        });
    };
    /**
     * @function
     * Generates a GUID
     */
    SocialPhotoStreamWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    SocialPhotoStreamWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    SocialPhotoStreamWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                sp_webpart_base_1.PropertyPaneDropdown('network', {
                                    label: strings.network,
                                    options: [
                                        { key: 'pinterest', text: 'Pinterest' },
                                        { key: 'instagram', text: 'Instagram' },
                                        { key: 'flickr', text: 'Flickr' },
                                        { key: 'picasa', text: 'Picasa' },
                                        { key: 'deviantart', text: 'Deviantart' },
                                        { key: 'dribbble', text: 'Dribbble' }
                                    ]
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('userName', {
                                    label: strings.userName
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('accessKey', {
                                    label: strings.accessKey
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('limit', {
                                    label: strings.limit,
                                    min: 1,
                                    max: 100,
                                    step: 1
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('overlay', {
                                    label: strings.overlay
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
                                    key: 'socialPhotoStreamDimensionFieldId'
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('spacing', {
                                    label: strings.spacing,
                                    min: 0,
                                    max: 30,
                                    step: 1
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return SocialPhotoStreamWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = SocialPhotoStreamWebPart;

//# sourceMappingURL=SocialPhotoStreamWebPart.js.map
