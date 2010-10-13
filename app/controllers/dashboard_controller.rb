class DashboardController < ApplicationController
  def index
    Garb::Session.login(CONFIG['garb_login'], CONFIG['garb_password'])
    @profile = Garb::Profile.first('UA-67918-1')

    @visits = get_visits
    @signup_journalists = get_signup_journalists
    @signup_follows = get_signup_follows
    @top_countries = get_top_countries
    @top_searches = get_top_searches
  end
  
  private
    
    def get_visits
      last = Garb::Report.new(@profile, {:metrics => [:visits], :start_date => Time.now - 2.month - 1.day, :end_date => Time.now - 1.month - 1.day}).results.first.visits.to_i
      now = Garb::Report.new(@profile, {:metrics => [:visits], :start_date => Time.now - 1.month - 1.day, :end_date => Time.now - 1.day }).results.first.visits.to_i
      percent = (now.to_f/last.to_f)*100 - 100 
      {:now => now, :last => last, :percent => percent}
    end
    
    def get_signup_journalists
      now = Garb::Report.new(@profile, {:metrics => [:goal6Completions], :start_date => Time.now - 1.day, :end_date => Time.now - 1.day}).results.first.goal6_completions.to_i
      last = Garb::Report.new(@profile, {:metrics => [:goal6Completions], :start_date => Time.now - 8.day, :end_date => Time.now - 8.day}).results.first.goal6_completions.to_i
      percent = (now.to_f/last.to_f)*100 - 100 
      {:now => now, :last => last, :percent => percent}
    end
    
    def get_signup_follows  
      now = Garb::Report.new(@profile, {:metrics => [:goal7Completions], :start_date => Time.now - 1.day, :end_date => Time.now - 1.day}).results.first.goal7_completions.to_i
      last = Garb::Report.new(@profile, {:metrics => [:goal7Completions], :start_date => Time.now - 8.day, :end_date => Time.now - 8.day}).results.first.goal7_completions.to_i
      percent = (now.to_f/last.to_f)*100 - 100 
      {:now => now, :last => last, :percent => percent}
    end
    
    def get_top_countries
      Garb::Report.new(@profile, {:sort => :visits.desc, :limit => 10, :dimensions => [:country], :metrics => [:visits], :start_date => Time.now - 1.month - 1.day, :end_date => Time.now - 1.day }).results
    end
    
    def get_top_searches
      report = Garb::Report.new(@profile,
                     :limit => 20,
                     :start_date => (Date.today - 7.day),
                     :end_date => (Date.today + 1.day))
      report.metrics :visits
      report.dimensions :pagePath
      report.sort :visits.desc
      report.filters do
        contains(:page_path, 'query=')
        contains(:page_path, '/search/')
        does_not_contain(:page_path, 'query=&')
      end
      
      results = report.results
      searchterms = Array.new
      
      results.each do |result|
        search_term = CGI.parse(result.page_path)['query'].to_s
        searchterms << {:search_term => search_term, :visits => result.visits.to_i } unless search_term.empty?
      end
      searchterms[0...10]
    end
end