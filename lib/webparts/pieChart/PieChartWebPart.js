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
 * Pie Chart Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("PieChartStrings");
//Imports property pane custom fields
var PropertyFieldCustomList_1 = require("sp-client-custom-fields/lib/PropertyFieldCustomList");
var PropertyFieldColorPickerMini_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPickerMini");
var PropertyFieldFontPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontPicker");
var PropertyFieldFontSizePicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontSizePicker");
var PropertyFieldDimensionPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldDimensionPicker");
var Chart = require('chartjs');
var PieChartWebPart = (function (_super) {
    __extends(PieChartWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function PieChartWebPart(context) {
        var _this = _super.call(this) || this;
        _this.guid = _this.getGuid();
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(PieChartWebPart.prototype, "dataVersion", {
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
    PieChartWebPart.prototype.getDataTab = function (property) {
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
    PieChartWebPart.prototype.render = function () {
        var html = '<canvas id="' + this.guid + '" width="' + this.properties.dimension.width + '" height="' + this.properties.dimension.height + '"></canvas>';
        this.domElement.innerHTML = html;
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
        var options = {
            responsive: this.properties.responsive != null ? this.properties.responsive : false,
            cutoutPercentage: this.properties.cutoutPercentage != null ? this.properties.cutoutPercentage : 0,
            animation: {
                animateRotate: this.properties.animateRotate,
                animateScale: this.properties.animateScale
            },
            title: {
                display: this.properties.titleEnable,
                text: this.properties.title,
                position: this.properties.position,
                fontFamily: this.properties.titleFont != null ? this.properties.titleFont : "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                fontSize: this.properties.titleSize != null ? Number(this.properties.titleSize.replace("px", "")) : 12,
                fontColor: this.properties.titleColor != null ? this.properties.titleColor : "#666"
            },
            legend: {
                display: this.properties.legendEnable,
                position: this.properties.legendPosition != null ? this.properties.legendPosition : 'top',
                labels: {
                    fontColor: this.properties.legendColor != null ? this.properties.legendColor : "#666",
                    fontFamily: this.properties.legendFont != null ? this.properties.legendFont : "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    fontSize: this.properties.legendSize != null ? Number(this.properties.legendSize.replace("px", "")) : 12
                }
            }
        };
        var ctx = document.getElementById(this.guid);
        new Chart(ctx, {
            type: 'pie',
            data: data,
            options: options
        });
    };
    /**
     * @function
     * Generates a GUID
     */
    PieChartWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    PieChartWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    PieChartWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                        { id: 'Color', title: "Color", required: true, type: PropertyFieldCustomList_1.CustomListFieldType.color },
                                        { id: 'Hover Color', title: "Hover Color", required: true, type: PropertyFieldCustomList_1.CustomListFieldType.color }
                                    ],
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    context: this.context,
                                    properties: this.properties,
                                    key: 'pieChartListField'
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
                                    key: 'pieChartDimensionFieldId'
                                })
                            ]
                        },
                        {
                            groupName: strings.OptionsGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneSlider('cutoutPercentage', {
                                    label: strings.CutoutPercentage,
                                    min: 0,
                                    max: 99,
                                    step: 1
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('animateRotate', {
                                    label: strings.AnimateRotate
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('animateScale', {
                                    label: strings.AnimateScale
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
                                    key: 'pieChartTitleFontField'
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
                                    key: 'pieChartTitleSizeField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('titleColor', {
                                    label: strings.TitleColor,
                                    initialColor: this.properties.titleColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'pieChartTitleColorField'
                                })
                            ]
                        },
                        {
                            groupName: strings.LegendGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneToggle('legendEnable', {
                                    label: strings.LegendEnable
                                }),
                                sp_webpart_base_1.PropertyPaneDropdown('legendPosition', {
                                    label: strings.LegendPosition,
                                    options: [
                                        { key: 'top', text: 'top' },
                                        { key: 'left', text: 'left' },
                                        { key: 'bottom', text: 'bottom' },
                                        { key: 'right', text: 'right' }
                                    ]
                                }),
                                PropertyFieldFontPicker_1.PropertyFieldFontPicker('legendFont', {
                                    label: strings.LegendFont,
                                    useSafeFont: true,
                                    previewFonts: true,
                                    initialValue: this.properties.legendFont,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'pieChartLegendFontField'
                                }),
                                PropertyFieldFontSizePicker_1.PropertyFieldFontSizePicker('legendSize', {
                                    label: strings.LegendSize,
                                    usePixels: true,
                                    preview: true,
                                    initialValue: this.properties.legendSize,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'pieChartLegendSizeField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('legendColor', {
                                    label: strings.LegendColor,
                                    initialColor: this.properties.legendColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'pieChartLegendColorField'
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return PieChartWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = PieChartWebPart;

//# sourceMappingURL=PieChartWebPart.js.map
