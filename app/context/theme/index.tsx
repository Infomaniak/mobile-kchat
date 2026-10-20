// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withObservables} from '@nozbe/watermelondb/react';
import React, {type ComponentType, createContext, useEffect, useState} from 'react';
import {Appearance} from 'react-native';
import tinyColor from 'tinycolor2';

import {Preferences} from '@constants';
import useDidUpdate from '@hooks/did_update';
import {queryThemePreferences} from '@queries/servers/preference';
import {observeCurrentTeamId} from '@queries/servers/system';
import {setThemeDefaults, updateThemeIfNeeded} from '@utils/theme';

import type {PreferenceModel} from '@database/models/server';
import type Database from '@nozbe/watermelondb/Database';

type Props = {
    currentTeamId?: string;
    children: React.ReactNode;
    themes: PreferenceModel[];
}

type WithThemeProps = {
    theme: Theme;
}

export function getDefaultThemeByAppearance() {
    if (Appearance.getColorScheme() === 'dark') {
        return Preferences.THEMES.onyx;
    }
    return Preferences.THEMES.infomaniak;
}

export const ThemeContext = createContext(getDefaultThemeByAppearance());
const {Consumer, Provider} = ThemeContext;

const themeCache = new Map<string, Theme>();
let clearingThemeCache = false;
const clearThemeCache = () => {
    if (clearingThemeCache) {
        return;
    }
    clearingThemeCache = true;
    themeCache.clear();
    setTimeout(() => {
        // We set this timeout to avoid clearing the cache multiple times
        // this would happen as we have a Provider for each screen in the stack
        // and when the themes changes we only want to invalidate the cache once
        clearingThemeCache = false;
    }, 300);
};

const getTheme = (teamId: string | undefined, themes: PreferenceModel[]): Theme => {
    if (teamId && themeCache.has(teamId)) {
        return themeCache.get(teamId)!;
    }

    const newTheme = (() => {
        if (teamId) {
            const teamTheme = themes.find((t) => t.name === teamId) || themes[0];
            if (teamTheme?.value) {
                try {
                    return setThemeDefaults(JSON.parse(teamTheme.value));
                } catch {
                    // no theme change
                }
            }
        }
        return getDefaultThemeByAppearance();
    })();

    themeCache.set(teamId || 'default', newTheme);
    return newTheme;
};

// Keep the native interface style (iOS 26 Liquid Glass tab bar, status bar,
// keyboard) in sync with the selected kSuite theme. 'auto' clears the
// override so native chrome keeps following the system appearance. Legacy
// and custom themes have no ksuiteTheme: classify them from their colors,
// like getKeyboardAppearanceFromTheme does.
const getNativeColorScheme = (theme: Theme) => {
    if (theme.ksuiteTheme === 'dark' || theme.ksuiteTheme === 'light') {
        return theme.ksuiteTheme;
    }

    if (theme.ksuiteTheme === 'auto') {
        return 'unspecified';
    }

    return tinyColor(theme.centerChannelBg).isLight() ? 'light' : 'dark';
};

const ThemeProvider = ({currentTeamId, children, themes}: Props) => {
    const [theme, setTheme] = useState(() => getTheme(currentTeamId, themes));

    useEffect(() => {
        const listener = Appearance.addChangeListener(() => {
            clearThemeCache();
            const newTheme = getTheme(currentTeamId, themes);
            setTheme(newTheme);
        });

        return () => listener.remove();
    }, [currentTeamId, themes]);

    useEffect(() => {
        updateThemeIfNeeded(theme);

        // Only pin the native scheme for a user-selected theme: with no theme
        // preference the theme is derived from the system appearance, and the
        // RCTAppearance override would freeze the window traits so the
        // Appearance listener above would never fire on system switches.
        Appearance.setColorScheme(themes.length > 0 ? getNativeColorScheme(theme) : 'unspecified');
    }, [theme, themes]);

    useDidUpdate(() => {
        clearThemeCache();
    }, [themes]);

    useDidUpdate(() => {
        setTheme(getTheme(currentTeamId, themes));
    }, [currentTeamId, themes]);

    return (
        <Provider value={theme}>
            {children}
        </Provider>
    );
};

export const CustomThemeProvider = ({theme, children}: {theme: Theme; children: React.ReactNode}) => {
    return (<Provider value={theme}>{children}</Provider>);
};

export function withTheme<T extends WithThemeProps>(Component: ComponentType<T>): ComponentType<T> {
    return function ThemeComponent(props) {
        return (
            <Consumer>
                {(theme) => (
                    <Component
                        {...props}
                        theme={theme}
                    />
                )}
            </Consumer>
        );
    };
}

export function useTheme(): Theme {
    return React.useContext(ThemeContext);
}

export function useThemeByAppearanceWithDefault(themeProp?: Theme): Theme {
    const [theme, setTheme] = useState<Theme>(() => {
        return themeProp || getDefaultThemeByAppearance();
    });

    useEffect(() => {
        const listener = Appearance.addChangeListener(() => {
            const newTheme = getDefaultThemeByAppearance();
            if (theme !== newTheme) {
                setTheme(newTheme);
            }
        });

        return () => listener.remove();
    }, [theme]);

    return theme;
}

const enhancedThemeProvider = withObservables([], ({database}: {database: Database}) => ({
    currentTeamId: observeCurrentTeamId(database),
    themes: queryThemePreferences(database).observeWithColumns(['value']),
}));

export default enhancedThemeProvider(ThemeProvider);
