require 'rack'
require 'capybara'
require 'capybara/rspec'
require 'capybara/poltergeist'
require 'capybara/mutation_observer'

Capybara.default_driver = :poltergeist
Capybara.app = Rack::Directory.new('spec/public')
Capybara.default_max_wait_time = 2
Capybara::MutationObserver.default_max_wait_time = 10

feature 'Waiting for mutation' do
  include Capybara::MutationObserver::DSL

  scenario 'when manually bootstrapping an mutation application' do
    open_manual_bootstrap_page
    timeout_page_should_have_waited
  end

  scenario 'when using ng-app to bootstrap an application' do
    open_ng_app_bootstrap_page
    timeout_page_should_have_waited
  end

  scenario 'when using ng-app not on the body tag to bootstrap an application' do
    open_ng_app_not_on_body_bootstrap_page
    timeout_page_should_have_waited
  end

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
