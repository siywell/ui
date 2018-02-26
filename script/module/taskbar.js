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

    /**
     * 初始化
     */
    var init = function () {
        siywell = require("siywell");

        initSetting();
        initObject();

        position(setting.position);
        win.resize(function(){
            resize();
        })
    }

    /**
     * 设置位置
     * @param position
     */
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

    /**
     * 重置大小
     */
    var resize = function(){

    }




    /**
     * 任务栏项目
     * @param param
     * @constructor
     */
    var Task = function (param) {
        var self = this;
        Component.call(this);
        var config = {
            title : "" ,
            id : null ,
            icon : null ,
            container : ".taskbar > .task > .list"
        }
        var html = '<div class="item tooltip-helper"><div class="inner"><i class="fa fa-cube"></i></div></div>';
        var object = null;

        var init = function () {
            $.extend(config,param);
            object = $(html);
            object.appendTo(config.container);
            object.data("title",config.title);
            object.click(function (e) {
                self.trigger("click",[e]);
            })
        }

        var close = function () {
            if(object)
                object.remove();
        }

        this.close = close;

        init();
    }

    /**
     * 添加任务栏按钮
     * @param param
     * @returns {Task}
     */
    var addTask = function (param) {
        return new Task(param);
    }




    /**
     * 内部方法
     */
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

    return {
        init : init ,
        position : position ,
        resize : resize ,

        addTask : addTask
    }
});