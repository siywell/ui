define(function (require) {
    var $ = require("jquery");
    var siywell = null;

    var setting = {};

    var object = {
        background : null ,
        helper : null ,
        inner : null
    }

    var win = null;
    var img = null;

    var init = function(){
        siywell = require("siywell");
        initSetting();
        initObject();
        //设置壁纸
        setFile(setting.file);
        win.resize(function(){
            resize();
        })
    }

    var initObject = function(){
        win = $(window);
        object.background = $(".background");
        object.helper = object.background.find(".helper");
        object.inner = object.background.find(".inner");
    }

    var setFile = function(file){
        object.helper.html("<img/>");
        img = object.helper.find("img");
        img.get(0).onload = function(){
            resize();
        }
        img.attr("src",file);
        setting.file = file;
        updateSetting();
    }

    var setColor = function(color){
        setting.color = color;
        updateSetting();
    }

    var initSetting = function(){
        $.extend(setting,siywell.setting.background);
    }

    var updateSetting = function(){
        siywell.setting.background = setting;
        siywell.trigger("setting.change");
    }

    var resize = function(){
        if(!img) return;
        img.removeAttr("style");
        if(img.width() < win.width()){ //如果宽度小与浏览器
            img.css("width",win.width() + "px").css("height","auto");
            if(img.height() < win.height()){
                img.css("height",win.height() + "px").css("width","auto");
            }
        }else if(img.height() < win.height()){
            img.css("height",win.height() + "px").css("width","auto");
        }
        object.inner.width(img.width());
        object.inner.height(img.height());
        object.inner.css("background-image","url("+setting.file+")");
        center();
    };

    var center = function(){
        object.inner.css("left",(win.width() - object.inner.width() ) / 2 + "px");
        object.inner.css("top",(win.height() - object.inner.height() ) / 2 + "px");
    }

    return {
        init : init ,
        setFile : setFile ,
        setColor : setColor
    }
});