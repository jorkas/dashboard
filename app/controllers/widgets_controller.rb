class WidgetsController < ApplicationController
  layout false
  before_filter :analytics
  
  def total_visits
    @total_visits = analytics.visits
  end
  
  def signup_journalists
    @signup_journalists = analytics.signup_journalists
  end
  
  def signup_follows
    @signup_follows = analytics.signup_follows
  end
  
  def signup_trails
    @signup_trails = analytics.signup_trails
  end
  
  def top_countries
    @top_countries = analytics.top_countries
  end
  
  def top_searches
    @top_searches = analytics.top_searches
  end
  
  private
  
  def analytics
    analytics = Analytics.new
  end
  
end
