import React from 'react';
declare const CustomOptionButton: ({ icon: iconSrc, onClick, text }: {
    icon: string;
    onClick: (e?: React.MouseEvent<Element, MouseEvent> | undefined) => void;
    text: string;
}) => JSX.Element;
export default CustomOptionButton;
