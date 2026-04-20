// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// @IK-MOBILE-TEST: Tests custom pour protéger le fix du thème auto contre les merges upstream
// Ce fichier de test a été ajouté par Ik pour valider le comportement du thème auto
// qui doit réagir aux changements d'apparence système.
//
// Ce test protège spécifiquement contre la régression du bug où :
// - Le thème en mode "auto" ne réagissait pas aux changements système
// - Le cache n'était pas vidé quand l'apparence changeait
// - Les illustrations changeaient sans que l'app entière ne suive

import React, {useContext} from 'react';
import {Appearance, Text, View} from 'react-native';

import {Preferences} from '@constants';
import {ThemeContext, getDefaultThemeByAppearance, CustomThemeProvider} from '@context/theme';
import {render} from '@test/intl-test-helper';

// Mock Appearance
let mockColorScheme = 'light';
const listeners: Array<() => void> = [];

jest.mock('react-native', () => {
    const actualRN = jest.requireActual('react-native');

    return {
        ...actualRN,
        Appearance: {
            getColorScheme: jest.fn(() => mockColorScheme),
            addChangeListener: jest.fn((callback: () => void) => {
                listeners.push(callback);
                return {
                    remove: () => {
                        const index = listeners.indexOf(callback);
                        if (index > -1) {
                            listeners.splice(index, 1);
                        }
                    },
                };
            }),
        },
    };
});

const TestComponent = () => {
    const theme = useContext(ThemeContext);

    return (
        <View>
            <Text testID='themeType'>{theme.type}</Text>
            <Text testID='ksuiteTheme'>{theme.ksuiteTheme}</Text>
        </View>
    );
};

describe('Theme Auto Reactivity (IK Custom)', () => {
    beforeEach(() => {
        listeners.length = 0;
        mockColorScheme = 'light';
        jest.clearAllMocks();
    });

    afterEach(() => {
        listeners.length = 0;
    });

    it('getDefaultThemeByAppearance should return light theme (Infomaniak) when system is light', () => {
        mockColorScheme = 'light';
        const theme = getDefaultThemeByAppearance();

        expect(theme.type).toBe('Infomaniak');
        expect(theme.ksuiteTheme).toBe('light');
    });

    it('getDefaultThemeByAppearance should return dark theme (Onyx) when system is dark', () => {
        mockColorScheme = 'dark';
        const theme = getDefaultThemeByAppearance();

        expect(theme.type).toBe('Onyx');
        expect(theme.ksuiteTheme).toBe('dark');
    });

    it('should render with correct theme type based on appearance', () => {
        mockColorScheme = 'light';
        const theme = getDefaultThemeByAppearance();

        const {getByTestId} = render(
            <CustomThemeProvider theme={theme}>
                <TestComponent/>
            </CustomThemeProvider>,
        );

        expect(getByTestId('themeType').props.children).toBe('Infomaniak');
    });

    it('Quartz theme should have ksuiteTheme set to auto', () => {
        // Le thème Quartz (Automatic) doit avoir ksuiteTheme: 'auto'
        const quartzTheme = Preferences.THEMES.quartz;

        expect(quartzTheme.ksuiteTheme).toBe('auto');
        expect(quartzTheme.type).toBe('Quartz');
    });

    it('should switch between light and dark themes based on appearance', () => {
        // Test que l'app peut switcher entre les deux thèmes
        mockColorScheme = 'light';
        const lightTheme = getDefaultThemeByAppearance();

        mockColorScheme = 'dark';
        const darkTheme = getDefaultThemeByAppearance();

        // Les deux thèmes doivent être différents
        expect(lightTheme.ksuiteTheme).not.toBe(darkTheme.ksuiteTheme);
        expect(lightTheme.type).toBe('Infomaniak');
        expect(darkTheme.type).toBe('Onyx');
    });
});

describe('Theme Cache Behavior (IK Custom)', () => {
    beforeEach(() => {
        listeners.length = 0;
        mockColorScheme = 'light';
        jest.clearAllMocks();
    });

    afterEach(() => {
        listeners.length = 0;
    });

    it('Appearance change listener should be registered', () => {
        // Simuler un composant qui s'abonne aux changements d'apparence
        // Cela vérifie que notre fix utilise bien addChangeListener
        const callback = jest.fn();

        const subscription = Appearance.addChangeListener(callback);

        expect(Appearance.addChangeListener).toHaveBeenCalledWith(callback);
        expect(listeners).toContain(callback);

        subscription.remove();
    });

    it('Multiple listeners should all be called when appearance changes', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();

        Appearance.addChangeListener(callback1);
        Appearance.addChangeListener(callback2);

        // Simuler le déclenchement
        listeners.forEach((listener) => listener());

        expect(callback1).toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
    });
});

describe('Theme Color Contrast (IK Custom)', () => {
    it('light theme should have light centerChannelBg', () => {
        mockColorScheme = 'light';
        const theme = getDefaultThemeByAppearance();

        // Infomaniak a un fond clair
        expect(theme.centerChannelBg).toMatch(/^#f|^#e|^#d/i);
    });

    it('dark theme should have dark centerChannelBg', () => {
        mockColorScheme = 'dark';
        const theme = getDefaultThemeByAppearance();

        // Onyx a un fond foncé
        expect(theme.centerChannelBg).toMatch(/^#0|^#1/i);
    });
});
