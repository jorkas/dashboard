class Mynewsdesk
  require 'open-uri'

  def self.recent_pressreleases
    Rails.cache.fetch("recent_pressreleases", :expires_in => 1.minutes) do
      doc = Nokogiri::XML(open("http://www.mynewsdesk.com/se/search/rss?date_end=&date_mode=between&date_on=&date_start=&g_region=&page=1&query=&sites=all&subject=&type_of_medias=Pressrelease"))
      doc.css("item").map {|item| {:site => item.at_css("link").text[26,2], :author => item.at_xpath("dc:creator").text, :title => item.at_css("title").text, :date => DateTime.parse(item.at_css("pubDate").text)}}
    end
  end
  
  def self.count_today
    Rails.cache.fetch("count_today", :expires_in => 5.minutes) do
      doc = Nokogiri::XML(open("http://www.mynewsdesk.com/se/search/pressreleases?type_of_medias=Pressrelease&subjects=&query=&date_mode=on&date_start=&date_end=&date_on=#{Date.today.to_s}&subject=&g_region=&sites=all"))
      doc.at_css('.searchTextRight span').text.to_i
    end
  end
  
  def self.count_yesterday
    Rails.cache.fetch("count_yesterday", :expires_in => 1.hours) do
      doc = Nokogiri::XML(open("http://www.mynewsdesk.com/se/search/pressreleases?type_of_medias=Pressrelease&subjects=&query=&date_mode=on&date_start=&date_end=&date_on=#{Date.yesterday.to_s}&subject=&g_region=&sites=all"))
      doc.at_css('.searchTextRight span').text.to_i
    end
  end
  
  def self.count_last_week
    Rails.cache.fetch("count_last_week", :expires_in => 2.hours) do
      doc = Nokogiri::XML(open("http://www.mynewsdesk.com/se/search/pressreleases?type_of_medias=Pressrelease&subjects=&query=&date_mode=on&date_start=&date_end=&date_on=#{(Date.today - 7.days).to_s}&subject=&g_region=&sites=all"))
      doc.at_css('.searchTextRight span').text.to_i
    end
  end
end