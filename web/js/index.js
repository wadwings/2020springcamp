window.onload = function () {
    init();
}
function init(){
    $.get("daily_data/world_confirmed_data.json",function(data,status){
        console.log("数据：" + data + "\n状态：" + status);
    });
}