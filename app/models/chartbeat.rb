class Chartbeat
  def self.quickstats
    json = Rails.cache.fetch("chartbeat_quickstats", :expires_in => 5.seconds) do
      require 'open-uri'
      doc = open "http://api.chartbeat.com/quickstats?host=mynewsdesk.com&apikey=#{CONFIG['chartbeat_key']}"
      JSON.parse doc.read.to_s
    end
  end
  
  def self.history
    json = Rails.cache.fetch("chartbeat_history", :expires_in => 1.hour) do
      require 'open-uri'
      doc = open "http://chartbeat.com/dashapi/stats/?host=mynewsdesk.com&apikey=#{CONFIG['chartbeat_key']}"
      JSON.parse doc.read.to_s
    end
  end
end