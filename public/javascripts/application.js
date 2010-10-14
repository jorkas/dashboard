// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults


$(document).ready(function(){
  load_widget("total_visits", 1200000)
  load_widget("signup_journalists", 1200000)
  load_widget("signup_follows",1200000)
  load_widget("signup_trails",1200000)
  load_widget("top_searches",1200000)
  load_widget("top_countries",1200000)
})


function load_widget (name,ttl) {
  console.log("loading_widget: "+name+" ttl: "+ttl)
  $.get("/widgets/"+name, function(data) {
    div = $("#"+name)
    if ( $(".spinner",div).size() > 0) {
      $(".spinner",div).fadeOut('slow', function() {
          div.html(data);
      });
    } else {
      div.html(data);
    }
    setTimeout(function(){
      console.log("reloading "+name)
      load_widget(name,ttl)
    },ttl);
  });
}