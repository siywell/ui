define(function (require) {
    var $ = require("jquery");
    var siywell = null;

    var body = null;
    var win = null;
    var obj = {
        taskbar : null ,
        btnStart : null ,
        task : null ,
        taskList : null ,
        taskNav : null ,
        btnPrevList : null ,
        btnNextList : null ,
        tray : null ,
        showDesktop : null
    }

    var setting = {
        position : "left"
    }

    var init = function () {
        siywell = require("siywell");

        initSetting();
        initObject();

        position(setting.position);
        win.resize(function(){
            resize();
        })
    }

    var initSetting = function(){
        $.extend(setting,siywell.setting.taskbar);
    }

    var initObject = function(){
        body = $("body");
        win = $(window);
        obj.taskbar = $(".taskbar");
        obj.btnStart = obj.taskbar.find(".btn-start");
        obj.task = obj.taskbar.find(".task");
        obj.taskList = obj.task.find(".list");
        obj.taskNav = obj.task.find(".nav");
        obj.btnPrevList = obj.taskNav.find(".btn-prev");
        obj.btnNextList = obj.taskNav.find(".btn-next");
        obj.tray = obj.taskbar.find(".tray");
        obj.showDesktop = obj.taskbar.find(".show-desktop");
    }

    var position = function(position){
        setting.position = position;
        var type = "horizontal";
        if(position == "left" || position == "right")
            type = "vertical";
        body.removeClass("taskbar-left");
        body.removeClass("taskbar-right");
        body.removeClass("taskbar-bottom");
        body.removeClass("taskbar-top");
        body.removeClass("taskbar-horizontal");
        body.removeClass("taskbar-vertical");

        body.addClass("taskbar-" + position);
        body.addClass("taskbar-" + type);
        resize();
    }

    var resize = function(){

    }

    return {
        init : init ,
        position : position
    }
});