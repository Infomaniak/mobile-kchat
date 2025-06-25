/// <reference types="react" />
import { GestureResponderEvent } from 'react-native';
interface ISelectedRecord {
    id: string;
    name: string;
    onClick: (e?: React.MouseEvent | GestureResponderEvent) => void;
    type: string;
}
export declare const useSalesforceLinkDialog: () => {
    hasDetailsErrors: boolean;
    hasRecordsErrors: boolean;
    isLoading: boolean;
    linkMeeting: () => Promise<void>;
    notes: string;
    records: never[];
    searchTerm: string | null;
    selectedRecord: ISelectedRecord | null;
    selectedRecordOwner: {
        id: string;
        name: string;
        type: string;
    } | null;
    setNotes: import("react").Dispatch<import("react").SetStateAction<string>>;
    setSearchTerm: import("react").Dispatch<import("react").SetStateAction<string | null>>;
    setSelectedRecord: import("react").Dispatch<import("react").SetStateAction<ISelectedRecord | null>>;
    showNoResults: boolean | "" | null;
    showSearchResults: boolean | "" | null;
};
export {};
