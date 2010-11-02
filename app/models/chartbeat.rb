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
  
  def self.countries
    visitors = recent_visitors
    countries = Hash.new
    visitors.each do |visitor|
      countries[COUNTRIES[visitor['country']]] = (countries[COUNTRIES[visitor['country']]] || 0) + 1
    end
    countries.sort {|a,b| b[1]<=>a[1]}
  end
  
  def self.referrers
    visitors = recent_visitors
    referrers = visitors.map {|visitor| {:referrer => visitor['r'], :title => visitor['i'] } unless visitor['r'].blank? }.compact
    referrers.select {|referrer| !%w"mynews ish.my".include? URI.parse(referrer[:referrer]).host[4..9] }
  end
  
  def self.recent_visitors
    Rails.cache.fetch("chartbeat_recent_visitors", :expires_in => 5.seconds) do
      require 'open-uri'
      doc = open "http://api.chartbeat.com/recent/?host=mynewsdesk.com&limit=1000&apikey=#{CONFIG['chartbeat_key']}"
      JSON.parse doc.read.to_s
    end
  end
end