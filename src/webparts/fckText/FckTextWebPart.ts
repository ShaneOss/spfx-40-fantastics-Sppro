/**
 * @file
 * FckText Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  IWebPartContext,
  PropertyPaneToggle
} from "@microsoft/sp-webpart-base";
import { DisplayMode, Version } from "@microsoft/sp-core-library";
import { Environment, EnvironmentType } from "@microsoft/sp-core-library";

import { loadStyles } from '@microsoft/load-themed-styles';

//Set fcktext and ckeditable styles
loadStyles('.cke_editable a { color: "[theme: themePrimary, default: #038387]" !important; font-size: 18px !important; } .fcktext a { color: "[theme: themePrimary, default: #038387]"; font-size: 18px !important; } .fcktext { font-family: "Segoe UI", "Segoe UI Web(West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif !important; font-weight: 400 !important; font-size: 18px !important; line-height: 1.4 !important} .cke_editable p { font-size: 18px; line-height: 1.4 }');

import * as strings from "fckTextStrings";
import { IFckTextWebPartProps } from "./IFckTextWebPartProps";
import { SPComponentLoader } from "@microsoft/sp-loader";

//Loads JQuery & JQuery UI
require('jquery');
import * as $ from 'jquery';

export default class FckTextWebPart extends BaseClientSideWebPart<
    IFckTextWebPartProps
    > {
    private guid: string;

    /**
     * @function
     * Web part contructor.
     */
    public constructor(context?: IWebPartContext) {
        super();

        this.guid = this.getGuid();

        //Hack: to invoke correctly the onPropertyChange function outside this class
        //we need to bind this object on it first
        this.onPropertyPaneFieldChanged = this.onPropertyPaneFieldChanged.bind(
            this
        );
    }

    /**
     * @function
     * Gets WP data version
     */
    protected get dataVersion(): Version {
        return Version.parse("1.0");
    }

    /**
     * @function
     * Renders HTML code
     */
    public render(): void {
        if (Environment.type === EnvironmentType.ClassicSharePoint) {
            var errorHtml = "";
            errorHtml += '<div style="color: red;">';
            errorHtml +=
                '<div style="display:inline-block; vertical-align: middle;"><i class="ms-Icon ms-Icon--Error" style="font-size: 20px"></i></div>';
            errorHtml +=
                '<div style="display:inline-block; vertical-align: middle;margin-left:7px;"><span>';
            errorHtml += strings.ErrorClassicSharePoint;
            errorHtml += "</span></div>";
            errorHtml += "</div>";
            this.domElement.innerHTML = errorHtml;
            return;
        }

        if (this.displayMode == DisplayMode.Edit) {
            //Edit mode
            var html = "";
            html += "<style>.cke .cke_top {display: block !important;} </style>";

            html += "<textarea name='" + this.guid + "-editor' id='" + this.guid + "-editor'>" + this.properties.text + "</textarea>";
            this.domElement.innerHTML = html;

            var ckEditorCdn: string = "//cdn.ckeditor.com/4.15.0/full/ckeditor.js";
            SPComponentLoader.loadScript(ckEditorCdn, {
                globalExportsName: "CKEDITOR"
            }).then((CKEDITOR: any): void => {
                if (this.properties.inline == null || this.properties.inline === false)
                    CKEDITOR.replace(this.guid + "-editor", {
                        skin: 'moono-lisa,//cdn.ckeditor.com/4.15.0/full-all/skins/moono-lisa/',
                        contentsCss: 'body { font-family: "Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif; }',
                        format_tags: 'p;h1;h2;h3',
                        format_p: { element: 'p', name: "Normal", styles: { 'font-size': '18px', 'font-weight': '400', 'line-height': '1.4' } },
                        format_h1: { element: 'h1', name: "Heading 1", styles: { 'font-size': '28px', 'font-weight': '600' } },
                        format_h2: { element: 'h2', name: "Heading 2", styles: { 'font-size': '24px', 'font-weight': '600' } },
                        format_h3: { element: 'h3', name: "Heading 3", styles: { 'font-size': '20px', 'font-weight': '600' } },
                        extraAllowedContent: 'p h1 h2 h3',
                        font_names: 'Segoe UI;Arial;Comic Sans MS;Courier New;Georgia;Lucida Sans Unicode;Tahoma;Times New Roman;Trebuchet MS;Verdana',
                        font_defaultLabel: 'Segoe UI',
                        fontSize_defaultLabel: '18px'
                    });
                else
                    //Disable CKEditor auto attaching inline to editable elements
                    CKEDITOR.disableAutoInline = true;

                    CKEDITOR.inline(this.guid + "-editor", {
                        skin: 'moono-lisa,//cdn.ckeditor.com/4.15.0/full-all/skins/moono-lisa/',
                        contentsCss: 'body { font-family: "Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif; }',
                        format_tags: 'p;h1;h2;h3',
                        format_p: { element: 'p', name: "Normal", styles: { 'font-size': '18px', 'font-weight': '400', 'line-height': '1.4' } },
                        format_h1: { element: 'h1', name: "Heading 1", styles: { 'font-size': '28px', 'font-weight': '600' } },
                        format_h2: { element: 'h2', name: "Heading 2", styles: { 'font-size': '24px', 'font-weight': '600' } },
                        format_h3: { element: 'h3', name: "Heading 3", styles: { 'font-size': '20px', 'font-weight': '600' } },
                        extraAllowedContent: 'p h1 h2 h3',
                        font_names: 'Segoe UI;Arial;Comic Sans MS;Courier New;Georgia;Lucida Sans Unicode;Tahoma;Times New Roman;Trebuchet MS;Verdana',
                        font_defaultLabel: 'Segoe UI',
                        fontSize_defaultLabel: '18px'
                    });

                for (var i in CKEDITOR.instances) {
                    CKEDITOR.instances[i].on("change", (elm?, val?) => {
                        //CKEDITOR.instances[i].updateElement();
                        elm.sender.updateElement();
                        if (document.getElementById(this.guid + "-editor")) {
                            var value = (document.getElementById(this.guid + "-editor") as any)
                                .value;
                            if (this.onPropertyPaneFieldChanged && value != null) {
                                this.properties.text = value;
                            }
                        }
                    });
                }
            });
        } else {

            //Read Mode
            if (this.properties.transparentbg == null || this.properties.transparentbg === false) {
                html = '<div class="fcktext" id="' + this.guid + '">';
                html += this.properties.text;
                this.domElement.innerHTML = html;
                $('#' + this.guid).closest(".ControlZone--emphasisBackground").removeAttr("style");
            }
            else {
                //Transparent background
                html = '<div class="fcktext" style="opacity: 1.0;" id="' + this.guid + '">';
                html += this.properties.text;
                this.domElement.innerHTML = html;
                $('#' + this.guid).closest(".ControlZone--emphasisBackground").css("background-color", "rgba(0, 0, 0, 0)!important");
            }
        }
    }

    /**
     * @function
     * Generates a GUID
     */
    private getGuid(): string {
        return (
            this.s4() +
            this.s4() +
            "-" +
            this.s4() +
            "-" +
            this.s4() +
            "-" +
            this.s4() +
            "-" +
            this.s4() +
            this.s4() +
            this.s4()
        );
    }

    /**
     * @function
     * Generates a GUID part
     */
    private s4(): string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    /**
     * @function
     * PropertyPanel settings definition
     */
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
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
                                PropertyPaneToggle("inline", {
                                    label: strings.Inline
                                }),
                                PropertyPaneToggle("transparentbg", {
                                    label: strings.TransparentBG
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    }
}
