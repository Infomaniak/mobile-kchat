package com.mattermost.rnbeta;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.github.emilioicai.hwkeyboardevent.HWKeyboardEventModule;
import com.mattermost.call.CallManagerModule;
import com.mattermost.notification.NotificationUtils;
import com.reactnativenavigation.NavigationActivity;

import java.util.Objects;

public class MainActivity extends NavigationActivity {
    private boolean HWKeyboardConnected = false;
    private final FoldableObserver foldableObserver = FoldableObserver.Companion.getInstance(this);

    @Override
    protected String getMainComponentName() {
        return "Mattermost";
    }

    /**
     * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
     * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
     * (aka React 18) with two boolean flags.
     */
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new DefaultReactActivityDelegate(
                this,
                Objects.requireNonNull(getMainComponentName()),
                // If you opted-in for the New Architecture, we enable the Fabric Renderer.
                DefaultNewArchitectureEntryPoint.getFabricEnabled());
    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(null);
        setContentView(R.layout.launch_screen);

        handleIntentExtras(getIntent());

        setHWKeyboardConnected();
        foldableObserver.onCreate();
    }

    @Override
    protected void onStart() {
        super.onStart();
        foldableObserver.onStart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        foldableObserver.onStop();
    }

    @Override
    public void onConfigurationChanged(@NonNull Configuration newConfig) {
        super.onConfigurationChanged(newConfig);

        if (newConfig.hardKeyboardHidden == Configuration.HARDKEYBOARDHIDDEN_NO) {
            HWKeyboardConnected = true;
        } else if (newConfig.hardKeyboardHidden == Configuration.HARDKEYBOARDHIDDEN_YES) {
            HWKeyboardConnected = false;
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        getReactGateway().onWindowFocusChanged(hasFocus);
    }

    /*
    https://mattermost.atlassian.net/browse/MM-10601
    Required by react-native-hw-keyboard-event
    (https://github.com/emilioicai/react-native-hw-keyboard-event)
    */
    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        if (HWKeyboardConnected) {
            int keyCode = event.getKeyCode();
            int keyAction = event.getAction();
            if (keyAction == KeyEvent.ACTION_UP) {
                if (keyCode == KeyEvent.KEYCODE_ENTER) {
                    String keyPressed = event.isShiftPressed() ? "shift-enter" : "enter";
                    HWKeyboardEventModule.getInstance().keyPressed(keyPressed);
                    return true;
                } else if (keyCode == KeyEvent.KEYCODE_K && event.isCtrlPressed()) {
                    HWKeyboardEventModule.getInstance().keyPressed("find-channels");
                    return true;
                }
            }
        }
        return super.dispatchKeyEvent(event);
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleIntentExtras(intent);
    }

    private void handleIntentExtras(Intent intent) {
        Log.i("handleIntentExtras", "handleIntentExtras");
        if (intent != null && intent.getExtras() != null) {
            Log.i("handleIntentExtras", "intent.getExtras() != null");
            Bundle bundle = intent.getExtras();
            String channelId = bundle.getString(NotificationUtils.CHANNEL_ID_KEY);
            String serverId = bundle.getString(NotificationUtils.SERVER_ID_KEY);
            String conferenceId = bundle.getString(NotificationUtils.CONFERENCE_ID_KEY);
            String conferenceJWT = bundle.getString(NotificationUtils.CONFERENCE_JWT_KEY);
            CallManagerModule callManagerModule = CallManagerModule.getInstance();

            if (callManagerModule != null
                    && channelId != null
                    && serverId != null
                    && conferenceJWT != null) {
                Log.i("handleIntentExtras", "callmanager != null");
                Log.i("handleIntentExtras", "serverId = " + serverId);
                Log.i("handleIntentExtras", "channelId = " + channelId);
                Log.i("handleIntentExtras", "conferenceJWT = " + conferenceJWT);
                //callManagerModule.callAnswered(serverId, channelId, conferenceJWT);
            }

            if (conferenceId != null) {
                Log.i("handleIntentExtras", "conferenceId == " + conferenceId);
                Log.i("handleIntentExtras", "dismissCallNotification");
                NotificationUtils.dismissCallNotification(this, conferenceId);
            }
        } else {
            Log.i("handleIntentExtras", "intent extras null");
        }
   }

    private void setHWKeyboardConnected() {
        HWKeyboardConnected = getResources().getConfiguration().keyboard == Configuration.KEYBOARD_QWERTY;
    }
}
