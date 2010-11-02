class Twitter
  def self.prepare_access_token(oauth_token, oauth_token_secret)
    consumer = OAuth::Consumer.new(CONFIG['twitter_apikey'],CONFIG['twitter_apisecret'],
      { :site => "http://api.twitter.com",
        :scheme => :header
      })
    token_hash = { :oauth_token => oauth_token,
                   :oauth_token_secret => oauth_token_secret
                 }
    access_token = OAuth::AccessToken.from_hash(consumer, token_hash )
    return access_token
  end

  def self.get_message
    Rails.cache.fetch("twitter_dm", :expires_in => 1.minutes) do
      access_token = prepare_access_token(CONFIG['twitter_oauthtoken'], CONFIG['twitter_oauthtoken_secret'])
      json = JSON.parse(access_token.request(:get, "http://api.twitter.com/1/direct_messages.json?count=1").body).first
      {:from => json['sender']['name'], :message => json['text'], :datetime => Time.parse(json['created_at'])}      
    end
  end
end