// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var recent_pressreleases_array = [];
var recent_pressreleases_index = 0;

$(document).ready(function(){

    var body = $("body")
    
    body.queue(function (next) {
        load_widget("recent_pressreleases",60000, "recent_pressreleases_callback")
        next()
    }) 
    body.queue(function (next) {
        load_widget("recent_checkins",5000)
        next()
    })
    body.queue(function (next) {
        load_widget("total_visits", 1200000)
        next()
    })
    body.queue(function (next) {
        load_widget("signup_journalists", 900000)
        next()
    })
    body.queue(function (next) {
        load_widget("signup_follows",1320000)
        next()
    })
    body.queue(function (next) {
        load_widget("signup_trials",2100000)
        next()
    })
    body.queue(function (next) {
        load_widget("top_searches",1620000)
        next()
    })
    body.queue(function (next) {
        load_widget("top_countries",1800000)
        next()
    })
    
    recent_pressreleases_rotator()

})


/* FORCE RELOAD WHEN CLICK ON WIDGET */
$(".widget").live("click",function(){
    load_widget($(this).attr("id"),0)
})


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
        if (ttl > 0) {
            setTimeout(function(){
                if (callback != undefined ) {
                    load_widget(name,ttl,callback)
                } else {
                    load_widget(name,ttl)
                }
            },ttl);
        };
    });
}

function recent_pressreleases_callback (data) {
    recent_pressreleases_array = $("li", data).get()
}

function recent_pressreleases_rotator() {
    if (recent_pressreleases_index == recent_pressreleases_array.length) {
        recent_pressreleases_index = 0
    };
    
    ul = $("#recent_pressreleases ul")
    li = $(recent_pressreleases_array[recent_pressreleases_index])
    ul.prepend(li)
    
    li.slideDown("slow")
    if ( $("li",ul).length > 3 ) {
        $("li",ul).last().slideUp("slow", function(){
            $(this).remove()
        })
    };
    
    recent_pressreleases_index++;
    setTimeout(function(){
        recent_pressreleases_rotator()
    },7000)
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