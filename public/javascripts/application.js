// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults


$(document).ready(function(){
  setTimeout(function(){
    load_widget("total_visits", 1200000)
  },10);
  setTimeout(function(){
    load_widget("signup_journalists", 1200000)
  },2000);
  setTimeout(function(){
    load_widget("signup_follows",1200000)
  },4000);
  setTimeout(function(){
    load_widget("signup_trails",1200000)
  },8000);
  setTimeout(function(){
    load_widget("top_searches",1200000)
  },12000);
  setTimeout(function(){
    load_widget("top_countries",1200000)
  },14000);
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