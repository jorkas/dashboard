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
    var getActiveGraphHtml = function(usersData){
        var active = usersData.active;
        var max = usersData.max;
        var avg = usersData.avg;
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
    var getBarItemHtml = function(max,identifier,label,value){
        return '<div class="bar bar-'+ identifier +'"><div>&#160;</div><span>'+ value +'</span><span class="country">'+ label +'</span></div>';
    };
    var getBarsHtml = function(visitorsByCountry){
        var max = $(visitorsByCountry).first()[0][1]
        var strHtml = "";
        $(visitorsByCountry).each(function(i,elm){
           console.log(elm + " - " + i);
           strHtml += getBarItemHtml(max,i+1,elm[0],elm[1]);
        });
        $("#bar-chart").html(strHtml);
        $("#bar-chart .bar").each(function(elm){
            var elm = $(this);
            var barBg = $(this).find("div");
            var val = elm.find("span:first").text();
            barBg.css("height",val);
            barBg.css("margin-top",max - val);
        });
    };
    return{
        init: function(){
            
        },
        renderActiveUsersByCountry: function(json){
            //renderBar();
            getBarsHtml(json);
        },
        renderActiveUsersGraph: function(usersData){
            $("#online-users").html(usersData.active);
            $("#online-avg").html(usersData.avg);
            $("#online-max").html(usersData.max);
            $("#percent-bar").html(getActiveGraphHtml(usersData));
        }
    }
})();
$(document).ready(function(){
    var visitorsByCountry = [["Sweden",487],["Norway",30],["United Kingdom",21],["Denmark",18],["Sri Lanka",17],["Finland",12],["Germany",10],["Poland",10],["Netherlands",7],["India",6]];
    Dashboard.app.renderActiveUsersByCountry(visitorsByCountry);
    var activeUsersData = {
      "active" : 700,
      "max" : 912,
      "avg" : 310
    };
    Dashboard.app.renderActiveUsersGraph(activeUsersData);
});