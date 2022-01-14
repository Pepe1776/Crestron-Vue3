// Copyright (C) 2020 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/* jslint es6 */

const navigationModule = (function () {
    'use strict';

    let previousPage = null;
    let currentPage = null;
    let isPresentationScreenViewed = false; // This variable is used to identify if the presentation screen is viewed, and then the user has not navigated back to home screen.

    const popupPages = {
        "announcementImportPage": {
            importPageName: "announcement-import-page",
            standAloneView: true,
            priorityIndex: 50
        },
        "configuringImportPage": {
            importPageName: "configuring-import-page",
            standAloneView: true,
            priorityIndex: 30
        },
        "coolingDownImportPage": {
            importPageName: "coolingDown-import-page",
            standAloneView: true,
            priorityIndex: 80
        },
        "disconnectedImportPage": {
            importPageName: "disconnected-import-page",
            standAloneView: true,
            priorityIndex: 10
        },
        "emergencyBroadcastImportPage": {
            importPageName: "emergencyBroadcast-import-page",
            standAloneView: true,
            priorityIndex: 40
        },
        "extendedInfoImportPage": {
            importPageName: "extendedInfo-import-page",
            standAloneView: true,
            priorityIndex: 140
        },
        "helpImportPage": {
            importPageName: "help-import-page",
            standAloneView: true,
            priorityIndex: 120
        },
        "infoImportPage": {
            importPageName: "info-import-page",
            standAloneView: true,
            priorityIndex: 150
        },
        "initializingImportPage": {
            importPageName: "initializing-import-page",
            standAloneView: true,
            priorityIndex: 20
        },
        "loaderImportPage": {
            importPageName: "loader-import-page",
            standAloneView: true,
            priorityIndex: 90
        },
        "logDisplayImportPage": {
            importPageName: "logDisplay-import-page",
            standAloneView: true,
            priorityIndex: 290
        },
        "scheduleMeetingImportPage": {
            importPageName: "scheduleMeeting-import-page",
            standAloneView: true,
            priorityIndex: 100
        },
        "screensaverImportPage": {
            importPageName: "screensaver-import-page",
            standAloneView: true,
            priorityIndex: 110
        },
        "shutdownImportPage": {
            importPageName: "shutdown-import-page",
            standAloneView: true,
            priorityIndex: 60
        },
        "warmingUpImportPage": {
            importPageName: "warmingUp-import-page",
            standAloneView: true,
            priorityIndex: 70
        }
    };

    const navigationPages = {
        "startPageImportPage": {
            importPageName: "startPage-import-page",
            standAloneView: false,
            index: 0,
            isSourceSelectionPage: false,
            isPresentationPage: false,
            isPresentationDetailsPage: false
        },
        "menuScreenImportPage": {
            importPageName: "menuScreen-import-page",
            standAloneView: false,
            index: 1,
            isSourceSelectionPage: false,
            isPresentationPage: false,
            isPresentationDetailsPage: false
        },
        "airmediaImportPage": {
            importPageName: "airmedia-import-page",
            standAloneView: false,
            index: 2,
            isSourceSelectionPage: true,
            isPresentationPage: false,
            isPresentationDetailsPage: true
        },
        "appleTvImportPage": {
            importPageName: "appleTv-import-page",
            standAloneView: false,
            index: 3,
            isSourceSelectionPage: true,
            isPresentationPage: false,
            isPresentationDetailsPage: true
        },
        "blurayImportPage": {
            importPageName: "bluray-import-page",
            standAloneView: false,
            index: 4,
            isSourceSelectionPage: true,
            isPresentationPage: false,
            isPresentationDetailsPage: true
        },
        "directTvImportPage": {
            importPageName: "directTv-import-page",
            standAloneView: false,
            index: 5,
            isSourceSelectionPage: true,
            isPresentationPage: false,
            isPresentationDetailsPage: true
        },
        "rokuImportPage": {
            importPageName: "roku-import-page",
            standAloneView: false,
            index: 6,
            isSourceSelectionPage: true,
            isPresentationPage: false,
            isPresentationDetailsPage: true
        },
        "tivoImportPage": {
            importPageName: "tivo-import-page",
            standAloneView: false,
            index: 7,
            isSourceSelectionPage: true,
            isPresentationPage: false,
            isPresentationDetailsPage: true
        },
        "horizontalPresentImportPage": {
            importPageName: "horizontalPresent-import-page",
            standAloneView: false,
            index: 8,
            isSourceSelectionPage: true,
            isPresentationPage: true,
            isPresentationDetailsPage: false
        },
        "verticalPresentImportPage": {
            importPageName: "verticalPresent-import-page",
            standAloneView: false,
            index: 9,
            isSourceSelectionPage: true,
            isPresentationPage: true,
            isPresentationDetailsPage: false
        },
        "uncontrolledSourcesImportPage": {
            importPageName: "uncontrolledSources-import-page",
            standAloneView: false,
            index: 10,
            isSourceSelectionPage: true,
            isPresentationPage: false,
            isPresentationDetailsPage: true
        }
    };

    const animationClasses = {
        "fadeOutUpBig": ["animate__animated", "animate__fadeOutUpBig"],
        "fadeInUpBig": ["animate__animated", "animate__fadeInUpBig"],
        "fadeOutDownBig": ["animate__animated", "animate__fadeOutDownBig"],
        "fadeInDownBig": ["animate__animated", "animate__fadeInDownBig"],
        "fadeOutUpBigFast": ["animate__animated", "animate__fadeOutUpBig", "animate__fast"],
        "fadeInUpBigFast": ["animate__animated", "animate__fadeInUpBig", "animate__fast"],
        "fadeOutDownBigFast": ["animate__animated", "animate__fadeOutDownBig", "animate__fast"],
        "fadeInDownBigFast": ["animate__animated", "animate__fadeInDownBig", "animate__fast"],
        "fadeOut": ["animate__animated", "animate__fadeOut"],
        "fadeOutSlow": ["animate__animated", "animate__fadeOut", "animate__slow"],
        "fadeIn": ["animate__animated", "animate__fadeIn"],
        "fadeInSlow": ["animate__animated", "animate__fadeIn", "animate__slow"],
        "fadeInFast": ["animate__animated", "animate__fadeIn", "animate__fast"],
        "zoomIn": ["animate__animated", "animate__zoomIn"],
        "zoomOut": ["animate__animated", "animate__zoomOut"],
        "fadeOutFast": ["animate__animated", "animate__fadeOut", "animate__fast"]
    };

    const animationBasedPopups = [{
        screenId: popupPages.infoImportPage.importPageName,
        fromAnimation: "", //AVFRM-2666 : removing animation transitions
        toAnimation: "", //AVFRM-2666 : removing animation transitions
        animateFullScreen: false
    },
    {
        screenId: popupPages.extendedInfoImportPage.importPageName,
        fromAnimation: animationClasses.zoomIn,
        toAnimation: animationClasses.zoomOut,
        animateFullScreen: true
    },
    {
        screenId: popupPages.logDisplayImportPage.importPageName,
        fromAnimation: animationClasses.fadeInSlow,
        toAnimation: animationClasses.fadeOutFast,
        animateFullScreen: true
    },
    {
        screenId: popupPages.helpImportPage.importPageName,
        fromAnimation: "", //AVFRM-2666 : removing animation transitions
        toAnimation: "", //AVFRM-2666 : removing animation transitions
        animateFullScreen: false
    },
    {
        screenId: popupPages.screensaverImportPage.importPageName,
        fromAnimation: animationClasses.fadeIn,
        toAnimation: animationClasses.fadeOut,
        animateFullScreen: false
    }
    ];

    const animationBasedOnFromAndTo = [
        {
            fromScreenId: "",
            toScreenId: navigationPages.menuScreenImportPage.importPageName,
            fromAnimation: animationClasses.fadeOutUpBig,
            toAnimation: animationClasses.fadeInUpBig
        },
        {
            fromScreenId: navigationPages.startPageImportPage.importPageName,
            toScreenId: navigationPages.menuScreenImportPage.importPageName,
            fromAnimation: animationClasses.fadeOutUpBig,
            toAnimation: animationClasses.fadeInUpBig
        },
        {
            fromScreenId: navigationPages.menuScreenImportPage.importPageName,
            toScreenId: navigationPages.startPageImportPage.importPageName,
            fromAnimation: animationClasses.fadeOutDownBig,
            toAnimation: animationClasses.fadeInDownBig
        },
        {
            fromScreenId: navigationPages.menuScreenImportPage.importPageName,
            toScreenId: navigationPages.horizontalPresentImportPage.importPageName,
            fromAnimation: animationClasses.fadeOutDownBig,
            toAnimation: animationClasses.fadeInDownBig
        },
        {
            fromScreenId: navigationPages.horizontalPresentImportPage.importPageName,
            toScreenId: navigationPages.menuScreenImportPage.importPageName,
            fromAnimation: animationClasses.fadeOutUpBig,
            toAnimation: animationClasses.fadeInUpBig
        },
        {
            fromScreenId: navigationPages.menuScreenImportPage.importPageName,
            toScreenId: navigationPages.uncontrolledSourcesImportPage.importPageName,
            fromAnimation: animationClasses.fadeOutDownBig,
            toAnimation: animationClasses.fadeInDownBig
        },
        {
            fromScreenId: navigationPages.uncontrolledSourcesImportPage.importPageName,
            toScreenId: navigationPages.menuScreenImportPage.importPageName,
            fromAnimation: animationClasses.fadeOutUpBig,
            toAnimation: animationClasses.fadeInUpBig
        },
        {
            fromScreenId: navigationPages.menuScreenImportPage.importPageName,
            toScreenId: navigationPages.verticalPresentImportPage.importPageName,
            fromAnimation: animationClasses.fadeOutDownBig,
            toAnimation: animationClasses.fadeInDownBig
        },
        {
            fromScreenId: navigationPages.verticalPresentImportPage.importPageName,
            toScreenId: navigationPages.menuScreenImportPage.importPageName,
            fromAnimation: animationClasses.fadeOutUpBig,
            toAnimation: animationClasses.fadeInUpBig
        },
        {
            fromScreenId: navigationPages.verticalPresentImportPage.importPageName,
            toScreenId: navigationPages.uncontrolledSourcesImportPage.importPageName,
            fromAnimation: animationClasses.fadeOut,
            toAnimation: animationClasses.fadeIn
        },
        {
            fromScreenId: navigationPages.horizontalPresentImportPage.importPageName,
            toScreenId: navigationPages.uncontrolledSourcesImportPage.importPageName,
            fromAnimation: animationClasses.fadeOut,
            toAnimation: animationClasses.fadeIn
        },
        {
            fromScreenId: navigationPages.uncontrolledSourcesImportPage.importPageName,
            toScreenId: navigationPages.verticalPresentImportPage.importPageName,
            fromAnimation: animationClasses.fadeOut,
            toAnimation: animationClasses.fadeIn
        },
        {
            fromScreenId: navigationPages.uncontrolledSourcesImportPage.importPageName,
            toScreenId: navigationPages.horizontalPresentImportPage.importPageName,
            fromAnimation: animationClasses.fadeOut,
            toAnimation: animationClasses.fadeIn
        }
    ];

    /**
     * Go to Vertical or Horizontal presentation screen.
     */
    function goToPresentationScreen() {
        isPresentationScreenViewed = true;
        const presentationObject = sourceSelectionModule.getPresentationObject();
        presentationObject.presentingScreenDisplayIndex = -1;
        presentationObject.presentingScreenSourceIndex = -1;
        avfUtility.log(`Presentation - horizontal ${presentationObject.screen.horizontal}`);
        avfUtility.log(`Presentation - vertical ${presentationObject.screen.vertical}`);
        if (presentationObject.screen.horizontal === true) {
            navigationModule.goToPage(navigationModule.navigationPages.horizontalPresentImportPage);
        } else if (presentationObject.screen.vertical === true) {
            verticalPresentModule.navigateToVerticalPageAndResetView(presentationObject.displayCount);
        }
    }

    /**
     * Back button click from Footer Menu.
     */
    function backButtonMenuIconClicked() {
        if (isPresentationScreenViewed) {
            goToPresentationScreen();
        } else {
            goToPage();
        }
    }

    /**
     * Go to selected page. If no parameter is supplied, then redirect to home page
     * @param {*} navigationPage 
     */
    function goToPage(navigationPage) {
        if (appModule.getSystemReady() === false) {
            return;
        }

        previousPage = currentPage;

        const pages = Object.values(navigationPages);
        let pageObject;
        if (navigationPage && avfUtility.isValidInput(navigationPage.importPageName)) {
            currentPage = navigationPage;
        } else {
            currentPage = navigationPages.startPageImportPage;
        }

        if (currentPage === navigationPages.startPageImportPage) {
            isPresentationScreenViewed = false;
        }
        pageObject = document.getElementById(currentPage.importPageName);

        // This line is important, and is used only for the first time
        document.getElementById('triggerViewWrapper').classList.remove("hide-vis");
        document.getElementById('pageLoadingDiv').classList.add("hide-div");

        avfUtility.log("navigationModule: goToPage - From", (previousPage && avfUtility.isValidInput(previousPage.importPageName)) ? previousPage.importPageName : '');
        avfUtility.log("navigationModule: goToPage - To", currentPage.importPageName);

        let previousPageObject = null;
        if (previousPage && avfUtility.isValidInput(previousPage.importPageName)) {
            previousPageObject = document.getElementById(previousPage.importPageName);
        }

        if (previousPageObject && (previousPageObject.id === pageObject.id)) {
            return;
        }
        const animationObject = getAnimationType(previousPageObject, pageObject);
        setPageAnimations(previousPageObject, animationObject.flyOutClasses);
        setPageAnimations(pageObject, animationObject.flyInClasses);

        let isFromViewStandAlone = false;
        if ((previousPageObject && avfUtility.isValidInput(previousPageObject.id))) {
            const previousPageObjectFromList = pages.find((tempObj) => tempObj.importPageName.trim().toLowerCase() === previousPageObject.id.trim().toLowerCase());
            if (previousPageObjectFromList) {
                isFromViewStandAlone = previousPageObjectFromList.standAloneView;
            } else {
                isFromViewStandAlone = true;
            }
        } else {
            isFromViewStandAlone = true;
        }

        let isToViewStandAlone = false;
        const pageObjectFromList = pages.find((tempObj) => tempObj.importPageName.trim().toLowerCase() === pageObject.id.trim().toLowerCase());
        if (pageObjectFromList) {
            isToViewStandAlone = pageObjectFromList.standAloneView;
        } else {
            isToViewStandAlone = true;
        }

        if (isFromViewStandAlone === false && isToViewStandAlone === false) {
            setTimeout(() => {
                pageObject.show = true;
                templateContentModule.navMenu(currentPage.index);
                // DEV NOTE: the alignment of few elements like the triggerview doesn't occur without below like
                // verticalPresent etc
                window.dispatchEvent(new Event('resize'));
            }, 100);
        } else {
            pageObject.show = true;
            templateContentModule.navMenu(currentPage.index);
            // DEV NOTE: the alignment of few elements like the triggerview doesn't occur without below like
            // verticalPresent etc
            window.dispatchEvent(new Event('resize'));
        }

        if (currentPage.importPageName === navigationPages.menuScreenImportPage.importPageName) {
            footerModule.showBackIcon();
        } else {
            footerModule.showMenuIcon();
        }
    }

    /**
     * Returns the current page
     */
    function getCurrentPage() {
        return currentPage;
    }

    /**
     * Go to previous page
     */
    function goToPreviousPage() {
        let identifyPreviousPage = null;
        if (previousPage) {
            identifyPreviousPage = previousPage;
        } else {
            identifyPreviousPage = navigationPages.startPageImportPage;
        }
        goToPage(identifyPreviousPage);
    }

    /**
     * Open selected Popup
     * @param {*} popupPage 
     */
    function openPopup(popupPage) {
        if (!popupPage) {
            return;
        }

        let popupObject = document.getElementById(popupPage.importPageName);
        if (!(popupObject && avfUtility.isValidInput(popupObject.id))) {
            return;
        } else if (document.getElementById(popupObject.id).show === true) {
            return;
        }

        if (appModule.getSystemReady() === false) {
            if (popupPage.importPageName !== popupPages.disconnectedImportPage.importPageName &&
                popupPage.importPageName !== popupPages.configuringImportPage.importPageName &&
                popupPage.importPageName !== popupPages.initializingImportPage.importPageName) {
                return;
            }
        } else {
            if (popupPage.importPageName === popupPages.configuringImportPage.importPageName) {
                return;
            }
        }

        const popups = Object.values(popupPages);
        for (let i = 0; i < popups.length; i++) {
            if (document.getElementById(popups[i].importPageName).show === true) {
                if (popupPage.priorityIndex > popups[i].priorityIndex) {
                    return;
                }
                if (popups[i].importPageName === popupPages.screensaverImportPage.importPageName) {
                    document.getElementById(popupPages.screensaverImportPage.importPageName).show = false;
                }
            }
        }

        document.getElementById('pageLoadingDiv').classList.add("hide-div");

        avfUtility.log("navigationModule: openPopup", popupObject.id);

        popupObject.show = true;

        setPageAnimationsForPopup(popupObject, "from");

        document.getElementById('triggerViewWrapper').classList.add("hide-div");
        document.getElementById('triggerViewWrapper').classList.remove("hide-vis");
    }

    /**
     * Close Selected Popup
     * @param {*} popupPage 
     * @param {*} timeoutVal 
     * @param {*} setAnimation 
     */
    function closePopup(popupPage, timeoutVal = 500, setAnimation = true, immediateSnapToView = false) {
        if (!popupPage) {
            return;
        }

        const popups = Object.values(popupPages);
        let popupObject = document.getElementById(popupPage.importPageName);
        if (!(popupObject && avfUtility.isValidInput(popupObject.id))) {
            return;
        } else if (document.getElementById(popupObject.id).show === false) {
            return;
        }

        avfUtility.log("navigationModule: closePopup", popupPage.importPageName);

        if (setAnimation === true) {
            setPageAnimationsForPopup(popupObject, "to");
        }

        if (timeoutVal > 0) {
            // Condition: below code executes post 300ms such that the animations are taken care off before
            // main hide logic occurs
            setTimeout(() => {
                document.getElementById(popupPage.importPageName).show = false;

                // Condition: below logic only to ensure a crossfade feel happens when the popup closes and 
                // reveals the main view "triggerViewWrapper" behind
                setTimeout(() => {
                    const triggerViewElement = document.getElementById('triggerViewWrapper');
                    triggerViewElement.classList.add(...animationClasses.fadeInFast);
                    triggerViewElement.classList.remove("hide-div");
                    //HH: Below line is only 1 corner case, need to clear it for a generic fix
                    document.getElementById('start-page-page').classList.remove("animate__fadeInUpBig");
                    popupObject.style.opacity = '1';
                }, 300);
            }, timeoutVal);
        } else {
            document.getElementById(popupPage.importPageName).show = false;
            const triggerViewElement = document.getElementById('triggerViewWrapper');
            if (immediateSnapToView) {
                triggerViewElement.classList.remove(...animationClasses.fadeInFast);
                triggerViewElement.classList.remove(...animationClasses.fadeIn);
            } else {
                triggerViewElement.classList.add(...animationClasses.fadeInFast);
            }
            //HH: Below line is only 1 corner case, need to clear it for a generic fix
            document.getElementById('start-page-page').classList.remove("animate__fadeInUpBig");
            popupObject.style.opacity = '1';
            triggerViewElement.classList.remove("hide-div");
        }
    }

    /**
     * Function to close all popups
     */
    function closeAllPopups() {
        avfUtility.log("navigationModule: closeAllPopups");
        const popups = Object.values(popupPages);

        for (let i = 0; i < popups.length; i++) {
            document.getElementById(popups[i].importPageName).show = false;
        }
        document.getElementById('triggerViewWrapper').classList.remove("hide-div");
    }

    /**
     * Function to enforce a page with the animation style as defined in the const above
     * @param {*} pageObject 
     * @param {*} pageAnimationInput 
     */
    function setPageAnimations(pageObject, pageAnimationInput) {
        if (pageObject && avfUtility.isValidInput(pageObject.id)) {
            const pageObjectFirstDivElement = pageObject.getElementsByTagName('div')[0];
            pageObjectFirstDivElement.style.overflow = "hidden";

            const pageObjectSectionElement = pageObjectFirstDivElement.getElementsByTagName('section')[0];
            if (pageObjectSectionElement) {
                for (let prop in animationClasses) {
                    pageObjectSectionElement.classList.remove(...animationClasses[prop]);
                }
                pageObjectSectionElement.classList.add(...pageAnimationInput);
            }
        }
    }

    /**
     * 
     * @param {*} pageObject 
     * @param {*} pageAnimationInput 
     */
    function setPageAnimationsForPopup(popupObject, fromOrTo) {
        if (popupObject && avfUtility.isValidInput(popupObject.id)) {
            const pageAnimationInput = animationBasedPopups.find(tempObj => tempObj.screenId === popupObject.id);
            if (pageAnimationInput) {
                if (pageAnimationInput.animateFullScreen === true) {
                    for (let prop in animationClasses) {
                        popupObject.classList.remove(...animationClasses[prop]);
                    }
                    if (fromOrTo === "from") {
                        popupObject.classList.add(...pageAnimationInput.fromAnimation);
                    } else {
                        popupObject.classList.add(...pageAnimationInput.toAnimation);
                    }
                } else {
                    const pageObjectFirstDivElement = popupObject.getElementsByTagName('div')[0];
                    const pageObjectSectionElement = pageObjectFirstDivElement.getElementsByTagName('section')[0];
                    if (pageObjectSectionElement) {
                        for (let prop in animationClasses) {
                            pageObjectSectionElement.classList.remove(...animationClasses[prop]);
                        }
                        if (fromOrTo === "from") {
                            pageObjectSectionElement.classList.add(...pageAnimationInput.fromAnimation);
                        } else {
                            pageObjectSectionElement.classList.add(...pageAnimationInput.toAnimation);
                        }
                    }

                }
            }
        }
    }

    /**
     * Animation of the page while flipping
     * @param {*} fromScreen 
     * @param {*} toScreen 
     */
    function getAnimationType(fromScreen, toScreen) {
        const output = {
            flyInClasses: [],
            flyOutClasses: []
        };

        let fromScreenId = "";
        if (fromScreen && avfUtility.isValidInput(fromScreen.id)) {
            fromScreenId = fromScreen.id;
        }
        let toScreenId = "";
        if (toScreen && avfUtility.isValidInput(toScreen.id)) {
            toScreenId = toScreen.id;
        }

        for (let i = 0; i < animationBasedOnFromAndTo.length; i++) {
            if (animationBasedOnFromAndTo[i].fromScreenId === fromScreenId && animationBasedOnFromAndTo[i].toScreenId === toScreenId) {
                output.flyOutClasses = animationBasedOnFromAndTo[i].fromAnimation;
                output.flyInClasses = animationBasedOnFromAndTo[i].toAnimation;
                break;
            }
        }
        return output;
    }

    return {
        goToPage,
        goToPreviousPage,
        openPopup,
        backButtonMenuIconClicked,
        closePopup,
        getCurrentPage,
        closeAllPopups,
        goToPresentationScreen,
        popupPages,
        navigationPages
    };

}());