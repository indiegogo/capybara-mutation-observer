module Capybara
  module MutationObserver
    def self.debug(msg)
      if default_debug
        puts "MutationObserver::DEBUG::#{msg.inspect}"
      end
    end

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
      @default_cycle_length_ms || 750
    end

    def self.default_cycle_length_ms=(value)
      @default_cycle_length_ms = value
    end

    def self.default_element_selector
      @default_element_selector || "body"
    end

    def self.default_element_selector=(value)
      @default_element_selector = value.to_s
    end

    def self.default_debug=(value)
      #false => false anything else is true
      @default_debug = (false != value)
    end

    def self.default_debug
      @default_debug || false
    end

  end
end
