# frozen_string_literal: true

module Capybara
  module MutationObserver
    class Waiter
      WAITER_JS = IO.read(File.expand_path('waiter.js', __dir__))

      attr_accessor :page

      def initialize(page)
        @page = page
      end

      def wait_until_ready
        return unless driver_supports_js?

        start = Time.now

        until ready?
          inject_waiter
          timeout! if timeout?(start)
          sleep(0.01)
        end
        Capybara::MutationObserver.debug(
          "network Count : #{ page.evaluate_script("window.__networkCount__()")}"
        )
      end

      private

      def driver_supports_js?
        page.evaluate_script 'true'
      rescue Capybara::NotSupportedByDriverError
        false
      end

      def timeout?(start)
        Time.now - start > Capybara::MutationObserver.default_max_wait_time
      end

      def timeout!
        raise Timeout::Error, 'timeout while waiting for mutation observer'
      end

      def mutation_function_exists_js
        'window.__MutationStable__ !== undefined'
      end

      def inject_waiter
        return if page.evaluate_script(mutation_function_exists_js)
        page.execute_script WAITER_JS
        Capybara::MutationObserver.debug("Injecting Waiter ->")
        Capybara::MutationObserver.debug(setup_script)
        page.execute_script setup_script
      end

      def setup_script
        <<~SETUP_SCRIPT
          window.__MutationSetup__({
            cycle_length_ms: #{Capybara::MutationObserver.default_cycle_length_ms},
            max_cycles_till_stable: #{Capybara::MutationObserver.default_max_cycles_till_stable},
            element_selector: "#{Capybara::MutationObserver.default_element_selector}",
            debug: #{Capybara::MutationObserver.default_debug}
          });
        SETUP_SCRIPT
      end

      def mutation_stable_function_js
        'window.__MutationStable__ && window.__MutationStable__() === true'
      end

      def ready?
        page.evaluate_script(mutation_stable_function_js)
      end
    end
  end
end
