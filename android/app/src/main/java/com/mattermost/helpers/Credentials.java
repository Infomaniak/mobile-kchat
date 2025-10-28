package com.mattermost.helpers;

import android.content.Context;

import androidx.security.crypto.EncryptedSharedPreferences;
import androidx.security.crypto.MasterKey;

import java.io.IOException;
import java.security.GeneralSecurityException;

public class Credentials {
    private static final String PREFS_NAME = "ik_secure_prefs";
    private static final String MASTER_KEY_ALIAS = "ik_master_key";
    private static MasterKey cachedMasterKey;

    private static synchronized MasterKey getMasterKey(Context context)
            throws GeneralSecurityException, IOException {
        if (cachedMasterKey == null) {
            cachedMasterKey = new MasterKey.Builder(context, MASTER_KEY_ALIAS)
                    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                    .build();
        }
        return cachedMasterKey;
    }

    public static String getCredentialsForServerSync(Context context, String baseUrl) {
        try {
            MasterKey masterKey = getMasterKey(context);

            EncryptedSharedPreferences prefs = (EncryptedSharedPreferences)
                    EncryptedSharedPreferences.create(
                            context,
                            PREFS_NAME,
                            masterKey,
                            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
                    );

            return prefs.getString(baseUrl, null);

        } catch (GeneralSecurityException | IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
