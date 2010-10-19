class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :date_in_timezone
  
  def date_in_timezone
    DateTime.now.in_time_zone.to_date
  end
end
