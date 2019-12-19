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
 * Tiles Menu Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("TilesMenuStrings");
//Imports property pane custom fields
var PropertyFieldColorPickerMini_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPickerMini");
var PropertyFieldFontPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontPicker");
var PropertyFieldFontSizePicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontSizePicker");
var PropertyFieldAlignPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldAlignPicker");
var PropertyFieldCustomList_1 = require("sp-client-custom-fields/lib/PropertyFieldCustomList");
//Loads external JS libs
require('jquery');
var $ = require("jquery");
require('unitegallery');
require('ug-theme-tiles');
//Loads external CSS files
require('../../css/unitegallery/unite-gallery.scss');
var TilesMenuWebPart = (function (_super) {
    __extends(TilesMenuWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function TilesMenuWebPart(context) {
        var _this = _super.call(this) || this;
        _this.guid = _this.getGuid();
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(TilesMenuWebPart.prototype, "dataVersion", {
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
    TilesMenuWebPart.prototype.render = function () {
        if (this.properties.items == null || this.properties.items.length == 0) {
            //Display select a list message
            this.domElement.innerHTML = "\n        <div class=\"ms-MessageBar\">\n          <div class=\"ms-MessageBar-content\">\n            <div class=\"ms-MessageBar-icon\">\n              <i class=\"ms-Icon ms-Icon--Info\"></i>\n            </div>\n            <div class=\"ms-MessageBar-text\">\n              " + strings.ErrorSelectList + "\n            </div>\n          </div>\n        </div>\n      ";
            return;
        }
        var outputHtml = '';
        outputHtml += "\n      <div id=\"" + this.guid + "-gallery\" style=\"display:none;\">\n    ";
        for (var i = 0; i < this.properties.items.length; i++) {
            var newsItem = this.properties.items[i];
            var newsTitle = newsItem['Title'];
            var newsDesc = newsItem['Description'];
            var newsEnable = newsItem['Enable'];
            var newsPicUrl = newsItem['Picture'];
            var newsLink = newsItem['Link Url'];
            if (newsEnable == "false")
                continue;
            outputHtml += "\n         <a href=\"" + newsLink + "\"><img alt=\"" + newsTitle + "\" src=\"" + newsPicUrl + "\"\n          data-image=\"" + newsPicUrl + "\"\n          data-description=\"" + newsDesc + "\"></a>\n        ";
        }
        outputHtml += '</div>';
        this.domElement.innerHTML = outputHtml;
        this.renderContents();
    };
    TilesMenuWebPart.prototype.renderContents = function () {
        console.log("this.properties", this.properties);
        $("#" + this.guid + "-gallery").unitegallery({
            tile_as_link: true,
            tiles_type: this.properties.justified === true ? "justified" : '',
            tile_enable_icons: this.properties.enableIcons,
            tile_enable_textpanel: this.properties.textPanelEnable,
            tile_textpanel_always_on: this.properties.textPanelAlwaysOnTop,
            tile_textpanel_position: this.properties.textPanelPosition,
            tile_textpanel_bg_opacity: this.properties.textPanelOpacity,
            tile_textpanel_bg_color: this.properties.textPanelBackgroundColor,
            tile_textpanel_title_font_family: this.properties.textPanelFont,
            tile_textpanel_title_font_size: this.properties.textPanelFontSize != null ? this.properties.textPanelFontSize.replace("px", "") : '',
            tile_textpanel_title_text_align: this.properties.textPanelAlign,
            tile_textpanel_title_color: this.properties.textPanelFontColor,
            tiles_space_between_cols: this.properties.spaceBetweenCols,
            tile_enable_border: this.properties.enableBorder,
            tile_border_width: this.properties.border,
            tile_border_color: this.properties.borderColor,
            tile_enable_shadow: this.properties.enableShadow,
            tiles_min_columns: this.properties.tilesMinColumns,
            tiles_max_columns: this.properties.tilesMaxColumns,
            tiles_justified_row_height: this.properties.tilesJustifiedRowHeight
        });
    };
    /**
     * @function
     * Generates a GUID
     */
    TilesMenuWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    TilesMenuWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    TilesMenuWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPageGeneral
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
                                        { id: 'Title', title: 'Title', required: true, type: PropertyFieldCustomList_1.CustomListFieldType.string },
                                        { id: 'Enable', title: 'Enable', required: true, type: PropertyFieldCustomList_1.CustomListFieldType.boolean },
                                        { id: 'Description', title: 'Description', required: false, hidden: true, type: PropertyFieldCustomList_1.CustomListFieldType.string },
                                        { id: 'Picture', title: 'Picture', required: true, hidden: true, type: PropertyFieldCustomList_1.CustomListFieldType.picture },
                                        { id: 'Link Url', title: 'Link Url', required: true, hidden: true, type: PropertyFieldCustomList_1.CustomListFieldType.string }
                                    ],
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    context: this.context,
                                    properties: this.properties,
                                    key: 'tilesMenuListField'
                                })
                            ]
                        },
                        {
                            groupName: strings.GeneralGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneToggle('justified', {
                                    label: strings.TilesTypeFieldLabel
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('enableIcons', {
                                    label: strings.EnableIconsFieldLabel
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('enableShadow', {
                                    label: strings.EnableShadowFieldLabel
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('spaceBetweenCols', {
                                    label: strings.SpaceBetweenColsFieldLabel,
                                    min: 0,
                                    max: 100,
                                    step: 1
                                }),
                            ]
                        }
                    ]
                },
                {
                    header: {
                        description: strings.PropertyPageTextPanel
                    },
                    groups: [
                        {
                            groupName: strings.TextPanelGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneToggle('textPanelEnable', {
                                    label: strings.TextPanelEnableFieldLabel
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('textPanelAlwaysOnTop', {
                                    label: strings.TextPanelAlwaysOnTopFieldLabel
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('textPanelOpacity', {
                                    label: strings.TextPanelOpacityFieldLabel,
                                    min: 0,
                                    max: 1,
                                    step: 0.1
                                }),
                                sp_webpart_base_1.PropertyPaneDropdown('textPanelPosition', {
                                    label: strings.TextPanelPositionFieldLabel,
                                    options: [
                                        { key: 'inside_bottom', text: "Inside bottom" },
                                        { key: 'inside_top', text: "Inside top" },
                                        { key: 'inside_center', text: "Inside center" },
                                        { key: 'top', text: "Top" },
                                        { key: 'bottom', text: "Bottom" }
                                    ]
                                }),
                                PropertyFieldAlignPicker_1.PropertyFieldAlignPicker('textPanelAlign', {
                                    label: strings.TextPanelAlignFieldLabel,
                                    initialValue: this.properties.textPanelAlign,
                                    onPropertyChanged: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'tilesMenuAlignField'
                                }),
                                PropertyFieldFontPicker_1.PropertyFieldFontPicker('textPanelFont', {
                                    label: strings.TextPanelFontFieldLabel,
                                    initialValue: this.properties.textPanelFont,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'tilesMenuFontField'
                                }),
                                PropertyFieldFontSizePicker_1.PropertyFieldFontSizePicker('textPanelFontSize', {
                                    label: strings.TextPanelFontSizeFieldLabel,
                                    initialValue: this.properties.textPanelFontSize,
                                    usePixels: true,
                                    preview: true,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'tilesMenuFontSizeField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('textPanelFontColor', {
                                    label: strings.TextPanelFontColorFieldLabel,
                                    initialColor: this.properties.textPanelFontColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'tilesMenuFontColorField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('textPanelBackgroundColor', {
                                    label: strings.TextPanelBackgroundColorFieldLabel,
                                    initialColor: this.properties.textPanelBackgroundColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'tilesMenuBgColorField'
                                })
                            ]
                        }
                    ]
                },
                {
                    header: {
                        description: strings.PropertyPageBorder
                    },
                    groups: [
                        {
                            groupName: strings.BorderGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneToggle('enableBorder', {
                                    label: strings.EnableBorderFieldLabel
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('border', {
                                    label: strings.BorderFieldLabel,
                                    min: 0,
                                    max: 50,
                                    step: 1
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('borderColor', {
                                    label: strings.BorderColorFieldLabel,
                                    initialColor: this.properties.borderColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'tilesMenuBorderColorField'
                                })
                            ]
                        },
                        {
                            groupName: strings.ColumnGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneSlider('tilesMinColumns', {
                                    label: strings.TilesMinCol,
                                    min: 0,
                                    max: 50,
                                    step: 1
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('tilesMaxColumns', {
                                    label: strings.TilesMaxCol,
                                    min: 0,
                                    max: 50,
                                    step: 1
                                })
                            ]
                        },
                        {
                            groupName: strings.JustifiedOptions,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneTextField('tilesJustifiedRowHeight', {
                                    label: strings.TilesJustifiedRowHeight,
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return TilesMenuWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = TilesMenuWebPart;

//# sourceMappingURL=TilesMenuWebPart.js.map
