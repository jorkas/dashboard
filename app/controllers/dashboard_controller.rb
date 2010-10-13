class DashboardController < ApplicationController
  def index
    Garb::Session.login(CONFIG['garb_login'], CONFIG['garb_password'])
    @profile = Garb::Profile.first('UA-67918-1')
    
    analytics = Analytics.new
    
    @visits = analytics.visits
    
    @signup_journalists = analytics.signup_journalists
    @signup_follows = analytics.signup_follows
    @signup_trails = analytics.signup_trails
    
    @top_countries = analytics.top_countries
    @top_searches = analytics.top_searches
  end
    
end