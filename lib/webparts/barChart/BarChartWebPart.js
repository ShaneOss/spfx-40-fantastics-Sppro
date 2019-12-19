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
 * Bar Chart Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("BarChartStrings");
//Imports the property pane custom fields
var PropertyFieldCustomList_1 = require("sp-client-custom-fields/lib/PropertyFieldCustomList");
var PropertyFieldColorPickerMini_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPickerMini");
var PropertyFieldFontPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontPicker");
var PropertyFieldFontSizePicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontSizePicker");
var PropertyFieldDimensionPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldDimensionPicker");
var Chart = require('chartjs');
/**
 * @class
 * Bar Chart Web Part
 */
var BarChartWebPart = (function (_super) {
    __extends(BarChartWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function BarChartWebPart(context) {
        var _this = _super.call(this) || this;
        _this.guid = _this.getGuid();
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(BarChartWebPart.prototype, "dataVersion", {
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
     * Transforms the item collection in a flat string collection of property for the Chart.js call
     */
    BarChartWebPart.prototype.getDataTab = function (property) {
        var res = [];
        this.properties.items.map(function (item) {
            res.push(item[property]);
        });
        return res;
    };
    /**
     * @function
     * Renders HTML code
     */
    BarChartWebPart.prototype.render = function () {
        //Create the unique main canvas container
        var html = '<canvas id="' + this.guid + '" width="' + this.properties.dimension.width + '" height="' + this.properties.dimension.height + '"></canvas>';
        this.domElement.innerHTML = html;
        //Inits the data
        var data = {
            labels: this.getDataTab("Label"),
            datasets: [
                {
                    data: this.getDataTab("Value"),
                    backgroundColor: this.getDataTab("Color"),
                    hoverBackgroundColor: this.getDataTab("Hover Color")
                }
            ]
        };
        //Inits the options
        var options = {
            responsive: this.properties.responsive != null ? this.properties.responsive : false,
            title: {
                display: this.properties.titleEnable,
                text: this.properties.title,
                position: this.properties.position,
                fontFamily: this.properties.titleFont != null ? this.properties.titleFont : "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                fontSize: this.properties.titleSize != null ? Number(this.properties.titleSize.replace("px", "")) : 12,
                fontColor: this.properties.titleColor != null ? this.properties.titleColor : "#666"
            },
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                        display: this.properties.xAxesEnable
                    }],
                yAxes: [{
                        display: this.properties.yAxesEnable
                    }]
            }
            /*
            legend: {
                display: this.properties.legendEnable,
                position: this.properties.legendPosition != null ? this.properties.legendPosition : 'top',
                labels: {
                    fontColor: this.properties.legendColor != null ? this.properties.legendColor : "#666",
                    fontFamily: this.properties.legendFont != null ? this.properties.legendFont : "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    fontSize: this.properties.legendSize != null ? Number(this.properties.legendSize.replace("px", "")) : 12
                }
            }*/
        };
        //Inits the context for the canvas html element
        var ctx = document.getElementById(this.guid);
        //Create the Chart object with data & options
        new Chart(ctx, {
            type: this.properties.horizontal === true ? 'horizontalBar' : 'bar',
            data: data,
            options: options
        });
    };
    /**
     * @function
     * Generates a GUID
     */
    BarChartWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    BarChartWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    BarChartWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                PropertyFieldCustomList_1.PropertyFieldCustomList('items', {
                                    label: strings.Items,
                                    value: this.properties.items,
                                    headerText: strings.ManageItems,
                                    fields: [
                                        { id: 'Label', title: "Label", required: true, type: PropertyFieldCustomList_1.CustomListFieldType.string },
                                        { id: 'Value', title: "Value", required: true, type: PropertyFieldCustomList_1.CustomListFieldType.number },
                                        { id: 'Color', title: "Color", required: true, type: PropertyFieldCustomList_1.CustomListFieldType.colorMini },
                                        { id: 'Hover Color', title: "Hover Color", required: true, type: PropertyFieldCustomList_1.CustomListFieldType.colorMini }
                                    ],
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    context: this.context,
                                    properties: this.properties,
                                    key: "barChartCustomListField"
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('responsive', {
                                    label: strings.Responsive,
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
                                    key: 'barChartDimensionFieldId'
                                })
                            ]
                        },
                        {
                            groupName: strings.OptionsGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneToggle('horizontal', {
                                    label: strings.Horizontal
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('xAxesEnable', {
                                    label: strings.XAxesEnable
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('yAxesEnable', {
                                    label: strings.YAxesEnable
                                })
                            ]
                        },
                        {
                            groupName: strings.TitleGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneToggle('titleEnable', {
                                    label: strings.TitleEnable
                                }),
                                sp_webpart_base_1.PropertyPaneTextField('title', {
                                    label: strings.Title
                                }),
                                sp_webpart_base_1.PropertyPaneDropdown('position', {
                                    label: strings.Position,
                                    options: [
                                        { key: 'top', text: 'top' },
                                        { key: 'left', text: 'left' },
                                        { key: 'bottom', text: 'bottom' },
                                        { key: 'right', text: 'right' }
                                    ]
                                }),
                                PropertyFieldFontPicker_1.PropertyFieldFontPicker('titleFont', {
                                    label: strings.TitleFont,
                                    useSafeFont: true,
                                    previewFonts: true,
                                    initialValue: this.properties.titleFont,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "barChartFontField"
                                }),
                                PropertyFieldFontSizePicker_1.PropertyFieldFontSizePicker('titleSize', {
                                    label: strings.TitleSize,
                                    usePixels: true,
                                    preview: true,
                                    initialValue: this.properties.titleSize,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "barChartTitleSizeField"
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('titleColor', {
                                    label: strings.TitleColor,
                                    initialColor: this.properties.titleColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "barChartTitleColorField"
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return BarChartWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = BarChartWebPart;

//# sourceMappingURL=BarChartWebPart.js.map
