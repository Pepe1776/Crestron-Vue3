// Copyright (C) 2020 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/* jslint es6 */

const appModule = (function () {
    'use strict';

    let isSystemReady = false;

    /**
     * Initialize the module
     */
    function initialize() {
        // onInit();
        // TODO the below
        // meetingSchedulerModule.onInit();
        // reserveNowMeetingSchedulerModule.onInit();
        announcementModule.onInit();
        configuringModule.onInit();
        coolingDownModule.onInit();
        dateTimeDisplayModule.onInit();
        disconnectedModule.onInit();
        emergencyBroadcastModule.onInit();
        // extendedInfoModule.onInit();
        footerModule.onInit();
        headerModule.onInit();
        helpModule.onInit();
        infoModule.onInit();
        //infoFooter
        initializingModule.onInit();
        //loader
        meetingStatusModule.onInit();
        // menuScreenModule.onInit();
        scheduleMeetingModule.onInit();
        screenSaverModule.onInit();
        shutdownModule.onInit();
        sourceSelectionModule.onInit();
        // airmediaModule.onInit();
        // appleTvModule.onInit();
        // blurayModule.onInit();
        // directTvModule.onInit();
        // rokuModule.onInit();
        // tivoModule.onInit();
        // horizontalPresentModule.onInit();
        //uncontrolled
        // verticalPresentModule.onInit();
        startPageModule.onInit();
        warmingUpModule.onInit();

        // meetingStatusModule.onInit();

        // meetingSchedulerModule.subscribeMeetingScheduling();
        // reserveNowMeetingSchedulerModule.subscribeReserveNowScheduler();
    }

    /**
     * Subscribe server joins values
     */
    function invokeAllSubscriptions() {
        CrComLib.subscribeState('b', 'Csig.Hard_Button_2.Press', (response) => {
            avfUtility.log(`Csig.Hard_Button_2.Press: ${response}`);
            if (avfUtility.toBool(response)) {
                navigationModule.goToPage();
            }
        });

        CrComLib.subscribeState('s', 'Room[0].Locale', (response) => {
            avfUtility.log(`Translation Language: ${response}`);
            if (response) {
                translateModule.getLanguage(response);
            } else {
                translateModule.getLanguage('en-US');
            }
        });
    }

    /**
     * Bootstrap AVF app and webSocketConnection
     */
    function onInit() {
        isSystemReady = false;
        initialize();
        invokeAllSubscriptions();
        webSocketConnection.registerLibrary();
    }

    /**
     * Check if the System is ready to be used.
     */
    function getSystemReady() {
        return isSystemReady;
    }

    /**
     * Set the System to be ready or down for usage.
     * @param {*} value 
     */
    function setSystemReady(value) {
        isSystemReady = value;
    }

    return {
        onInit,
        setSystemReady,
        getSystemReady
    };

}());