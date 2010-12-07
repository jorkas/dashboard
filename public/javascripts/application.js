// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var app_version = ""

var recent_pressreleases_array = [];
var recent_pressreleases_index = 0;
var recent_pressreleases_timeout;

var recent_checkins_array = [];
var recent_checkins_index = 0;

var online_user_images = Array()

jQuery.easing.def = "easeInOutBack";

$(document).ready(function(){

    for (var i=0; i < 72; i++) {
        online_user_images[i] = $("<div>", {
            class: 'users'
        })
    };
    
    elm = $("#online_now");
    elm.html("").append.apply( elm, $.isArray( online_user_images) ? online_user_images : [online_user_images])
    
    var body = $("body")
    
    body.queue(function (next) {
        load_widget("recent_pressreleases",60000, "recent_pressreleases_callback")
        next()
    })
    body.queue(function (next) {
        load_widget("recent_checkins",5000, "recent_checkins_callback")
        next()
    })
    body.queue(function (next) {
        load_widget("total_visits", 1200000)
        next()
    })
    body.queue(function (next) {
        load_widget("analytics_goals", 900000)
        next()
    })
    body.queue(function (next) {
        load_widget("count_pressreleases",30000)
        next()
    })
    body.queue(function (next) {
        load_widget("new_relic",40000)
        next()
    })
    body.queue(function (next) {
        load_widget("top_countries",5000)
        next()
    })
    body.queue(function (next) {
        load_widget("active_visits", 5000, 'active_visits_callback')
        next()
    })
    body.queue(function (next) {
        load_widget("recent_referrers", 5000)
        next()
    })
    body.queue(function (next) {
        load_widget("user_stats", 30000)
        next()
    })
    body.queue(function (next) {
        load_widget("message", 40000, "message_callback")
        next()
    })
    
    recent_pressreleases_rotator()
    check_version()
    
    konami = new Konami()
    konami.code = function() {
        $("article").addClass("party")
        document.getElementById('smb').play();
        do_crazy_shit();
    }
    konami.load()

})


/* FORCE RELOAD WHEN CLICK ON WIDGET */
$(".widget").live("click",function(){
    load_widget($(this).attr("id"),0)
})


function check_version () {
    var old_version = app_version
    
    $.get("/version", function(data){
        app_version = $.trim(data)
        
        if (old_version != app_version && old_version != "") {
            window.location.reload()
        }
    })
    
    setTimeout(function(){
        check_version()
    },50000)
}

function load_widget (name,ttl,callback) {
    $.get("/widgets/"+name, function(data) {
        if (callback != undefined ) {
            var gthis = (function(){return this;})();
            gthis[callback](data)
        } else {
            div = $("#"+name)

            if ( $(".spinner",div).size() > 0) {
                $(".spinner",div).fadeOut('slow', function() {
                    div.html(data);
                });
            }

            div.html(data);
        }
    });
    if (ttl > 0) {
        setTimeout(function(){
            if (callback != undefined ) {
                load_widget(name,ttl,callback)
            } else {
                load_widget(name,ttl)
            }
        },ttl);
    };
}

function message_callback (data) {
    oldmsg = $("#message strong").text()
    newmsg = $("strong", data).text()
    var div = $("#message")
    div.html(data);
    if (oldmsg != newmsg) {
        if (oldmsg != "") {
          div.addClass("newmessage")  
        };
        setTimeout(function(){
            div.removeClass("newmessage")
        }, 15000)
    } else {
        console.log("samma msg som tidigare")
    }
    
    
}

function active_visits_callback (data) {
    now_element = $("#active_visits span.big")
    max_element = $(".visits_max")
    avg_element = $(".visits_avg")
    
    now_value = $(".visits_now",data).text()
    max_value = $(".visits_max",data).text()
    avg_value = $(".visits_avg",data).text()
    
    changeValue(now_element, now_value)

    max_element.text(max_value)
    avg_element.text(avg_value)
    
    // new_width = (now_value/1000)*100
    //     $("#new").animate({width: new_width+"%"},3000)
    
    $(online_user_images).each(function(index){
        $(this).removeClass("active")
    })
    
    for (var i=0; i < (now_value/max_value)*online_user_images.length; i++) {
        $(online_user_images[i]).addClass("active")
    };
}

function recent_pressreleases_callback (data) {
    recent_pressreleases_array = $("li", data).get()
}

function recent_checkins_callback(data) {
    recent_checkins_array = $("li", data).get().reverse()
    ul = $("#recent_checkins ul")
    for (var i=0; i < recent_checkins_array.length; i++) {
        li = $(recent_checkins_array[i])
        id = li.data("id")
        if (id > recent_checkins_index) {
            ul.prepend(li)
            li.slideDown(2000)
            recent_checkins_index = id
        } else {
            old_li = $("li[data-id="+id+"]", ul)
            li.attr("style", null)
            old_li.replaceWith(li)
        }
    };
    
    ul.children().slice(7).remove()
    
}

function recent_pressreleases_rotator() {
    if (recent_pressreleases_index == recent_pressreleases_array.length) {
        recent_pressreleases_index = 0
    };
    
    ul = $("#recent_pressreleases ul")
    li = $(recent_pressreleases_array[recent_pressreleases_index])
    ul.prepend(li)
    
    li.slideDown(1000,'easeOutQuad')
    if ( $("li",ul).length > 1 ) {
        $("li",ul).last().slideUp(1800,'easeOutQuad', function(){
            $(this).remove()
        })
    };
    
    recent_pressreleases_index++;
    recent_pressreleases_timeout = setTimeout(function(){
        recent_pressreleases_rotator()
    },Math.floor((9000-3000)*Math.random()) + 3000)
}

function unique(arrayName) {
    var newArray=new Array();
    label:for(var i=0; i<arrayName.length;i++ )
    {  
        for(var j=0; j<newArray.length;j++ )
        {
            if( $(newArray[j]).text() == $(arrayName[i]).text() ) {
                newArray[j] = arrayName[i]
                continue label;
            }
        }
        newArray[newArray.length] = arrayName[i];
    }
    return newArray;
}

function changeValue (element, new_value) {
    old_value = Number(element.text())
    diff = new_value - old_value
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
}


function do_crazy_shit(element){
    setTimeout(function(){
        do_crazy_shit()
    }, 900)
  if(!element){
    var element = $("html, body, strong, section, header, h2, span");
  }
  element.each(function(index, item){
    animateLikeAMotherFucker(item)
  })

}

function random_colour(){
  var motherFuckingRed = Math.floor(Math.random()*256).toString(16);
  var motherFuckingGreen = Math.floor(Math.random()*256).toString(16)
  var motherFuckingBlue = Math.floor(Math.random()*256).toString(16)
  var ohYeahNeedAHashInFront = "#";
  return ohYeahNeedAHashInFront + motherFuckingRed + motherFuckingGreen + motherFuckingBlue
}

function animateLikeAMotherFucker (element){
    try {
        $(element).stop().animate({
          backgroundColor: random_colour(),
          color: random_colour()
        }, 1500)
    } catch(err) {}
}