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
    @top_countries = Chartbeat.countries[0...10]
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
  end
  
  def analytics_goals
    analytics
    @signup_trials = analytics.signup_trials
    @signup_follows = analytics.signup_follows
    @signup_journalists = analytics.signup_journalists
  end
  
  def new_relic
    expires_in = Rails.env.production? ? 1.minutes : 10.minutes
    @values = Rails.cache.fetch("new_relic", :expires_in => expires_in) do
      array = Array.new
      result = NewRelicApi::Account.find(:first).applications(:params => {:conditions => {:name => 'Newsdesk (production)'}}).first.threshold_values
      result.each do |r|
        array << {:name => r.name, :metric_value => r.metric_value, :color_value => r.color_value, :formatted_metric_value => r.formatted_metric_value }
      end
      array
    end
  end
  
  def active_visits
    @stats = Chartbeat.quickstats
    @history = Chartbeat.history
  end
  
  def recent_referrers
    @referrers = Chartbeat.referrers[0...10]
  end
  
  private
  
  def analytics
    analytics = Analytics.new
  end
  
end
