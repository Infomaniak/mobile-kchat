import React from 'react';
export interface IProps {
    /**
     * The children components.
     */
    children: React.ReactNode;
    /**
     * Id of the component.
     */
    id?: string;
    /**
    * Whether this conference info container should be visible or not.
    */
    visible: boolean;
}
declare const _default: ({ visible, children, id }: IProps) => JSX.Element;
export default _default;
