/// <reference types="node" />
import React, { ReactElement } from 'react';
export declare const NotificationsTransitionContext: React.Context<{
    unmounting: Map<string, NodeJS.Timeout | null>;
}>;
declare const NotificationsTransition: ({ children }: {
    children: ReactElement[];
}) => JSX.Element;
export default NotificationsTransition;
