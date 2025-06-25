/// <reference types="react" />
export interface IProps {
    breakoutRoomJid: string;
    name?: string;
}
/**
 * Implements the rename button component which is displayed only for renaming a breakout room which is joined by the
 * user.
 *
 * @param {IProps} props - The props of the component.
 * @returns {JSX.Element}
 */
export default function RenameButton({ breakoutRoomJid, name }: IProps): JSX.Element;
