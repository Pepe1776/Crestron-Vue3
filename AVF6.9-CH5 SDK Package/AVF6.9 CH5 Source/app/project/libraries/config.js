// Copyright (C) 2020 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/* jslint es6 */

const configModule = (function () {
    'use strict';

    let configurationData = null;

    /**
     * Returns Urls
     */
    function getUrls() {
        return configurationData.urls;
    }

    function getLoggerLimit() {
        return configurationData.logger.limit;
    }

    /**
     * Returns icon based on iconName and iconType
     * @param {*} iconName 
     * @param {*} iconType 
     */
    function getConfigIcon(iconName, iconType) {
        if (!iconName) {
            iconName = 'Swirl'; // defaulting to swirl if no icon name is present
        }
        return configurationData.iconMapping[iconName][iconType];
    }

    /**
     * Sets the configuration data object.
     * @param {*} resp 
     */
    function setData(resp) {
        configurationData = resp;
    }

    /**
     * Returns the configuration data object.
     */
    function getData() {
        return configurationData;
    }

    return {
        setData,
        getData,
        getConfigIcon,
        getUrls,
        getLoggerLimit
    };

}());