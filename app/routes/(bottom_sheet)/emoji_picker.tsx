import {usePropsFromParams} from '@hooks/props_from_params';
import EmojiPickerScreen, {type EmojiPickerProps} from '@screens/emoji_picker';

export default function EmojiPickerRoute() {
    const props = usePropsFromParams<EmojiPickerProps>();

    return <EmojiPickerScreen {...props}/>;
}
