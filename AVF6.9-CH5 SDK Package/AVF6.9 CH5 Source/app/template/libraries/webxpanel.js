// Copyright (C) 2020 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.
/* global WebXPanel, translateModule*/

var webXPanelModule = (function () {
  "use strict";

  const config = {
    "host": "",
    "port": 49200,
    "roomId": "",
    "ipId": "",
    "tokenSource": "",
    "tokenUrl": ""
  };

  const RENDER_STATUS = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    hide: 'hide',
    loading: 'loading'
  };

  var WARN_DAYS_BEFORE = 0;
  var status;
  var header, appVer, params;
  var pcConfig = config;
  var urlConfig = config;

  /**
   * Function to set status bar current state - hidden being default
   * @param {*} classNameToAdd 
   */
  function setStatus(classNameToAdd = RENDER_STATUS.hide) {
    let preloader = document.getElementById('pageStatusIdentifier');
    if (preloader) {
      preloader.className = classNameToAdd;
    }
  }

  /**
   * Get WebXPanel configuration present in project-config.json
   */
  function getWebXPanelConfiguration(projectConfig) {
    if (projectConfig.config && projectConfig.config.controlSystem) {
      pcConfig.host = projectConfig.config.controlSystem.host || "";
      pcConfig.port = projectConfig.config.controlSystem.port || "";
      pcConfig.roomId = projectConfig.config.controlSystem.roomId || "";
      pcConfig.ipId = projectConfig.config.controlSystem.ipId || "";
      pcConfig.tokenSource = projectConfig.config.controlSystem.tokenSource || "";
      pcConfig.tokenUrl = projectConfig.config.controlSystem.tokenUrl || "";

      // if undefined, assign 60 days as default 
      WARN_DAYS_BEFORE = projectConfig.config.controlSystem.licenseExpirationWarning || 60;
    }
  }

  /**
   * Get the url params if defined.
   */
  function getWebXPanelUrlParams() {
    let urlString = window.location.href;
    let urlParams = new URL(urlString);

    // default host should be the IP address of the PC
    urlConfig.host = urlParams.searchParams.get("host") || pcConfig.host;
    urlConfig.port = urlParams.searchParams.get("port") || pcConfig.port;
    urlConfig.roomId = urlParams.searchParams.get("roomId") || pcConfig.roomId;
    urlConfig.ipId = urlParams.searchParams.get("ipId") || pcConfig.ipId;
    urlConfig.tokenSource = urlParams.searchParams.get("tokenSource") || pcConfig.tokenSource;
    urlConfig.tokenUrl = urlParams.searchParams.get("tokenUrl") || pcConfig.tokenUrl;
  }

  /**
   * Set the listeners for WebXPanel
   */
  function setWebXPanelListeners() {
    // A successful WebSocket connection has been established
    WebXPanel.default.addEventListener(WebXPanel.WebXPanelEvents.CONNECT_WS, (event) => {
      status.innerHTML = translateModule.translateInstant("app.webxpanel.status.CONNECT_WS");
    });

    WebXPanel.default.addEventListener(WebXPanel.WebXPanelEvents.DISCONNECT_CIP, (msg) => {
      status.innerHTML = translateModule.translateInstant("app.webxpanel.status.DISCONNECT_CIP");
      displayConnectionWarning();
    });

    WebXPanel.default.addEventListener(WebXPanel.WebXPanelEvents.ERROR_WS, (msg) => {
      status.innerHTML = translateModule.translateInstant("app.webxpanel.status.ERROR_WS");
      displayConnectionWarning();
    });

    WebXPanel.default.addEventListener(WebXPanel.WebXPanelEvents.AUTHENTICATION_FAILED, (msg) => {
      status.innerHTML = translateModule.translateInstant("app.webxpanel.status.AUTHENTICATION_FAILED");
      displayConnectionWarning();
    });

    WebXPanel.default.addEventListener(WebXPanel.WebXPanelEvents.AUTHENTICATION_REQUIRED, (msg) => {
      status.innerHTML = translateModule.translateInstant("app.webxpanel.status.AUTHENTICATION_REQUIRED");
      displayConnectionWarning();
    });

    WebXPanel.default.addEventListener(WebXPanel.WebXPanelEvents.CONNECT_CIP, (msg) => {
      setStatus(RENDER_STATUS.success);

      // Hide the bar after 10 seconds
      setTimeout(() => {
        setStatus(RENDER_STATUS.hide);
      }, 10000);

      status.innerHTML = translateModule.translateInstant("app.webxpanel.status.CONNECT_CIP");
      let connectInfo = `<span>CS: ${msg.detail.url}</span>`
        + `<span>IPID: ${Number(msg.detail.ipId).toString(16)}</span>`;

      // Show roomId in info when it is not empty
      if (msg.detail.roomId !== "") {
        connectInfo += `<span>Room Id: ${msg.detail.roomId}</span>`;
      }
      document.getElementById("webXPnlParams").innerHTML = connectInfo;
    });

    // Display License errors
    WebXPanel.default.addEventListener(WebXPanel.WebXPanelEvents.LICENSE_WS, ({ detail }) => {
      updateDialogLicenseInfo(detail);
    });


    function updateDialogLicenseInfo(detail) {
      const controlSystemSupportsLicense = detail.controlSystemSupportsLicense;  // boolean
      const licenseApplied = detail.licenseApplied; // optional boolean
      const licenseDaysRemaining = detail.licenseDaysRemaining; // optional number
      const licenseHasExpiry = detail.licenseHasExpiry; // optional boolean 
      const trialPeriod = detail.trialPeriod; // optional boolean
      const trialPeriodDaysRemaining = detail.trialPeriodDaysRemaining; // optional number
      const resourceAvailable = detail.resourceAvailable; // boolean 

      const licenseText = document.getElementById("webXPnlLicense");

      if (!controlSystemSupportsLicense) {
        licenseText.textContent = translateModule.translateInstant("app.webxpanel.license.csmobilitysupport");
      } else if (!resourceAvailable) {
        licenseText.textContent = translateModule.translateInstant("app.webxpanel.license.mobilitylicenserequired");
      } else if (licenseApplied) {
        if (!licenseHasExpiry) {
          licenseText.textContent = translateModule.translateInstant("app.webxpanel.license.mobilitylicensevalid");
        } else {
          // Display warning
          displayLicenseWarning(WARN_DAYS_BEFORE, licenseDaysRemaining);

          licenseText.textContent = translateModule.translateInstant("app.webxpanel.license.mobilitylicensewarning", { licenseDaysRemaining });
          const updatedDetail = detail;
          updatedDetail.licenseDaysRemaining = licenseDaysRemaining - 1;
          setTimeout(updateDialogLicenseInfo, 24 * 60 * 60 * 1000, updatedDetail);
        }
      } else if (trialPeriod) {
        licenseText.textContent = translateModule.translateInstant("app.webxpanel.license.mobilitylicensetrial", { trialPeriodDaysRemaining });

        // Display warning
        displayLicenseWarning(WARN_DAYS_BEFORE, trialPeriodDaysRemaining);

        const updatedDetail = detail;
        updatedDetail.trialPeriodDaysRemaining = trialPeriodDaysRemaining - 1;
        setTimeout(updateDialogLicenseInfo, 24 * 60 * 60 * 1000, updatedDetail);
      }
    }


    // Authorization
    WebXPanel.default.addEventListener(WebXPanel.WebXPanelEvents.NOT_AUTHORIZED, ({ detail }) => {
      let winParams = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
      width=0,height=0,left=-1000,top=-1000`;
      let redirectWindow = window.open(detail.redirectTo, 'msgwindow', winParams);
      if (!redirectWindow || redirectWindow.closed || typeof redirectWindow.closed == 'undefined') {
        let popupblockmsg = translateModule.translateInstant("app.webxpanel.popupblocked");
        alert(popupblockmsg);
      }

      status.innerHTML = "Status: NOT AUTHORIZED";

      redirectWindow.onbeforeunload = (event) => {
        // Cancel the event as stated by the standard.
        // event.preventDefault();
        // try to authenticate after user enters the details in the popup successfully
        WebXPanel.default.authenticate();
        // or refreshing the page, uncomment the below code if the above line is not working 
        // window.reload();
      }
    });
  }

  /**
   * Show the badge on the info icon for connection status.
   */
  function displayConnectionWarning() {
    let classArr = document.getElementById("infobtn").classList;
    if (classArr) {
      classArr.add("warn");
    }
  }

  /**
   * Show the badge on the info icon for license expiry warning.
   */
  function displayLicenseWarning(warnDays, remainingDays) {
    // 0 means no license warning messages
    if (WARN_DAYS_BEFORE !== 0) {
      if (warnDays >= remainingDays) {
        let classArr = document.getElementById("infobtn").classList;
        if (classArr) {
          classArr.add("warn");
        }
      } else {
        return false;
      }
    }
  }

  /**
   * Show WebXPanel connection status 
   */
  function webXPanelConnectionStatus() {
    //Display the connection animation on the header bar
    setStatus(RENDER_STATUS.loading);

    // Hide the animation after 30 seconds
    setTimeout(() => {
      setStatus(RENDER_STATUS.hide);
    }, 30000);
  }

  /**
   * Connect to the control system through websocket connection.
   * Show the status in the header bar using CSS animation. 
   * @param {object} projectConfig 
   */
  function connectWebXPanel(projectConfig) {
    let connectParams = config;
    let ver = WebXPanel.getVersion();
    let bdate = WebXPanel.getBuildDate();

    document.getElementById("versionDetails").style.display = 'block'; // Show the style
    header = document.getElementById("webXPnlHdr").innerHTML = `WebXPanel Version: ${ver}<span>Build date: ${bdate}</span>`;
    appVer = document.getElementById("webXPnlVer");
    status = document.getElementById("webXPnlStatus");
    params = document.getElementById("webXPnlParams");

    webXPanelConnectionStatus();

    // Merge the configuration params, params of the URL takes precedence
    getWebXPanelConfiguration(projectConfig);
    getWebXPanelUrlParams();

    // Assign the combined configuration
    connectParams = urlConfig;

    connectParams.host + connectParams.ipId

    WebXPanel.default.initialize(connectParams);
    status.innerHTML = translateModule.translateInstant("app.webxpanel.status.CONNECT_WS");
    let connectInfo = `<span>CS: wss://${connectParams.host}:${connectParams.port}/</span>`
      + `<span>IPID: ${Number(connectParams.ipId).toString(16)}</span>`;

    // Show roomId in info when it is not empty
    if (connectParams.roomId !== "") {
      connectInfo += `<span>Room Id: ${connectParams.roomId}</span>`;
    }
    document.getElementById("webXPnlParams").innerHTML = connectInfo;

    // WebXPanel listeners are called in the below method
    setWebXPanelListeners();
  }

  /**
   * Initialize WebXPanel
   */
  function connect(projectConfig) {
    // Connect only in browser environment
    if (!WebXPanel.isActive) {
      return;
    } else {
      connectWebXPanel(projectConfig);
    }
  }

  /**
   * All public method and properties exporting here
   */
  return {
    connect
  };

})();
