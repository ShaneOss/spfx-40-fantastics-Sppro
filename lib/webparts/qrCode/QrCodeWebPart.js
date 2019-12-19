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
 * QR Code Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("QrCodeStrings");
var PropertyFieldDimensionPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldDimensionPicker");
var $ = require("jquery");
require('qrcode');
var QrCodeWebPart = (function (_super) {
    __extends(QrCodeWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function QrCodeWebPart(context) {
        var _this = _super.call(this) || this;
        _this.guid = _this.getGuid();
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(QrCodeWebPart.prototype, "dataVersion", {
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
    QrCodeWebPart.prototype.render = function () {
        var html = '<div id="' + this.guid + '"></div>';
        this.domElement.innerHTML = html;
        var width = Number(this.properties.dimension.width.replace("px", "").replace("%", ""));
        var height = Number(this.properties.dimension.height.replace("px", "").replace("%", ""));
        if (this.properties.mode == "table") {
            $('#' + this.guid).qrcode({
                render: "table",
                text: this.properties.text,
                width: width,
                height: height
            });
        }
        else {
            $('#' + this.guid).qrcode({
                text: this.properties.text,
                width: width,
                height: height
            });
        }
    };
    /**
     * @function
     * Generates a GUID
     */
    QrCodeWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    QrCodeWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    QrCodeWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                sp_webpart_base_1.PropertyPaneTextField('text', {
                                    label: strings.Text
                                }),
                                PropertyFieldDimensionPicker_1.PropertyFieldDimensionPicker('dimension', {
                                    label: strings.Dimension,
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
                                    key: 'qrCodeDimensionFieldId'
                                }),
                                sp_webpart_base_1.PropertyPaneDropdown('mode', {
                                    label: strings.Mode,
                                    options: [
                                        { key: 'canvas', text: 'Canvas' },
                                        { key: 'table', text: 'Table' }
                                    ]
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return QrCodeWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = QrCodeWebPart;

//# sourceMappingURL=QrCodeWebPart.js.map
