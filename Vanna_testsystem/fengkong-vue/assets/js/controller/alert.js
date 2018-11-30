function alert(e){
    $("body").append("<div id='msg'><span>"+e+"</span></div>");
    clearmsg();
}
function clearmsg(){
    var t = setTimeout(function(){
        $("#msg").remove();
    },2000)
};