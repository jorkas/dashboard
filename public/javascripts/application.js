// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults


$(document).ready(function(){
  load_widget("total_visits")
  load_widget("signup_journalists")
  load_widget("signup_follows")
  load_widget("signup_trails")
  load_widget("top_searches")
  load_widget("top_countries")
})



function load_widget (name) {
  $.get("/widgets/"+name, function(data) {
    div = $("#"+name)
    $(".spinner",div).fadeOut('slow', function() {
        div.html(data);
    });
  });
}