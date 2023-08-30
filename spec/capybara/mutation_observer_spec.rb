require 'rack'
require 'capybara'
require 'capybara/rspec'
require 'capybara/cuprite'
require 'capybara-mutation-observer'

Capybara.default_driver = :cuprite
Capybara.app = Rack::Directory.new('spec/public')
Capybara.default_max_wait_time = 2
Capybara::MutationObserver.default_max_wait_time = 10
Capybara::MutationObserver.default_debug = true
Capybara::MutationObserver.default_max_cycles_till_stable = 3
Capybara::MutationObserver.default_cycle_length_ms = 500
Capybara::MutationObserver.default_element_selector = "[ng-controller]"

feature 'Waiting for mutation' do
  include Capybara::MutationObserver::DSL

  scenario 'when manually bootstrapping an mutation application' do
    open_manual_bootstrap_page
    timeout_page_should_have_waited
  end

  scenario 'when using ng-app to bootstrap an application' do
    open_ng_app_bootstrap_page

    # app.js is setup with 4 total timeouts of characterData changes
    # one at 750ms, one at 1500ms, one at 2500ms, one at 5000ms

    # that should be a runtime floor of around > 4500ms
    # that should be 3 rounds of total mutations

    # after the mutation observer stops
    # the capybara wait time begins. (2000 ms)
    timeout_page_should_have_waited


    # last timer is a 2500ms , next timer at 5400 ms
    # this should give 3 full cycles of non mutation
    #
    # floor(5400-2500) / 750ms == 3
    
    expect(page.evaluate_script("window._mutationState_.executionsWithoutMutation")).to eq(3)
  end

  scenario 'when using ng-app not on the body tag to bootstrap an application' do
    open_ng_app_not_on_body_bootstrap_page
    timeout_page_should_have_waited
    # same reason as above - different initalization mechanism
    expect(page.evaluate_script("window._mutationState_.executionsWithoutMutation")).to eq(3)
  end

  # this test is for an ongoing mutation observer that
  # periodically resets
  #
  scenario 'with continuous mutations at various points' do
    ignoring_mutation do
      visit '/continuous.html'
    end
    expect(page).to have_content('waited') # first cycle
    expect(page).to have_content('last-change') # last cycle
  end

  #
  # below three scenarios should not invoke the mutation observer ass
  # they are missing the matching elementSelector
  #
  scenario 'when visiting a non-mutation page' do
    open_non_mutation_page
    non_mutation_page_should_load
  end

  scenario 'when visiting a non-mutation page that loads angular javascript' do
    open_non_mutation_page_with_angular_javascript
    non_mutation_page_should_load
  end

  scenario 'when visiting a non-mutation page that loads angular javascript' do
    open_non_mutation_page_with_angular_javascript
    non_mutation_page_should_load
  end


  def open_manual_bootstrap_page
    ignoring_mutation do
      visit '/manual.html'
    end
  end

  def open_ng_app_bootstrap_page
    ignoring_mutation do
      visit '/ng-app.html'
    end
  end

  def open_ng_app_not_on_body_bootstrap_page
    ignoring_mutation do
      visit '/ng-app-not-on-body.html'
    end
  end

  def open_non_mutation_page
    ignoring_mutation do
      visit '/non-mutation-page.html'
    end
  end

  def open_non_mutation_page_with_angular_javascript
    ignoring_mutation do
      visit '/non-mutation-page-with-angular-javascript.html'
    end
  end

  def timeout_page_should_have_waited
    expect(page).to have_content('waited')
  end

  def non_mutation_page_should_load
    expect(page).to have_content('non-mutation page')
  end
end
