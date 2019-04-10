require "capybara"
require "capybara/dsl"

require_relative "mutation_observer/dsl"
require_relative "mutation_observer/waiter"

module Capybara
  module MutationObserver
    def self.default_max_wait_time
      @default_max_wait_time || Capybara.default_max_wait_time
    end

    def self.default_max_wait_time=(timeout)
      @default_max_wait_time = timeout
    end
  end
end
