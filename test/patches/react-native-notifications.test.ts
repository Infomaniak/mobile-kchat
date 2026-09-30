// RM-622439
// Guards the tap-intent fix: the RN 0.83 migration silently reintroduced a one-shot
// shared PendingIntent. Any future regen of this patch must keep the tap intent reusable.
import fs from 'fs';
import path from 'path';

const PATCHES_DIR = path.join(__dirname, '../../patches');

describe('react-native-notifications patch', () => {
    it('keeps notification tap intents reusable and per-message', () => {
        const patchFile = fs.readdirSync(PATCHES_DIR).find((f) => f.startsWith('react-native-notifications+') && f.endsWith('.patch'));
        expect(patchFile).toBeDefined();
        const addedLines = fs.
            readFileSync(path.join(PATCHES_DIR, patchFile as string), 'utf8').
            split('\n').
            filter((line) => line.startsWith('+') && !line.startsWith('+++')).
            join('\n');

        expect(addedLines).not.toContain('FLAG_ONE_SHOT');
        expect(addedLines).toContain('google.message_id');
    });
});
