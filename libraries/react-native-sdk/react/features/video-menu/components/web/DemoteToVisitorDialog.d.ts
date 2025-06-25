/// <reference types="react" />
import { DialogProps } from '../../../base/dialog/constants';
export interface IProps extends DialogProps {
    /**
     * The ID of the remote participant to be demoted.
     */
    participantID: string;
}
/**
 * Dialog to confirm a remote participant demote action.
 *
 * @returns {JSX.Element}
 */
export default function DemoteToVisitorDialog({ participantID }: IProps): JSX.Element;
