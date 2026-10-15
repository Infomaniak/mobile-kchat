#import "RNUtils.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNUtilsSpec.h"

using namespace facebook::react;
using namespace JS::NativeRNUtils;
#endif

#if __has_include("mattermost_rnutils-Swift.h")
#import <mattermost_rnutils-Swift.h>
#else
#import <mattermost_rnutils/mattermost_rnutils-Swift.h>
#endif

@interface RNUtils() <RNUtilsDelegate>
+ (UIImage *)circularImageFromImage:(UIImage *)image size:(CGFloat)size ringColor:(NSString *)ringColor;
+ (UIImage *)initialsAvatarWithSize:(CGFloat)size initials:(NSString *)initials backgroundColor:(NSString *)backgroundColor ringColor:(NSString *)ringColor;
+ (UIColor *)colorFromHex:(NSString *)hex;
+ (NSString *)base64UriFromImage:(UIImage *)image;
- (void)renderTabAvatarWithOptions:(NSDictionary *)options resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
@end

@implementation RNUtils {
    RNUtilsWrapper *wrapper;
}

-(instancetype)init {
    self = [super init];
    if (self) {
        wrapper = [RNUtilsWrapper new];
        wrapper.delegate = self;
        [wrapper captureEvents];
    }
    return self;
}

#pragma protocol

- (void)sendEventWithName:(NSString * _Nonnull)name result:(NSDictionary<NSString *,id> * _Nullable)result {
    [self sendEventWithName:name body:result];
}

- (NSArray<NSString *> *)supportedEvents {
  return [RNUtilsWrapper supportedEvents];
}

#pragma overrides
+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (NSDictionary *)constantsToExport {
  return @{
           @"appGroupIdentifier": [wrapper getAppGroupId],
           @"appGroupSharedDirectory" : [wrapper appGroupSharedDirectory]
           };
}

RCT_EXPORT_MODULE(RNUtils)

RCT_REMAP_BLOCKING_SYNCHRONOUS_METHOD(deleteDatabaseDirectory, NSDictionary*, databaseName:(NSString *)databaseName
                                       shouldRemoveDirectory:(BOOL)shouldRemoveDirectory) {
    return [wrapper deleteDatabaseDirectoryWithDatabaseName:databaseName shouldRemoveDirectory:shouldRemoveDirectory];
}

RCT_REMAP_BLOCKING_SYNCHRONOUS_METHOD(renameDatabase, NSDictionary*, dataabaseName:(NSString *)databaseName
                                       newDatabaseName:(NSString *)newDatabaseName) {
    return [wrapper renameDatabaseWithDatabaseName:databaseName newDatabaseName:newDatabaseName];
}

RCT_REMAP_BLOCKING_SYNCHRONOUS_METHOD(deleteEntitiesFile, NSNumber*, deleteEntities) {
    return [wrapper deleteEntitiesFile];
}

RCT_REMAP_BLOCKING_SYNCHRONOUS_METHOD(isRunningInSplitView, NSDictionary*, isSplitView) {
    return [wrapper isRunningInSplitView];
}

RCT_REMAP_BLOCKING_SYNCHRONOUS_METHOD(getWindowDimensions, NSDictionary*, windowDimensions) {
    return [wrapper getWindowDimensions];
}

RCT_REMAP_BLOCKING_SYNCHRONOUS_METHOD(getHasRegisteredLoad, NSDictionary*, getLoad) {
    return [wrapper getHasRegisteredLoad];
}

RCT_REMAP_METHOD(setHasRegisteredLoad, setLoad) {
    [wrapper setHasRegisteredLoad];
}

RCT_REMAP_METHOD(unlockOrientation, unlock) {
    [wrapper unlockOrientation];
}

RCT_REMAP_METHOD(lockPortrait, portrait) {
    [wrapper lockOrientation];
}

RCT_EXPORT_METHOD(getDeliveredNotifications:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject) {
    [self getNotifications:resolve];
}

RCT_REMAP_METHOD(removeChannelNotifications, serverUrl:(NSString *)serverUrl
                  channeId:(NSString *)channelId) {
    [self removeChannelNotifications:serverUrl channelId:channelId];
}

