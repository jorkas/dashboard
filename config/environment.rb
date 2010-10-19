# Load the rails application
require File.expand_path('../application', __FILE__)

require 'yaml'
CONFIG = (YAML.load_file('config/config.yml')["production"] rescue {}).merge(ENV)

# Initialize the rails application
Dashboard::Application.initialize!
Time::DATE_FORMATS[:date] = "%Y-%m-%d"