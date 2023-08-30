# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'capybara/mutation_observer/version'

#
# This gem is a fork of capybara-angular
#
Gem::Specification.new do |spec|
  spec.name          = "capybara-mutation-observer"
  spec.version       = Capybara::MutationObserver::VERSION
  spec.authors       = ["Pawel Pierzchala","Curtis Schofield"]
  spec.email         = ["pawelpierzchala@gmail.com", "curtis@ram9.cc"]
  spec.description   = %q{Capybara API that knows how to wait for dom mutations to relax in end to end specs}
  spec.summary       = %q{Stable Capybara API for DOM JS applications}
  spec.homepage      = ""
  spec.license       = "MIT"

  spec.files         = `git ls-files`.split($/)
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_dependency 'capybara', '>= 2.5.0'

  spec.add_development_dependency "bundler"
  spec.add_development_dependency "rake"
  spec.add_development_dependency "rackup"
  spec.add_development_dependency "rspec"
  spec.add_development_dependency "cuprite"
  spec.add_development_dependency "puma"
end
