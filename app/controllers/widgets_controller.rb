class WidgetsController < ApplicationController
  layout false
  
  def active_visits
    content = {
      :stats => Chartbeat.quickstats,
      :history => Chartbeat.history  
    }
    respond_to do |format|
      format.json { render :json => content }
    end
  end
  
  def analytics_goals
    analytics
    content = {
      :signup_trials => analytics.signup_trials,
      :signup_follows => analytics.signup_follows,
      :signup_journalists => analytics.signup_journalists      
    }
    respond_to do |format|
      format.json { render :json => content }
    end
  end

  def count_pressreleases
    content = {
      :today => Mynewsdesk.pressreleases_today,
      :yesterday => Mynewsdesk.pressreleases_yesterday,
      :last_week => Mynewsdesk.pressreleases_last_week
    }
    respond_to do |format|
      format.json { render :json => content }
    end
  end
  
  def message
    content = Twitter.get_message
    respond_to do |format|
      format.json { render :json => content }
    end
  end
  
  def new_relic
    expires_in = Rails.env.production? ? 1.minutes : 10.minutes
    content = Rails.cache.fetch("new_relic", :expires_in => expires_in) do
      array = Array.new
      result = NewRelicApi::Account.find(:first).applications(:params => {:conditions => {:name => 'Newsdesk (production)'}}).first.threshold_values
      result.each do |r|
        array << {:name => r.name, :metric_value => r.metric_value, :color_value => r.color_value, :formatted_metric_value => r.formatted_metric_value }
      end
      array
    end
    respond_to do |format|
      format.json { render :json => content }
    end
  end
  
  def recent_checkins
    content = Gowalla.recent_checkins
    respond_to do |format|
      format.json { render :json => content }
    end   
  end
  
  def recent_pressreleases
    content = Mynewsdesk.recent_pressreleases
    respond_to do |format|
      format.json { render :json => content }
    end
  end
  
  def recent_referrers
    content = Chartbeat.referrers[0...10]
    respond_to do |format|
      format.json { render :json => content }
    end
  end
  
  def total_visits
    analytics
    content = analytics.total_visits
    respond_to do |format|
      format.json { render :json => content }
    end
  end
  
  def user_stats
    content = {
      :followers => Mynewsdesk.followers,
      :journalists => Mynewsdesk.journalists,
      :customers => Mynewsdesk.customers      
    }
    respond_to do |format|
      format.json { render :json => content }
    end
  end
  
  def top_countries
    content = Chartbeat.countries[0...10].to_json
    respond_to do |format|
      format.json { render :json => content }
    end
  end
  
  private
  
  def analytics
    analytics = Analytics.new
  end
  
end
