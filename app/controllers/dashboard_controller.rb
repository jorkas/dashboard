class DashboardController < ApplicationController
  def index
    
  end
  
  def pshb
    if !params["hub.challenge"].nil?
      logger.info params["hub.challenge"]
      @challenge = params["hub.challenge"]
      render :action => "pshb", :status => 200, :layout => false
    else
      @challenge = "uhoh!"
      render :action => "pshb", :status => 404, :layout => false
    end
  end
end