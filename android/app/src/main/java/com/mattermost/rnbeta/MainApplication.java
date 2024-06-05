package com.mattermost.rnbeta;

import static com.mattermost.rnbeta.CustomPushNotification.CHANNEL_ID_CALL;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.facebook.react.PackageList;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.JSIModulePackage;
import com.facebook.react.bridge.JSIModuleSpec;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.soloader.SoLoader;
import com.mattermost.flipper.ReactNativeFlipper;
import com.mattermost.helpers.RealPathUtil;
import com.mattermost.networkclient.RCTOkHttpClientFactory;
import com.mattermost.share.ShareModule;
import com.nozbe.watermelondb.jsi.WatermelonDBJSIPackage;
import com.oney.WebRTCModule.WebRTCModuleOptions;
import com.reactnativenavigation.NavigationApplication;
import com.wix.reactnativenotifications.RNNotificationsPackage;
import com.wix.reactnativenotifications.core.AppLaunchHelper;
import com.wix.reactnativenotifications.core.AppLifecycleFacade;
import com.wix.reactnativenotifications.core.JsIOHelper;
import com.wix.reactnativenotifications.core.notification.INotificationsApplication;
import com.wix.reactnativenotifications.core.notification.IPushNotification;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainApplication extends NavigationApplication implements INotificationsApplication {
    public static MainApplication instance;

    public Boolean sharedExtensionIsOpened = false;
    private final ReactNativeHost mReactNativeHost =
            new DefaultReactNativeHost(this) {
                @Override
                public boolean getUseDeveloperSupport() {
                    return BuildConfig.DEBUG;
                }

                @Override
                protected List<ReactPackage> getPackages() {
                    List<ReactPackage> packages = new PackageList(this).getPackages();
                    // Packages that cannot be autolinked yet can be added manually here, for example:
                    // packages.add(new MyReactNativePackage());
                    packages.add(new RNNotificationsPackage(MainApplication.this));

                    packages.add(
                            new TurboReactPackage() {

                                @Override
                                public NativeModule getModule(String name, ReactApplicationContext reactContext) {
                                    switch (name) {
                                        case "MattermostManaged":
                                            return MattermostManagedModule.getInstance(reactContext);
                                        case "MattermostShare":
                                            return ShareModule.getInstance(reactContext);
                                        case "Notifications":
                                            return NotificationsModule.getInstance(instance, reactContext);
                                        case "SplitView":
                                            return SplitViewModule.getInstance(reactContext);
                                        case "CallManagerModule":
                                            return CallManagerModule.getInstance(reactContext);
                                        default:
                                            throw new IllegalArgumentException("Could not find module " + name);
                                    }
                                }

                                @Override
                                public ReactModuleInfoProvider getReactModuleInfoProvider() {
                                    return () -> {
                                        Map<String, ReactModuleInfo> map = new HashMap<>();
                                        map.put("MattermostManaged", new ReactModuleInfo("MattermostManaged", "com.mattermost.rnbeta.MattermostManagedModule", false, false, false, false, false));
                                        map.put("MattermostShare", new ReactModuleInfo("MattermostShare", "com.mattermost.share.ShareModule", false, false, true, false, false));
                                        map.put("Notifications", new ReactModuleInfo("Notifications", "com.mattermost.rnbeta.NotificationsModule", false, false, false, false, false));
                                        map.put("SplitView", new ReactModuleInfo("SplitView", "com.mattermost.rnbeta.SplitViewModule", false, false, false, false, false));
                                        map.put("CallManagerModule", new ReactModuleInfo("CallManagerModule", "com.mattermost.rnbeta.CallManagerModule", false, false, false, false, false));
                                        return map;
                                    };
                                }
                            }
                    );

                    return packages;
                }

                @Override
                protected JSIModulePackage getJSIModulePackage() {
                    return (reactApplicationContext, jsContext) -> {
                        List<JSIModuleSpec> modules = Collections.emptyList();
                        modules.addAll(new WatermelonDBJSIPackage().getJSIModules(reactApplicationContext, jsContext));

                        return modules;
                    };
                }

                @Override
                protected String getJSMainModuleName() {
                    return "index";
                }

                @Override
                protected boolean isNewArchEnabled() {
                    return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
                }

                @Override
                protected Boolean isHermesEnabled() {
                    return BuildConfig.IS_HERMES_ENABLED;
                }
            };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
        Context context = getApplicationContext();

        // Delete any previous temp files created by the app
        File tempFolder = new File(context.getCacheDir(), RealPathUtil.CACHE_DIR_NAME);
        RealPathUtil.deleteTempFiles(tempFolder);
        Log.i("ReactNative", "Cleaning temp cache " + tempFolder.getAbsolutePath());

        // Tells React Native to use our RCTOkHttpClientFactory which builds an OKHttpClient
        // with a cookie jar defined in APIClientModule and an interceptor to intercept all
        // requests that originate from React Native's OKHttpClient
        OkHttpClientProvider.setOkHttpClientFactory(new RCTOkHttpClientFactory());

        SoLoader.init(this, /* native exopackage */ false);
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // If you opted-in for the New Architecture, we load the native entry point for this app.
            DefaultNewArchitectureEntryPoint.load();
        }
        ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());

        // @jitsi/react-native-sdk setup
        // Ref https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-react-native-sdk#android
        WebRTCModuleOptions options = WebRTCModuleOptions.getInstance();
        options.enableMediaProjectionService = true;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            createCallNotificationChannel();
        }
    }

    @Override
    public IPushNotification getPushNotification(Context context, Bundle bundle, AppLifecycleFacade defaultFacade, AppLaunchHelper defaultAppLaunchHelper) {
        return new CustomPushNotification(
                context,
                bundle,
                defaultFacade,
                defaultAppLaunchHelper,
                new JsIOHelper()
        );
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void createCallNotificationChannel() {
        NotificationChannel callChannel = buildNotificationChannel(
                CHANNEL_ID_CALL,
                getString(R.string.notificationChannelName),
                NotificationManager.IMPORTANCE_HIGH,
                getString(R.string.notificationChannelDescription)
        );
        List<NotificationChannel> channels = new ArrayList<>();
        channels.add(callChannel);

        createNotificationChannels(channels);
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private NotificationChannel buildNotificationChannel(
            String channelId,
            String name,
            int importance,
            String description
    ) {
        NotificationChannel notificationChannel = new NotificationChannel(channelId, name, importance);

        notificationChannel.setDescription(description);

        boolean isImportant = importance == NotificationManager.IMPORTANCE_HIGH;
        notificationChannel.enableLights(isImportant);
        notificationChannel.setShowBadge(isImportant);
        notificationChannel.enableVibration(isImportant);
        return notificationChannel;
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private void createNotificationChannels(
            List<NotificationChannel> channelList
    ) {
        NotificationManager notificationManager = (NotificationManager) getSystemService(Application.NOTIFICATION_SERVICE);
        if (notificationManager != null) {
            notificationManager.createNotificationChannels(channelList);
        }
    }
}
