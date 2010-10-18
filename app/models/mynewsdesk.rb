class Mynewsdesk
  def self.recent_pressreleases
    Rails.cache.fetch("recent_pressreleases", :expires_in => 1.minutes) do
      require 'open-uri'
      doc = Nokogiri::XML(open("http://www.mynewsdesk.com/se/search/rss?page=1&type_of_medias=Pressrelease"))
      doc.css("item").map {|item| {:author => item.at_xpath("dc:creator").text, :title => item.at_css("title").text, :date => DateTime.parse(item.at_css("pubDate").text)}}
    end
  end
end