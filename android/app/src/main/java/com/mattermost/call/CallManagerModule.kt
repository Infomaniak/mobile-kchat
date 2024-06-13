package com.mattermost.call

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.mattermost.notification.NotificationUtils

class CallManagerModule(private var reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var listenerCount = 0

    companion object {
        private var instance: CallManagerModule? = null

        @JvmStatic
        var onModuleInitializedListener: (() -> Unit)? = null

        @JvmStatic
        fun getInstance(reactContext: ReactApplicationContext): CallManagerModule {
            if (instance == null) {
                instance = CallManagerModule(reactContext)
            } else {
                instance!!.reactContext = reactContext
            }

            return instance!!
        }

        @JvmStatic
        fun getInstance(): CallManagerModule? {
            return instance
        }
    }

    override fun getName() = "CallManagerModule"

    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactContext
            .getJSModule(RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    fun callAnswered(serverId: String, channelId: String, conferenceJWT: String) {
        val result = if (currentActivity != null) {
            val map = Arguments.createMap()
            map.putString(NotificationUtils.INTENT_EXTRA_SERVER_ID_KEY, serverId)
            map.putString(NotificationUtils.INTENT_EXTRA_CHANNEL_ID_KEY, channelId)
            map.putString(NotificationUtils.INTENT_EXTRA_CONFERENCE_JWT_KEY, conferenceJWT)
            map
        } else {
            null
        }

        sendEvent("CallAnswered", result)
    }

    fun callEnded(serverId: String, conferenceId: String) {
        val result = if (currentActivity != null) {
            val map = Arguments.createMap()
            map.putString(NotificationUtils.INTENT_EXTRA_SERVER_ID_KEY, serverId)
            map.putString(NotificationUtils.INTENT_EXTRA_CONFERENCE_ID_KEY, conferenceId)
            map
        } else {
            null
        }

        sendEvent("CallEnded", result)
    }

    @ReactMethod
    fun initialized() {
        onModuleInitializedListener?.invoke()
    }

    @ReactMethod
    fun addListener(eventName: String) {
        listenerCount += 1
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        listenerCount -= count
    }
}
