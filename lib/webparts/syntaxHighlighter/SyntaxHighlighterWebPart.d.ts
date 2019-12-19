/**
 * @file
 * Syntax Highlighter Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import { BaseClientSideWebPart, IPropertyPaneConfiguration, IWebPartContext } from '@microsoft/sp-webpart-base';
import { ISyntaxHighlighterWebPartProps } from './ISyntaxHighlighterWebPartProps';
import { Version } from '@microsoft/sp-core-library';
/**
 * @class
 * Syntax Highlighter Web Part.
 */
export default class SyntaxHighlighterWebPart extends BaseClientSideWebPart<ISyntaxHighlighterWebPartProps> {
    /**
     * @var
     * Unique ID of this Web Part instance
     */
    private guid;
    /**
     * @function
     * Web part contructor.
     */
    constructor(context?: IWebPartContext);
    /**
     * @function
     * Gets WP data version
     */
    protected readonly dataVersion: Version;
    /**
     * @function
     * Renders HTML code
     */
    render(): void;
    /**
     * @function
     * Event occurs when the content of the textarea in edit mode is changing.
     */
    private onSyntaxHighlighterChanged(elm?);
    /**
     * @function
     * Generates a GUID
     */
    private getGuid();
    /**
     * @function
     * Generates a GUID part
     */
    private s4();
    /**
     * @function
     * PropertyPanel settings definition
     */
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
