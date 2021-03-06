// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
var Dashboard = {};

var app_version = "";

$.fn.equalizeHeights = function(){
 return this.height( Math.max.apply(this, $(this).map(function(i,e){ return $(e).height() }).get() ));
};

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
        container.fadeIn(200).delay(6000).fadeOut(300);
        container.html(text);
        rotator = setTimeout(function(){
            index = ((index + 1) >= data.length) ? 0 : index+1;
            rotatePressreleases(data, index);
        },7000);
    };
    var roundNumber = function(val,decimals){
      return Math.round(val*Math.pow(10,decimals))/Math.pow(10,decimals);  
    };
    var changeValue = function(element, new_value) {
        old_value = Number(parseInt(element.text(),10));
        diff = new_value - old_value;
        if (diff != 0) {
            element.countTo({
                from: old_value,
                to: new_value,
                speed: 2000,
                refreshInterval: 50,
                onComplete: function(value) {
                }
            });
        }
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
    var renderClock = function(){
        var dt = new Date();
        dateFormat.masks.clock = "HH:MM:ss";
        $("#pressreleases time").html(dt.format("clock"));
        setTimeout(function(){
            renderClock();
        },500);
    };
    var serverCheckinsSlider = function(){
        $("#recent-checkins,#server").slideToggle(2000);
        setTimeout(function(){
            serverCheckinsSlider();
        },10000);
    };
    var initBottomSlider = function(){
        // $("#recent-checkins").hide();
        // serverCheckinsSlider();
    };
    var rightLargeColumnSwapper = function(){
        $("#recent-referrers,#top-countries").each(function(i, elm){
            elm = $(elm);
           if(elm.is(':visible')){
               elm.fadeOut(300);
           }
           else{
               setTimeout(function(){
                   elm.fadeIn(400);
               }, 400);
           }
        });
        setTimeout(function(){
            rightLargeColumnSwapper();
        },15000);
    };
    var initRightLargeColumnSwapper = function(){
        $("#recent-referrers").hide();
        rightLargeColumnSwapper();
    };
    return{
        init: function(){
            renderClock();
            initRightLargeColumnSwapper();
            initBottomSlider();
        },
        renderActiveUsersByCountry: function(data){
            getBarsHtml(data,400);
        },
        renderCustomStats: function(data){
            $("#custom-stats .fb-newsrooms-count").text(data.facebook_newsrooms.count);
            var html = "";
            $(data.facebook_newsrooms.latest).each(function(i, elm){
                html += "<p><span class=\"number-highlight\">→</span> "+elm+"</p>";
            })
            $("#custom-stats .fb-newsrooms-latest").html(html);
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
                var grid = (i == 2 || i == 5) ? 2 : 3;
                html += '<div class="grid_'+ grid +'">'+ elm.name +' <span class="stats-val '+ elm.color_value.toLowerCase() +'">'+ elm.formatted_metric_value +'</span></div>';
            });
            $("#server-update").html(html);
        },
        renderBookedRooms: function(data){
            $(data).each(function(i,elm){
                roomDiv = $("#room"+i)
                roomDiv.find(".big").text(elm.title)
                ulHTML = ""
                var hour = new Date();
                dateFormat.masks.hour = "HH";
                hour = hour.format("hour");
                $(elm.events).each(function(i,event){
                    if (event.end_time.split(":")[0] > hour) {
                        ulHTML += "<li><div class='grid_2 alpha'><span class='number-highlight'>"+ event.start_time +"-"+ event.end_time +"</span><small>"+ event.author +"</small></div><div class='grid_5 omega'><span>"+ event.title +"</span></div></li>"
                    };
                });
                roomDiv.find("ul").html(ulHTML)
                
                var more = roomDiv.find("ul li:gt(3)");
                if (more.length > 0) {
                    more.hide();
                    roomDiv.find("ul").append("<li class='more'>...</li>");
                };
            });
            $("#room0,#room1,#room2,#room3").equalizeHeights();
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
            total.find("strong").first().text(roundNumber(data.percent,2) + "%");
            total.find("strong").last().text(roundNumber(data.last_year_percent,2) + "%");
            var arrow = total.find("span.arrow-wrapper").first();
            if(data.percent < 0){
                arrow.addClass("down");
            } else {
                arrow.removeClass("down");
            }
            arrow = total.find("span.arrow-wrapper").last();
            if(data.last_year_percent < 0){
                arrow.addClass("down");
            } else {
                arrow.removeClass("down");
            }
        },
        renderActiveUsersGraph: function(data){
            changeValue($("#online-users"), parseInt(data.stats.visits));
            $("#online-avg").html(parseInt(data.history.people_avg,10));
            $("#online-max").html(data.history.people_max);
            
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
               strHtml += "<li><span class=\"text-highlight\">"+referrer.host+"</span> → <span class=\"title\">"+referrer.title+"</span></li>";
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
        renderSearches: function(data){
            var new_searches = "";
            var current_searches = [];
            
            $("#recent-searches li").each(function(i, elm){
                current_searches[i] = $(elm).html();
            });
            
            data = data.slice(0,5);
            $(data).each(function(i,search){
                var listr = "<span class=\"number-highlight\">→</span> "+search;
                if($.inArray(listr, current_searches) == -1){
                    var li = $("<li/>").html(listr).css("display","none");
                    $("#recent-searches").prepend(li);
                    li.animate({width: 'toggle'});
                }
            });
            $("#recent-searches li:gt(6)").remove()
        }
    };
})();
Dashboard.loader = (function(){
    var loadingQueue = $("body");
    var loadWidget = function(settings){
        $.get(settings.action + ".json", function(data,status){
            Dashboard.app[settings.callback](data);
            if(settings.refreshTime){
                setTimeout(function(){
                    loadWidget(settings);
                },settings.refreshTime);
            }
            settings.element.removeClass("dynamic-loader");
            initWidgets();
        });
    };
    var initWidgets = function(){
        var elements = $(".dynamic-loader");
        if (elements.length > 0 ) {
            var rand = Math.floor(Math.random() * elements.length);
            var element = elements.eq(rand);
            loadWidget({
                "action": element.data("action"),
                "callback": element.data("callback"),
                "refreshTime": element.data("refresh-time"),
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
    $("#slider").easySlider({
		auto: true, 
		pause: 6000,
		controlsShow:false,
		continuous: true
	});

});