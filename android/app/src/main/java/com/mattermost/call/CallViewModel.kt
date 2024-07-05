package com.mattermost.call

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import com.mattermost.call.CallActivity.Companion.MAX_CALLERS
import com.mattermost.rnbeta.*

class CallViewModel(application: Application) : AndroidViewModel(application) {

    fun getFormattedCallers(channelName: String?): String {
        return channelName?.let {
            val splittedCallers = it.replace(" ", "").split(",")
            var formattedCallers = ""
            splittedCallers.forEachIndexed { index, caller ->
                if (index + 1 > MAX_CALLERS) {
                    val count = splittedCallers.size - index
                    formattedCallers +=
                        getApplication<Application>()
                            .resources
                            .getQuantityString(R.plurals.manyCallers, count, count)
                    return formattedCallers
                } else {
                    formattedCallers += if (index != 0) ", $caller" else caller
                }
            }
            formattedCallers
        } ?: ""
    }
}
