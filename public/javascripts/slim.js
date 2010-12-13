// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
var Dashboard = {};

var app_version = "";

Dashboard.app = (function(){
    var rotator;
    var getActiveGraphHtml = function(data){
        var active = data.active;
        var max = data.max;
        var percentOfMax = (active/max)*100;
        var strHtml = "";
        var cssClass = "low";
        for(var i=0;i<100;i++){
            if(i <= percentOfMax){
                strHtml += "<span class=\"active-color\">&#160;</span>";
            }
            else{
                strHtml += "<span>&#160;</span>";
            }
        }
        strHtml += "<span class=\"summary active-color\">"+ parseInt(percentOfMax,10) +"%</span>";
        return strHtml;  
    };
    var getBarItemHtml = function(max,identifier,label,value,percent){
        return '<div class="bar bar-'+ identifier +'"><div>&#160;</div><span data-percent="'+ percent+'">'+ value +'</span><span class="country">'+ label + '</span></div>';
    };
    var getBarsHtml = function(visitorsByCountry,minHeight){
        var countries = $(visitorsByCountry.countries);
        var total = visitorsByCountry.total;

        var strHtml = "";
        var name;
        var visits;
        var percent;
        countries.each(function(i,country){
            name = country[0];
            visits = country[1];
            percent = parseInt((visits/total *100),10);
            strHtml += getBarItemHtml(minHeight,i+1,name,visits,percent);
        });
        
        //var strHtml = "";
        // $(visitorsByCountry.countries).each(function(i,elm){
        //    strHtml += getBarItemHtml(max,i+1,elm[0],elm[1]);
        // });
        $("#bar-chart").html(strHtml);
        $("#bar-chart .bar").each(function(){
            var elm = $(this);
            var barBg = $(this).find("div");
            var val = elm.find("span:first").data("percent") * 4 + 4;
            barBg.css("height",val);
            barBg.css("margin-top",minHeight - val);
        });
    };
    var rotatePressreleases = function(data, index){
        clearTimeout(rotator);
        var container = $("#pressreleases-latest>span");
        var dt = new Date(data[index].date);
        //var text = "<time>" + new Date(data[index].date) +"</time>" + data[index].author + " - " +data[index].title;
        var text = "<strong class=\"text-highlight\">"+ data[index].author + "</strong> - " +data[index].title;
        container.hide();
        container.fadeIn(200).delay(3000).fadeOut(300);
        container.html(text);
        rotator = setTimeout(function(){
            index = ((index + 1) >= data.length) ? 0 : index+1;
            rotatePressreleases(data, index);
        },4000);
    };
    var roundNumber = function(val,decimals){
      return Math.round(val*Math.pow(10,decimals))/Math.pow(10,decimals);  
    };
    var formatNumber = function(number, seperator){
        number += '';
        x = number.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + seperator + '$2');
        }
        return x1 + x2;
    };
    var formatDate = function(date){
        date = new Date(date);
        dateFormat.masks.dashboard_date = "HH:MM:ss ddd mmm dd";
        return date.format("dashboard_date");
    };
    var getCheckinHtml = function(checkin){
        return '<li data-id="'+checkin.id+'" class="grid_4"><img src="'+checkin.image+'"><span class="text-highlight">'+checkin.name+'</span>'+checkin.place+'<small>'+ formatDate(checkin.time) +'</small></li>';
    };
    return{
        init: function(){
            Dashboard.app.renderClock();
        },
        renderActiveUsersByCountry: function(data){
            getBarsHtml(data,400);
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
            var statswrapper = $(".stats-customer");
            statswrapper.find(".total").text(formatNumber(data.mynewsdesk.customers.total," "));
            //Customer
            summaryStats = statswrapper.find(".summary-stats");
            summaryStats.find(".today").text(data.mynewsdesk.customers.today);
            summaryStats.find(".yesterday").text(data.mynewsdesk.customers.yesterday);
            goals = statswrapper.find(".goals");
            goals.find(".yesterday").text(data.google.signup_trials.now);
            goals.find(".arrow-wrapper strong").text(roundNumber(data.google.signup_trials.percent,2)+"%");
            if(data.google.signup_trials.percent < 0){
                statswrapper.find(".arrow-wrapper").addClass("down");
            } else {
                statswrapper.find(".arrow-wrapper").removeClass("down");
            }
            
            //Followers
            statswrapper = $(".stats-followers");
            statswrapper.find(".total").text(formatNumber(data.mynewsdesk.followers.total," "));
            summaryStats = statswrapper.find(".summary-stats");
            summaryStats.find(".today").text(data.mynewsdesk.followers.today);
            summaryStats.find(".yesterday").text(data.mynewsdesk.followers.yesterday);
            goals = statswrapper.find(".goals");
            goals.find(".yesterday").text(data.google.signup_follows.now);
            goals.find(".arrow-wrapper strong").text(roundNumber(data.google.signup_follows.percent,2)+"%");
            if(data.google.signup_follows.percent < 0){
                statswrapper.find(".arrow-wrapper").addClass("down");
            } else {
                statswrapper.find(".arrow-wrapper").removeClass("down");
            }
            
            //Journalists
            statswrapper = $(".stats-journalists");
            statswrapper.find(".total").text(formatNumber(data.mynewsdesk.journalists.total," "));
            summaryStats = statswrapper.find(".summary-stats");
            summaryStats.find(".today").text(data.mynewsdesk.journalists.today);
            summaryStats.find(".yesterday").text(data.mynewsdesk.journalists.yesterday);
            goals = statswrapper.find(".goals");
            goals.find(".yesterday").text(data.google.signup_journalists.now);
            goals.find(".arrow-wrapper strong").text(roundNumber(data.google.signup_journalists.percent,2)+"%");
            if(data.google.signup_journalists.percent < 0){
                statswrapper.find(".arrow-wrapper").addClass("down");
            } else {
                statswrapper.find(".arrow-wrapper").removeClass("down");
            }
            
        },
        renderTotalVisits: function(data){
            var total = $("#total-visits");
            total.find("span.big").text(formatNumber(data.now," "));
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
            $("#return-avg").html(parseInt(data.history.return_avg,10));
            $("#return-max").html(data.history.return_max);
            
            $("#percent-bar").html(getActiveGraphHtml({
                "active": data.stats.visits,
                "max": data.history.people_max
            }));
        },
        renderMessage: function(data){
          $("#twitter-message p.message").text(data.message);
          $("#twitter-message span.from").text(data.from);
          $("#twitter-message time").text(formatDate(data.datetime));
        },
        renderRecentReferrers: function(data){
            var strHtml = "";
            $(data).each(function(i,referrer){
               //strHtml += "<li><span class=\"text-highlight\">"+referrer.host+"</span> → <span class=\"title\">"+referrer.title+"</span></li>";
               strHtml += "<p><span class=\"text-highlight\">"+referrer.host+"</span> → <span class=\"title\">"+referrer.title+"</span></p>";
            });
            $(".recent-referrers ul").html(strHtml);
        },
        renderRecentCheckins: function(data){
            var strHtml = "";
            $(data).each(function(i,checkin){
                if(i<4){
                    strHtml += getCheckinHtml(checkin);
                }
            });
            $("#recent-checkins ul").html(strHtml);
        },
        renderClock: function(){
            var dt = new Date();
            dateFormat.masks.clock = "HH:MM:ss";
            $("#pressreleases time").html(dt.format("clock"));
            setTimeout(function(){
                Dashboard.app.renderClock();
            },500);
        }
    };
})();
Dashboard.loader = (function(){
    var loadingQueue = $("body");
    var loadWidget = function(settings){
        $.get(settings.action + ".json", function(data,status){
            Dashboard.app[settings.callback](data);
            /*if(settings.refreshTime){
                setTimeout(function(){
                    loadWidget(settings);
                },settings.refreshTime);
            }*/
            if(settings.onSuccess){
                settings.element.removeClass("dynamic-loader");
                settings.onSuccess();
            }
        });  
    };
    var initWidgets = function(){
        element = $(".dynamic-loader");
        if (element.length > 0 ) {
            element = element.first();
            loadWidget({
                "action": element.data("action"),
                "callback": element.data("callback"),
                "refreshTime": element.data("refresh-time"),
                "onSuccess": initWidgets,
                "element": element
            });
        };
    };
    return{
        init: function(){
           initWidgets();
        },
        checkVersion: function(){
            var old_version = app_version;
            $.get("/version", function(data){
                app_version = $.trim(data);
                if (old_version != app_version && old_version != "") {
                    window.location.reload();
                }
            });
            setTimeout(function(){
                Dashboard.loader.checkVersion();
            },50000);
        }
    };
})();
$(document).ready(function(){
    Dashboard.loader.init();
    Dashboard.loader.checkVersion();
    Dashboard.app.init();
	$("#slider-top-right").easySlider({
		auto: true, 
		pause: 30000,
		controlsShow:false,
		continuous: true
	});
    $("#slider").easySlider({
		auto: true, 
		pause: 6000,
		controlsShow:false,
		continuous: true
	});

});