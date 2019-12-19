/**
 * @file ArcTextWebPart.ts
 * ArcText JQuery Plugin adaptation as a web part for the SharePoint Framework (SPfx)
 *
 * @copyright 2016 Olivier Carpentier
 * Released under MIT licence
 */
import { BaseClientSideWebPart, IPropertyPaneConfiguration, IWebPartContext } from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';
import { IArcTextWebPartProps } from './IArcTextWebPartProps';
/**
 * @class
 * ArcText Web Part
 */
export default class ArcTextWebPart extends BaseClientSideWebPart<IArcTextWebPartProps> {
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
     * Renders JavaScript JQuery calls
     */
    private renderContents();
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
