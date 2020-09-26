declare interface IFckTextStrings {
    PropertyPaneDescription: string;
    BasicGroupName: string;
    Inline: string;
    TransparentBG: string;
    ErrorClassicSharePoint: string;
}

declare module 'fckTextStrings' {
    const strings: IFckTextStrings;
    export = strings;
}
