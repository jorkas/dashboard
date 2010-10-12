class DashboardController < ApplicationController
  def index
    Garb::Session.login(CONFIG['garb_login'], CONFIG['garb_password'])
    profile = Garb::Profile.first('UA-67918-1')
    
    last = Garb::Report.new(profile, {:metrics => [:visits], :start_date => Time.now - 2.month, :end_date => Time.now - 1.month}).results.first.visits.to_i
    now = Garb::Report.new(profile, {:metrics => [:visits], :start_date => Time.now - 1.month, :end_date => Time.now }).results.first.visits.to_i
    percent = (now.to_f/last.to_f)*100
    @visits = {:now => now, :last => last, :percent => percent}
  end

end
