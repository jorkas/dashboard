class Analytics
  
  def initialize
    @profile = Rails.cache.fetch("garb_profile", :expires_in => 1.hour) do
      Garb::Session.login(CONFIG['garb_login'], CONFIG['garb_password'])
      Garb::Profile.first('UA-67918-1')
    end
  end
  
  def total_visits
    now_end_date = Time.zone.now - 1.day
    last_end_date = get_end_date(now_end_date, 30)
    
    last = Rails.cache.fetch("garb_total_visits_last", :expires_in => 1.hour) do
      Garb::Report.new(@profile, {:metrics => [:visits], :start_date => last_end_date - 30.days, :end_date => last_end_date}).results.first.visits.to_i
    end
    now = Rails.cache.fetch("garb_total_visits_now", :expires_in => 1.hour) do
      Garb::Report.new(@profile, {:metrics => [:visits], :start_date => now_end_date - 30.days, :end_date => now_end_date }).results.first.visits.to_i
    end
    percent = (now.to_f/last.to_f)*100 - 100 
    {:now => now, :last => last, :percent => percent}
  end
  
  def signup_journalists
    last = Rails.cache.fetch("garb_signup_jouenalists_last", :expires_in => 1.hour) do
      Garb::Report.new(@profile, {:metrics => [:goal6Completions], :start_date => Time.zone.now - 8.day, :end_date => Time.zone.now - 8.day}).results.first.goal6_completions.to_i
    end
    now = Rails.cache.fetch("garb_signup_jouenalists_now", :expires_in => 1.hour) do
      Garb::Report.new(@profile, {:metrics => [:goal6Completions], :start_date => Time.zone.now - 1.day, :end_date => Time.zone.now - 1.day}).results.first.goal6_completions.to_i
    end
    percent = (now.to_f/last.to_f)*100 - 100 
    {:now => now, :last => last, :percent => percent}
  end
    
  def signup_follows
    last = Rails.cache.fetch("garb_signup_follows_last", :expires_in => 1.hour) do
      Garb::Report.new(@profile, {:metrics => [:goal7Completions], :start_date => Time.zone.now - 8.day, :end_date => Time.zone.now - 8.day}).results.first.goal7_completions.to_i
    end
    now = Rails.cache.fetch("garb_signup_follows_now", :expires_in => 1.hour) do
      Garb::Report.new(@profile, {:metrics => [:goal7Completions], :start_date => Time.zone.now - 1.day, :end_date => Time.zone.now - 1.day}).results.first.goal7_completions.to_i
    end
    percent = (now.to_f/last.to_f)*100 - 100 
    {:now => now, :last => last, :percent => percent}
  end
    
  def signup_trials
    last = Rails.cache.fetch("garb_signup_trials_last", :expires_in => 1.hour) do
      Garb::Report.new(@profile, {:metrics => [:goal1Completions], :start_date => Time.zone.now - 8.day, :end_date => Time.zone.now - 8.day}).results.first.goal1_completions.to_i
    end
    now = Rails.cache.fetch("garb_signup_trials_now", :expires_in => 1.hour) do
      Garb::Report.new(@profile, {:metrics => [:goal1Completions], :start_date => Time.zone.now - 1.day, :end_date => Time.zone.now - 1.day}).results.first.goal1_completions.to_i
    end
    percent = (now.to_f/last.to_f)*100 - 100 
    {:now => now, :last => last, :percent => percent}
  end
  
  def top_countries
    results = Rails.cache.fetch("garb_top_countries", :expires_in => 1.hour) do
      Garb::Report.new(@profile, {:sort => :visits.desc, :limit => 10, :dimensions => [:country], :metrics => [:visits], :start_date => Time.zone.now - 1.month - 1.day, :end_date => Time.zone.now - 1.day }).results
    end
    results
  end
  
  private
  
  def get_end_date(end_date, number_of_days)
    new_end_date = end_date - number_of_days.days
    until new_end_date.wday == end_date.wday do
      new_end_date -= 1.day
    end
    new_end_date
  end
  
end