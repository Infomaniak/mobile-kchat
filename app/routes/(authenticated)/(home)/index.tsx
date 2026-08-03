import {Redirect} from 'expo-router';

export default function HomeIndex() {
    return <Redirect href='/(authenticated)/(home)/channel_list'/>;
}
