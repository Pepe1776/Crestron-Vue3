// Copyright (C) 2020 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/* jslint es6 */

const avfUtility = (function () {
    'use strict';

    /**
     * Convert input to boolean.
     * @param {boolean | string} v 
     */
    function toBool(v) {
        return (v === true || String(v).toLowerCase() === "true");
    }

    /**
     * 
     * @param {*} input 
     */
    function convertNullToEmptyString(input) {
        if (isValidInput(input)) {
            return input;
        } else {
            return "";
        }
    }

    /**
     * Wrapper over console.log to allow controlling this based on config.
     * @param  {...any} input 
     */
    function log(...input) {
        console.log(...input);
    }

    /**
     * Check if the input is not undefined or not null or not empty.
     * @param {*} input 
     */
    function isValidInput(input) {
        return !(typeof input === 'undefined' || input === null || input.trim() == "");
    }

    /**
     * 
     * @param {*} str 
     * @param {*} find 
     * @param {*} replace 
     */
    function replaceAll(str, find, replace) {
        if (str && String(str).trim() !== "") {
            return String(str).split(find).join(replace);
        } else {
            return str;
        }
    }

    /**
     * Converts AM/PM time format to milliseconds.
     * @param {string} time12h
     */
    function convertTime12tomilliSeconds(time12h) {
        let [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') {
            hours = '00';
        }
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
        return (hours * 60 * 60 * 1000) + parseInt(minutes) * 60 * 1000;
    }

    /**
     * Convert millisconds diffrence to hour minutes and seconds
     * @param {string} fromTime
     * @param {string} toTime
     */
    function timeDiffInHHMM(fromTime, toTime) {
        const timeInHHMM = {};
        const timediff = fromTime - toTime;
        timeInHHMM.hour = parseInt(timediff / (3600 * 1000)); // hours
        timeInHHMM.minutes = parseInt(timediff / (60 * 1000)); // minutes
        timeInHHMM.seconds = parseInt(timediff / 1000); // seconds
        return timeInHHMM;
    }

    /**
     * Add the leading zeros to a number.
     * @param {number} num
     * @param {number} places
     */
    function zeroPad(num, places) {
        let zero = places - num.toString().length + 1;
        let numberWithZeroPad = Array(+(zero > 0 && zero)).join("0") + num;
        return numberWithZeroPad;
    }

    /**
     * Function to check if a given string is a valid URL with valid port numbers
     */
    function isValidURL(inputStr = '') {
        const input = inputStr.toLowerCase();
        let isValidURLEntry = false;
        if (isValidInput(input)) {
            const colonCount = (input.match(/:/g) === null) ? 0 : input.match(/:/g).length; // storing colon count if its valid
            let ipExp = /^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/;
            let hostExp = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/;
            let httpCheck = (input.indexOf('http://') > -1 || input.indexOf('https://') > -1);
            let checkPortNo = ((colonCount === 0 && !httpCheck) || (colonCount === 1 && httpCheck));
            let dataArr = input.split(':');
            let valueToTestEntry = (httpCheck) ? dataArr[1] : dataArr[0];
            valueToTestEntry = valueToTestEntry.replace(/\//g, '');
            // if a valid count of colon is found, check for valid port number
            if (colonCount == 1 || colonCount == 2) {
                if ((httpCheck && colonCount == 2) ||
                    (!httpCheck && colonCount == 1)) {
                    let portNo = parseInt(dataArr[dataArr.length - 1]);
                    // check if port number is a valid number and lies between 1025 and 65335
                    checkPortNo = (!isNaN(portNo) && portNo > 1024 && portNo < 65536);
                }
            }
            isValidURLEntry = (
                checkPortNo &&
                valueToTestEntry !== null &&
                valueToTestEntry !== undefined &&
                valueToTestEntry !== "0.0.0.0" &&
                valueToTestEntry !== "255.255.255.255" &&
                valueToTestEntry.length <= 127 &&
                (ipExp.test(valueToTestEntry) || hostExp.test(valueToTestEntry))
            )
        }
        return isValidURLEntry;
    }

    return {
        toBool,
        convertTime12tomilliSeconds,
        timeDiffInHHMM,
        zeroPad,
        log,
        replaceAll,
        isValidInput,
        convertNullToEmptyString,
        isValidURL
    };

}());