class Gowalla
  class Entry
    attr_accessor :name, :time, :place, :image, :id
    def initialize(name,time,place,image, id)
      @name = name
      @time = time
      @place = place
      @image = image
      @id = id
    end
  end
  
  def self.recent_checkins
    #sthlm  1361526
    #malmo  3379248
    #gbg    6361341
    #singapore 6898169
    entries = Rails.cache.fetch("gowalla", :expires_in => 30.minutes) do
      entries = Gowalla.parse_feed(3379248) + Gowalla.parse_feed(1361526) + Gowalla.parse_feed(6361341) + Gowalla.parse_feed(6898169)
      entries.sort! { |a,b| b.time <=> a.time }
    end
    entries[0...7]
  end
  
  def self.parse_xml(doc)
    doc.remove_namespaces!
    place = doc.at_css("feed>title").text
    place.gsub!("Gowalla Checkins at MyNewsdesk ","")
    place.gsub!("Gowalla Checkins at Mynewsdesk ","")
    place = "Stockholm office" if place.strip == "HQ"
    place = "Gothenburg office" if place.strip == ""
    place = "Singapore office" if place.strip == "Singapore"
    xml_entries = doc.css("entry")
    entries = Array.new
    xml_entries.each do |entry|
      name = entry.at_css("name").text
      time = Time.parse(entry.at_css("published").text)
      username = entry.at_css("preferredUsername").text
      image = entry.at_css("link[rel=photo]").try(attr("href")) || get_avatar(username)
      id = entry.at_css("id").text[/\d{5,}/]
      entries << Gowalla::Entry.new(name, time, place, image, id)
    end
    entries
  end
  
  def self.parse_feed(id)
    entries = Rails.cache.fetch("gowalla_#{id}", :expires_in => 10.seconds) do
      doc = Nokogiri::XML(open("http://gowalla.com/spots/#{id}/checkins.atom"))
      Gowalla.parse_xml(doc)
    end
  end
  
  private
  
  def self.get_avatar(name)
    user = GowallaUser.find_or_create_by_name(name)
    user.image_url
  end
  
end