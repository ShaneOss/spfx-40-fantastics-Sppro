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
 * 3D Carousel Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("carousel3DStrings");
//Imports property pane custom fields
var PropertyFieldCustomList_1 = require("sp-client-custom-fields/lib/PropertyFieldCustomList");
var PropertyFieldFontPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontPicker");
var PropertyFieldFontSizePicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontSizePicker");
var PropertyFieldColorPickerMini_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPickerMini");
//Loads external JS libs
var $ = require("jquery");
require('jqueryreflection');
require('cloud9carousel');
var Carousel3DWebPart = (function (_super) {
    __extends(Carousel3DWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function Carousel3DWebPart(context) {
        var _this = _super.call(this) || this;
        //Generates the unique ID
        _this.guid = _this.getGuid();
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        //Binds the async method
        _this.rendered = _this.rendered.bind(_this);
        _this.onLoaded = _this.onLoaded.bind(_this);
        return _this;
    }
    Object.defineProperty(Carousel3DWebPart.prototype, "dataVersion", {
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
    Carousel3DWebPart.prototype.render = function () {
        var _this = this;
        //Checks if the carousel is already loaded. If yes, desacrivate it
        if ($('#' + this.guid + '-carousel').data("carousel") != null) {
            $('#' + this.guid + '-carousel').data("carousel").deactivate();
            $('#' + this.guid + '-carousel').data("carousel").onRendered = null;
        }
        //Defines the main DIV container
        var html = '<div id="' + this.guid + '-bigCarousel" style="height:0px; visibility: hidden"><div id="' + this.guid + '-carousel"> ';
        if (this.properties.items != null) {
            //Browse the items collection
            this.properties.items.map(function (item) {
                if (item != null && item.Enabled != "false") {
                    //Adds a new Carousel entry
                    html += '<img class="cloud9-item" style="cursor: pointer" dataText="' + item['Link Text'] + '" dataUrl="' + item['Link Url'] + '" src="' + item.Picture + '" height="' + _this.properties.itemHeight + '" alt="' + item.Title + '" />';
                }
            });
        }
        html += "\n        </div>\n       ";
        if (this.properties.showTitle === true) {
            //Shows the title
            html += '<div style=\'font-size: ' + this.properties.fontSize + '; color: ' + this.properties.fontColor + '; font-family:'
                + this.properties.font + '\'><div id="' + this.guid + '-item-title" style="position: absolute; bottom:0; width: 100%; text-align: center;">&nbsp;</div></div>';
        }
        if (this.properties.showButton === true) {
            //Shows the button to navigate
            html += '<div id="' + this.guid + '-buttons" style="height: 100%">';
            html += "\n          <button class=\"left\" style=\"float:left; height: 60px; position: absolute; top: 45%; cursor: pointer;\">\n            <i class='ms-Icon ms-Icon--ChevronLeft' aria-hidden=\"true\" style=\"font-size:large\"></i>\n          </button>\n          <button class=\"right\" style=\"float:right; height: 60px; position: absolute; top: 45%; margin-right: 10px; right: 0; cursor: pointer;\">\n            <i class='ms-Icon ms-Icon--ChevronRight' aria-hidden=\"true\" style=\"font-size:large\"></i>\n          </button>\n        </div>\n        ";
        }
        html += "\n      </div>\n    ";
        this.domElement.innerHTML = html;
        this.renderContents();
    };
    /**
     * @function
     * Renders JavaScript JQuery plugin
     */
    Carousel3DWebPart.prototype.renderContents = function () {
        if ($('#' + this.guid + '-carousel') != null) {
            //Calls the jquery carousel init method
            $('#' + this.guid + '-carousel').Cloud9Carousel({
                buttonLeft: $("#" + this.guid + "-buttons > .left"),
                buttonRight: $("#" + this.guid + "-buttons > .right"),
                autoPlay: this.properties.autoPlay === true ? 1 : 0,
                autoPlayDelay: this.properties.autoPlayDelay,
                bringToFront: this.properties.bringToFront,
                speed: this.properties.speed,
                yOrigin: this.properties.yOrigin,
                yRadius: this.properties.yRadius,
                xOrigin: this.properties.xOrigin,
                xRadius: this.properties.xRadius,
                mirror: {
                    gap: this.properties.mirrorGap,
                    height: this.properties.mirrorHeight,
                    opacity: this.properties.mirrorOpacity
                },
                onRendered: this.rendered,
                onLoaded: this.onLoaded,
            });
        }
    };
    /**
     * @function
     * Occurs when the carousel jquery plugin is loaded. So, change the visiblity
     */
    Carousel3DWebPart.prototype.onLoaded = function () {
        $("#" + this.guid + "-bigCarousel").css('visibility', 'visible');
        $("#" + this.guid + "-bigCarousel").css('height', this.properties.height);
        $("#" + this.guid + "-carousel").css('visibility', 'visible');
        $("#" + this.guid + "-carousel").css('display', 'block');
        $("#" + this.guid + "-carousel").css('overflow', 'visible');
        $("#" + this.guid + "-carousel").fadeIn(1500);
    };
    /**
     * @function
     * Occurs when the carousel is rendered. So, display the item
     */
    Carousel3DWebPart.prototype.rendered = function (carousel) {
        if ($('#' + this.guid + '-item-title') != null) {
            var subTitle = '';
            subTitle += carousel.nearestItem().element.alt;
            if (carousel.nearestItem().element.children[0].attributes.dataurl) {
                var linkUrl = carousel.nearestItem().element.children[0].attributes.dataurl.value;
                if (linkUrl && linkUrl != '' && linkUrl != 'undefined') {
                    subTitle += "&nbsp;<a href='" + linkUrl + "'>";
                    var dataText = carousel.nearestItem().element.children[0].attributes.datatext.value;
                    if (dataText == null || dataText == '')
                        dataText = strings.ReadMore;
                    subTitle += dataText;
                    subTitle += "</a>";
                }
            }
            $('#' + this.guid + '-item-title').html(subTitle);
            // Fade in based on proximity of the item
            var c = Math.cos((carousel.floatIndex() % 1) * 2 * Math.PI);
            $('#' + this.guid + '-item-title').css('opacity', 0.5 + (0.5 * c));
        }
    };
    /**
     * @function
     * Generates a GUID
     */
    Carousel3DWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    Carousel3DWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    Carousel3DWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    displayGroupsAsAccordion: true,
                    groups: [
                        {
                            groupName: strings.DataGroupName,
                            groupFields: [
                                PropertyFieldCustomList_1.PropertyFieldCustomList('items', {
                                    label: strings.DataFieldLabel,
                                    value: this.properties.items,
                                    headerText: "Manage Items",
                                    fields: [
                                        { id: 'Title', title: 'Title', required: true, type: PropertyFieldCustomList_1.CustomListFieldType.string },
                                        { id: 'Enabled', title: 'Enabled', required: true, type: PropertyFieldCustomList_1.CustomListFieldType.boolean },
                                        { id: 'Picture', title: 'Picture', required: true, type: PropertyFieldCustomList_1.CustomListFieldType.picture },
                                        //{ title: 'Picture', required: true, type: CustomListFieldType.picture },
                                        { id: 'Link Url', title: 'Link Url', required: false, type: PropertyFieldCustomList_1.CustomListFieldType.string, hidden: true },
                                        { id: 'Link Text', title: 'Link Text', required: false, type: PropertyFieldCustomList_1.CustomListFieldType.string, hidden: true }
                                    ],
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    context: this.context,
                                    properties: this.properties,
                                    key: "carousel3DListField"
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('itemHeight', {
                                    label: strings.ItemHeightFieldLabel,
                                    min: 10,
                                    max: 400,
                                    step: 1,
                                    showValue: true
                                }),
                            ]
                        },
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneSlider('speed', {
                                    label: strings.SpeedFieldLabel,
                                    min: 1,
                                    max: 10,
                                    step: 1,
                                    showValue: true
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('autoPlay', {
                                    label: strings.AutoplayFieldLabel
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('autoPlayDelay', {
                                    label: strings.AutoplayDelayFieldLabel,
                                    min: 0,
                                    max: 10000,
                                    step: 100,
                                    showValue: true
                                })
                            ]
                        },
                        {
                            groupName: strings.GeneralGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneSlider('height', {
                                    label: strings.HeightFieldLabel,
                                    min: 0,
                                    max: 800,
                                    step: 5,
                                    showValue: true
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('showTitle', {
                                    label: strings.ShowTitleFieldLabel
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('showButton', {
                                    label: strings.ShowButtonsFieldLabel
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('bringToFront', {
                                    label: strings.BringtoFrontFieldLabel
                                })
                            ]
                        },
                        {
                            groupName: strings.MirrorGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneSlider('mirrorGap', {
                                    label: strings.MirrorGapFieldLabel,
                                    min: 0,
                                    max: 20,
                                    step: 1,
                                    showValue: true
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('mirrorHeight', {
                                    label: strings.MirrorHeightFieldLabel,
                                    min: 0,
                                    max: 1,
                                    step: 0.1,
                                    showValue: true
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('mirrorOpacity', {
                                    label: strings.MirrorOpacityFieldLabel,
                                    min: 0,
                                    max: 1,
                                    step: 0.1,
                                    showValue: true
                                })
                            ]
                        },
                        {
                            groupName: strings.OriginGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneSlider('yOrigin', {
                                    label: strings.YOriginFieldLabel,
                                    min: 0,
                                    max: 200,
                                    step: 1,
                                    showValue: true
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('yRadius', {
                                    label: strings.YRadiusFieldLabel,
                                    min: 0,
                                    max: 200,
                                    step: 1,
                                    showValue: true
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('xOrigin', {
                                    label: strings.XOriginFieldLabel,
                                    min: 0,
                                    max: 700,
                                    step: 1,
                                    showValue: true
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('xRadius', {
                                    label: strings.XRadiusFieldLabel,
                                    min: 0,
                                    max: 700,
                                    step: 1,
                                    showValue: true
                                })
                            ]
                        },
                        {
                            groupName: strings.TitleGroupName,
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
                                    key: "carousel3DFontField"
                                }),
                                PropertyFieldFontSizePicker_1.PropertyFieldFontSizePicker('fontSize', {
                                    label: strings.FontSizeFieldLabel,
                                    usePixels: true,
                                    preview: true,
                                    initialValue: this.properties.fontSize,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "carousel3DFontSizeField"
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('fontColor', {
                                    label: strings.ColorFieldLabel,
                                    initialColor: this.properties.fontColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: "carousel3DFontColorField"
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return Carousel3DWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = Carousel3DWebPart;

//# sourceMappingURL=Carousel3DWebPart.js.map
