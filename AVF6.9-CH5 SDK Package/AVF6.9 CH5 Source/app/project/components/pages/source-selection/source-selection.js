// Copyright (C) 2020 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/* jslint es6 */

const sourceSelectionModule = (function () {
    'use strict';

    let presentationObject = null;
    let defaultSourceIndex = [];
    let airMediaScreenStatus = "";

    const NUMBER_OF_DISPLAYS = 8;
    const NUMBER_OF_SOURCES = 10;

    /**
    * On Init
    */
    function onInit() {
        invokeUnsubscriptions();
        initializeVariables();
        invokeSubscriptions();
    }

    /**
    * Initialize all the variables used in this module
    */
    function initializeVariables() {
        const displayObject = {
            "displayIndex": 0,
            "presentingSource": {
                "device": {
                    "icon": "",
                    "name": "",
                    "type": "",
                    "model": "",
                    "channelType": ""
                },
                "presenting": false,
                "airMedia": {
                    "users": 0,
                    "hasPin": false,
                    "address": "",
                    "pin": ""
                },
                "hasSync": false,
                "controlHint": false
            },
            "videoMuteMode": 0,
            "warmingUp": false,
            "coolingDown": false,
            "presentingPreviousStatus": false,
            "isPresenting": false,
            "sources": {}
        };
        const sourceObject = {
            "sourceIndex": 0,
            "audioFollow": false,
            "device": {
                "name": "",
                "icon": "",
                "model": "",
                "type": ""
            },
            "presenting": false,
            "default": false,
            "hasSync": false
        };

        presentationObject = {};
        presentationObject["displayCount"] = 0;
        presentationObject["presentingScreenDisplayIndex"] = -1;
        presentationObject["presentingScreenSourceIndex"] = -1;

        presentationObject["screen"] = {};
        presentationObject["screen"]["horizontal"] = false;
        presentationObject["screen"]["vertical"] = false;

        presentationObject["displays"] = [];
        for (let i = 0; i < NUMBER_OF_DISPLAYS; i++) {
            const newDisplayObj = JSON.parse(JSON.stringify(displayObject));
            newDisplayObj.displayIndex = i;

            const sourcesArray = [];
            for (let j = 0; j < NUMBER_OF_SOURCES; j++) {
                const newSourceObject = JSON.parse(JSON.stringify(sourceObject));
                newSourceObject.sourceIndex = j;
                sourcesArray.push(newSourceObject);
            }
            newDisplayObj.sources = sourcesArray;
            presentationObject["displays"].push(newDisplayObj);
        }
        avfUtility.log("Initialize presentationObject", JSON.parse(JSON.stringify(presentationObject)));
    }

    /**
     * Temporary loggers to be removed before build
     * @param {*} displayIndex 
     */
    function invokeSubscribeForDebug(displayIndex) {
        CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].BlankRoute.Supports`, (v) => {
            console.info(`Room[0].Display[${displayIndex}].BlankRoute.Supports: ${v}`);
        });
        CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].BlankRoute.CanExecute`, (v) => {
            console.info(`Room[0].Display[${displayIndex}].BlankRoute.CanExecute: ${v}`);
        });
        CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].StopRoute.Supports`, (v) => {
            console.info(`Room[0].Display[${displayIndex}].StopRoute.Supports: ${v}`);
        });
        CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].StopRoute.CanExecute`, (v) => {
            console.info(`Room[0].Display[${displayIndex}].StopRoute.CanExecute: ${v}`);
        });
        CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].PresentingSource.Menu.Supports`, (v) => {
            console.info(`Room[0].Display[${displayIndex}].PresentingSource.Menu.Supports: ${v}`);
        });
        CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].PresentingSource.Menu.CanExecute`, (v) => {
            console.info(`Room[0].Display[${displayIndex}].PresentingSource.Menu.CanExecute: ${v}`);
        });
        CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].PresentingSource.Home.Supports`, (v) => {
            console.info(`Room[0].Display[${displayIndex}].PresentingSource.Home.Supports: ${v}`);
        });
        CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].PresentingSource.Home.CanExecute`, (v) => {
            console.info(`Room[0].Display[${displayIndex}].PresentingSource.Home.CanExecute: ${v}`);
        });
        CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].PresentingSource.Play.Supports`, (v) => {
            console.info(`Room[0].Display[${displayIndex}].PresentingSource.Play.Supports: ${v}`);
        });
        CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].PresentingSource.Play.CanExecute`, (v) => {
            console.info(`Room[0].Display[${displayIndex}].PresentingSource.Play.CanExecute: ${v}`);
        });
        CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].PresentingSource.UpArrow.Supports`, (v) => {
            console.info(`Room[0].Display[${displayIndex}].PresentingSource.UpArrow.Supports: ${v}`);
        });
        CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].PresentingSource.UpArrow.CanExecute`, (v) => {
            console.info(`Room[0].Display[${displayIndex}].PresentingSource.UpArrow.CanExecute: ${v}`);
        });
        CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].PresentingSource.LeftArrow.Supports`, (v) => {
            console.info(`Room[0].Display[${displayIndex}].PresentingSource.LeftArrow.Supports: ${v}`);
        });
        CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].PresentingSource.LeftArrow.CanExecute`, (v) => {
            console.info(`Room[0].Display[${displayIndex}].PresentingSource.LeftArrow.CanExecute: ${v}`);
        });
        CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].PresentingSource.Select.Supports`, (v) => {
            console.info(`Room[0].Display[${displayIndex}].PresentingSource.Select.Supports: ${v}`);
        });
        CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].PresentingSource.Select.CanExecute`, (v) => {
            console.info(`Room[0].Display[${displayIndex}].PresentingSource.Select.CanExecute: ${v}`);
        });
        CrComLib.subscribeState('b', 'Room[0].Power.PowerOn.Execute', (v) => {
            console.info(`Room[0].Power.PowerOn.Execute, ${v}`);
        });
        CrComLib.subscribeState('b', `Room[0].Power.PowerOn.Supports`, (v) => {
            console.info(`Room[0].Power.PowerOn.Supports: ${v}`);
        });
        CrComLib.subscribeState('b', `Room[0].Power.PowerOn.CanExecute`, (v) => {
            console.info(`Room[0].Power.PowerOn.CanExecute: ${v}`);
        });
    }

    /**
    * Subscribe data for present a source screen and share the data between horizontal and vertical screens.
    */
    function invokeSubscriptions() {
        CrComLib.subscribeState('n', `Room[0].DisplayCount`, (v) => {
            avfUtility.log(`Room[0].DisplayCount: ${v}`);
            const presentSourceDisplayCount = parseInt(v);
            presentationObject.displayCount = presentSourceDisplayCount;
            if (presentSourceDisplayCount === 1) {
                presentationObject.screen.vertical = false;
                presentationObject.screen.horizontal = true;
                console.info("horizontal configured.");
            } else if (presentSourceDisplayCount > 1) {
                presentationObject.screen.vertical = true;
                presentationObject.screen.horizontal = false;
                console.info("vertical configured.");
            } else if (presentSourceDisplayCount < 1) {
                console.info("There must be a minimum 1 display configured.");
            }
        });

        for (let displayIndex = 0; displayIndex < NUMBER_OF_DISPLAYS; displayIndex++) {
            // BELOW LINE MUST BE COMMENTED FOR BUILD PURPOSES
            // invokeSubscribeForDebug(d);
            CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].WarmingUp`, (v) => {
                const warmingUpStatus = avfUtility.toBool(v);
                avfUtility.log(`Room[0].Display[${displayIndex}].WarmingUp:`, warmingUpStatus);
                presentationObject["displays"][displayIndex].warmingUp = warmingUpStatus;
                let warmingResult = false;
                for (let counter = 0; counter < NUMBER_OF_DISPLAYS; counter++) {
                    if (presentationObject["displays"][counter].warmingUp === true) {
                        warmingResult = true;
                        break;
                    }
                }
                if (warmingResult === true) {
                    navigationModule.openPopup(navigationModule.popupPages.warmingUpImportPage);
                } else {
                    navigationModule.closePopup(navigationModule.popupPages.warmingUpImportPage);
                }
            });
            CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].CoolingDown`, (v) => {
                const coolingDownStatus = avfUtility.toBool(v);
                avfUtility.log(`Room[0].Display[${displayIndex}].CoolingDown:`, coolingDownStatus);
                presentationObject["displays"][displayIndex].coolingDown = coolingDownStatus;
                let coolingResult = false;
                for (let counter = 0; counter < NUMBER_OF_DISPLAYS; counter++) {
                    if (presentationObject["displays"][counter].coolingDown === true) {
                        coolingResult = true;
                        break;
                    }
                }
                if (coolingResult === true) {
                    navigationModule.openPopup(navigationModule.popupPages.coolingDownImportPage);
                } else {
                    navigationModule.closePopup(navigationModule.popupPages.coolingDownImportPage);
                }
            });
            CrComLib.subscribeState('s', `Room[0].Display[${displayIndex}].PresentingSource.Device.Icon`, (v) => {
                avfUtility.log(`Room[0].Display[${displayIndex}].PresentingSource.Device.Icon: ${v}`);
                presentationObject["displays"][displayIndex].presentingSource.device.icon = avfUtility.convertNullToEmptyString(v);
                updatePresenting(displayIndex, v, 'deviceIcon');
            });
            CrComLib.subscribeState('s', `Room[0].Display[${displayIndex}].PresentingSource.Device.Name`, (v) => {
                avfUtility.log(`Room[0].Display[${displayIndex}].PresentingSource.Device.Name: ${v}`);
                presentationObject["displays"][displayIndex].presentingSource.device.name = avfUtility.convertNullToEmptyString(v);
                updatePresenting(displayIndex, v, 'deviceName');
            });
            CrComLib.subscribeState('s', `Room[0].Display[${displayIndex}].PresentingSource.Device.Type`, (v) => {
                avfUtility.log(`Room[0].Display[${displayIndex}].PresentingSource.Device.Type: ${v}`);
                presentationObject["displays"][displayIndex].presentingSource.device.type = avfUtility.convertNullToEmptyString(v);
                updatePresenting(displayIndex, v, 'deviceType');
            });
            CrComLib.subscribeState('s', `Room[0].Display[${displayIndex}].PresentingSource.Device.Model`, (v) => {
                avfUtility.log(`Room[0].Display[${displayIndex}].PresentingSource.Device.Model: ${v}`);
                presentationObject["displays"][displayIndex].presentingSource.device.model = avfUtility.convertNullToEmptyString(v);
                updatePresenting(displayIndex, v, 'deviceModel');
            });
            CrComLib.subscribeState('s', `Room[0].Display[${displayIndex}].PresentingSource.ChannelType`, (v) => {
                avfUtility.log(`Room[0].Display[${displayIndex}].PresentingSource.ChannelType: ${v}`);
                presentationObject["displays"][displayIndex].presentingSource.device.channelType = avfUtility.convertNullToEmptyString(v);
                updatePresenting(displayIndex, v, 'ChannelType');
            });
            CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].PresentingSource.Presenting`, (v) => {
                const output = avfUtility.toBool(v);
                avfUtility.log(`Room[0].Display[${displayIndex}].PresentingSource.Presenting: ${output}`);
                presentationObject["displays"][displayIndex].presentingSource.presenting = output;
                updatePresenting(displayIndex, output, 'Presenting');
            });
            CrComLib.subscribeState('n', `Room[0].Display[${displayIndex}].PresentingSource.AirMedia.Users`, (v) => {
                avfUtility.log(`Room[0].Display[${displayIndex}].PresentingSource.AirMedia.Users: ${v}`);
                presentationObject["displays"][displayIndex].presentingSource.airMedia.users = parseInt(v);
                updatePresenting(displayIndex, v, 'airMediaUsers');
            });
            CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].PresentingSource.HasSync`, (v) => {
                const output = avfUtility.toBool(v);
                avfUtility.log(`Room[0].Display[${displayIndex}].PresentingSource.HasSync: ${output}`);
                presentationObject["displays"][displayIndex].presentingSource.hasSync = output;
                updatePresenting(displayIndex, output, 'HasSync');
            });
            CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].PresentingSource.ControlHint`, (v) => {
                const output = avfUtility.toBool(v);
                avfUtility.log(`Room[0].Display[${displayIndex}].PresentingSource.ControlHint: ${output}`);
                presentationObject["displays"][displayIndex].presentingSource.controlHint = output;
                updatePresenting(displayIndex, output, 'ControlHint');
            });
            CrComLib.subscribeState('n', `Room[0].Display[${displayIndex}].VideoMuteMode`, (v) => {
                const videoModeValue = parseInt(v);
                avfUtility.log(`Room[0].Display[${displayIndex}].VideoMuteMode: ${videoModeValue}`);
                presentationObject["displays"][displayIndex].videoMuteMode = videoModeValue;
                updatePresenting(displayIndex, videoModeValue, 'VideoMuteMode');
            });
            CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].PresentingSource.AirMedia.HasPin`, (v) => {
                const output = avfUtility.toBool(v);
                presentationObject["displays"][displayIndex].presentingSource.airMedia.hasPin = output;
                avfUtility.log(`Room[0].Display[${displayIndex}].PresentingSource.AirMedia.HasPin: ${output}`);
                if (output) {
                    document.getElementById('airmediaHasPin').style.display = 'block';
                } else {
                    document.getElementById('airmediaHasPin').style.display = 'none';
                }
                updatePresenting(displayIndex, output, 'airmediausers');
            });
            CrComLib.subscribeState('s', `Room[0].Display[${displayIndex}].PresentingSource.AirMedia.Address`, (v) => {
                presentationObject["displays"][displayIndex].presentingSource.airMedia.address = avfUtility.convertNullToEmptyString(v);
                document.getElementById('airmediaAddress').innerText = v;
            });
            CrComLib.subscribeState('s', `Room[0].Display[${displayIndex}].PresentingSource.AirMedia.Pin`, (v) => {
                presentationObject["displays"][displayIndex].presentingSource.airMedia.pin = avfUtility.convertNullToEmptyString(v);
                document.getElementById('airmediaPin').innerText = v;
            });

            for (let s = 0; s < NUMBER_OF_SOURCES; s++) {
                CrComLib.subscribeState('s', `Room[0].Display[${displayIndex}].Source[${s}].Device.Name`, (v) => {
                    avfUtility.log(`Room[0].Display[${displayIndex}].Source[${s}].Device.Name: ${v}`);
                    presentationObject["displays"][displayIndex]["sources"][s].device.name = avfUtility.convertNullToEmptyString(v);
                    updateScreenBasedOnIndex(displayIndex, s, v, 'DeviceName');
                });
                CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].Source[${s}].AudioFollow`, (v) => {
                    const responseValue = avfUtility.toBool(v);
                    avfUtility.log(`Room[0].Display[${displayIndex}].Source[${s}].AudioFollow: ${responseValue}`);
                    presentationObject["displays"][displayIndex]["sources"][s].audioFollow = responseValue;
                    updateScreenBasedOnIndex(displayIndex, s, responseValue, 'AudioFollow');
                });
                CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].Source[${s}].Presenting`, (v) => {
                    const responseValue = avfUtility.toBool(v);
                    avfUtility.log(`Room[0].Display[${displayIndex}].Source[${s}].Presenting: ${responseValue}`);
                    presentationObject["displays"][displayIndex]["sources"][s].presenting = responseValue;
                    updateScreenBasedOnIndex(displayIndex, s, responseValue, 'Presenting');
                });
                CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].Source[${s}].Default`, (v) => {
                    const responseValue = avfUtility.toBool(v);
                    avfUtility.log(`Room[0].Display[${displayIndex}].Source[${s}].Default: ${responseValue}`);
                    presentationObject["displays"][displayIndex]["sources"][s].default = responseValue;
                    setDefaultSource(s, responseValue);
                });
                CrComLib.subscribeState('s', `Room[0].Display[${displayIndex}].Source[${s}].Device.Icon`, (v) => {
                    avfUtility.log(`Room[0].Display[${displayIndex}].Source[${s}].Device.Icon: ${v}`);
                    presentationObject["displays"][displayIndex]["sources"][s].device.icon = avfUtility.convertNullToEmptyString(v);
                    updateScreenBasedOnIndex(displayIndex, s, v, 'Icon');
                });
                CrComLib.subscribeState('s', `Room[0].Display[${displayIndex}].Source[${s}].Device.Model`, (v) => {
                    avfUtility.log(`Room[0].Display[${displayIndex}].Source[${s}].Device.Model: ${v}`);
                    presentationObject["displays"][displayIndex]["sources"][s].device.model = avfUtility.convertNullToEmptyString(v);
                    updateScreenBasedOnIndex(displayIndex, s, v, 'sourcedevicemodel');
                });
                CrComLib.subscribeState('s', `Room[0].Display[${displayIndex}].Source[${s}].Device.Type`, (v) => {
                    avfUtility.log(`Room[0].Display[${displayIndex}].Source[${s}].Device.Type: ${v}`);
                    presentationObject["displays"][displayIndex]["sources"][s].device.type = avfUtility.convertNullToEmptyString(v);
                    updateScreenBasedOnIndex(displayIndex, s, v, 'sourcedevicetype');
                });
                CrComLib.subscribeState('b', `Room[0].Display[${displayIndex}].Source[${s}].HasSync`, (v) => {
                    const responseValue = avfUtility.toBool(v);
                    avfUtility.log(`Room[0].Display[${displayIndex}].Source[${s}].HasSync: ${responseValue}`);
                    presentationObject["displays"][displayIndex]["sources"][s].hasSync = responseValue;
                    updateScreenBasedOnIndex(displayIndex, s, responseValue, 'HasSync');
                });
            }
        }
    }

    /**
     * Function to handle the setting of caption and image for STOP/Resume/Blank based buttons when an input is being presented
     * @param {Has the index of the display for which the actions need to be taken} videoMuteModeValue 
     */
    function setButtonToAllDisplays(displayIndex, videoMuteModeValue) {
        let labelValue = getStopButtonText(videoMuteModeValue);
        let iconUrlValue = './app/project/assets/img/avf/stop_btn.png';
        // Sec 1: for known devices' list
        const displayList = [
            appleTvColorButtonsModule.getTriggerBtnObject(displayIndex),
            blurayColorButtonsModule.getTriggerBtnObject(displayIndex),
            directTvColorButtonsModule.getTriggerBtnObject(displayIndex),
            tivoColorButtonsModule.getTriggerBtnObject(displayIndex),
            rokuColorButtonsModule.getTriggerBtnObject(displayIndex)
        ];
        for (let i = 0; i < displayList.length; i++) {
            const btnObject = displayList[i];
            if (videoMuteModeValue === 0) {
                // labelValue: no hardcoding required
                // iconUrlValue - default case
            } else if (videoMuteModeValue === 1) {
                // labelValue: no hardcoding required
                // iconUrlValue - default case
            } else if (videoMuteModeValue === 2) {
                // labelValue: no hardcoding required
                iconUrlValue = './app/project/assets/img/avf/Resume_Playing.png';
            } else if (videoMuteModeValue === 3) {
                // labelValue: no hardcoding required
                // iconUrlValue - default case
            } else if (videoMuteModeValue === 4) {
                // TODO: HH - Hardcoding now for now - needs to be fixed
                // labelValue = translateModule.translateInstant('Resuming');
                labelValue = 'Resuming';
                iconUrlValue = './app/project/assets/img/avf/Resuming_Playing.png';
            }
            btnObject.setAttribute('label', labelValue);
            btnObject.setAttribute('iconurl', iconUrlValue);
        }
        // Sec 2:  for uncontrolled devices
        // sets label value for uncontrolled-sources' buttons
        setLabelAndSetViewForUncontrolledDevices(displayIndex, labelValue);
    }

    /**
     * Function to set label and text of the button when required
     */
    function setLabelAndSetViewForUncontrolledDevices(displayIndex, labelValue) {
        for (let j = 0; j < NUMBER_OF_DISPLAYS; j++) {
            const elem = document.getElementById("stopPresentingButtonHorizontal" + j);
            if (labelValue) {
                elem.setAttribute("label", labelValue);
            }
            if (j === displayIndex) {
                elem.classList.remove("hide-div");
            } else {
                elem.classList.add("hide-div");
            }
        }
    }

    /**
     * Get translated value of Stop Button Text
     * @param {*} inputValue 
     */
    function getStopButtonText(inputValue) {
        let stopButtonLabel = "Stop";
        switch (inputValue) {
            case 0:
                stopButtonLabel = "Stop";
                break;
            case 1:
                stopButtonLabel = "BlankScreen";
                break;
            case 2:
                stopButtonLabel = "Resume";
                break;
            case 3:
                stopButtonLabel = "Blanking";
                break;
            case 4:
                stopButtonLabel = "Resuming";
                break;
        }
        return translateModule.translateInstant(stopButtonLabel);
    }

    /**
    * Invoke unsubscriptions related to module
    */
    function invokeUnsubscriptions() {

    }

    /**
    * Update the displayed screen based on source index.
    * @param {*} displayIndex 
    * @param {*} sourceIndex 
    * @param {*} joinValue 
    * @param {*} joinName 
    */
    function updateScreenBasedOnIndex(displayIndex, sourceIndex, joinValue, joinName) {
        avfUtility.log("updateScreenBasedOnIndex", displayIndex, sourceIndex, joinValue, joinName);
        console.debug("presentationObject", JSON.parse(JSON.stringify(presentationObject))); //(JSON.stringify(presentationObject, null, 2)));
        if (presentationObject.screen.vertical === true) {
            verticalPresentModule.updateVerticalPresentationPage(displayIndex, sourceIndex, joinValue, joinName);
        } else if (presentationObject.screen.horizontal === true) {
            horizontalPresentModule.updateHorizontalPresentationPage(sourceIndex, joinValue, joinName);
        }
    }

    /**
     * 
     * @param {*} displayIndex 
     * @param {*} sourceIndex 
     */
    function clickButton(displayIndex, sourceIndex) {
        document.getElementById("vertical_source_row_" + displayIndex + "_" + sourceIndex).click();
    }

    /**
    * Invoked when any of the sources is clicked.
    * @param {*} selectedObject 
    * @param {*} displayIndex 
    * @param {*} sourceIndex 
    */
    function startPresenting(selectedObject, displayIndex, sourceIndex, manualPublish = false) {
        avfUtility.log("startPresenting with displayIndex: ", displayIndex, ", and sourceIndex: ", sourceIndex);
        // const deviceModel = selectedObject.getAttribute('sourceDeviceModelName');
        // const deviceType = selectedObject.getAttribute('sourceDeviceType');
        const deviceModel = presentationObject.displays[displayIndex].sources[sourceIndex].device.model;
        const deviceType = presentationObject.displays[displayIndex].sources[sourceIndex].device.type;
        // setdisplayIndex(displayIndex, sourceIndex);

        setDeviceModelAndType(deviceModel, deviceType, displayIndex);

        for (let i = 0; i < NUMBER_OF_SOURCES; i++) {
            if (i === sourceIndex) {
                updateScreenBasedOnIndex(displayIndex, i, true, "presenting");
            } else {
                updateScreenBasedOnIndex(displayIndex, i, false, "presenting");
            }
            const audioIndicator = document.getElementById(`vertical_source_audio_indicator_${displayIndex}_${i}`);
            if (audioIndicator) {
                audioIndicator.style.display = (i === sourceIndex) ? 'block' : 'none';
            }
        }
        goToPresentationDetailsScreen(displayIndex, selectedObject);
    }

    /**
    * 
    */
    function startPresentingDefaultSource() {
        let btnIdStr = "";
        let displayIndexValue = 0;
        let sourceIndexValue = 0;
        avfUtility.log("startPresentingDefaultSource - defaultSourceIndex", defaultSourceIndex);
        if (presentationObject.screen.horizontal === true) {
            if (defaultSourceIndex.length) {
                const splitIndex = parseInt(defaultSourceIndex[0].split("_")[1]);
                sourceIndexValue = splitIndex;
                btnIdStr = `horizontal_source_${splitIndex}`;
                // TODO  horizontalPresentModule.setCurrentSourcePresentIndex(splitIndex);
            } else {
                sourceIndexValue = 0;
                btnIdStr = `horizontal_source_0`;
                // TODO horizontalPresentModule.setCurrentSourcePresentIndex(0);
            }
        } else if (presentationObject.screen.vertical === true) {
            if (defaultSourceIndex.length) {
                const splitIndex = defaultSourceIndex[0].split("_");
                let dIndex = parseInt(splitIndex[0]);
                let sIndex = parseInt(splitIndex[1]);
                sourceIndexValue = sIndex;
                btnIdStr = `vertical_source_btn_${dIndex}_${sIndex}`;
            } else {
                sourceIndexValue = 0;
                btnIdStr = `vertical_source_btn_0_0`;
            }
        }
        const imgBtnObj = document.getElementById(btnIdStr);
        const model = presentationObject.displays[displayIndexValue].sources[sourceIndexValue].device.model;
        const type = presentationObject.displays[displayIndexValue].sources[sourceIndexValue].device.type;
        setDeviceModelAndType(model, type, displayIndexValue);
        goToPresentationDetailsScreen(displayIndexValue, imgBtnObj);
        // TODO Himadhar November 09, 2020: 
        // Commenting below line to confirm if presenting is relying on "false" or not
        CrComLib.publishEvent('b', `Room[0].Display[${displayIndexValue}].Source[${sourceIndexValue}].Present.Execute`, false);
        CrComLib.publishEvent('b', `Room[0].Display[${displayIndexValue}].Source[${sourceIndexValue}].Present.Execute`, true);
    }

    /**
     * 
     */
    function getDefaultSourceIndex() {
        let sourceIndexValue = 0;
        avfUtility.log("getDefaultSourceIndex - defaultSourceIndex", defaultSourceIndex);
        if (presentationObject.screen.horizontal === true) {
            if (defaultSourceIndex.length) {
                const splitIndex = parseInt(defaultSourceIndex[0].split("_")[1]);
                sourceIndexValue = splitIndex;
            } else {
                sourceIndexValue = 0;
            }
        } else if (presentationObject.screen.vertical === true) {
            if (defaultSourceIndex.length) {
                const splitIndex = defaultSourceIndex[0].split("_");
                sourceIndexValue = parseInt(splitIndex[1]);
            } else {
                sourceIndexValue = 0;
            }
        }
        return sourceIndexValue;
    }

    /**
    * 
    * @param {*} deviceModel 
    * @param {*} deviceType 
    */
    function setDeviceModelAndType(deviceModel, deviceType, displayIndex) {
        presentationObject["displays"][displayIndex].presentingSource.device.model = avfUtility.convertNullToEmptyString(deviceModel);
        presentationObject["displays"][displayIndex].presentingSource.device.type = avfUtility.convertNullToEmptyString(deviceType);
    }

    /**
    * 
    * @param {*} selectedDisplayIndex 
    * @param {*} selectedObject
    */
    function goToPresentationDetailsScreen(selectedDisplayIndex, selectedObject) {
        presentationObject.presentingScreenDisplayIndex = selectedDisplayIndex;
        let model = presentationObject["displays"][selectedDisplayIndex].presentingSource.device.model;
        let device = presentationObject["displays"][selectedDisplayIndex].presentingSource.device.type;

        // DEV NOTE: below element controls the css display of "Airmedia" or "Uncontrolled display" based on what option is selected
        // this is because AM and Uncontrolled displays share same view file, but have different captions when rendered
        const uncontrolledSourceLabel = document.getElementById('uncontrolledDeviceSourceLabel');
        avfUtility.log("goToPresentationDetailsScreen for model ", model, ", device ", device, ", selectedDisplayIndex", selectedDisplayIndex);
        /* Uncomment the below as applicable for debugging on browser ONLY */

        // device = 'cabletv'; model = 'directtv';

        /* Controlled Sources */
        // device = 'cabletv'; model = 'directv';
        // device = 'cabletv'; model = 'directtv';
        // device = 'bluray'; model = '';
        // device = 'cabletv'; model = 'tivo';
        // device = 'cabletv'; model = 'tivo premiere';
        // device = 'videoserver'; model = 'apple tv';
        // device = 'videoserver'; model = 'apple tv 4k';
        // device = 'videoserver'; model = 'roku';
        // device = 'videoserver'; model = 'roku premiere (4620x)';
        /* Ends */
        let screenName = "";
        if (!(device && avfUtility.isValidInput(device))) {
            avfUtility.log("calling setUncontrolledSourceView > \n ------selectedDisplayIndex > ",
                selectedDisplayIndex,
                ' \n ------presentationObject >' + presentationObject["displays"]);
            screenName = navigationModule.navigationPages.uncontrolledSourcesImportPage;
            uncontrolledSourceLabel.setAttribute('data-airmedia', 'false');
            uncontrolledSourcesModule.setUncontrolledSourceView(presentationObject["displays"][selectedDisplayIndex].presentingSource.hasSync, selectedObject);
        }

        if (!!device && device.toLowerCase() !== "airmedia") {
            airMediaScreenStatus = "";
        }

        switch (!!device && device.toLowerCase()) {
            case "cabletv":
                switch (model.toLowerCase()) {
                    case "directv":
                    case "directtv":
                        screenName = navigationModule.navigationPages.directTvImportPage;
                        startControlledSource(device.toLowerCase(), model.toLowerCase(), selectedDisplayIndex);
                        break;
                    case "tivo":
                    case "tivo premiere":
                        screenName = navigationModule.navigationPages.tivoImportPage;
                        startControlledSource(device.toLowerCase(), model.toLowerCase(), selectedDisplayIndex);
                        break;
                }
                break;
            case "videoserver":
                switch (model.toLowerCase()) {
                    case "apple tv":
                    case "apple tv 4k":
                        screenName = navigationModule.navigationPages.appleTvImportPage;
                        startControlledSource(device.toLowerCase(), model.toLowerCase(), selectedDisplayIndex);
                        break;
                    case "roku":
                    case "roku premiere (4620x)":
                        screenName = navigationModule.navigationPages.rokuImportPage;
                        startControlledSource(device.toLowerCase(), model.toLowerCase(), selectedDisplayIndex);
                        break;
                }
                break;
            case "airmedia":
                const presentationObj = presentationObject["displays"][selectedDisplayIndex];
                const users = presentationObj.presentingSource.airMedia.users;
                uncontrolledSourceLabel.setAttribute('data-airmedia', 'true');
                if (users > 0) {
                    avfUtility.log("AirMedia Users : ", airMediaScreenStatus, '>>>>>', users);
                    screenName = navigationModule.navigationPages.uncontrolledSourcesImportPage;
                    uncontrolledSourcesModule.setUncontrolledSourceView(presentationObj.presentingSource.hasSync, selectedObject);
                    if (airMediaScreenStatus !== "playing") {
                        airMediaScreenStatus = "playing";
                    }
                } else {
                    airMediaScreenStatus = "stopped";
                    screenName = navigationModule.navigationPages.airmediaImportPage;
                    startControlledSource(device.toLowerCase(), '', selectedDisplayIndex);
                }
                break;
            case "bluray":
                screenName = navigationModule.navigationPages.blurayImportPage;
                startControlledSource(device.toLowerCase(), '', selectedDisplayIndex);
                break;
        }
        avfUtility.log("screenName", screenName);
        if (screenName) {
            navigationModule.goToPage(screenName);
        }
    }

    /**
    * Returns Presentation Object
    */
    function getPresentationObject() {
        return presentationObject;
    }

    /**
    * Trigger stop event on click of source preseting stopped
    * @param {number} displayIndex
    */
    function stopPresenting(displayIndex) {
        // avfUtility.log("stopPresenting");
        // for (let i = 0; i < NUMBER_OF_SOURCES; i++) {
        //     updateScreenBasedOnIndex(displayIndex, i, false, "presenting");
        //     const audioIndicator = document.getElementById(`vertical_source_audio_indicator_${displayIndex}_${i}`);
        //     if (audioIndicator) {
        //         audioIndicator.style.display = 'none';
        //     }
        // }
    }

    /**
    * Handle navigation of source presenting screen and async data update.
    * @param {*} displayIndex 
    * @param {*} responseValue 
    * @param {*} joinKey 
    */
    function updatePresenting(displayIndex, responseValue, joinKey) {
        if (presentationObject.presentingScreenDisplayIndex === -1 ||
            displayIndex === presentationObject.presentingScreenDisplayIndex) {
            const sourceObject = presentationObject["displays"][displayIndex].presentingSource;
            const stopBtnWrapper = document.getElementById("stopBtnSourcePresent");
            const btnImage = document.getElementById("sourceImageIcon");
            const sourceSyncStatus = document.getElementById("sourceSyncStatus");
            const deviceName = document.getElementById("sourcDeviceName");
            const redIndicator = "./app/project/assets/img/avf/redup.png";
            const greenIndicator = "./app/project/assets/img/avf/greenup.png";

            let isPresentingStopped = false;

            switch (!!joinKey && joinKey.toLowerCase()) {
                case "devicename":
                    deviceName.innerHTML = responseValue;
                    break;

                case "devicetype":
                    // if (value) {
                    //     presentationObject["displays"][displayIndex].presentingSource.device.type = value;
                    // }
                    break;

                case "devicemodel":
                    // if (value) {
                    //     presentationObject["displays"][displayIndex].presentingSource.device.model = value;
                    // }
                    break;

                case "deviceicon":
                    if (responseValue) {
                        const imgName = configModule.getConfigIcon(responseValue, 'solid');
                        btnImage.setAttribute("iconUrl", `./app/project/assets/img/avf/${imgName}`);
                    }
                    break;

                case "presenting":
                    presentationObject["displays"][displayIndex].presentingPreviousStatus = presentationObject["displays"][displayIndex].isPresenting;
                    presentationObject["displays"][displayIndex].isPresenting = responseValue;
                    if (presentationObject["displays"][displayIndex].presentingPreviousStatus && !presentationObject["displays"][displayIndex].isPresenting) {
                        isPresentingStopped = true;
                    }
                    break;

                case "channeltype":
                    document.getElementById("sourceTypeName").innerHTML = responseValue;
                    break;

                case "controlhint":
                    break;

                case "hassync":
                    const outOfSycMsgEl = document.getElementById("outOfSyncMsg");
                    if (responseValue) {
                        outOfSycMsgEl.style.display = 'none';
                        stopBtnWrapper.style.display = 'block';
                        sourceSyncStatus.setAttribute("url", greenIndicator);
                        sourceSyncStatus.getElementsByTagName('img')[0].setAttribute("src", greenIndicator);
                    } else {
                        outOfSycMsgEl.style.display = 'block';
                        stopBtnWrapper.style.display = 'none';
                        sourceSyncStatus.setAttribute("url", redIndicator);
                        sourceSyncStatus.getElementsByTagName('img')[0].setAttribute("src", redIndicator);
                    }
                    // presentationObject["displays"][displayIndex].sourceIsSynced = value;
                    break;

                case "airmediausers":
                    // presentationObject["displays"][displayIndex].presentingSource.airMedia.users = parseInt(value);
                    break;

                case "videomutemode":
                    avfUtility.log('setButtonToAllDisplays to run', displayIndex, responseValue);
                    setButtonToAllDisplays(displayIndex, responseValue);
                    break;
            }

            if (sourceObject.device.type.toLowerCase() === 'airmedia') {
                avfUtility.log("Airmedia flags: airMediaScreenStatus >", airMediaScreenStatus,
                    ' ----- Join key >', joinKey.toLowerCase(),
                    ' ---- Users >', sourceObject.airMedia.users);
                if ((airMediaScreenStatus === 'playing' || airMediaScreenStatus === 'stopped') &&
                    airMediaScreenStatus && isPresentingStopped) {
                    avfUtility.log("Airmedia page flipped");
                    navigationModule.goToPresentationScreen();
                } else {
                    if ((sourceObject.airMedia.users > 0 && airMediaScreenStatus === 'playing') ||
                        (sourceObject.airMedia.users === 0 && airMediaScreenStatus === 'stopped')) {
                        avfUtility.log("No screen change require. airMediaScreenStatus - ", airMediaScreenStatus);
                    } else {
                        avfUtility.log("Airmedia going inside.");
                        goToPresentationDetailsScreen(displayIndex, null);
                    }
                }
            } else {
                if (isCurrentScreenPresentationDetails()) {
                    avfUtility.log("isCurrentScreenPresentationDetails()", isCurrentScreenPresentationDetails());
                    avfUtility.log("isPresentingStopped", isPresentingStopped);
                    if (isPresentingStopped) {
                        avfUtility.log("flip to presentScreen on press of stop button.");
                        navigationModule.goToPresentationScreen();
                    } else if (!isPresentingStopped) {
                        // if (presentationObject) {
                        // presentationObject["displays"][displayIndex]["sources"][j].sourceIndex = j;
                        const selDeviceModelValue = sourceObject.device.model;
                        const selDeviceTypeValue = sourceObject.device.type;
                        setDeviceModelAndType(selDeviceModelValue, selDeviceTypeValue, displayIndex);
                        avfUtility.log('presenting a page: >>> selDeviceModelValue = ', selDeviceModelValue, ', >>> selDeviceTypeValue = ', selDeviceTypeValue)
                        goToPresentationDetailsScreen(displayIndex, null);
                        // }
                    }
                }
            }
        }
    }

    /**
    * 
    * @param {*} deviceType 
    * @param {*} deviceModel 
    * @param {*} selectedDisplayIndex 
    */
    function startControlledSource(deviceType = '', deviceModel = '', selectedDisplayIndex = 0) {
        avfUtility.log('deviceModel: ' + deviceModel + ', deviceType: ' + deviceType + ', selectedDisplayIndex: ' + selectedDisplayIndex);
        switch (deviceType.toLowerCase()) {
            case 'bluray':
                blurayModule.setDisplayIndex(selectedDisplayIndex);
                break;

            case 'cabletv':
                switch (deviceModel.toLowerCase()) {
                    case "directv":
                    case 'directtv':
                        directTvModule.setDisplayIndex(selectedDisplayIndex);
                        break;

                    case 'tivo':
                    case "tivo premiere":
                        tivoModule.setDisplayIndex(selectedDisplayIndex);
                        break;
                }
                break;

            case 'videoserver':
                switch (deviceModel.toLowerCase()) {
                    case 'apple tv':
                    case "apple tv 4k":
                        appleTvModule.setDisplayIndex(selectedDisplayIndex);
                        break;

                    case 'roku':
                    case "roku premiere (4620x)":
                        rokuModule.setDisplayIndex(selectedDisplayIndex);
                        break;
                }
                break;
        }
    }

    /**
    * Is the current screen 'Presentation details'
    */
    function isCurrentScreenPresentationDetails() {
        const currentPage = navigationModule.getCurrentPage();
        if (currentPage) {
            return (currentPage.isPresentationDetailsPage);
        } else {
            return false;
        }
    }

    /**
    * Set Default Source
    * @param {*} sourceIndex 
    * @param {*} responseValue 
    */
    function setDefaultSource(sourceIndex, responseValue) {
        let sourceIndexNew = `${0}_${sourceIndex}`;
        if (!responseValue) {
            const index = defaultSourceIndex.indexOf(sourceIndexNew);
            if (index > -1) {
                defaultSourceIndex.splice(index, 1);
            }
        } else {
            dateTimeDisplayModule.setDefaultStartButton(sourceIndex);
            defaultSourceIndex.length = 0;
            defaultSourceIndex.push(sourceIndexNew);
        }
    }

    // list of public functions
    return {
        NUMBER_OF_DISPLAYS,
        clickButton,
        startPresenting,
        stopPresenting,
        getStopButtonText,
        getPresentationObject,
        onInit,
        startPresentingDefaultSource,
        getDefaultSourceIndex
    };

}());
