window.onload = function () {
    init();
}

w_conf = $.getJSON("daily_data/world_confirmed_data.json",function(status){
    console.log(status);
});
w_death = $.getJSON("daily_data/world_deaths_data.json",function(status){
    console.log(status);
});

function init(){
    for(key in w_conf.responseJSON){
        var name = key;
        var conf = w_conf.responseJSON[key][w_conf.responseJSON[key].length - 1];
        if(w_death.responseJSON[key].length > 0)
            var death = w_death.responseJSON[key][w_death.responseJSON[key].length - 1];
        var div = document.createElement("div");
        div.className = "relative";
        var para1 = document.createElement("p");
        para1.innerHTML = name;
        para1.className = "left"
        div.appendChild(para1);
        var para2 = document.createElement("p");
        para2.className = "mid"
        para2.innerHTML = conf;
        div.appendChild(para2);
        var para3 = document.createElement("p");
        para3.className = "right"
        para3.innerHTML = death;
        div.appendChild(para3);
        $(".world")[0].appendChild(div);
    }
    var time = new Date();
    $("#time").append(time.toDateString());
    var i = w_conf.responseJSON.China[w_conf.responseJSON.China.length - 1];
    $("#q1").append(i);
    var i = w_death.responseJSON.China[w_death.responseJSON.China.length - 1];
    $("#q2").append(i);
    var i = w_conf.responseJSON.China[w_conf.responseJSON.China.length - 1] - w_conf.responseJSON.China[w_conf.responseJSON.China.length - 2];
    $("#q3").append(i);
    var i = w_death.responseJSON.China[w_death.responseJSON.China.length - 1] - w_death.responseJSON.China[w_death.responseJSON.China.length - 2];
    $("#q4").append(i);
    var i = w_conf.responseJSON.World[w_conf.responseJSON.World.length - 1];
    $("#w1").append(i);
    var i = w_death.responseJSON.World[w_death.responseJSON.World.length - 1];
    $("#w2").append(i);
    var i = w_conf.responseJSON.World[w_conf.responseJSON.World.length - 1] - w_conf.responseJSON.World[w_conf.responseJSON.China.length - 2];
    $("#w3").append(i);
    var i = w_death.responseJSON.World[w_death.responseJSON.World.length - 1] - w_death.responseJSON.World[w_death.responseJSON.China.length - 2];
    $("#w4").append(i);
}

function world(){
    if ($(".world")[0].style.transform == "none")
        $(".world")[0].setAttribute("style","transition: 0.5s;");
    else
        $(".world")[0].setAttribute("style","transform:none; transition: 0.5s;");   
}
