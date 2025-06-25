/// <reference types="react" />
/**
 * Icon wrapper that checks for branding before returning the SVG component.
 *
 * @returns {JSX.Element}
 */
declare const withBranding: ({ DefaultIcon, iconName }: {
    DefaultIcon: any;
    iconName: string;
}) => (props: any) => JSX.Element;
export default withBranding;
