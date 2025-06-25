import React, { ReactElement } from 'react';
export declare const DialogTransitionContext: React.Context<{
    isUnmounting: boolean;
}>;
declare const DialogTransition: ({ children }: {
    children: ReactElement | null;
}) => JSX.Element;
export default DialogTransition;
