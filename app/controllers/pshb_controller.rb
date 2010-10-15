class PshbController < ApplicationController
  def gowalla
    
    if !params["hub.challenge"].nil?
      @challenge = params["hub.challenge"]
      render :action => "pshb", :status => 200, :layout => false
    else
      doc = Nokogiri::XML(request.body.read)
      entries = Gowalla.parse_xml(doc, "Stockholm Office")
      logger.info entries.inspect
      @challenge = "uhoh!"
      render :action => "pshb", :status => 404, :layout => false
    end
  end
end
