// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
var Dashboard = {};

var app_version = "";

Dashboard.app = (function(){
    var getClassFromPercent = function(percent){
        if(percent<30){
            cssClass = "medium";
        }else if(percent<75){
            cssClass = "medium";
        }else{
            cssClass = "medium";
        }
        return cssClass;
    };
    var renderBar = function(){
        $(".bar").each(function(elm){
            var elm = $(this);
            var barBg = $(this).find("div");
            var val = elm.find("span:first").text();
            barBg.css("height",val);
            barBg.css("margin-top",320 - val);
        });
    };
    var getActiveGraphHtml = function(active,max){
        var percentOfMax = (active/max)*100;
        var strHtml = "";
        var cssClass = "low";
        for(var i=0;i<100;i++){
            if(i <= percentOfMax){
                strHtml += "<span class=\""+ getClassFromPercent(i) +"\">&#160;</span>";
            }
            else{
                strHtml += "<span>&#160;</span>";
            }
        }
        strHtml += "<span class=\"summary "+ getClassFromPercent(percentOfMax) +"\">"+ parseInt(percentOfMax) +"%</span>";
        return strHtml;  
    };
    return{
        init: function(){
            
        },
        renderActiveUsersByCountry: function(){
            renderBar();
        },
        renderActiveUsersGraph: function(active,max){
            $("#online_now").html(getActiveGraphHtml(active,max));
        }
    }
})();
$(document).ready(function(){
    Dashboard.app.renderActiveUsersByCountry();
    Dashboard.app.renderActiveUsersGraph(800,902);
});