// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults


$(document).ready(function(){
  
  var body = $("body")
  
  body.queue(function (next) {
    load_widget("recent_checkins",5000)
    next()
  })
  body.queue(function (next) {
    load_widget("total_visits", 1200000)
    next()
  })
  body.queue(function (next) {
    load_widget("signup_journalists", 1200000)
    next()
  })
  body.queue(function (next) {
    load_widget("signup_follows",1200000)
    next()
  })
  body.queue(function (next) {
    load_widget("signup_trials",1200000)
    next()
  })
  body.queue(function (next) {
    load_widget("top_searches",1200000)
    next()
  })
  body.queue(function (next) {
    load_widget("top_countries",1200000)
    next()
  })

})


$(".widget").live("click",function(){
  load_widget($(this).attr("id"),0)
})

function load_widget (name,ttl) {
  $.get("/widgets/"+name, function(data) {
    div = $("#"+name)
    if ( $(".spinner",div).size() > 0) {
      $(".spinner",div).fadeOut('slow', function() {
          div.html(data);
      });
    } else {
      div.html(data);
    }
    if (ttl > 0) {
      setTimeout(function(){
        load_widget(name,ttl)
      },ttl);
    };
  });
}