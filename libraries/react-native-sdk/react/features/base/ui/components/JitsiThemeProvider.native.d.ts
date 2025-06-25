import * as React from 'react';
export interface IProps {
    /**
    * The children of the component.
    */
    children: React.ReactNode;
}
/**
 * The theme provider for the mobile app.
 *
 * @param {Object} props - The props of the component.
 * @returns {React.ReactNode}
 */
export default function JitsiThemePaperProvider(props: IProps): JSX.Element;
