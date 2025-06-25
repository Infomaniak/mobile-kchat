/// <reference types="react" />
export declare const ACTIVE_TAB_COLOR: string;
export declare const INACTIVE_TAB_COLOR: string;
export declare const tabBarOptions: {
    tabBarActiveTintColor: string;
    tabBarInactiveTintColor: string;
    tabBarLabelStyle: {
        fontSize: number;
    };
    tabBarStyle: {
        backgroundColor: string;
    };
};
export declare const recentListTabBarOptions: {
    tabBarIcon: ({ focused }: {
        focused: boolean;
    }) => JSX.Element;
};
export declare const calendarListTabBarOptions: {
    tabBarIcon: ({ focused }: {
        focused: boolean;
    }) => JSX.Element;
};
export declare const settingsTabBarOptions: {
    tabBarIcon: ({ focused }: {
        focused: boolean;
    }) => JSX.Element;
};
