// This script is injected from waiter.rb.  It is responsible for setting
// window.capybaraAngularReady when either a) angular is ready, or b)
// it determines the page is not an angular page.

(function () {
  "use strict";

  window.capybaraAngularReady = false;
  window.mutationsCompleted = false;

  function ready() {
    console.log("=====> Capybara-Angular::ready:");
    window.capybaraAngularReady = (true && window.mutationsCompleted);
  }

  function angularPresent() {
    return window.angular !== undefined;
  }

  function element() {
    return document.querySelector("[ng-app], [data-ng-app]") || document.querySelector("body");
  }

  function elementPresent() {
    return element() !== undefined;
  }
  /* not for angular 1 */
  function setupTestability() {
    try {
      angular.getTestability(element()).whenStable(ready);
    } catch (err) {
      console.log("=====> Capybara-Angular::getTestability Error: "+ err);
      ready();
    }
  }

  function setupInjector() {
    try {
      angular.element(element()).injector().get("$browser").notifyWhenNoOutstandingRequests(ready);
    } catch (err) {
      console.log("=====> Capybara-Angular::setupInjector Error: "+ err);
      ready();
    }
  }

  window.stableEnough = function() {
    return window.capybaraAngularReady;
  };

  window.checkForMutations = function() {
    // restart from scratch
    window.capybaraAngularReady = false;
    window.mutationsCompleted = false;
    //
    if(elementPresent() && angularPresent()) {
      console.log("=> Installing: Checking for Mutations");
      window._last_checked_mutation_time = new Date().getTime();
      window._last_multation_time = new Date().getTime();
      window._angular_mutation_observer = new MutationObserver(function(mutations) {
        console.log("mutation triggered", mutations);
        setTimeout(function(){
          window._last_multation_time = new Date().getTime();
          window._check_mutations = true; /* continue mutation loop */
        }, 0);
      });

      //install observer
      window._angular_mutation_observer.observe(document, {
        attributeFilter: ["href"],
        attributes: true,
        childList: true,
        subtree: true
      });

      window._check_mutations = true; /* enable mutation loop */

      window._mutation_interval_timer = setInterval(function() {
        console.log("==> Mutation Check Interval Awake");
        if (window._check_mutations) {
          window._last_checked_mutation_time = new Date().getTime();
          var delta = window._last_checked_mutation_time -  window._last_multation_time;
          if (delta > 700) {
            console.log("No Mutations Since "+delta+" - clearing mutation check next free interval");
            window._check_mutations = false;
          }
        } else {
          clearInterval(window._mutation_interval_timer);
          window.mutationsCompleted = true; // allow external code to evaluate as if dom is stable
          setupInjector(); // fallback to standard angular check
        }
      }, 700); /* check to see if mutations are over */


    } else {
      setTimeout(function(){
        console.log("=> No element or Angular => Assuming no mutations");
        window.mutationsCompleted = true; // allow external code to evaluate as if dom is stable
        ready();
      },0)
    }
  };

  function setup() {
    if (!angularPresent() || !elementPresent()) {
      window.mutationsCompleted = true;
      ready();
    } else {
      window.checkForMutations();
    }
  }

  setup();
}());
