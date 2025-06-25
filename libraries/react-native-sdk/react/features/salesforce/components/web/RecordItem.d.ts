import React from 'react';
/**
 * The type of the React {@code Component} props of {@link RecordItem}.
 */
export interface IProps {
    /**
     * The id of the record.
     */
    id?: string;
    /**
     * The name of the record.
     */
    name?: string;
    /**
     * The handler for the click event.
     */
    onClick?: (e?: React.MouseEvent) => void;
    /**
     * The type of the record.
     */
    type?: string;
}
/**
 * Component to render Record data.
 *
 * @param {IProps} props - The props of the component.
 * @returns {React$Element<any>}
 */
export declare const RecordItem: ({ id, name, onClick, type }: IProps) => JSX.Element;
