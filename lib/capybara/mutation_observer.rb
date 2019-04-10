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

    def self.default_max_cycles_till_stable
      @default_max_cycles_till_stable || 2
    end

    def self.default_max_cycles_till_stable=(value)
      @default_max_cycles_till_stable = value
    end

    def self.default_cycle_length_ms
      @default_cycle_length_ms ||750
    end

    def self.default_cycle_length_ms=(value)
      @default_cycle_length_ms = value
    end
  end
end
