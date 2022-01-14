const webSocketConnection = (function () {
    'use strict';
    window.oncontextmenu = function () {
        return false;
    }
    // REMOTE LOGGER

    let contractObject = {};

    /**
     * Define the type of the panel message
     * @param {string} panelMessage 
     */
    function panelMessageToState(panelMessage) {
        let state = '';
        try {
            switch (panelMessage.type) {
                case 'b':
                    state = contractObject.signals.states.boolean[`${panelMessage.smartObjectId}`][`${panelMessage.joinId}`];
                    break;
                case 's':
                    state = contractObject.signals.states.string[`${panelMessage.smartObjectId}`][`${panelMessage.joinId}`];
                    break;
                case 'n':
                    state = contractObject.signals.states.numeric[`${panelMessage.smartObjectId}`][`${panelMessage.joinId}`];
                    break;
                case 'o':
                    state = contractObject.signals.states.object[`${panelMessage.smartObjectId}`][`${panelMessage.joinId}`];
                    break;
            }
        } catch (e) {

        }
        return state;
    }

    /**
     * Define the constants of the websocket
     */
    function tryRecover() {
        switch (CrComLib.wscip.readyState) {
            case WebSocket.CONNECTING:
            case WebSocket.OPEN:
            case WebSocket.CLOSING:
                break;
            case WebSocket.CLOSED:
                registerCrComLib();
                break;
        }
    }

    /**
     * Reconnect the websoocket connection
     */
    function webSocketReconnect() {
        if (CrComLib.wscip == null) {
            tryRecover();
        } else {
            CrComLib.wscip.onclose = () => {
                tryRecover();
            }
            CrComLib.wscip.close();
        }
    }

    /**
     * Returns the value of the user-agent header sent by the browser to the server
     */
    function userAgent() {
        return navigator.userAgent;
    }

    /**
     * Check whether the panel includes the Crestron
     */
    function isPanel() {
        return userAgent().includes("Crestron");
    }

    /**
     * Register the CrComLib, connect to the websocket and then publish the signals to signalbridge
     */
    function registerCrComLib() {
        avfUtility.log("RegisterCrComLib: Started")
        return new Promise((resolve, reject) => {
            if (isPanel()) {
                avfUtility.log("RegisterCrComLib: Running on PANEL")
                resolve();
            } else {
                avfUtility.log("RegisterCrComLib: Running on BROWSER")
                // TODO: REMOVE REMOTE LOGGER CODE
                // CrComLib.getRemoteAppender = () => {};
                // CrComLib.getLogger = () => {};

                fetch('/libraries/contract.js')
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        avfUtility.log("RegisterCrComLib: LOADED CONTRACT OBJECT")
                        contractObject = data;
                        avfUtility.log(contractObject);
                    })
                    .then(() => {
                        const wscipaddr = configModule.getUrls().ipAddress;
                        const wscipport = 8009;
                        CrComLib.wscip = new WebSocket(`ws://${wscipaddr}:${wscipport}`);
                        CrComLib.wscip.onopen = function (event) {
                            avfUtility.log("RegisterCrComLib: Websocket Opened");
                            resolve();
                        };
                        CrComLib.wscip.onerror = function (err) {
                            // let error = JSON.parse(err);
                            console.error(JSON.stringify(err));
                            tryRecover();
                        };
                        CrComLib.wscip.onclose = function () {
                            console.error("RegisterCrComLib: Websocket closed");
                            tryRecover();
                        }
                        CrComLib.wscip.onmessage = function (message) {
                            let msg = {
                                type: null,
                                value: null,
                                join: null
                            };
                            let panelMessage = JSON.parse(message.data);
                            let state = panelMessageToState(panelMessage);

                            switch (panelMessage.type) {
                                case 'b':
                                    CrComLib.bridgeReceiveBooleanFromNative(state, panelMessage.value);
                                    break;
                                case 'n':
                                    CrComLib.bridgeReceiveIntegerFromNative(state, panelMessage.value);
                                    break;
                                case 's':
                                    CrComLib.bridgeReceiveStringFromNative(state, panelMessage.value);
                                    break;
                            }
                        };
                        CrComLib.publishEvent = (type, signalName, val) => {
                            let obj = {};
                            switch (type) {
                                case 'b':
                                    obj = contractObject.signals.events.boolean[signalName];
                                    break;
                                case 's':
                                    obj = contractObject.signals.events.string[signalName];
                                    break;
                                case 'n':
                                    obj = contractObject.signals.events.numeric[signalName];
                                    break;
                            }
                            if (!obj) {
                                // if (signalName === 'consolelog') {
                                //     CrComLib.publishEvent('s', signalName, value)
                                // } else 
                                if (signalName != 'canvas.created') {
                                    console.warn(`signal name was not in contract: ${signalName}`);
                                }
                                return;
                            }
                            let msg = {
                                type: type,
                                join: `${obj.smartObjectId}${obj.joinId}`,
                                value: val,
                                joinId: obj.joinId,
                                smartObjectId: obj.smartObjectId,
                                deviceId: obj.deviceId,
                            };
                            CrComLib.wscip.send(JSON.stringify(msg));
                        };

                        window.JSInterface = {
                            bridgeSendBooleanToNative: (signalName, value) => CrComLib.publishEvent('b', signalName, value),
                            bridgeSendIntegerToNative: (signalName, value) => CrComLib.publishEvent('n', signalName, value),
                            bridgeSendStringToNative: (signalName, value) => CrComLib.publishEvent('s', signalName, value),
                            bridgeSendObjectToNative: (signalName, jsonEncodedString) => CrComLib.publishEvent('o', signalName, jsonEncodedString),
                            bridgeSendArrayToNative: (jsonEncodedArray) => alert('array')
                        };
                    })
                    .catch((e) => {
                        avfUtility.log(e);
                    });
            }
        });
    }

    /**
     * Register the CrComLib file
     */
    function registerLibrary() {
        registerCrComLib() // Must be done before any CrComLib calls
            .then(() => { })
    }

    return {
        registerLibrary: registerLibrary
    }
}());