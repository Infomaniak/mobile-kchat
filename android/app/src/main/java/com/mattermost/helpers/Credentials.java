package com.mattermost.helpers;

import android.content.Context;

import androidx.annotation.Nullable;
import androidx.security.crypto.EncryptedSharedPreferences;
import androidx.security.crypto.MasterKey;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.oblador.keychain.KeychainModule;

import java.io.IOException;
import java.security.GeneralSecurityException;


public class Credentials {
       public static String getCredentialsForServerSync(Context context, String baseUrl) {
        try {
            MasterKey masterKey = new MasterKey.Builder(context)
                    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                    .build();

            EncryptedSharedPreferences prefs = (EncryptedSharedPreferences) EncryptedSharedPreferences.create(
                    context,
                    "ik_secure_prefs",
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