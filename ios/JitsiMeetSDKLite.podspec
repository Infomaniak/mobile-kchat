Pod::Spec.new do |s|
  s.name                  = 'JitsiMeetSDKLite'
  s.version               = '13.1.1-lite'
  s.summary               = 'Jitsi Meet iOS SDK Lite (kChat fork — hermesvm stripped to avoid conflict with RN Hermes)'
  s.description           = 'Jitsi Meet is a WebRTC compatible, free and Open Source video conferencing system that provides browsers and mobile applications with Real Time Communications capabilities. This is the lite SDK.'
  s.homepage              = 'https://github.com/jitsi/jitsi-meet-ios-sdk-releases'
  s.license               = 'Apache 2'
  s.authors               = 'The Jitsi Meet project authors'
  s.source                = { :git => 'https://github.com/jitsi/jitsi-meet-ios-sdk-releases.git', :tag => '13.1.1-lite' }
  s.platforms             = { :ios => '15.1' }
  s.swift_versions        = '5'

  # Only vendored JitsiMeetSDK framework — hermesvm.xcframework removed
  # to avoid conflict with React Native 0.83's hermes-engine which also
  # ships hermesvm.xcframework. RN's Hermes is the active JS engine.
  # The Jitsi SDK will use the RN-provided Hermes at runtime.
  s.vendored_frameworks  = ['lite/Frameworks/JitsiMeetSDK.xcframework']

  s.dependency 'JitsiWebRTC', '~> 124.0'
end
