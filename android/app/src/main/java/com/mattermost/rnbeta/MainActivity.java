package com.mattermost.rnbeta;

import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import android.view.KeyEvent;
import android.content.res.Configuration;

import com.facebook.react.ReactActivityDelegate;
import com.reactnativenavigation.NavigationActivity;
import com.github.emilioicai.hwkeyboardevent.HWKeyboardEventModule;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.mattermost.helpers.CustomPushNotificationHelper;

import java.util.UUID;


public class MainActivity extends NavigationActivity {
    private boolean HWKeyboardConnected = false;

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
                getMainComponentName(),
                // If you opted-in for the New Architecture, we enable the Fabric Renderer.
                DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
                // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
                DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
        );
    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(null);
        setContentView(R.layout.launch_screen);
        setHWKeyboardConnected();
        askForNotificationPermissions();
    }

    private void askForNotificationPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            String postNotificationPermission = "android.permission.POST_NOTIFICATIONS";
            if (ContextCompat.checkSelfPermission(this, postNotificationPermission) == PackageManager.PERMISSION_GRANTED) {
            } else {
                CustomPushNotificationHelper.createNotificationChannels(this);
                NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CustomPushNotificationHelper.CHANNEL_MIN_IMPORTANCE_ID);
                builder.setSmallIcon(R.drawable.ic_notification);
                NotificationManagerCompat.from(this).notify(UUID.randomUUID().hashCode(), builder.build());
            }
        }
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
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

    private void setHWKeyboardConnected() {
        HWKeyboardConnected = getResources().getConfiguration().keyboard == Configuration.KEYBOARD_QWERTY;
    }
}
