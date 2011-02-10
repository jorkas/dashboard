class Chartbeat
  
  def self.active_visits
    {
      :stats => self.quickstats,
      :history => self.history  
    }
  end
  
  def self.countries
    visitors = recent_visitors
    countries = Hash.new
    visitors.each do |visitor|
      countries[COUNTRIES[visitor['country']]] = (countries[COUNTRIES[visitor['country']]] || 0) + 1
    end
    countries.sort {|a,b| b[1]<=>a[1]}[0,10]
  end
  
  def self.recent_visitors
    Rails.cache.fetch("chartbeat_recent_visitors", :expires_in => 5.seconds) do
      doc = open "http://api.chartbeat.com/recent/?host=mynewsdesk.com&limit=1000&apikey=#{CONFIG['chartbeat_key']}"
      JSON.parse doc.read.to_s
    end
  end

  def self.referrers
    visitors = recent_visitors
    referrers = visitors.map {|visitor| {:referrer => URI.parse(URI.escape(visitor['r'])), :title => visitor['i'] } unless visitor['r'].blank? }.compact
    referrers = referrers.select{|referrer| !%w"google mynews ish.my".include? referrer[:referrer].host[4..9] }
    referrers.map{ |ref|
      {
        :host => ref[:referrer].host.gsub('www.', '').strip,
        :title => ref[:title][0,(ref[:title].index("-") || 30)-1]
      }
    }[0,10]
  end
  
  def self.top_countries
    {
      :countries => self.countries,
      :total => self.quickstats["visits"]
    }
  end
  
  private
  
  def self.quickstats
    Rails.cache.fetch("chartbeat_quickstats", :expires_in => 5.seconds) do
      doc = open "http://api.chartbeat.com/quickstats?host=mynewsdesk.com&apikey=#{CONFIG['chartbeat_key']}"
      JSON.parse doc.read.to_s
    end
  end
  
  def self.history
    Rails.cache.fetch("chartbeat_history", :expires_in => 1.hour) do
      doc = open "http://chartbeat.com/dashapi/stats/?host=mynewsdesk.com&apikey=#{CONFIG['chartbeat_key']}"
      JSON.parse doc.read.to_s
    end
  end
end