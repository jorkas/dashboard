class GowallaUser < ActiveRecord::Base
  before_save :get_gowalla_id
  
  def image_url
    "http://s3.amazonaws.com/static.gowalla.com/users/#{gowalla_id}-standard.jpg"
  end
  
  private
  def get_gowalla_id
    require 'open-uri'
    self.gowalla_id = JSON.parse(open("http://api.gowalla.com/users/#{self.name}.json").read)['url'].split('/').last
  end
end
