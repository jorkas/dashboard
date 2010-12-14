require "rexml/document"

class NewRelic
  def self.server_status
    expires_in = Rails.env.production? ? 1.minutes : 10.minutes
    result = Rails.cache.fetch("new_relic", :expires_in => expires_in) do
      doc = Nokogiri::XML(open("https://rpm.newrelic.com/accounts/1/applications/41272/threshold_values.xml", "x-license-key" => CONFIG['new_relic_key']))
      array = Array.new
      doc.css("threshold_value").each do |value|
        array << {
          :name => value.attributes["name"].text,
          :metric_value => value.attributes["metric_value"].text,
          :color_value => self.get_color_from_value(value.attributes["threshold_value"].text),
          :formatted_metric_value => value.attributes["formatted_metric_value"].text
        }
      end
      array
    end
    result
  end
  
  private
  def self.get_color_from_value(value)
    case value
    when "1"
      "Green"
    when "2"
      "Yellow"
    when "3"
      "Red"
    end
  end
end