# Capybara::MutationObserver

Capybara API that knows how to wait for MutationObserver in end to end specs.

## Installation

Add this line to your application's Gemfile:

    gem 'capybara-mutation-observer'

## Usage

Use it as you would use regular Capybara API, however this time, you won't face any race conditions when working with DOM Mutation JS applications.

```ruby
RSpec.configure do |config|
  config.include Capybara::MutationObserver::DSL, type: feature
end
```

## Tuning

```
   	# wait # of unninterupted cycles after javascript stops mutation to consider stable
   	Capybara::MutationObserver.default_max_cycles_till_stable = 3

   	# length of time of a cyle in ms
   	Capybara::MutationObserver.default_cycle_length_ms = 250
   
   	# consider any mutation to body element as a reset on the mutation timing window
   	Capybara::MutationObserver.default_element_selector = "body" # CSS Selector ie: "[ng-app] or elsewise"

   	# spit out extra logging to JS console
   	Capybara::MutationObserver.default_debug = true
```


If you need to run some code without caring about Angular or mutating JS, you can use `ignoring_mutation` like this:
```ruby
ignoring_mutation do
  # Your Mutation agnostic code goes here
end
```

## Limitations

At the moment it works with AngularJS applications initialized with `ng-app`. Other frameworks that modify the dom should work aswell however are untested.

Testing with other frameworks like Vue is expected to occur

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
# capybara-mutation-observer
# capybara-mutation-observer
# capybara-mutation-observer
