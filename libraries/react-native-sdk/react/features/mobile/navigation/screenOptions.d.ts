/// <reference types="react" />
/**
 * Default modal transition for the current platform.
 */
export declare const modalPresentation: import("@react-navigation/stack").TransitionPreset;
/**
 * Screen options and transition types.
 */
export declare const fullScreenOptions: {
    gestureEnabled: boolean;
    headerShown: boolean;
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Navigation container theme.
 */
export declare const navigationContainerTheme: {
    colors: {
        background: any;
    };
};
/**
 * Screen options for welcome page.
 */
export declare const welcomeScreenOptions: {
    gestureEnabled: boolean;
    headerShown: boolean;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Screen options for conference.
 */
export declare const conferenceScreenOptions: {
    gestureEnabled: boolean;
    headerShown: boolean;
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Tab bar options for chat screen.
 */
export declare const chatTabBarOptions: {
    swipeEnabled: boolean;
    tabBarIndicatorStyle: {
        backgroundColor: any;
    };
    tabBarStyle: {
        backgroundColor: any;
        borderBottomColor: any;
        borderBottomWidth: number;
    };
};
/**
 * Screen options for presentation type modals.
 */
export declare const presentationScreenOptions: {
    headerBackTitleVisible: boolean;
    headerLeft: () => JSX.Element;
    headerStatusBarHeight: number;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Screen options for breakout rooms screen.
 */
export declare const breakoutRoomsScreenOptions: {
    headerBackTitleVisible: boolean;
    headerLeft: () => JSX.Element;
    headerStatusBarHeight: number;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Screen options for car mode.
 */
export declare const carmodeScreenOptions: {
    headerBackTitleVisible: boolean;
    headerLeft: () => JSX.Element;
    headerStatusBarHeight: number;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Screen options for chat.
 */
export declare const chatScreenOptions: {
    headerBackTitleVisible: boolean;
    headerLeft: () => JSX.Element;
    headerStatusBarHeight: number;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Dial-IN Info screen options and transition types.
 */
export declare const dialInSummaryScreenOptions: {
    headerLeft: () => JSX.Element;
    headerBackTitleVisible: boolean;
    headerStatusBarHeight: number;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Screen options for invite modal.
 */
export declare const inviteScreenOptions: {
    headerBackTitleVisible: boolean;
    headerLeft: () => JSX.Element;
    headerStatusBarHeight: number;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Screen options for live stream modal.
 */
export declare const liveStreamScreenOptions: {
    headerBackTitleVisible: boolean;
    headerLeft: () => JSX.Element;
    headerStatusBarHeight: number;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Screen options for participants modal.
 */
export declare const participantsScreenOptions: {
    headerBackTitleVisible: boolean;
    headerLeft: () => JSX.Element;
    headerStatusBarHeight: number;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Screen options for speaker stats modal.
 */
export declare const speakerStatsScreenOptions: {
    headerBackTitleVisible: boolean;
    headerLeft: () => JSX.Element;
    headerStatusBarHeight: number;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Screen options for security options modal.
 */
export declare const securityScreenOptions: {
    headerBackTitleVisible: boolean;
    headerLeft: () => JSX.Element;
    headerStatusBarHeight: number;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Screen options for recording modal.
 */
export declare const recordingScreenOptions: {
    headerBackTitleVisible: boolean;
    headerLeft: () => JSX.Element;
    headerStatusBarHeight: number;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Screen options for subtitles modal.
 */
export declare const subtitlesScreenOptions: {
    headerBackTitleVisible: boolean;
    headerLeft: () => JSX.Element;
    headerStatusBarHeight: number;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Screen options for lobby modal.
 */
export declare const lobbyScreenOptions: {
    headerLeft: () => JSX.Element;
    headerBackTitleVisible: boolean;
    headerStatusBarHeight: number;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Screen options for lobby chat modal.
 */
export declare const lobbyChatScreenOptions: {
    headerLeft: () => JSX.Element;
    headerBackTitleVisible: boolean;
    headerStatusBarHeight: number;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Screen options for salesforce link modal.
 */
export declare const salesforceScreenOptions: {
    headerBackTitleVisible: boolean;
    headerLeft: () => JSX.Element;
    headerStatusBarHeight: number;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Screen options for GIPHY integration modal.
 */
export declare const gifsMenuOptions: {
    headerBackTitleVisible: boolean;
    headerLeft: () => JSX.Element;
    headerStatusBarHeight: number;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Screen options for shared document.
 */
export declare const sharedDocumentScreenOptions: {
    headerBackTitleVisible: boolean;
    headerLeft: () => JSX.Element;
    headerStatusBarHeight: number;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Screen options for settings modal.
 */
export declare const settingsScreenOptions: {
    headerBackTitleVisible: boolean;
    headerLeft: () => JSX.Element;
    headerStatusBarHeight: number;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Screen options for connecting screen.
 */
export declare const connectingScreenOptions: {
    gestureEnabled: boolean;
    headerShown: boolean;
};
/**
 * Screen options for the whiteboard screen.
 */
export declare const whiteboardScreenOptions: {
    headerBackTitleVisible: boolean;
    headerLeft: () => JSX.Element;
    headerStatusBarHeight: number;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
/**
 * Screen options for pre-join screen.
 */
export declare const preJoinScreenOptions: {
    gestureEnabled: boolean;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
};
/**
 * Screen options for profile setting.
 */
export declare const profileSettingsScreenOptions: {
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    headerBackTitleVisible: boolean;
};
/**
 * Screen options for language select screen.
 */
export declare const languageSelectScreenOptions: {
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
    headerBackTitleVisible: boolean;
};
/**
 * Screen options for pre-join screen.
 */
export declare const unsafeMeetingScreenOptions: {
    gestureEnabled: boolean;
    headerStyle: {
        backgroundColor: any;
    };
    headerTitleStyle: {
        color: any;
    };
};
/**
 * Screen options for conference navigation container screen.
 */
export declare const conferenceNavigationContainerScreenOptions: {
    gestureEnabled: boolean;
    headerShown: boolean;
};
/**
 * Screen options for lobby navigation container screen.
 */
export declare const lobbyNavigationContainerScreenOptions: {
    gestureEnabled: boolean;
    headerShown: boolean;
};
/**
 * Screen options for settings navigation container screen.
 */
export declare const settingsNavigationContainerScreenOptions: {
    gestureEnabled: boolean;
    headerShown: boolean;
    gestureDirection: import("@react-navigation/stack/lib/typescript/src/types").GestureDirection;
    transitionSpec: {
        open: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
        close: import("@react-navigation/stack/lib/typescript/src/types").TransitionSpec;
    };
    cardStyleInterpolator: import("@react-navigation/stack").StackCardStyleInterpolator;
    headerStyleInterpolator: import("@react-navigation/stack").StackHeaderStyleInterpolator;
};
