module Capybara
  module MutationObserver
    module DSL
      include Capybara::DSL

      def page
        Capybara::MutationObserver.debug("Page Invoked")
        wait_until_ready unless @ignoring_mutation
        Capybara.current_session
      end

      def wait_until_ready
        Capybara::MutationObserver.debug("wait_until_ready")
        Waiter.new(Capybara.current_session).wait_until_ready
      end

      def ignoring_mutation(value = true)
        ignoring_mutation_was = @ignoring_mutation
        if @ignoring_mutation = value
          Capybara::MutationObserver.debug("Ignoring Mutation")
        end
        yield if block_given?
      ensure
        @ignoring_mutation = ignoring_mutation_was if block_given?
      end
    end
  end
end

