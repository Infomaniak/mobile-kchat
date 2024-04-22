package com.mattermost.rnbeta

import android.content.Intent
import android.content.res.Configuration
import android.os.Bundle
import android.util.Log
import android.view.KeyEvent

import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.ReactActivityDelegate

import com.github.emilioicai.hwkeyboardevent.HWKeyboardEventModule

import com.mattermost.call.CallManagerModule
import com.mattermost.notification.NotificationUtils

import com.reactnativenavigation.NavigationActivity

class MainActivity : NavigationActivity() {
    private var HWKeyboardConnected = false
    private val foldableObserver = FoldableObserver.getInstance(this)

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "Mattermost"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, DefaultNewArchitectureEntryPoint.fabricEnabled)


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(null)
        setContentView(R.layout.launch_screen)
        handleIntentExtras(getIntent())
        setHWKeyboardConnected()
        foldableObserver.onCreate()
    }

    override fun onStart() {
        super.onStart()
        foldableObserver.onStart()
    }

    override fun onStop() {
        super.onStop()
        foldableObserver.onStop()
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        if (newConfig.hardKeyboardHidden == Configuration.HARDKEYBOARDHIDDEN_NO) {
            HWKeyboardConnected = true
        } else if (newConfig.hardKeyboardHidden == Configuration.HARDKEYBOARDHIDDEN_YES) {
            HWKeyboardConnected = false
        }
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        reactGateway.onWindowFocusChanged(hasFocus)
    }

    /*
    https://mattermost.atlassian.net/browse/MM-10601
    Required by react-native-hw-keyboard-event
    (https://github.com/emilioicai/react-native-hw-keyboard-event)
    */
    override fun dispatchKeyEvent(event: KeyEvent): Boolean {
        if (HWKeyboardConnected) {
            val keyCode = event.keyCode
            val keyAction = event.action
            if (keyAction == KeyEvent.ACTION_UP) {
                if (keyCode == KeyEvent.KEYCODE_ENTER) {
                    val keyPressed = if (event.isShiftPressed) "shift-enter" else "enter"
                    HWKeyboardEventModule.getInstance().keyPressed(keyPressed)
                    return true
                } else if (keyCode == KeyEvent.KEYCODE_K && event.isCtrlPressed) {
                    HWKeyboardEventModule.getInstance().keyPressed("find-channels")
                    return true
                }
            }
        }
        return super.dispatchKeyEvent(event)
    }

    private fun setHWKeyboardConnected() {
        HWKeyboardConnected = getResources().configuration.keyboard == Configuration.KEYBOARD_QWERTY
    }

    override fun onWindowFocusChanged(intent: Intent) {
        super.onNewIntent(intent)
        handleIntentExtras(intent)
    }

    public fun handleIntentExtras(intent: Intent) {
        Log.i("handleIntentExtras", "handleIntentExtras")
        if (intent != null && intent.getExtras() != null) {
            Log.i("handleIntentExtras", "intent.getExtras() != null")
            val options: WebRTCModuleOptions = WebRTCModuleOptions.getInstance()
            val bundle: Bundle = intent.getExtras()
            val channelId: String = bundle.getString(NotificationUtils.CHANNEL_ID_KEY)
            val serverId: String = bundle.getString(NotificationUtils.SERVER_ID_KEY)
            val conferenceId: String = bundle.getString(NotificationUtils.CONFERENCE_ID_KEY)
            val conferenceJWT: String = bundle.getString(NotificationUtils.CONFERENCE_JWT_KEY)
            val callManagerModule: CallManagerModule = CallManagerModule.getInstance()

            if (callManagerModule != null
                    && channelId != null
                    && serverId != null
                    && conferenceJWT != null) {
                Log.i("handleIntentExtras", "callmanager != null")
                Log.i("handleIntentExtras", "serverId = " + serverId)
                Log.i("handleIntentExtras", "channelId = " + channelId)
                Log.i("handleIntentExtras", "conferenceJWT = " + conferenceJWT)
                //callManagerModule.callAnswered(serverId, channelId, conferenceJWT)
            }

            if (conferenceId != null) {
                Log.i("handleIntentExtras", "conferenceId == " + conferenceId)
                Log.i("handleIntentExtras", "dismissCallNotification")
                NotificationUtils.dismissCallNotification(this, conferenceId)
            }
        } else {
            Log.i("handleIntentExtras", "intent extras null")
        }
   }
}
