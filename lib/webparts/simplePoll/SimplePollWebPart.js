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
 * @file SimplePollWebPart.ts
 * Simple Poll Web part for SharePoint Framework SPFx
 *
 * @copyright 2016 Olivier Carpentier
 * Released under MIT licence
 */
var React = require("react");
var ReactDom = require("react-dom");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("SimplePollStrings");
var SimplePollWebPartHost_1 = require("./components/SimplePollWebPartHost");
//Imports property pane custom fields
var PropertyFieldColorPickerMini_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPickerMini");
var PropertyFieldFontPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontPicker");
var PropertyFieldFontSizePicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontSizePicker");
var PropertyFieldSPListPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldSPListPicker");
var SimplePollWebPart = (function (_super) {
    __extends(SimplePollWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function SimplePollWebPart(context) {
        var _this = _super.call(this) || this;
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(SimplePollWebPart.prototype, "dataVersion", {
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
    SimplePollWebPart.prototype.render = function () {
        //Constructs the react element code to JSX
        var element = React.createElement(SimplePollWebPartHost_1.default, {
            surveyList: this.properties.surveyList,
            font: this.properties.font,
            size: this.properties.size,
            color: this.properties.color,
            chartType: this.properties.chartType,
            forceVoteToViewResults: this.properties.forceVoteToViewResults,
            context: this.context
        });
        //Render the dom
        ReactDom.render(element, this.domElement);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    SimplePollWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    displayGroupsAsAccordion: true,
                    groups: [
                        {
                            groupName: strings.EffectGroupName,
                            groupFields: [
                                PropertyFieldSPListPicker_1.PropertyFieldSPListPicker('surveyList', {
                                    label: strings.surveyList,
                                    selectedList: this.properties.surveyList,
                                    includeHidden: false,
                                    baseTemplate: 102,
                                    orderBy: PropertyFieldSPListPicker_1.PropertyFieldSPListPickerOrderBy.Title,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    context: this.context,
                                    properties: this.properties,
                                    key: 'simplePollListField'
                                }),
                                sp_webpart_base_1.PropertyPaneDropdown('chartType', {
                                    label: strings.chartType,
                                    options: [
                                        { key: 'pie', text: 'Pie chart' },
                                        { key: 'horizontalBar', text: 'Bar chart' }
                                    ]
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('forceVoteToViewResults', {
                                    label: strings.forceVoteToViewResults
                                })
                            ]
                        },
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyFieldFontPicker_1.PropertyFieldFontPicker('font', {
                                    label: strings.FontFieldLabel,
                                    useSafeFont: true,
                                    previewFonts: true,
                                    initialValue: this.properties.font,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'simplePollFontField'
                                }),
                                PropertyFieldFontSizePicker_1.PropertyFieldFontSizePicker('size', {
                                    label: strings.FontSizeFieldLabel,
                                    usePixels: true,
                                    preview: true,
                                    initialValue: this.properties.size,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'simplePollSizeField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('color', {
                                    label: strings.ColorFieldLabel,
                                    initialColor: this.properties.color,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'simplePollColorField'
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return SimplePollWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = SimplePollWebPart;

//# sourceMappingURL=SimplePollWebPart.js.map
