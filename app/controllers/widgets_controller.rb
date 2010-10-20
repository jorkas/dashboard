class WidgetsController < ApplicationController
  layout false
  
  def total_visits
    analytics
    @total_visits = analytics.total_visits
  end
  
  def signup_journalists
    analytics
    @signup_journalists = analytics.signup_journalists
  end
  
  def signup_follows
    analytics
    @signup_follows = analytics.signup_follows
  end
  
  def signup_trials
    analytics
    @signup_trials = analytics.signup_trials
  end
  
  def top_countries
    analytics
    @top_countries = analytics.top_countries
    @total_visits = analytics.total_visits
  end
  
  def top_searches
    analytics
    @top_searches = analytics.top_searches
  end
  
  def recent_checkins
    @recent_checkins = Gowalla.recent_checkins
  end
  
  def recent_pressreleases
    @recent_pressreleases = Mynewsdesk.recent_pressreleases
  end
  
  def count_pressreleases
    @today = Mynewsdesk.count_today
    @yesterday = Mynewsdesk.count_yesterday
    @last_week = Mynewsdesk.count_last_week
    @angle = 180 * (@today.to_f/@last_week.to_f)
  end
  
  private
  
  def analytics
    analytics = Analytics.new
  end
  
end
