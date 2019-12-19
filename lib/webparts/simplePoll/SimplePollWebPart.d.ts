import { BaseClientSideWebPart, IPropertyPaneConfiguration, IWebPartContext } from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';
import { ISimplePollWebPartProps } from './ISimplePollWebPartProps';
export default class SimplePollWebPart extends BaseClientSideWebPart<ISimplePollWebPartProps> {
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
     * PropertyPanel settings definition
     */
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
