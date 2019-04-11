
(function () {
  "use strict";

  window.mutationsCompleted = false;
  window._execution_without_mutation = 0;

  window.__MutationStable__ = function() {
    return window.mutationsCompleted;
  };

  window.__CheckForMutations__ = function(options) {
    window._mutation_cycle_length_ms = options.cycle_length_ms || 500;
    window._mutation_max_cycles_till_stable = options.max_cycles_till_stable || 11;
    window.mutationsCompleted = false;
    console.log("=> Installing: Checking for Mutations");
    window._last_checked_mutation_time = new Date().getTime();
    window._last_multation_time = new Date().getTime();
    window._mutation_observer = new MutationObserver(function(mutations) {
      console.log("mutation triggered", mutations);
      setTimeout(function(){
        window.mutationsCompleted = false;
        window._last_multation_time = new Date().getTime();
        window._execution_without_mutation = 0;
      }, 0);
    });
 
    //install observer
    window._mutation_observer.observe(document, {
      attributes: true,
      childList: true,
      subtree: true
    });

    window._mutation_interval_timer = setInterval(function() {

      console.log("==> Mutation Check Interval Awake | Stable Execution Count[" + window._execution_without_mutation+"]");
      window._last_checked_mutation_time = new Date().getTime();
      var delta = window._last_checked_mutation_time -  window._last_multation_time;
      console.log("deltas ["+delta+"]");

      if (delta > window._mutation_cycle_length_ms) {
        window._execution_without_mutation += (delta / window._mutation_cycle_length_ms);
      }

      if (window._mutation_max_cycles_till_stable <= window._execution_without_mutation) {
        window.mutationsCompleted = true; // allow external code to evaluate as if dom is stable
        shutdownMutationCheck();
      }

    }, window._mutation_cycle_length_ms*2); /* check to see if mutations are over */
  };

  function shutdownMutationCheck() {
    console.log("Disconnect Mutation Observer");
    window._mutation_observer.disconnect();
    console.log("Clearing Mutation Evaluation Timer");
    clearInterval(window._mutation_interval_timer);
    window._mutation_observer = null;
    
  }

  window.__MutationSetup__ = function (options) {
    if (window._mutation_observer) {
    } else {
      window.__CheckForMutations__(options);
    }
  }
}());
