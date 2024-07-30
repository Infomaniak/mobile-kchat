package com.mattermost.call

import android.app.Application
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.mattermost.call.CallActivity.Companion.MAX_CALLERS
import com.mattermost.rnbeta.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class CallViewModel(application: Application) : AndroidViewModel(application) {

    private val callManagerModule by lazy { CallManagerModule.getInstance() }

    val conferenceImageLiveData = MutableLiveData<Bitmap?>()

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

    fun cancelCall(serverId: String, conferenceId: String) {
        NetworkUtils.cancelCall(serverId, conferenceId)
        callManagerModule?.callEnded(serverId = serverId, conferenceId = conferenceId)
    }

    fun getUserImage(serverId: String?, conferenceId: String?) {
        if (serverId != null && conferenceId != null) {
            viewModelScope.launch(Dispatchers.IO) {
                NetworkUtils.getUserIdFromConference(serverId, conferenceId)?.let { userId ->
                    val userImageByteArray = NetworkUtils.getUserImage(serverId, userId)
                    val bitmap =
                        BitmapFactory.decodeByteArray(userImageByteArray, 0, userImageByteArray.size)
                    conferenceImageLiveData.postValue(bitmap)
                }
            }
        } else {
            conferenceImageLiveData.value = null
        }
    }
}
