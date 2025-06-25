"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
let ConnectionService = react_native_1.NativeModules.ConnectionService;
// XXX Rather than wrapping ConnectionService in a new class and forwarding
// the many methods of the latter to the former, add the one additional
// method that we need to ConnectionService.
if (ConnectionService) {
    const eventEmitter = new react_native_1.NativeEventEmitter(ConnectionService);
    ConnectionService = {
        ...ConnectionService,
        addListener: eventEmitter.addListener.bind(eventEmitter),
        registerSubscriptions(context, delegate) {
            return [
                ConnectionService.addListener('org.jitsi.meet:features/connection_service#disconnect', delegate._onPerformEndCallAction, context),
                ConnectionService.addListener('org.jitsi.meet:features/connection_service#abort', delegate._onPerformEndCallAction, context)
            ];
        },
        setMuted() {
            // Currently no-op, but remember to remove when implemented on
            // the native side
        }
    };
}
exports.default = ConnectionService;
