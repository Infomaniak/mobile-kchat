package com.mattermost.helpers;

import android.content.Context;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.mattermost.networkclient.ApiClientModuleImpl;
import com.mattermost.networkclient.enums.RetryTypes;
import com.mattermost.turbolog.TurboLog;

import java.util.Iterator;
import java.util.Map;
import okhttp3.HttpUrl;
import okhttp3.Response;



public class Network {
    private static ApiClientModuleImpl clientModule;
    private static final WritableMap clientOptions = Arguments.createMap();
    private static final Promise emptyPromise = new ResolvePromise();
    private static Context context;

    public static void init(Context context) {
        Network.context = context;
        if (clientModule == null) {
            clientModule = new ApiClientModuleImpl(context);
            createClientOptions();
        } else {
            TurboLog.Companion.i("ReactNative", "Network already initialized");
        }
    }

    public static WritableMap addHeaders(String baseUrl, ReadableMap options) {
        WritableMap newOptions;
        if (options == null) {
            newOptions = Arguments.createMap();
        } else {
            newOptions = toWritableMap(options.toHashMap());
        }
        WritableMap headers = Arguments.createMap();

        String token = Credentials.getCredentialsForServerSync(Network.context, baseUrl);

        if (token != null) {
            headers.putString("Authorization", "Bearer " + token);
            headers.putString("Content-Type", "application/json");
        }
        newOptions.putMap("headers", headers);
        return newOptions;
    }

    public static WritableMap toWritableMap(Map<String, Object> map) {
        WritableMap writableMap = Arguments.createMap();
        Iterator iterator = map.entrySet().iterator();

        while (iterator.hasNext()) {
            Map.Entry pair = (Map.Entry) iterator.next();
            Object value = pair.getValue();

            if (value == null) {
                writableMap.putNull((String) pair.getKey());
            } else if (value instanceof Boolean) {
                writableMap.putBoolean((String) pair.getKey(), (Boolean) value);
            } else if (value instanceof Double) {
                writableMap.putDouble((String) pair.getKey(), (Double) value);
            } else if (value instanceof Integer) {
                writableMap.putInt((String) pair.getKey(), (Integer) value);
            } else if (value instanceof String) {
                writableMap.putString((String) pair.getKey(), (String) value);
            } else if (value instanceof Map) {
                writableMap.putMap((String) pair.getKey(), toWritableMap((Map<String, Object>) value));
            } else if (value.getClass() != null && value.getClass().isArray()) {
                writableMap.putArray((String) pair.getKey(), toWritableArray((Object[]) value));
            }

            iterator.remove();
        }

        return writableMap;
    }

    public static WritableArray toWritableArray(Object[] array) {
        WritableArray writableArray = Arguments.createArray();

        for (int i = 0; i < array.length; i++) {
            Object value = array[i];

            if (value == null) {
                writableArray.pushNull();
            }
            if (value instanceof Boolean) {
                writableArray.pushBoolean((Boolean) value);
            }
            if (value instanceof Double) {
                writableArray.pushDouble((Double) value);
            }
            if (value instanceof Integer) {
                writableArray.pushInt((Integer) value);
            }
            if (value instanceof String) {
                writableArray.pushString((String) value);
            }
            if (value instanceof Map) {
                writableArray.pushMap(toWritableMap((Map<String, Object>) value));
            }
            if (value.getClass().isArray()) {
                writableArray.pushArray(toWritableArray((Object[]) value));
            }
        }

        return writableArray;
    }

    public static void get(String baseUrl, String endpoint, ReadableMap options, Promise promise) {
        createClientIfNeeded(baseUrl);
        clientModule.get(baseUrl, endpoint, addHeaders(baseUrl, options), promise);
    }

    public static void post(String baseUrl, String endpoint, ReadableMap options, Promise promise) {
        createClientIfNeeded(baseUrl);
        clientModule.post(baseUrl, endpoint, addHeaders(baseUrl, options), promise);
    }

    public static Response getSync(String baseUrl, String endpoint, ReadableMap options) {
        createClientIfNeeded(baseUrl);
        return clientModule.getSync(baseUrl, endpoint, addHeaders(baseUrl, options));
    }

    public static Response postSync(String baseUrl, String endpoint, ReadableMap options) {
        createClientIfNeeded(baseUrl);
        return clientModule.postSync(baseUrl, endpoint, addHeaders(baseUrl, options));
    }

    private static void createClientOptions() {
        WritableMap headers = Arguments.createMap();
        headers.putString("X-Requested-With", "XMLHttpRequest");
        clientOptions.putMap("headers", headers);

        WritableMap retryPolicyConfiguration = Arguments.createMap();
        retryPolicyConfiguration.putString("type", RetryTypes.EXPONENTIAL_RETRY.getType());
        retryPolicyConfiguration.putDouble("retryLimit", 2);
        retryPolicyConfiguration.putDouble("exponentialBackoffBase", 2);
        retryPolicyConfiguration.putDouble("exponentialBackoffScale", 0.5);
        clientOptions.putMap("retryPolicyConfiguration", retryPolicyConfiguration);

        WritableMap requestAdapterConfiguration = Arguments.createMap();
        requestAdapterConfiguration.putString("bearerAuthTokenResponseHeader", "token");
        clientOptions.putMap("requestAdapterConfiguration", requestAdapterConfiguration);

        WritableMap sessionConfiguration = Arguments.createMap();
        sessionConfiguration.putInt("httpMaximumConnectionsPerHost", 10);
        sessionConfiguration.putDouble("timeoutIntervalForRequest", 30000);
        sessionConfiguration.putDouble("timeoutIntervalForResource", 30000);
        clientOptions.putMap("sessionConfiguration", sessionConfiguration);
    }

    private static void createClientIfNeeded(String baseUrl) {
        HttpUrl url = HttpUrl.parse(baseUrl);
        if (url != null && !clientModule.hasClientFor(url)) {
            clientModule.createClientFor(baseUrl, clientOptions, emptyPromise);
        }
    }
}
