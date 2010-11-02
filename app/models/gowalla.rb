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
    entries = Rails.cache.fetch("gowalla", :expires_in => 30.minutes) do
      entries = Gowalla.parse_feed(3379248) + Gowalla.parse_feed(1361526) + Gowalla.parse_feed(6361341)
      entries.sort! { |a,b| b.time <=> a.time }
    end
    entries[0...7]
  end
  
  def self.parse_xml(doc)
    doc.remove_namespaces!
    place = doc.at_css("feed>title").text
    place["Gowalla Checkins at MyNewsdesk"] = ""
    place = "Stockholm office" if place.strip == "HQ"
    place = "Gothenburg office" if place.strip == ""
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
      require 'open-uri'
      doc = Nokogiri::XML(open("http://gowalla.com/spots/#{id}/checkins.atom"))
      Gowalla.parse_xml(doc)
    end
  end
  
  private
  
  def self.get_avatar(name)
    avatars = {
      'joakwest' => 16751,
      'richardj' => 18417,
      'dojan' => 14679,
      'davidwennergren' => 15886,
      'kungkeke' => 1483696,
      'iPillan' => 64229,
      'mhallqvist' => 15536,
      'dwiberg' => 14419,
      'himynameisjonas' => 63524,
      'sofiaeiworth' => 121097,
      'mgarbarczyk' => 1025564
      }
    if avatars.has_key? name
      return "http://s3.amazonaws.com/static.gowalla.com/users/#{avatars[name]}-standard.jpg"
    else
      return "http://gowalla.com/images/default-user.jpg"
    end
  end
end