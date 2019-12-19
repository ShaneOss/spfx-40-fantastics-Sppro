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
 * FckText Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_core_library_2 = require("@microsoft/sp-core-library");
var strings = require("fckTextStrings");
var sp_loader_1 = require("@microsoft/sp-loader");
var FckTextWebPart = (function (_super) {
    __extends(FckTextWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function FckTextWebPart(context) {
        var _this = _super.call(this) || this;
        _this.guid = _this.getGuid();
        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(FckTextWebPart.prototype, "dataVersion", {
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
    FckTextWebPart.prototype.render = function () {
        var _this = this;
        if (sp_core_library_2.Environment.type === sp_core_library_2.EnvironmentType.ClassicSharePoint) {
            var errorHtml = '';
            errorHtml += '<div style="color: red;">';
            errorHtml += '<div style="display:inline-block; vertical-align: middle;"><i class="ms-Icon ms-Icon--Error" style="font-size: 20px"></i></div>';
            errorHtml += '<div style="display:inline-block; vertical-align: middle;margin-left:7px;"><span>';
            errorHtml += strings.ErrorClassicSharePoint;
            errorHtml += '</span></div>';
            errorHtml += '</div>';
            this.domElement.innerHTML = errorHtml;
            return;
        }
        if (this.displayMode == sp_core_library_1.DisplayMode.Edit) {
            //Edit mode
            var html = '';
            html += "<textarea name='" + this.guid + "-editor' id='" + this.guid + "-editor'>" + this.properties.text + "</textarea>";
            this.domElement.innerHTML = html;
            var ckEditorCdn = '//cdn.ckeditor.com/4.6.2/full/ckeditor.js';
            sp_loader_1.SPComponentLoader.loadScript(ckEditorCdn, { globalExportsName: 'CKEDITOR' }).then(function (CKEDITOR) {
                if (_this.properties.inline == null || _this.properties.inline === false)
                    CKEDITOR.replace(_this.guid + '-editor', {
                        skin: 'moono-lisa,//cdn.ckeditor.com/4.6.2/full-all/skins/moono-lisa/'
                    });
                else
                    CKEDITOR.inline(_this.guid + '-editor', {
                        skin: 'moono-lisa,//cdn.ckeditor.com/4.6.2/full-all/skins/moono-lisa/'
                    });
                for (var i in CKEDITOR.instances) {
                    CKEDITOR.instances[i].on('change', function (elm, val) {
                        //CKEDITOR.instances[i].updateElement();
                        elm.sender.updateElement();
                        var value = (document.getElementById(_this.guid + '-editor')).value;
                        if (_this.onPropertyPaneFieldChanged && value != null) {
                            _this.properties.text = value;
                        }
                    });
                }
            });
        }
        else {
            //Read Mode
            this.domElement.innerHTML = this.properties.text;
        }
    };
    /**
     * @function
     * Generates a GUID
     */
    FckTextWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    FckTextWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    FckTextWebPart.prototype.getPropertyPaneConfiguration = function () {
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
                                sp_webpart_base_1.PropertyPaneToggle('inline', {
                                    label: strings.Inline,
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return FckTextWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = FckTextWebPart;

//# sourceMappingURL=FckTextWebPart.js.map
