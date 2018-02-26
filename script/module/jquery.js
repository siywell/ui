define(function (require) {
    var $ = require("jquery");

    var init = function () {
        initDelegate();
    }

    var initDelegate = function () {
        var popup = require("popup");
        var doc = $(document);
        doc.delegate(".btn-popup","click",function (e) {
            var btn = $(this);
            popup.open({
                url : this.href ,
                id : this.target ,
                title : btn.text()
            });
            e.preventDefault();
        })
    }
    
    return {
        init : init
    }
});