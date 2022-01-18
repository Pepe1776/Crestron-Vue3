/**
 * Copyright (C) 2020 to the present, Crestron Electronics, Inc.
 * All rights reserved.
 * No part of this software may be reproduced in any form, machine
 * or natural, without the express written consent of Crestron Electronics.
 * Use of this source code is subject to the terms of the Crestron Software License Agreement 
 * under which you licensed this source code.  
 *
 * This code was automatically generated by Crestron's code generation tool.
 */

/* jslint es6 */

const dateTimeDisplayModule = (function () {
    'use strict';

    let isStartButtonEnabled = false;
    let enableCustomLogo = false;
    let subDateTimeStartButtonEnabled = null;
    let subDateTimeEnableCustomLogo = null;

    /**
     * Initialize Method
     */
    function onInit() {
        invokeUnsubscriptions();
        initializeVariables();
        invokeSubscriptions();
    }

    /**
     * Invoke Subscriptions
     */
    function invokeSubscriptions() {
        subDateTimeStartButtonEnabled = CrComLib.subscribeState('b', 'Room[0].StartButtonEnabled', (response) => {
            isStartButtonEnabled = avfUtility.toBool(response);
            avfUtility.log("Room[0].StartButtonEnabled", isStartButtonEnabled);
            dateTimeDisplay();
        });

        subDateTimeEnableCustomLogo = CrComLib.subscribeState('b', 'Room[0].TouchScreenSettings.EnableCustomLogo', (response) => {
            enableCustomLogo = avfUtility.toBool(response);
            avfUtility.log("Room[0].TouchScreenSettings.EnableCustomLogo", enableCustomLogo);
            setTimeout(() => {
                dateTimeDisplay();
            }, 300);
        });
    }

    /**
     * 
     */
    function dateTimeDisplay(updateLogo = true) {
        const homeStartBtn1 = document.getElementById("homeStartBtn1");
        const homeStartBtn2 = document.getElementById("homeStartBtn2");
        const displayDateTimeControl = document.getElementById("displayDateTime");
        homeStartBtn1.style.display = enableCustomLogo ? 'block' : 'none';
        displayDateTimeControl.style.display = !enableCustomLogo ? 'block' : 'none';
        homeStartBtn2.style.display = isStartButtonEnabled ? 'block' : 'none';
        // homeStartBtn1.style.opacity = '0';
        // datetime and custom logo are inversely relevant
        if (enableCustomLogo) {
            // Below IIFE is related to a bug that hides the custom logo only on load
            // by changing the css for a second, the ch5-image logic gets re-triggered to render image
            if (updateLogo) {
                ((customLogoContainer) => {
                    let customLogoImage = document.getElementById("customLogoImage");
                    customLogoImage.style.opacity = '0.9';
                    customLogoContainer.style.opacity = '0.9';
                    setTimeout(() => {
                        let customLogoImage = document.getElementById("customLogoImage");
                        customLogoImage.style.opacity = '1';
                        customLogoContainer.style.opacity = '1';
                        removeCustomLogoAttribute();
                    }, 2000);
                })(homeStartBtn1);
            }
        }
    }

    /**
     * Function to manage the custom logo 
     * This is a dirty fix and needs to be addressed at component level since its a seemingly straight forward ch5-image bug
     */
    function removeCustomLogoAttribute() {
        setTimeout(() => {
            let customLogoImage = document.getElementById("customLogoImage");
            customLogoImage.removeAttribute('refreshRate');
            avfUtility.log("Updating custom-logo b2 : ", customLogoImage.childrenOfCurrentNode[0].getAttribute('src'));
        }, 6000);
    }

    /**
     * Function to set the source index for the default presenting source if the signal is available
     * "Room[0].Display[${Display_INDEX}].Source[${INDEX}].Default"
     */
    function setDefaultStartButton(sourceIndex) {
        const elem = document.getElementById('startBtnTrigger');
        elem.setAttribute('sendeventonclick', "Room[0].Display[0].Source[" + sourceIndex + "].Present.Execute");
        elem.setAttribute('data-source-index', sourceIndex);
    }

    /**
     * Function to set the click handler of start button to present a default screen
     * if "Room[0].Display[${Display_INDEX}].Source[${INDEX}].Default" is not set, the default value is 0
     * @param {Start button object} selectedObject 
     */
    function startPresentTrigger(selectedObject) {
        const elem = document.getElementById('startBtnTrigger');
        const srcIndex = parseInt(elem.getAttribute('data-source-index'));
        if (srcIndex > -1) {
            sourceSelectionModule.startPresenting(selectedObject, 0, srcIndex);
        } else {
            elem.setAttribute('sendeventonclick', "Room[0].Power.PowerOn.Execute");
            elem.setAttribute('receivestateshow', "Room[0].Power.PowerOn.Supports");
            elem.setAttribute('receivestateenable', "Room[0].Power.PowerOn.CanExecute");
        }
    }

    /**
     * Invoke unsubscriptions related to module
     */
    function invokeUnsubscriptions() {
        if (subDateTimeStartButtonEnabled) {
            CrComLib.unsubscribeState('b', 'Room[0].StartButtonEnabled', subDateTimeStartButtonEnabled);
        }
        if (subDateTimeEnableCustomLogo) {
            CrComLib.unsubscribeState('b', 'Room[0].TouchScreenSettings.EnableCustomLogo', subDateTimeEnableCustomLogo);
        }
    }

    /**
     * Initialize all the variables used in this module
     */
    function initializeVariables() {
        isStartButtonEnabled = false;
        enableCustomLogo = false;
        subDateTimeStartButtonEnabled = null;
        subDateTimeEnableCustomLogo = null;
    }

    /**
     * All public method and properties are exported here
     */
    return {
        onInit,
        dateTimeDisplay,
        setDefaultStartButton,
        startPresentTrigger
    };

}());