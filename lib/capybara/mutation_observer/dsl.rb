module Capybara
  module MutationObserver
    module DSL
      include Capybara::DSL
      Capybara::Session::DSL_METHODS.each do |method|
        Capybara::MutationObserver.debug("Redefining #{method}")
        define_method(method) do |*args, &block|
          page.send(method, *args, &block)
        end
      end

      def page
        Capybara::MutationObserver.debug("Page Invoked")
        wait_until_ready unless @ignoring_mutation
        Capybara.current_session
      end

      def wait_until_ready
        Capybara::MutationObserver.debug("wait_until_ready")
        Waiter.new(Capybara.current_session).wait_until_ready
      end

      def ignoring_mutation
        @ignoring_mutation = true
        Capybara::MutationObserver.debug("Ignoring Mutation")
        yield
      ensure
        @ignoring_mutation = false
      end
    end
  end
end

