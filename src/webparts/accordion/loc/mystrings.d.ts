declare interface IAccordionStrings {
    PropertyPaneDescription: string;
    BasicGroupName: string;
    TextEditorGroupName: string;
    LayoutGroupName: string;
    DescriptionFieldLabel: string;
    Inline: string;
    ManageAccordion: string;
    Accordion: string;
    DisableColor: string;
    SelectedColor: string;
    Collapsible: string;
    CollapsedDefault: string;
    Animate: string;
    Speed: string;
    HeightStyle: string;
    IconHeader: string;
    IconActiveHeader: string;
    ClassesUIAccordionCustomCSS: string;
    ErrorClassicSharePoint: string;
}

declare module 'AccordionStrings' {
    const strings: IAccordionStrings;
    export = strings;
}
