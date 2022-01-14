/*jslint es6 */
/*global document, window, XMLHttpRequest, CrComLib, event, translateModule, setTimeout, requestAnimationFrame, serviceModule */
var appModule = (function () {
  "use strict";
  /**
   * All public and local(prefix '_') properties
   */
  var triggerview = document.querySelector(".triggerview");
  var navbarThumb = document.querySelector(".swiper-thumb");
  var activeIndex = 0;
  var themeNav = document.getElementById("changeTheme");
  var appName = null;
  var appVersion = null;
  var errorClass = "version-error";
  var previousActiveIndex = -1;
  var themeTimer;
  const NAV_PAGE_COUNT = 5; // Number of buttons in the navigation menu

  /**
   * This is public method to change the theme
   * @param {string} theme pass theme type like 'LIGHT', 'DARK'
   */
  function changeTheme(theme) {
    // add active class
    //let current = themeNav.getElementsByClassName('active');
    //if (current.length > 0) {
    //    current[0].className = current[0].className.replace(' active', '');
    //}
    //self.className += ' active';
  }
  const targetDiv = document.getElementById("third");
  const btn = document.getElementById("toggle");
  btn.onclick = function () {
    if (targetDiv.style.display !== "none") {
      targetDiv.style.display = "none";
    } else {
      targetDiv.style.display = "block";
    }
  };
  const targetDiv2 = document.getElementById("fourth");
  const btn2 = document.getElementById("toggle2");
  btn2.onclick = function () {
    if (targetDiv2.style.display !== "none") {
      targetDiv2.style.display = "none";
    } else {
      targetDiv2.style.display = "block";
    }
  };

  const targetDiv3 = document.getElementById("fifth");
  const btn3 = document.getElementById("toggle3");
  btn3.onclick = function () {
    if (targetDiv3.style.display !== "none") {
      targetDiv3.style.display = "none";
    } else {
      targetDiv3.style.display = "block";
    }
  };
  const targetDiva = document.getElementById("thirda");
  const btna = document.getElementById("togglea");
  btna.onclick = function () {
    if (targetDiva.style.display !== "none") {
      targetDiva.style.display = "none";
    } else {
      targetDiva.style.display = "block";
    }
  };
  const targetDiv2a = document.getElementById("fourtha");
  const btn2a = document.getElementById("toggle2a");
  btn2a.onclick = function () {
    if (targetDiv2a.style.display !== "none") {
      targetDiv2a.style.display = "none";
    } else {
      targetDiv2a.style.display = "block";
    }
  };

  const targetDiv3a = document.getElementById("fiftha");
  const btn3a = document.getElementById("toggle3a");
  btn3a.onclick = function () {
    if (targetDiv3a.style.display !== "none") {
      targetDiv3a.style.display = "none";
    } else {
      targetDiv3a.style.display = "block";
    }
  };

  /**
   * Fetch app version info from menifest file.
   */
  function getAppVersionInfo() {
    serviceModule.loadJSON(
      "./assets/data/app.manifest.json",
      function (response) {
        response = JSON.parse(response);
        appName = response.appName;
        appVersion = response.appVersion;
        let _appVersionEl = document.getElementById("appVersion");
        if (!!appName && !!appVersion) {
          let _successMessage = `${appName} version ${appVersion}`;
          if (!!_appVersionEl) {
            _appVersionEl.classList.remove(errorClass);
            _appVersionEl.innerHTML = _successMessage;
          }
        } else {
          if (!!_appVersionEl) {
            _appVersionEl.classList.add(errorClass);
            _appVersionEl.innerHTML = `Error: While fetching sample project version.`;
          }
        }
      }
    );
  }

  /**
   * Display Crestron Component Library version information using
   * ch5-modal-dialog.
   */
  function versionInformation() {
    let _crComLibVersion = CrComLib.version;
    let _crComBuildDate = CrComLib.buildDate;
    let _versionEl = document.getElementById("versionDescription");
    if (!!_crComLibVersion && !!_crComBuildDate) {
      let _successMessage = `Crestron Component Library version ${_crComLibVersion} build date ${_crComBuildDate}`;
      if (!!_versionEl) {
        _versionEl.classList.remove(errorClass);
        _versionEl.innerHTML = _successMessage;
      }
    } else {
      if (!!_versionEl) {
        _versionEl.classList.add(errorClass);
        _versionEl.innerHTML = `Error: While fetching crestron component library version.`;
      }
    }
  }

  /**
   * This is public method for bottom navigation to set active state
   * @param {number} idx is current index for active state
   */
  function navActiveState(idx) {
    // If the previous and current index are same then return
    if (previousActiveIndex === idx) return;

    CrComLib.publishEvent(
      "b",
      "active_state_class_" + String(previousActiveIndex),
      false
    );
    if (activeIndex === idx) {
      previousActiveIndex = idx;
      CrComLib.publishEvent("b", "active_state_class_" + String(idx), true);
    }
  }

  /**
   * This is public method for triggerview
   * @param {number} navItemSize is number of bottom navigation list
   */
  function triggerviewOnInit(navItemSize) {
    navItemSize = NAV_PAGE_COUNT;
    // storing active class index
    let storedActiveCls = document.querySelectorAll(
      ".swiper-thumb .ch5-button"
    );
    storedActiveCls.forEach(function (cls, navIdx) {
      if (cls.classList.contains("ch5-button--selected")) {
        navActiveState(navIdx);
      }
    });

    // on Init after language load
    if (navItemSize !== storedActiveCls.length) {
      CrComLib.publishEvent("n", "nav.items.size", navItemSize);
      navActiveState(activeIndex);
    }
  }

  /**
   * This is public method to show language dropdown in smaller screen
   * @param {object} self is current element
   */
  function openLngMenu(self) {
    self.className += " open";
    event.stopPropagation();
  }

  /**
   * This method will call till element is load
   */
  function rafAsync() {
    return new Promise(function (resolve) {
      requestAnimationFrame(resolve);
    });
  }

  /**
   * This method will return true if element loads
   * @param {string} selector is string of element, like class, id, tag name etc...
   */
  function checkElement(selector) {
    if (document.querySelector(selector) === null) {
      return rafAsync().then(() => checkElement(selector));
    } else {
      return Promise.resolve(true);
    }
  }

  /**
   * This is private method for add the class on targeted class element
   * @param {array} gatherElementsClass is array of class which you have to target.
   * @param {string} appendClass is class name which you have to add.
   */
  function addClassOnClick(gatherElementsClass, appendClass) {
    let elements = document.querySelectorAll(gatherElementsClass);
    if (elements) {
      elements.forEach(function (element) {
        element.addEventListener("click", function (e) {
          e.currentTarget.classList.add(appendClass);
          let myButton = e.currentTarget;
          setTimeout(function () {
            myButton.classList.remove(appendClass);
          }, 1500);
        });
      });
    }
  }

  /**
   * Load the emulator JSON file
   */
  function loadEmulator() {
    // Button Emulator
    serviceModule.loadJSON(
      "./assets/data/button-emulator.json",
      function (response) {
        serviceModule.initEmulator(JSON.parse(response));
      }
    );
  }

  /**
   * This is public method to toggle left navigation sidebar
   */
  function toggleSidebar() {
    //themeNav.firstElementChild.classList.toggle('active');
    //navbarThumb.classList.toggle('open');
  }
  //
  /**
   * This method will invoke on body click
   */
  document.body.addEventListener("click", function (event) {
    //translateModule.currentLng.classList.remove('open');

    if (event.target.id === "sidebarToggle") {
      event.stopPropagation();
    } else {
      //navbarThumb.classList.remove('open');
      //themeNav.firstElementChild.classList.remove('active');
    }
  });

  /**
   * Load the emulator, theme, default language and listeners
   */
  function onLoadInit() {
    loadEmulator();
    changeTheme("LIGHT");
    //translateModule.getLanguage(translateModule.defaultLng);
    getAppVersionInfo();
    versionInformation();
    setTimeout(function () {
      for (let idx = 0; idx < NAV_PAGE_COUNT; idx++) {
        //addNavItemClickListener(idx);
      }
    }, 1000);
  }

  document.addEventListener("DOMContentLoaded", onLoadInit);

  /**
   * All public method and properties exporting here
   */
  return {
    toggleSidebar: toggleSidebar,
    changeTheme: changeTheme,
    triggerviewOnInit: triggerviewOnInit,
    openLngMenu: openLngMenu,
    checkElement: checkElement,
    addClassOnClick: addClassOnClick,
  };
})();

/**
 * Loader method is for spinner
 */
function loader() {
  "use strict";
  /*
    let spinner = document.getElementById('loader');
    setTimeout(function () {
        spinner.style.display = 'none';
    }, 1000);*/
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", loader, false);
