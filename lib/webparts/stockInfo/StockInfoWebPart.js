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
 * Stock Info Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("StockInfoStrings");
var PropertyFieldDimensionPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldDimensionPicker");
var StockInfoWebPart = (function (_super) {
    __extends(StockInfoWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function StockInfoWebPart(context) {
        var _this = _super.call(this) || this;
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(StockInfoWebPart.prototype, "dataVersion", {
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
    StockInfoWebPart.prototype.render = function () {
        if (this.properties.stock == null || this.properties.stock == '') {
            var error = "\n        <div class=\"ms-MessageBar\">\n          <div class=\"ms-MessageBar-content\">\n            <div class=\"ms-MessageBar-icon\">\n              <i class=\"ms-Icon ms-Icon--Info\"></i>\n            </div>\n            <div class=\"ms-MessageBar-text\">\n              " + strings.ErrorSelectStock + "\n            </div>\n          </div>\n        </div>\n      ";
            this.domElement.innerHTML = error;
            return;
        }
        var width = Number(this.properties.dimension.width.replace("px", "").replace("%", ""));
        var height = Number(this.properties.dimension.height.replace("px", "").replace("%", ""));
        var html = '<img src="//chart.finance.yahoo.com/t?s=' + this.properties.stock + '&amp;lang=' + this.properties.lang + '&amp;region=' + this.properties.region + '&amp;width=' + width + '&amp;height=' + height + '" alt="" width="' + width + '" height="' + height + '">';
        this.domElement.innerHTML = html;
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    StockInfoWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                sp_webpart_base_1.PropertyPaneTextField('stock', {
                                    label: strings.Stock
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
                                    key: 'stockInfoDimensionFieldId'
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('lang', {
                                    label: strings.Lang
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('region', {
                                    label: strings.Region
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return StockInfoWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = StockInfoWebPart;

//# sourceMappingURL=StockInfoWebPart.js.map
