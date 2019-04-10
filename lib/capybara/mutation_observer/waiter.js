// This script is injected from waiter.rb.  It is responsible for setting
// window.capybaraAngularReady when either a) angular is ready, or b)
// it determines the page is not an angular page.

(function () {
  "use strict";

  window.mutationsCompleted = false;

  window.__MutationStable__ = function() {
    return window.mutationsCompleted;
  };

  window.checkForMutations = function() {
      window.mutationsCompleted = false;
      console.log("=> Installing: Checking for Mutations");
      window._last_checked_mutation_time = new Date().getTime();
      window._last_multation_time = new Date().getTime();
      window._mutation_observer = new MutationObserver(function(mutations) {
        console.log("mutation triggered", mutations);
        setTimeout(function(){
          window.mutationsCompleted = false
          window._last_multation_time = new Date().getTime();
          window._check_mutations = true; /* continue mutation loop */
        }, 0);
      });

      //install observer
      window._mutation_observer.observe(document, {
        attributeFilter: ["href"],
        attributes: true,
        childList: true,
        subtree: true
      });

      window._check_mutations = true; /* enable mutation loop */

      window._mutation_interval_timer = setInterval(function() {
        console.log("==> Mutation Check Interval Awake");
          window._last_checked_mutation_time = new Date().getTime();
          var delta = window._last_checked_mutation_time -  window._last_multation_time;
          if (delta > 700) {
            console.log("No Mutations Since "+delta+" - clearing mutation check");
            clearInterval(window._mutation_interval_timer);
            window.mutationsCompleted = true; // allow external code to evaluate as if dom is stable
          }
      }, 700); /* check to see if mutations are over */
  };

  function setup() {
      window.checkForMutations();
  }

  setup();
}());
