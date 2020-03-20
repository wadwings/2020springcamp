window.onload = function () {
    init();
}
function init(){
    $.get("data/test.json",function(data,status){
        console.log("数据：" + data + "\n状态：" + status);
    });
}