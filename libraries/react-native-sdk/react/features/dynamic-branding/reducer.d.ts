import { type Image } from '../virtual-background/constants';
export interface IDynamicBrandingState {
    avatarBackgrounds: string[];
    backgroundColor: string;
    backgroundImageUrl: string;
    brandedIcons?: Record<string, string>;
    customizationFailed: boolean;
    customizationReady: boolean;
    defaultBranding: boolean;
    didPageUrl: string;
    inviteDomain: string;
    labels: Object | null;
    logoClickUrl: string;
    logoImageUrl: string;
    muiBrandedTheme?: boolean;
    premeetingBackground: string;
    showGiphyIntegration?: boolean;
    useDynamicBrandingData: boolean;
    virtualBackgrounds: Array<Image>;
}
