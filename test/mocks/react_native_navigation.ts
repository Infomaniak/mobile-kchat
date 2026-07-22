import React from 'react';

export const OptionsModalPresentationStyle = {
    currentContext: 'currentContext',
    formSheet: 'formSheet',
    none: 'none',
    overCurrentContext: 'overCurrentContext',
    overFullScreen: 'overFullScreen',
    pageSheet: 'pageSheet',
};

const registerComponentListener = jest.fn().mockReturnValue({remove: jest.fn()});
const registerComponentDidAppearListener = jest.fn().mockReturnValue({remove: jest.fn()});
const registerComponentDidDisappearListener = jest.fn().mockReturnValue({remove: jest.fn()});
const registerComponentWillAppearListener = jest.fn().mockReturnValue({remove: jest.fn()});
const registerNavigationButtonPressedListener = jest.fn().mockReturnValue({remove: jest.fn()});

export const Navigation = {
    dismissAllOverlays: jest.fn(),
    dismissModal: jest.fn(),
    dismissOverlay: jest.fn(),
    events: jest.fn().mockReturnValue({
        bindComponent: jest.fn(),
        registerCommandListener: jest.fn().mockReturnValue({remove: jest.fn()}),
        registerComponentDidAppearListener,
        registerComponentDidDisappearListener,
        registerComponentListener,
        registerComponentWillAppearListener,
        registerNavigationButtonPressedListener,
        registerScreenPoppedListener: jest.fn().mockReturnValue({remove: jest.fn()}),
    }),
    mergeOptions: jest.fn(),
    pop: jest.fn(),
    popTo: jest.fn(),
    popToRoot: jest.fn(),
    registerComponent: jest.fn(),
    setDefaultOptions: jest.fn(),
    setLazyComponentRegistrator: jest.fn(),
    setRoot: jest.fn(),
    showModal: jest.fn(),
    showOverlay: jest.fn(),
    updateProps: jest.fn(),
};

export class NavigationComponent<P = Record<string, unknown>, S = Record<string, unknown>> extends React.Component<P, S> {}
