export interface ICalendarSyncState {
    authorization?: string;
    error?: {
        error: string;
    };
    events: Array<{
        calendarId: string;
        endDate: string;
        id: string;
        startDate: string;
        url: string;
    }>;
    integrationReady: boolean;
    integrationType?: string;
    isLoadingEvents?: boolean;
    msAuthState?: any;
    profileEmail?: string;
}
