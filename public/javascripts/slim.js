// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
var Dashboard = {};

var app_version = "";

Dashboard.app = (function(){
    var rotator;
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
    var getActiveGraphHtml = function(data){
        var active = data.active;
        var max = data.max;
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
        strHtml += "<span class=\"summary "+ getClassFromPercent(percentOfMax) +"\">"+ parseInt(percentOfMax,10) +"%</span>";
        return strHtml;  
    };
    var getBarItemHtml = function(max,identifier,label,value){
        return '<div class="bar bar-'+ identifier +'"><div>&#160;</div><span>'+ value +'</span><span class="country">'+ label +'</span></div>';
    };
    var getBarsHtml = function(visitorsByCountry){
        var max = $(visitorsByCountry).first()[0][1];
        var strHtml = "";
        $(visitorsByCountry).each(function(i,elm){
           strHtml += getBarItemHtml(max,i+1,elm[0],elm[1]);
        });
        $("#bar-chart").html(strHtml);
        $("#bar-chart .bar").each(function(){
            var elm = $(this);
            var barBg = $(this).find("div");
            var val = elm.find("span:first").text();
            barBg.css("height",val);
            barBg.css("margin-top",max - val);
        });
    };
    var rotatePressreleases = function(data, index){
        clearTimeout(rotator);
        var container = $("#pressreleases-latest>span");
        var dt = new Date(data[index].date);
        //var text = "<time>" + new Date(data[index].date) +"</time>" + data[index].author + " - " +data[index].title;
        var text = data[index].author + " - " +data[index].title;
        container.hide();
        container.fadeIn(200).delay(3000).fadeOut(300);
        container.html(text.substring(0,200));
        rotator = setTimeout(function(){
            index = ((index + 1) >= data.length) ? 0 : index+1;
            rotatePressreleases(data, index);
        },4000);
    };
    var roundNumber = function(val,decimals){
      return Math.round(val*Math.pow(10,decimals))/Math.pow(10,decimals);  
    };
    return{
        init: function(){
            
        },
        renderActiveUsersByCountry: function(data){
            getBarsHtml(data);
        },
        renderPressreleasesStats : function(data){
            $("#pressreleases-today").text(data.today);
            $("#pressreleases-yesterday").text(data.yesterday);
            $("#pressreleases-last-week").text(data.last_week);
        },
        renderPressreleases : function(data){
            rotatePressreleases(data, 0);
        },
        renderNewRelic: function(data){
            var html = "";
            $(data).each(function(i,elm){
              html += '<div class="grid_2">'+ elm.name +' <span class="stats-val '+ elm.color_value.toLowerCase() +'">'+ elm.formatted_metric_value +'</span></div>';
            });
            $("#server-update").html(html);
        },
        renderCombinedUserStats: function(data){
            var summaryStats;
            var goals;
            var statswrapper = $("#stats-customer");
            statswrapper.find(".total").text(data.mynewsdesk.customers.total);
            //Customer
            summaryStats = statswrapper.find(".summary-stats");
            summaryStats.find(".today").text(data.mynewsdesk.customers.today);
            summaryStats.find(".yesterday").text(data.mynewsdesk.customers.yesterday);
            goals = statswrapper.find(".goals");
            goals.find(".yesterday").text(data.google.signup_trials.now);
            goals.find(".arrow-wrapper strong").text(roundNumber(data.google.signup_trials.percent,2));
            if(data.google.signup_trials.percent < 0){
                statswrapper.find(".arrow-wrapper").addClass("down");
            } else {
                statswrapper.find(".arrow-wrapper").removeClass("down");
            }
            
            //Followers
            statswrapper = $("#stats-followers");
            statswrapper.find(".total").text(data.mynewsdesk.followers.total);
            summaryStats = statswrapper.find(".summary-stats");
            summaryStats.find(".today").text(data.mynewsdesk.followers.today);
            summaryStats.find(".yesterday").text(data.mynewsdesk.followers.yesterday);
            goals = statswrapper.find(".goals");
            goals.find(".yesterday").text(data.google.signup_follows.now);
            goals.find(".arrow-wrapper strong").text(roundNumber(data.google.signup_follows.percent,2));
            if(data.google.signup_follows.percent < 0){
                statswrapper.find(".arrow-wrapper").addClass("down");
            } else {
                statswrapper.find(".arrow-wrapper").removeClass("down");
            }
            
            //Journalists
            statswrapper = $("#stats-journalists");
            statswrapper.find(".total").text(data.mynewsdesk.journalists.total);
            summaryStats = statswrapper.find(".summary-stats");
            summaryStats.find(".today").text(data.mynewsdesk.journalists.today);
            summaryStats.find(".yesterday").text(data.mynewsdesk.journalists.yesterday);
            goals = statswrapper.find(".goals");
            goals.find(".yesterday").text(data.google.signup_journalists.now);
            goals.find(".arrow-wrapper strong").text(roundNumber(data.google.signup_journalists.percent,2));
            if(data.google.signup_journalists.percent < 0){
                statswrapper.find(".arrow-wrapper").addClass("down");
            } else {
                statswrapper.find(".arrow-wrapper").removeClass("down");
            }
            
        },
        renderTotalVisits: function(data){
            var total = $("#total-visits");
            total.find("span.big").text(data.now);
            total.find("strong").text(roundNumber(data.percent,2) + "%");
            var arrow = total.find("span.arrow-wrapper");
            if(data.percent < 0){
                arrow.addClass("down");
            } else {
                arrow.removeClass("down");
            }
        },
        renderActiveUsersGraph: function(data){
            $("#online-users").html(data.stats.visits);
            $("#online-avg").html(parseInt(data.history.people_avg,10));
            $("#online-max").html(data.history.people_max);
            $("#percent-bar").html(getActiveGraphHtml({
                "active": data.stats.visits,
                "max": data.history.people_max
            }));
        }
    };
})();
Dashboard.loader = (function(){
    var loadingQueue = $("body");
    var loadWidget = function(settings){
        $.get(settings.action + ".json", function(data){
            Dashboard.app[settings.callback](data);
            if(settings.refreshTime){
                setTimeout(function(){
                    loadWidget(settings);
                },settings.refreshTime);
            }
        });  
    };
    var loadWidgets = function(){
        $(".dynamic-loader").each(function(i, element){
            element = $(element);
            loadWidget({
                "action": element.data("action"),
                "callback": element.data("callback"),
                "refreshTime": element.data("refresh-time")
            });
        });
    };
    return{
        init: function(){
           loadWidgets(); 
        }
    };
})();
$(document).ready(function(){
    Dashboard.loader.init();
});