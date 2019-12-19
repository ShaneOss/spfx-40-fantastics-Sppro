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
 * Image Puzzle Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("ImagePuzzleStrings");
//Imports property pane custom fields
var PropertyFieldPicturePicker_1 = require("sp-client-custom-fields/lib/PropertyFieldPicturePicker");
var PropertyFieldDimensionPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldDimensionPicker");
var $ = require("jquery");
require('jigsaw');
var ImagePuzzleWebPart = (function (_super) {
    __extends(ImagePuzzleWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function ImagePuzzleWebPart(context) {
        var _this = _super.call(this) || this;
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        _this.guid = _this.getGuid();
        return _this;
    }
    Object.defineProperty(ImagePuzzleWebPart.prototype, "dataVersion", {
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
    ImagePuzzleWebPart.prototype.render = function () {
        if (this.properties.image == null || this.properties.image == '') {
            var error = "\n        <div class=\"ms-MessageBar\">\n          <div class=\"ms-MessageBar-content\">\n            <div class=\"ms-MessageBar-icon\">\n              <i class=\"ms-Icon ms-Icon--Info\"></i>\n            </div>\n            <div class=\"ms-MessageBar-text\">\n              " + strings.ErrorSelectImage + "\n            </div>\n          </div>\n        </div>\n      ";
            this.domElement.innerHTML = error;
            return;
        }
        var html = '';
        if (this.properties.linkUrl != null && this.properties.linkUrl != '')
            html += '<a href="' + this.properties.linkUrl + '">';
        html += '<div id="' + this.guid + '"><img src="' + this.properties.image + '" style="width:' + this.properties.dimension.width + ';height:' + this.properties.dimension.height + '" alt="' + this.properties.alt + '" title="' + this.properties.alt + '"></div>';
        if (this.properties.linkUrl != null && this.properties.linkUrl != '')
            html += '</a>';
        this.domElement.innerHTML = html;
        $("#" + this.guid).jigsaw({
            freq: this.properties.frequence,
            x: this.properties.columns,
            y: this.properties.rows,
            margin: this.properties.margin
        });
    };
    /**
     * @function
     * Generates a GUID
     */
    ImagePuzzleWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    ImagePuzzleWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    ImagePuzzleWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                PropertyFieldPicturePicker_1.PropertyFieldPicturePicker('image', {
                                    label: strings.Image,
                                    initialValue: this.properties.image,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    context: this.context,
                                    properties: this.properties,
                                    key: "imagePuzzlePictureField"
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
                                    key: 'imagePuzzleDimensionFieldId'
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('alt', {
                                    label: strings.Alt
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('linkUrl', {
                                    label: strings.LinkUrl
                                })
                            ]
                        },
                        {
                            groupName: strings.PuzzleGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneSlider('frequence', {
                                    label: strings.Frequence,
                                    min: 0,
                                    max: 5000,
                                    step: 100
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('columns', {
                                    label: strings.Columns,
                                    min: 1,
                                    max: 20,
                                    step: 1
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('rows', {
                                    label: strings.Rows,
                                    min: 1,
                                    max: 20,
                                    step: 1
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('margin', {
                                    label: strings.Margin,
                                    min: 0,
                                    max: 50,
                                    step: 1
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return ImagePuzzleWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = ImagePuzzleWebPart;

//# sourceMappingURL=ImagePuzzleWebPart.js.map
