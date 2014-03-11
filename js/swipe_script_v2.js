(function ($) {
    var con = $("#content"); // element wrapper
    var _el = $(".view"); // view element
    var _elPos = [0, 100, 200, 300, -300, -200, -100]; // element position(default)
    var swipableDistance = 100; // allowed swiping distance for action
    var el_size = _elPos.length; // element size
    var duration = 200; // animated duration.

    var next = -100;
    var prev = 100;

    var currentPage = 6; // get from the server

    /**
    * Get element position according with current page number
    * @param : index {number}
    */
    var diff = [0, 100, 200, 300, -300, -200, -100];
    function getPosition(index) {
        var cnt = 0;
        for(var k=index;k<7;k++){
            _elPos[k] = diff[cnt];
            cnt++;
        }

        for(var j=0;j<=index-1;j++){
            _elPos[j] = diff[cnt];
            cnt++;
        }   
    }

    /**
    * set each element position which was modified.
    *
    */
    function setPosition() {
        for(var i=0,len=_elPos.length;i<len;i++)
            _el.eq(i).css("left", _elPos[i] + "%")
    }

    /**
    * vitalize current view element
    * parameter index {number} : current page number
    */
    function checkPosition(index) {
        for(var i=0;i<7;i++)
            _el.eq(i).css("position", "absolute");
        _el.eq(index).css("position","relative");

        // check whether call data or not
        if(_el.eq(index).attr("data-staus") == 0)
            callData(index);

    }

    /**
    * call data by ajax, insert into element, change data-staus
    * @ paramter index {number} / current page number
    */
    function callData(index) {
        console.log("call ajax from the server for view " + index);
        _el.eq(index).attr("data-staus", 1);
    }

    /**
    * @ prev action
    * No parameter / right
    */
    function prevAction() {
        for(var i=0;i<el_size;i++){

            // update position
            if(_elPos[i] >= 300) {
                _elPos[i] = -300;
                _el.eq(i).css({"left" : _elPos[i] + "%"});
            } else if(_elPos[i] < 300) {
                _elPos[i] = _elPos[i] + prev;
                _el.eq(i).stop().animate({"left" : _elPos[i] + "%"}, duration);
            }
        }

        if(currentPage > 0)
            currentPage--;
        else
            currentPage = 6;

        checkPosition(currentPage);
        console.log(currentPage);
        console.log("go right");
        return false;
    }

    /**
    * @ next action
    * No parameter / left
    */
    function nextAction() {
        for(var i=0;i<el_size;i++){

            // update position
            if(_elPos[i] <= -300) {
                _elPos[i] = 300;
                _el.eq(i).css({"left" : _elPos[i] + "%"});
            } else {
                _elPos[i] = _elPos[i] + next;
                _el.eq(i).stop().animate({"left" : _elPos[i] + "%"}, duration);    
            }
        }

        if(currentPage < 6)
            currentPage++;
        else
            currentPage = 0;

        checkPosition(currentPage);
        console.log(currentPage);
        console.log("go left");
        return false;
    }


    /**
    * @ go to the Top
    * @param {Number} : speed
    */
    function goToTop(speed) {
        $("html,body").animate({scrollTop : 0}, speed);
    }


    /**
    * @ swipe action
    * jQuery plugin
    */
    $("#content").swipe({
        swipeStatus:function(event, phase, direction, distance, duration, fingers)
        {
            if(phase === "end" && distance > swipableDistance) {
                if(direction !== "up" && direction !== "down") {
                    if(direction === "right") {
                        // right action!
                        prevAction();
                    } else if(direction === "left") {
                        // left action!
                        nextAction();
                    }
                }
            }
        },
        allowPageScroll : "vertical"
    });

    // initiate
    window.onload = function () {
        getPosition(currentPage);
        setPosition();
        checkPosition(currentPage);

    };
}(jQuery));