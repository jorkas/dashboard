class DashboardController < ApplicationController
  def index
    Garb::Session.login(CONFIG['garb_login'], CONFIG['garb_password'])
    @profile = Garb::Profile.first('UA-67918-1')

    @visits = get_visits
    @signup_journalists = get_signup_journalists
    @signup_follows = get_signup_follows
    
  end
  
  private
    
    def get_visits
      last = Garb::Report.new(@profile, {:metrics => [:visits], :start_date => Time.now - 2.month - 1.day, :end_date => Time.now - 1.month - 1.day}).results.first.visits.to_i
      now = Garb::Report.new(@profile, {:metrics => [:visits], :start_date => Time.now - 1.month - 1.day, :end_date => Time.now - 1.day }).results.first.visits.to_i
      percent = (now.to_f/last.to_f)*100 - 100 
      {:now => now, :last => last, :percent => percent}
    end
    
    def get_signup_journalists
      now = Garb::Report.new(@profile, {:metrics => [:goal6Completions], :start_date => Time.now - 1.day, :end_date => Time.now - 1.day}).results.first.goal6_completions.to_i
      last = Garb::Report.new(@profile, {:metrics => [:goal6Completions], :start_date => Time.now - 8.day, :end_date => Time.now - 8.day}).results.first.goal6_completions.to_i
      percent = (now.to_f/last.to_f)*100 - 100 
      {:now => now, :last => last, :percent => percent}
    end
    
    def get_signup_follows  
      now = Garb::Report.new(@profile, {:metrics => [:goal7Completions], :start_date => Time.now - 1.day, :end_date => Time.now - 1.day}).results.first.goal7_completions.to_i
      last = Garb::Report.new(@profile, {:metrics => [:goal7Completions], :start_date => Time.now - 8.day, :end_date => Time.now - 8.day}).results.first.goal7_completions.to_i
      percent = (now.to_f/last.to_f)*100 - 100 
      {:now => now, :last => last, :percent => percent}
    end
end