class Calendar
  attr_accessor :title
  
  def initialize(title)
    @title = title    
    @@service = GCal4Ruby::Service.new
    @@service.authenticate(CONFIG['garb_login'], CONFIG['garb_password'])
    @cal = GCal4Ruby::Calendar.find(@@service, {:title => @title}).first
  end
  
  def events
    @cal.events({'start-min' => Time.now.beginning_of_day.utc.xmlschema, 'start-max' => Time.now.end_of_day.utc.xmlschema,:singleevents => true}).map{|c|
      Event.new(
        :author => c.author_name,
        :title => c.title,
        :start_time => c.start_time.strftime("%R"),
        :end_time => c.end_time.strftime("%R"),
        :all_day => c.all_day
      )
    }.sort{|a,b| a.start_time <=> b.start_time}
  end
  
  class Event
    attr_accessor :author, :end_time, :start_time, :title, :where, :all_day
    def initialize(attributes = {})
      attributes.each do |name, value|
        send("#{name}=", value)
      end
    end
  end
  
  def clear_cache
    Rails.cache.delete events_cache_key
    Rails.cache.delete cal_cache_key
  end
  
  def self.get_events
    Rails.cache.fetch("calendars", :expires_in => 10.minutes) do
      cals = ["London (10 pers)","New York (18 pers)","Oslo (8 pers)","Singapore (6 pers)"]
      cals.map!{|title| Calendar.new(title) }
      cals.map{|cal|
        {
          :title => cal.title,
          :events => cal.events
        }
      }
    end
  end
  
  private
  
  def events_cache_key
    "calendars"
  end
  def cal_cache_key
    "calendar_#{@title}"
  end
end