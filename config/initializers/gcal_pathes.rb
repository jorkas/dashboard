module GCal4Ruby
  class Calendar
    def events(args = {})
      events = []
      ret = @service.send_request(GData4Ruby::Request.new(:get, @content_uri, nil, nil, args))
      REXML::Document.new(ret.body).root.elements.each("entry"){}.map do |entry|
        entry = GData4Ruby::Utils.add_namespaces(entry)
        e = Event.new(service)
        if e.load(entry.to_s)
          events << e
        end
      end
      return events
    end
  end
end