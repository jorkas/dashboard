class WidgetsController < ApplicationController
  layout false
  
  def active_visits
    respond_to do |format|
      format.json { render :json => Chartbeat.active_visits }
    end
  end
  
  def analytics_goals
    respond_to do |format|
      format.json { render :json => Analytics.new.analytics_goals }
    end
  end

  def count_pressreleases
    respond_to do |format|
      format.json { render :json => MyNewsdesk.count_pressreleases }
    end
  end
  
  def message
    respond_to do |format|
      format.json { render :json => Twitter.get_message }
    end
  end
  
  def new_relic
    respond_to do |format|
      format.json { render :json => NewRelicApi.server_status }
    end
  end
  
  def recent_checkins
    respond_to do |format|
      format.json { render :json => Gowalla.recent_checkins }
    end   
  end
  
  def recent_pressreleases
    respond_to do |format|
      format.json { render :json => MyNewsdesk.recent_pressreleases }
    end
  end
  
  def recent_referrers
    respond_to do |format|
      format.json { render :json => Chartbeat.referrers }
    end
  end
  
  def total_visits
    respond_to do |format|
      format.json { render :json => Analytics.new.total_visits }
    end
  end
  
  def combined_user_stats
    content = {
      :mynewsdesk => MyNewsdesk.user_stats,
      :google => Analytics.new.analytics_goals
    }
    respond_to do |format|
      format.json { render :json => content }
    end
  end
  
  def user_stats
    respond_to do |format|
      format.json { render :json => MyNewsdesk.user_stats }
    end
  end
  
  def top_countries
    respond_to do |format|
      format.json { render :json => Chartbeat.top_countries }
    end
  end
end
