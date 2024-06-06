package com.mattermost.call

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter

class CallManagerModule(private var reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var listenerCount = 0

    companion object {
        private var instance: CallManagerModule? = null

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
            map.putString("serverId", serverId)
            map.putString("channelId", channelId)
            map.putString("conferenceJWT", conferenceJWT)
            map
        } else {
            null
        }

        sendEvent("CallAnswered", result)
    }

    fun callEnded(serverId: String, conferenceId: String) {
        val result = if (currentActivity != null) {
            val map = Arguments.createMap()
            map.putString("serverId", serverId)
            map.putString("conferenceId", conferenceId)
            map
        } else {
            null
        }

        sendEvent("CallEnded", result)
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
