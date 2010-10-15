class DashboardController < ApplicationController
  def index
    
  end
  
  def pshb
    if !params["hub.challenge"].nil?
      logger.info "%%%%%%%%%%%%%%%"
      logger.info params.inspect
      logger.info "%%%%%%%%%%%%%%%"
      @challenge = params["hub.challenge"]
      render :action => "pshb", :status => 200, :layout => false
    else
            logger.info "%%%%%%%%%%%%%%%"
      logger.info params.inspect
            logger.info "%%%%%%%%%%%%%%%"
      @challenge = "uhoh!"
      render :action => "pshb", :status => 404, :layout => false
    end
  end
end