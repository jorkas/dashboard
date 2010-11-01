class Mynewsdesk
  require 'open-uri'

  def self.recent_pressreleases
    Rails.cache.fetch("recent_pressreleases", :expires_in => 1.minutes) do
      doc = Nokogiri::XML(open("http://www.mynewsdesk.com/se/search/rss?date_end=&date_mode=between&date_on=&date_start=&g_region=&page=1&query=&sites=all&subject=&type_of_medias=Pressrelease"))
      doc.css("item").map {|item| {:site => item.at_css("link").text[26,2], :author => item.at_xpath("dc:creator").text, :title => item.at_css("title").text, :date => DateTime.parse(item.at_css("pubDate").text)}}
    end
  end
  
  def self.pressreleases_today
    Mynewsdesk.xml.at_css("pressreleases today").text.to_i
  end
  
  def self.pressreleases_yesterday
    Mynewsdesk.xml.at_css("pressreleases yesterday").text.to_i
  end
  
  def self.pressreleases_last_week
      Mynewsdesk.xml.at_css("pressreleases a_week_ago").text.to_i
  end
  
  def self.followers
    xml = Mynewsdesk.xml
    {
      :today => xml.at_css("followers today").text.to_i,
      :total => xml.at_css("followers total").text.to_i,
      :yesterday => xml.at_css("followers yesterday").text.to_i
    }
  end
  
  def self.journalists
    xml = Mynewsdesk.xml
    {
      :today => xml.at_css("journalists today").text.to_i,
      :total => xml.at_css("journalists total").text.to_i,
      :yesterday => xml.at_css("journalists yesterday").text.to_i
    }
  end
  
  def self.customers
    xml = Mynewsdesk.xml
    {
      :today => xml.at_css("customers today").text.to_i,
      :total => xml.at_css("customers total").text.to_i,
      :yesterday => xml.at_css("customers yesterday").text.to_i
    }
  end
  
  def self.xml
    doc = Rails.cache.fetch("mynewsdesk_xml", :expires_in => 4.minutes) do
      open("http://www.mynewsdesk.com/admin/dashboard.xml").read
    end
    Nokogiri::XML(doc)
  end
end