RCT_REMAP_METHOD(removeThreadNotifications, server:(NSString *)serverUrl
                  threadId:(NSString *)threadId) {
    [self removeThreadNotifications:serverUrl threadId:threadId];
}

RCT_REMAP_METHOD(removeServerNotifications, serverUrl:(NSString *)serverUrl) {
    [self removeServerNotifications:serverUrl];
}

RCT_EXPORT_METHOD(getRealFilePath:(NSString *)filePath
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject) {
    [self getRealFilePath:filePath resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(saveFile:(NSString *)filePath
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject) {
    [self saveFile:filePath resolve:resolve reject:reject];
}

RCT_REMAP_METHOD(setSoftKeyboardToAdjustResize, setAdjustResize) {
    [self setSoftKeyboardToAdjustResize];
}

RCT_REMAP_METHOD(setSoftKeyboardToAdjustNothing, setAdjustNothing) {
    [self setSoftKeyboardToAdjustNothing];
}

RCT_EXPORT_METHOD(createZipFile:(NSArray<NSString *> *)paths
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject) {
    [self createZipFile:paths resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(renderTabAvatar:(NSDictionary *)options
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject) {
    [self renderTabAvatarWithOptions:options resolve:resolve reject:reject];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<TurboModule>)getTurboModule:
    (const ObjCTurboModule::InitParams &)params
{
    return std::make_shared<NativeRNUtilsSpecJSI>(params);
}

- (ModuleConstants<Constants::Builder>)getConstants {
    NSDictionary *appGroup = [wrapper appGroupSharedDirectory];
    NSString *sharedDirectory = appGroup[@"sharedDirectory"];
    NSString *databasePath = appGroup[@"databasePath"];
    NSString *appGroupIdentifier = [wrapper getAppGroupId];
    
    ConstantsAppGroupSharedDirectory::Builder::Input sharedDirectoryInput = {
          sharedDirectory,
          databasePath
        };
    
    ConstantsAppGroupSharedDirectory::Builder sharedDirectoryBuilder(sharedDirectoryInput);
    Constants::Builder::Input constantsInput = {
          appGroupIdentifier,
          sharedDirectoryBuilder
        };
    
    Constants::Builder constantsBuilder(constantsInput);

    return [_RCTTypedModuleConstants newWithUnsafeDictionary:constantsBuilder.buildUnsafeRawValue()];
}
#endif

- (NSDictionary *)deleteDatabaseDirectory:(NSString *)databaseName shouldRemoveDirectory:(BOOL)shouldRemoveDirectory {
    return [wrapper deleteDatabaseDirectoryWithDatabaseName:databaseName shouldRemoveDirectory:shouldRemoveDirectory];
}

- (NSDictionary *)renameDatabase:(NSString *)databaseName newDatabaseName:(NSString *)newDatabaseName {
    return [wrapper renameDatabaseWithDatabaseName:databaseName newDatabaseName:newDatabaseName];
}

- (NSNumber *)deleteEntitiesFile {
    return [wrapper deleteEntitiesFile];
}

- (NSDictionary *)isRunningInSplitView {
    return [wrapper isRunningInSplitView];
}

- (NSDictionary *)getWindowDimensions {
    return [wrapper getWindowDimensions];
}

- (NSDictionary *)getHasRegisteredLoad {
    return [wrapper getHasRegisteredLoad];
}

- (void)setHasRegisteredLoad {
    [wrapper setHasRegisteredLoad];
}

- (void)lockPortrait {
    [wrapper lockOrientation];
}

- (void)unlockOrientation {
    [wrapper unlockOrientation];
}


- (void)getDeliveredNotifications:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self getNotifications:resolve];
}


- (void)removeChannelNotifications:(NSString *)serverUrl channelId:(NSString *)channelId {
    [[NotificationManager shared] removeChannelNotificationsWithServerUrl:serverUrl channelId:channelId];
}

- (void)removeThreadNotifications:(NSString *)serverUrl threadId:(NSString *)threadId {
    [[NotificationManager shared] removeThreadNotificationsWithServerUrl:serverUrl threadId:threadId];
}

- (void)removeServerNotifications:(NSString *)serverUrl {
    [[NotificationManager shared] removeServerNotificationsWithServerUrl:serverUrl];
}

- (void)getRealFilePath:(NSString *)filePath resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    resolve(@"");
}

- (void)saveFile:(NSString *)filePath resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    resolve(@"");
}

