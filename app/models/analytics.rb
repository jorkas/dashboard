class Analytics
  
  def initialize
    Garb::Session.login(CONFIG['garb_login'], CONFIG['garb_password'])
    @profile = Rails.cache.fetch("garb_profile", :expires_in => 1.hour) do
      Garb::Profile.first('UA-67918-1')
    end
  end
  
  def total_visits
    last = Rails.cache.fetch("garb_total_visits_last", :expires_in => 1.hour) do
      Garb::Report.new(@profile, {:metrics => [:visits], :start_date => Time.now - 2.month - 1.day, :end_date => Time.now - 1.month - 1.day}).results.first.visits.to_i
    end
    now = Rails.cache.fetch("garb_total_visits_now", :expires_in => 1.hour) do
      Garb::Report.new(@profile, {:metrics => [:visits], :start_date => Time.now - 1.month - 1.day, :end_date => Time.now - 1.day }).results.first.visits.to_i
    end
    percent = (now.to_f/last.to_f)*100 - 100 
    {:now => now, :last => last, :percent => percent}
  end
  
  def signup_journalists
      last = Rails.cache.fetch("garb_signup_jouenalists_last", :expires_in => 1.hour) do
        Garb::Report.new(@profile, {:metrics => [:goal6Completions], :start_date => Time.now - 8.day, :end_date => Time.now - 8.day}).results.first.goal6_completions.to_i
      end
      now = Rails.cache.fetch("garb_signup_jouenalists_now", :expires_in => 1.hour) do
        Garb::Report.new(@profile, {:metrics => [:goal6Completions], :start_date => Time.now - 1.day, :end_date => Time.now - 1.day}).results.first.goal6_completions.to_i
      end
      percent = (now.to_f/last.to_f)*100 - 100 
      {:now => now, :last => last, :percent => percent}
    end
    
    def signup_follows
      last = Rails.cache.fetch("garb_signup_follows_last", :expires_in => 1.hour) do
        Garb::Report.new(@profile, {:metrics => [:goal7Completions], :start_date => Time.now - 8.day, :end_date => Time.now - 8.day}).results.first.goal7_completions.to_i
      end
      now = Rails.cache.fetch("garb_signup_follows_now", :expires_in => 1.hour) do
        Garb::Report.new(@profile, {:metrics => [:goal7Completions], :start_date => Time.now - 1.day, :end_date => Time.now - 1.day}).results.first.goal7_completions.to_i
      end
      percent = (now.to_f/last.to_f)*100 - 100 
      {:now => now, :last => last, :percent => percent}
    end
    
    def signup_trials
      last = Rails.cache.fetch("garb_signup_trials_last", :expires_in => 1.hour) do
        Garb::Report.new(@profile, {:metrics => [:goal1Completions], :start_date => Time.now - 8.day, :end_date => Time.now - 8.day}).results.first.goal1_completions.to_i
      end
      now = Rails.cache.fetch("garb_signup_trials_now", :expires_in => 1.hour) do
        Garb::Report.new(@profile, {:metrics => [:goal1Completions], :start_date => Time.now - 1.day, :end_date => Time.now - 1.day}).results.first.goal1_completions.to_i
      end
      percent = (now.to_f/last.to_f)*100 - 100 
      {:now => now, :last => last, :percent => percent}
    end
    
    def top_countries
      results = Rails.cache.fetch("garb_top_countries", :expires_in => 1.hour) do
        Garb::Report.new(@profile, {:sort => :visits.desc, :limit => 10, :dimensions => [:country], :metrics => [:visits], :start_date => Time.now - 1.month - 1.day, :end_date => Time.now - 1.day }).results
      end
      results
    end
    
    def top_searches
      results = Rails.cache.fetch("garb_top_searches", :expires_in => 1.hour) do
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
        report.results
      end
      
      
      searchterms = Array.new
      
      results.each do |result|
        search_term = CGI.parse(result.page_path)['query'].to_s
        searchterms << {:search_term => search_term, :visits => result.visits.to_i } unless search_term.empty?
      end
      searchterms[0...10]
    end
  
end