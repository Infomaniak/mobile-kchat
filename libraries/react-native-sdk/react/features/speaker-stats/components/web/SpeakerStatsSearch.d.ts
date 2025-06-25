/// <reference types="react" />
/**
 * The type of the React {@code Component} props of {@link SpeakerStatsSearch}.
 */
export interface IProps {
    /**
     * The function to initiate the change in the speaker stats table.
     */
    onSearch: Function;
}
/**
 * React component for display an individual user's speaker stats.
 *
 * @returns {React$Element<any>}
 */
declare function SpeakerStatsSearch({ onSearch }: IProps): JSX.Element | null;
export default SpeakerStatsSearch;
