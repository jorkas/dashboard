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
    content = NewRelicApi.server_status
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
  
  def combined_user_stats
    content = {
      :mynewsdesk => {
        :followers => Mynewsdesk.followers,
        :journalists => Mynewsdesk.journalists,
        :customers => Mynewsdesk.customers      
      },
      :google => {
        :signup_trials => analytics.signup_trials,
        :signup_follows => analytics.signup_follows,
        :signup_journalists => analytics.signup_journalists      
      }
    }
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
    content = {
      :countries => Chartbeat.countries[0...10],
      :total => Chartbeat.quickstats["visits"]
    }
    respond_to do |format|
      format.json { render :json => content }
    end
  end
  
  private
  
  def analytics
    analytics = Analytics.new
  end
  
end
