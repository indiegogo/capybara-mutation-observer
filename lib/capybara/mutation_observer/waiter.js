
(function () {
  "use strict";


  var mutationConfig = {
    cycle_length_ms: 500, /* using underbar for external config from ruby etc) */
    max_cycles_till_stable: 5,
    element_selector: "body",
    debug: false,
  };
  /* note all javascript time in ms */
  window._mutationState_ = {
    mutationsCompleted: false,
    executionsWithoutMutation: 0,
    installedTime: null,
    lastMutationTime: null,
    lastCheckedMutationTime: null,
    mutationObserver: null,
    timer: null
  };

  window.__MutationStable__ = function() {
    return window._mutationState_.mutationsCompleted;
  };

  function updateConfig(newConfig) {
    for (var prop in newConfig) {
      if (mutationConfig.hasOwnProperty(prop)) {
        mutationConfig[prop] = newConfig[prop];
      }
    }
  };

  function isStable() {
    return mutationConfig.max_cycles_till_stable <= window._mutationState_.executionsWithoutMutation;
  };

  function elementSelector() {
    return mutationConfig.element_selector;
  };

  function element() {
    return document.querySelector(elementSelector());
  };

  function debug() {
    if (mutationConfig.debug) {
      console.log.apply(console,arguments);
    }
  }
  window.__CheckForMutations__ = function(options) {
    updateConfig(options);
    if(element()){
      window._mutationState_.mutationsCompleted = false;

      debug("=> Installing: Checking for Mutations");

      window._mutationState_.installedTime = new Date().getTime();
      window._mutationState_.lastCheckedMutationTime = new Date().getTime();
      window._mutationState_.lastMultationTime = new Date().getTime();

      window._mutationState_.mutationObserver = new MutationObserver(function(mutations) {
        debug("mutation triggered", mutations.length);
        /* schedule modification of shared data structure */
        setTimeout(function(){
          window._mutationState_.mutationsCompleted = false;
          window._mutationState_.lastMultationTime = new Date().getTime();
          debug("Reseting executionsWithoutMutation , was:", window._mutationState_.executionsWithoutMutation);
          window._mutationState_.executionsWithoutMutation = 0;
        },0);
      });
      
      //install observer
      window._mutationState_.mutationObserver.observe(element(), {
        attributeFilter: ['href'],
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true
      });

      window._mutationState_.timer = setInterval(function() {
        debug("==> Mutation Check => Interval Awake | Stable Execution Count[" + window._mutationState_.executionsWithoutMutation+"]");

        window._mutationState_.lastCheckedMutationTime = new Date().getTime();

        var delta = window._mutationState_.lastCheckedMutationTime -  window._mutationState_.lastMultationTime;
        debug("deltas ["+delta+"]");

        if (delta > mutationConfig.cycle_length_ms) {
          window._mutationState_.executionsWithoutMutation += Math.floor((delta / mutationConfig.cycle_length_ms));
        }

        if (isStable()) {
          debug("==> Mutation Check => Stable | Stable Execution Count[" + window._mutationState_.executionsWithoutMutation+"]");
          window._mutationState_.mutationsCompleted = true; // allow external code to evaluate as if dom is stable
          resetMutationCheck();
        }

      }, mutationConfig.cycle_length_ms);
      /* clean up after 'before unload' */
      window.addEventListener("beforeunload", function() {
        debug("Disconnect Mutation Observer");
        window._mutationState_.mutationObserver.disconnect();
        window._mutationState_.mutationObserver = null;

        debug("Clearing Mutation Evaluation Timer");
        clearInterval(window._mutationState_.timer);
      })
    } else {
      debug("MutationObserver:: Element ("+ elementSelector()+") to watch not found.");
      debug("Skipping Mutation Observer Instalation");
      window._mutationState_.mutationsCompleted = true;
    }

  };

  function resetMutationCheck() {
    /* time to shutdown */
    /* schedule shutdown in next timeout */
    setTimeout(function() {

      window._mutationState_.lastResetTime = (new Date().getTime());
      window._mutationState_.totalTime = (
        window._mutationState_.lastResetTime -
          window._mutationState_.installedTime 
      );

      debug("Mutation installedTime ["+ window._mutationState_.installedTime +"]");
      debug("Mutation lastResetTime ["+ window._mutationState_.lastResetTime +"]");
      debug("Mutation totalTime ["+ window._mutationState_.totalTime +"]");
      
      window._mutationState_.totalCycles = Math.floor(
        window._mutationState_.totalTime / mutationConfig.cycle_length_ms
      );
      debug("Mutation Cycles Executed: ["+window._mutationState_.totalCycles+"]");
    })
  }

  window.__MutationSetup__ = function (options) {
    if (window._mutationState_.mutationObserver) {
      debug("MutationSetup invoked while observer running");
    } else {
      window.__CheckForMutations__(options);
    }
  };

}());
