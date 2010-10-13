class DashboardController < ApplicationController
  def index
    Garb::Session.login(CONFIG['garb_login'], CONFIG['garb_password'])
    @profile = Garb::Profile.first('UA-67918-1')

    @visits = get_visits
    @signups_journalists = get_signup_journalists
    
  end
  
  private
    
    def get_visits
      last = Garb::Report.new(@profile, {:metrics => [:visits], :start_date => Time.now - 2.month, :end_date => Time.now - 1.month}).results.first.visits.to_i
      now = Garb::Report.new(@profile, {:metrics => [:visits], :start_date => Time.now - 1.month, :end_date => Time.now }).results.first.visits.to_i
      percent = (now.to_f/last.to_f)*100 - 100 
      {:now => now, :last => last, :percent => percent}
    end
    
    def get_signup_journalists
      Garb::Report.new(@profile, {:metrics => [:goal6Completions], :start_date => Time.now - 1.day, :end_date => Time.now - 1.day}).results.first.goal6_completions.to_i
    end
end