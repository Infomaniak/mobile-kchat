package com.mattermost.helpers

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = PostRetryModule.NAME)
class PostRetryModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        const val NAME = "PostRetry"
    }

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    fun enqueueRetryWork() {
        PostRetryWorker.enqueue(reactApplicationContext)
    }
}
