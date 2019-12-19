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
 * Radar Chart Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("RadarChartStrings");
//Imports property pane custom fields
var PropertyFieldCustomList_1 = require("sp-client-custom-fields/lib/PropertyFieldCustomList");
var PropertyFieldColorPickerMini_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPickerMini");
var PropertyFieldFontPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontPicker");
var PropertyFieldFontSizePicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontSizePicker");
var PropertyFieldDimensionPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldDimensionPicker");
var Chart = require('chartjs');
var RadarChartWebPart = (function (_super) {
    __extends(RadarChartWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function RadarChartWebPart(context) {
        var _this = _super.call(this) || this;
        _this.guid = _this.getGuid();
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(RadarChartWebPart.prototype, "dataVersion", {
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
    RadarChartWebPart.prototype.getDataTab = function (property) {
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
    RadarChartWebPart.prototype.render = function () {
        var html = '<canvas id="' + this.guid + '" width="' + this.properties.dimension.width + '" height="' + this.properties.dimension.height + '"></canvas>';
        this.domElement.innerHTML = html;
        var data = {
            labels: this.getDataTab("Label"),
            datasets: [
                {
                    data: this.getDataTab("Value"),
                    backgroundColor: this.properties.fillColor,
                    pointStyle: this.properties.pointStyle,
                    fill: this.properties.fill,
                    lineTension: this.properties.lineTension,
                    showLine: this.properties.showLine,
                    pointRadius: 2,
                    steppedLine: this.properties.steppedLine
                }
            ]
        };
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
        var ctx = document.getElementById(this.guid);
        new Chart(ctx, {
            type: 'radar',
            data: data,
            options: options
        });
    };
    /**
     * @function
     * Generates a GUID
     */
    RadarChartWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    RadarChartWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    RadarChartWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                        { id: 'Value', title: "Value", required: true, type: PropertyFieldCustomList_1.CustomListFieldType.number }
                                    ],
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    context: this.context,
                                    properties: this.properties,
                                    key: 'radarChartListField'
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
                                    key: 'radarChartDimensionFieldId'
                                })
                            ]
                        },
                        {
                            groupName: strings.OptionsGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneToggle('fill', {
                                    label: strings.Fill
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('xAxesEnable', {
                                    label: strings.XAxesEnable
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('yAxesEnable', {
                                    label: strings.YAxesEnable
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('lineTension', {
                                    label: strings.LineTension,
                                    min: 0,
                                    max: 0.5,
                                    step: 0.05
                                }),
                                sp_webpart_base_1.PropertyPaneDropdown('pointStyle', {
                                    label: strings.PointStyle,
                                    options: [
                                        { key: 'circle', text: 'circle' },
                                        { key: 'triangle', text: 'triangle' },
                                        { key: 'rect', text: 'rect' },
                                        { key: 'rectRot', text: 'rectRot' },
                                        { key: 'cross', text: 'cross' },
                                        { key: 'crossRot', text: 'crossRot' },
                                        { key: 'star', text: 'star' },
                                        { key: 'line', text: 'line' },
                                        { key: 'dash', text: 'dash' }
                                    ]
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('fillColor', {
                                    label: strings.FillColor,
                                    initialColor: this.properties.fillColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'radarChartFillColorField'
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
                                    key: 'radarChartTitleFontField'
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
                                    key: 'radarChartTitleSizeField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('titleColor', {
                                    label: strings.TitleColor,
                                    initialColor: this.properties.titleColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'radarChartTitleColorField'
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return RadarChartWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = RadarChartWebPart;

//# sourceMappingURL=RadarChartWebPart.js.map
