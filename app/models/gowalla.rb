class Gowalla
  class Entry
    attr_accessor :name, :time, :place, :image
    def initialize(name,time,place,image)
      @name = name
      @time = time
      @place = place
      @image = image
    end
  end
  
  def self.recent_checkins
    #sthlm  1361526
    #malmo  3379248
    entries = Rails.cache.fetch("gowalla", :expires_in => 5.minutes) do
      entries = Gowalla.parse_feed(3379248, "Øresund Office") + Gowalla.parse_feed(1361526, "Stockholm Office")
      entries.sort! { |a,b| b.time <=> a.time }
      entries[0...15]
    end
    entries
  end
  
  def self.parse_xml(doc, place)
    xml_entries = doc.css("entry")
    entries = Array.new
    xml_entries.each do |entry|
      name = entry.at_css("name").text
      time = Time.parse(entry.at_css("published").text)
      image = entry.at_css("link[rel=photo]").attr("href")
      entries << Gowalla::Entry.new(name, time, place, image)
    end
    entries
  end
  
  def self.parse_feed(id, place)
    entries = Rails.cache.fetch("gowalla_#{id}", :expires_in => 10.seconds) do
      require 'open-uri'
      doc = Nokogiri::XML(open("http://gowalla.com/spots/#{id}/checkins.atom"))
      Gowalla.parse_xml(doc, place)
    end
  end
end