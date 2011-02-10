class DashboardController < ApplicationController
  def index
  end
  
  def slim
    render :layout => "slim"
  end
  
  def visitors
  end
  
  def version
    @version = ENV['COMMIT_HASH'] || `git rev-parse HEAD`
    @version.strip!
    render :layout => false
  end
end