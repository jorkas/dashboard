class Chartbeat
  def self.quickstats
    require 'open-uri'
    doc = open "http://api.chartbeat.com/quickstats?host=mynewsdesk.com&apikey=#{CONFIG['chartbeat_key']}"
    json = JSON.parse doc.read.to_s
  end
end