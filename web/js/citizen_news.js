window.onload = function(){
    init();
}

function init(){
    $.ajaxSettings.async = false;
    web_data = $.getJSON("data/modifier.json");
    for (var i = 0; i < web_data.responseJSON.citizen.length; i++){
        var div = document.createElement("div");
        div.className = "data";
        var a = document.createElement("a");
        a.innerHTML = web_data.responseJSON.citizen[i].Title;
        a.href = web_data.responseJSON.citizen[i].Url;
        div.appendChild(a);
        $(".container")[0].appendChild(div);
    }
}