- (void)createZipFile:(NSArray<NSString *> *)paths resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary *result = [wrapper createZipFileWithSourcePaths:paths];
    
    if ([[result objectForKey:@"success"] boolValue]) {
        resolve([result objectForKey:@"zipFilePath"]);
    } else {
        reject(@"create_zip_error", [result objectForKey:@"error"], nil);
    }
}

-(void)setSoftKeyboardToAdjustResize {
    // Do nothing as it does not apply to iOS
}

-(void)setSoftKeyboardToAdjustNothing {
    // Do nothing as it does not apply to iOS
}

// Codegen dispatch (turbo module): the generated spec calls this exact selector.
#ifdef RCT_NEW_ARCH_ENABLED
- (void)renderTabAvatar:(JS::NativeRNUtils::AvatarOptions &)options resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self renderTabAvatarWithOptions:@{
        @"uri": options.uri() ?: @"",
        @"headers": options.headers() ?: @{},
        @"size": @(options.size()),
        @"initials": options.initials() ?: @"",
        @"backgroundColor": options.backgroundColor() ?: @"",
        @"ringColor": options.ringColor() ?: @"",
    } resolve:resolve reject:reject];
}
#endif

- (void)renderTabAvatarWithOptions:(NSDictionary *)options resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    CGFloat size = [options[@"size"] doubleValue] ?: 28.0;
    NSString *initials = options[@"initials"];
    NSString *backgroundColor = options[@"backgroundColor"];
    NSString *ringColor = options[@"ringColor"];
    NSString *uri = options[@"uri"];
    NSDictionary<NSString *, NSString *> *headers = options[@"headers"];

    NSURL *url = [NSURL URLWithString:uri];
    if (url == nil) {
        UIImage *image = [RNUtils initialsAvatarWithSize:size initials:initials backgroundColor:backgroundColor ringColor:ringColor];
        resolve([RNUtils base64UriFromImage:image]);
        return;
    }

    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    for (NSString *key in headers) {
        NSString *value = headers[key];
        if (value != nil) {
            [request addValue:value forHTTPHeaderField:key];
        }
    }
    request.timeoutInterval = 10.0;

    NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        UIImage *avatar = nil;
        if (data.length > 0 && !error) {
            avatar = [RNUtils circularImageFromImage:[UIImage imageWithData:data] size:size ringColor:ringColor];
        }

        if (avatar == nil) {
            NSLog(@"[RNUtils] tab avatar download failed (%@), rendering initials fallback", error.localizedDescription);
            avatar = [RNUtils initialsAvatarWithSize:size initials:initials backgroundColor:backgroundColor ringColor:ringColor];
        }

        NSString *result = [RNUtils base64UriFromImage:avatar];
        dispatch_async(dispatch_get_main_queue(), ^{
            resolve(result);
        });
    }];
    [task resume];
}

#pragma helpers
-(void)getNotifications:(RCTPromiseResolveBlock)resolve {
    [[NotificationManager shared] getDeliveredNotificationsWithCompletionHandler:^(NSArray<NSDictionary *> * _Nonnull notifications) {
        resolve(notifications);
    }];
}

#pragma mark - Tab avatar helpers

