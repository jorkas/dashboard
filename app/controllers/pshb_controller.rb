class PshbController < ApplicationController
  def gowalla
    doc = Nokogiri::XML(request.body.read)
    entries = Gowalla.parse_xml(doc, "Stockholm Office")
    logger.info entries.inspect
  end
end