+ (UIImage *)circularImageFromImage:(UIImage *)image size:(CGFloat)size ringColor:(NSString *)ringColor {
    if (image == nil || size <= 0) {
        return nil;
    }

    CGFloat ring = ringColor.length > 0 ? 2.0 : 0.0;
    UIGraphicsImageRendererFormat *format = [[UIGraphicsImageRendererFormat alloc] init];
    format.scale = [UIScreen mainScreen].scale;
    UIGraphicsImageRenderer *renderer = [[UIGraphicsImageRenderer alloc] initWithSize:CGSizeMake(size, size) format:format];

    return [renderer imageWithActions:^(UIGraphicsImageRendererContext *context) {
        // The photo fills the whole canvas, the ring is stroked over its
        // outer edge, matching the kDrive tab bar profile icon.
        [[UIBezierPath bezierPathWithOvalInRect:CGRectMake(0, 0, size, size)] addClip];

        CGFloat scale = MAX(size / image.size.width, size / image.size.height);
        CGSize scaled = CGSizeMake(image.size.width * scale, image.size.height * scale);
        CGRect drawRect = CGRectMake((size - scaled.width) / 2.0, (size - scaled.height) / 2.0, scaled.width, scaled.height);
        [image drawInRect:drawRect];

        if (ring > 0) {
            UIBezierPath *ringPath = [UIBezierPath bezierPathWithOvalInRect:CGRectMake(ring / 2.0, ring / 2.0, size - ring, size - ring)];
            ringPath.lineWidth = ring;
            [[RNUtils colorFromHex:ringColor] setStroke];
            [ringPath stroke];
        }
    }];
}

+ (UIImage *)initialsAvatarWithSize:(CGFloat)size initials:(NSString *)initials backgroundColor:(NSString *)backgroundColor ringColor:(NSString *)ringColor {
    if (size <= 0) {
        return nil;
    }

    CGFloat ring = ringColor.length > 0 ? 2.0 : 0.0;
    UIColor *background = backgroundColor.length ? [RNUtils colorFromHex:backgroundColor] : [UIColor lightGrayColor];
    UIGraphicsImageRendererFormat *format = [[UIGraphicsImageRendererFormat alloc] init];
    format.scale = [UIScreen mainScreen].scale;
    UIGraphicsImageRenderer *renderer = [[UIGraphicsImageRenderer alloc] initWithSize:CGSizeMake(size, size) format:format];

    return [renderer imageWithActions:^(UIGraphicsImageRendererContext *context) {
        [[UIBezierPath bezierPathWithOvalInRect:CGRectMake(0, 0, size, size)] addClip];
        CGRect rect = CGRectMake(0, 0, size, size);
        [background setFill];
        [[UIBezierPath bezierPathWithOvalInRect:rect] fill];

        UIFont *font = [UIFont fontWithName:@"Metropolis-SemiBold" size:size * 0.4];
        if (font == nil) {
            font = [UIFont systemFontOfSize:size * 0.4 weight:UIFontWeightSemibold];
        }

        NSDictionary *attributes = @{
            NSFontAttributeName: font,
            NSForegroundColorAttributeName: UIColor.whiteColor,
        };

        NSString *text = initials.length ? [initials uppercaseString] : @"";
        CGSize textSize = [text sizeWithAttributes:attributes];
        CGRect textRect = CGRectMake(0, (size - textSize.height) / 2.0, size, textSize.height);
        [text drawInRect:textRect withAttributes:attributes];

        if (ring > 0) {
            UIBezierPath *ringPath = [UIBezierPath bezierPathWithOvalInRect:CGRectMake(ring / 2.0, ring / 2.0, size - ring, size - ring)];
            ringPath.lineWidth = ring;
            [[RNUtils colorFromHex:ringColor] setStroke];
            [ringPath stroke];
        }
    }];
}

+ (UIColor *)colorFromHex:(NSString *)hex {
    NSString *clean = [[hex stringByReplacingOccurrencesOfString:@"#" withString:@""] uppercaseString];
    if (clean.length < 6) {
        return [UIColor lightGrayColor];
    }

    NSScanner *scanner = [NSScanner scannerWithString:clean];
    unsigned int value = 0;
    [scanner scanHexInt:&value];

    CGFloat red = ((value >> 16) & 0xFF) / 255.0;
    CGFloat green = ((value >> 8) & 0xFF) / 255.0;
    CGFloat blue = (value & 0xFF) / 255.0;
    return [UIColor colorWithRed:red green:green blue:blue alpha:1.0];
}

+ (NSString *)base64UriFromImage:(UIImage *)image {
    if (image == nil) {
        return nil;
    }

    NSData *data = UIImagePNGRepresentation(image);
    if (data == nil) {
        return nil;
    }

    return [NSString stringWithFormat:@"data:image/png;base64,%@", [data base64EncodedStringWithOptions:0]];
}


@end
