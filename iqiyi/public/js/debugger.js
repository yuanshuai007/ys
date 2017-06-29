$ = function(a){return document.getElementById(a);};
function ajax(method,url,data,success){
    var xhr=new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        //连接服务器成功
        if(xhr.readyState===4&&xhr.status===200){
            //console.log("与服务器连接成功");
            if(success!=undefined){
                success(xhr);
            }
            else{
                console.log("没有传入成功函数");
            }
            //eval(xhr.responseText);
            //success(xhr);
        }
    };
    if(arguments[0]==="get"){
        xhr.open("get",url,true);
        xhr.send(null);
    }
    else if(arguments[0]==="post"){
        xhr.open("post",url,true);
        xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
        xhr.send(data);
    }
    else{
        console.log("第一个参数必须是get或是post");
        return;
    }
}

// Debugger for demo
var tests = {
    //对应按钮的id  文件的路径
    "test-6": "test/comment.xml",
};

var debugs = {
    "preset-1-run": "cm.filter.addModifier(function(cmt){if(cmt.pool === 0) return null; return cmt;})",
    "preset-2-run": "cm.filter.setRuntimeFilter(function(cmt){if(cmt.hasSet) return cmt; cmt.hasSet = true; cmt.onclick = function(){if(!this.hold){this.hold = true;this.style.border=\"1px solid #ff0\";this.style.zIndex =\"9999\"; this.style.backgroundColor=\"#000\";}else{this.hold = false;this.style.border=\"0px\";this.style.backgroundColor=\"\";}}; return cmt;});",
    "preset-3-run": "cm.filter.addModifier(function(cmt){cmt.border = true; return cmt;})",
};

var state = {
    "format": "hrf",
    "cw": "p-main",
    "mode": "timer",
};

var CCLDBG = new function () {
    var x = 0;
    var profiles = [];
    var pmax = 0;
    var smax = 0;
    var sample = 0;
    var avg = 0;
    this.reset = function () {
        profiles = [];
        x = 0;
        pmax = 0;
        avg = 0;
        sample = 0;
    };
    this.profiler = function () {
        var t = (new Date()).getTime();
        var tdiff = t - x;
        if (tdiff < 10) {
            return;
        }
        sample++;
        if (sample % 100 == 0) {
            sample = 0;
            profiles.push(-1);
        }
        if (tdiff < 5000) {
            avg += tdiff / 300;
            profiles.push(tdiff);
            if (tdiff > pmax) {
                pmax = tdiff;
            }
            if (tdiff > smax) {
                smax = tdiff;
            }
            if (profiles.length > 300) {
                var del = profiles.shift();
                avg -= del / 300;
            }
        }
        x = t;
    };
    this.render = function () {
        if (smax > avg * 4) {
            smax = Math.round(avg * 4)
        }
        var ctx = $("profiler").getContext("2d");
        if (ctx != null) {
            ctx.fillStyle = "#00FFFF";
            ctx.clearRect(0, 0, 300, 40);
            for (var i = 0; i < profiles.length; i++) {
                if (profiles[i] < 0) {
                    ctx.fillStyle = "#FF00FF";
                    ctx.fillRect(i, 0, 1, 40);
                    ctx.fillStyle = "#00FFFF";
                    continue;
                }
                var barh = Math.round((profiles[i] / (smax + 5)) * 40);
                if (barh <= 40) {
                    ctx.fillRect(i, 40 - barh, 1, barh);
                } else {
                    ctx.fillStyle = "#FFFF00";
                    ctx.fillRect(i, 40 - barh, 1, barh);
                    ctx.fillStyle = "#00FFFF";
                }
            }
            ctx.fillStyle = "#FF0000";
            ctx.fillRect(0, 40 - Math.round(avg / (smax + 5) * 40), 300, 1);
            ctx.fillStyle = "#00FFFF";
        }
        ;
        $("pf-stats").innerHTML = "AVG:" + Math.round(avg) + "<br>" + "MAX:" + pmax + "<br>FPS:" + (avg > 0 ? Math.round(1000 / avg) : 0);
    };
    this.getProfiles = function () {
        return profiles;
    };
    var self = this;
    var t = -1;
    ;
    this.on = function () {
        if (t > 0)
            return;
        t = setInterval(function () {
            self.render();
        }, 150);
        $("profiler-start").style.color = "#0ff";
    };
    this.off = function () {
        if (t < 0)
            return;
        clearInterval(t);
        t = -1;
        $("profiler-start").style.color = "";
        $("pf-stats").innerHTML = "PF:OFF";
    };
    this.isOn = function () {
        return t >= 0;
    };
};

//给各种按钮绑定点击事件
function bind() {
    window.cm = new CommentManager($('commentCanvas'));
    cm.init();

    var tmr = -1;
    var start = 0;
    var playhead = 0;

    //绑定键盘事件
    $("w-main").addEventListener("keydown", function (k) {
        if (k) {
            if (k.keyCode === 70) {
                state.format = (state.format === "hrf" ? "std" : "hrf");
            } else if (k.keyCode === 32) {
                if (tmr < 0) {
                    resume();
                } else {
                    stop();
                }
            } else if (k.keyCode === 66) {
                $("player").style.backgroundColor = "#000"; //b
                $("c-region").style.color = "#fff";
            } else if (k.keyCode === 87) {
                $("player").style.backgroundColor = "#fff"; //w
                $("c-region").style.color = "#000";
            } else if (k.keyCode === 82) {
                var x = prompt("Resize player window (WxH or 'old','new')");
                if (x) {
                    if (x === "new")
                        x = "672x438";
                    if (x === "old")
                        x = "512x384";
                    var wh = x.split("x");
                    var w = parseInt(wh[0]);
                    var h = parseInt(wh[1]);
                    if (w > 0 && h > 0) {
                        $("player").style.height = h + "px";
                        $("player-unit").style.width = w + "px";
                        if (cm)
                            cm.setBounds();
                    }
                }
            } else if (k.keyCode === 80) { //p
                if (CCLDBG.isOn()) {
                    CCLDBG.off();
                    cm.filter.setRuntimeFilter(null);
                } else {
                    CCLDBG.on();
                    cm.filter.setRuntimeFilter(function (cmt) {
                        CCLDBG.profiler();
                        return cmt;
                    });
                }
            }
        }
    });

    window.isDebugRunning = function () {
        return tmr >= 0 || !$("abpVideo").paused;
    };

    function stop() {
        if (state.mode === "timer") {
            cm.stopTimer();
            $("control-status").className = "status";
            clearInterval(tmr);
            tmr = -1;
        } else {
            $("abpVideo").pause();
        }
    }

    function resume() {
        if (state.mode !== "timer") {
            $("abpVideo").play();
            return;
        }
        if (tmr !== -1)
            return;
        $("control-status").className = "status active";
        cm.startTimer();
        start = new Date().getTime() - playhead;
        tmr = setInterval(function () {
            playhead = new Date().getTime() - start;
            displayTime(playhead);
            cm.time(playhead);
        }, 42);
    }

    /** Load **/
    //加载文档
    //调用loadDM的只传了一个参数
    window.loadDM = function (dmf, provider) {
        //console.log("loadDM");
        if (provider == null)
            provider = 'bilibili';
        cm.clear();
        start = 0;
        try {
            clearTimeout(tmr);
        } catch (e) {
        }
        if (trace) {
            trace("Loading " + dmf + " : " + provider);
        }
        //加载文档      url        cm   不需要
        //改写这里就可以了--发起请求(socket)cm.load(json);
        (function () {
            //CommentLoader('../' + dmf, cm, provider);
            var success=function(xhr){
                //json数据转数组
                var arr=JSON.parse(xhr.responseText);
               // console.log(xhr.responseText);
                cm.load(arr);
            }
            ajax(
                "get",
                "/danmu_init",//请求的地址
                null,
                success
            );
            // var list = [
            //     {
            //         border:false,
            //         color:16777215,
            //         date:1307940958,
            //         dbid:30723621,
            //         hash:"Da9e216f",
            //         mode:1,
            //         pool:0,
            //         position:"absolute",
            //         size:25,
            //         stime:3000,
            //         text:"神啊，知道，二次元的世界吗~~↵"
            //     }
            // ]
            // ;
        }());

        cm.startTimer();
        //$("control-status").className = "status active";
        if (state.mode !== "timer") {
            $("abpVideo").play();
            return;
        }
        start = new Date().getTime();
        tmr = setInterval(function () {
            playhead = new Date().getTime() - start;
            cm.time(playhead);
        }, 42);
    };

    var isWindowedFullscreen = false;

    function launchFullScreen(element) {
        cm.setBounds();
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullscreen) {
            element.mozRequestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
    }

    function launchWindowFull(element, e2) {
        if (!isWindowedFullscreen) {
            element.style.position = "fixed";
            element.style.top = "0";
            element.style.bottom = "0";
            element.style.left = "0";
            element.style.right = "0";
            element.style.width = "auto";
            element.style.height = "auto";
            e2.style.height = "100%";
        } else {
            element.style.position = "";
            element.style.top = "";
            element.style.bottom = "";
            element.style.left = "";
            element.style.right = "";
        }
        isWindowedFullscreen = !isWindowedFullscreen;
    }

    // Add Fullscreen Handlers
    var fs = function () {
        cm.setBounds();
    };
    document.addEventListener("fullscreenchange", fs);
    document.addEventListener("webkitfullscreenchange", fs);
    document.addEventListener("mozfullscreenchange", fs);
}

//给各种test绑定点击事件
// function bindTests() {
//     //改写test-6
//     $("test-6").addEventListener("click", (function () {
//         //value
//         var url = tests["test-6"];
//         return function () {
//             if (typeof url === "string") {
//                 loadDM(url);
//             } else {
//                 loadDM(url.f, url.p);
//             }
//         }
//     })());
// }

function bindResize() {
    var sX = 0, sY = 0;
    var iX = 0, iY = 0;
    var isDownTB = false;
    var isDownLR = false;
    document.addEventListener("dblclick", function () {
        isDownTB = false;
        isDownLR = false;
    });
    document.addEventListener("mousemove", function (e) {
        if (isDownTB) {
            var yDelta = e.clientY - sY;
            $("player").style.height = (iY + yDelta) + "px";
            $("c-region").innerHTML = iX + "x" + (iY + yDelta);
        } else if (isDownLR) {
            var xDelta = e.clientX - sX;
            $("player-unit").style.width = (iX + xDelta) + "px";
            $("c-region").innerHTML = (iX + xDelta) + "x" + iY;
        }
    });
    document.addEventListener("mouseup", function (e) {
        if ((isDownTB || isDownLR)) {
            if (trace) {
                trace("Resize to " + $("commentCanvas").offsetWidth + "x" + $("commentCanvas").offsetHeight);
            }
            cm.setBounds();
            $("commentCanvas").style.border = "0px";
            $("c-region").style.display = "none";
            cm.setBounds();
        }
        isDownTB = false;
        isDownLR = false;
    });
};

function bindDebugger() {
    var output = $("debugger-output");

    function trace(msg) {
        if (typeof msg === "object") {
            var obj = {};
            for (var field in msg) {
                if (typeof msg[field] !== "function") {
                    obj[field] = msg[field].toString();
                } else {
                    obj[field] = "[function Function]";
                }
            }
            msg = JSON.stringify(obj, undefined, 2);
        } else if (msg === undefined) {
            msg = "[undefined]";
        } else if (typeof msg !== "string") {
            msg = msg.toString();
        }
        var lines = msg.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;").split("\n");
        output.innerHTML = lines.join("<br>") + "<br>" + output.innerHTML;
    };
    window.trace = trace;
};

function bindVideo(video, cm) {
    video.addEventListener("timeupdate", function () {
        if (cm.display === false) return;
        if (video.hasStalled) {
            cm.startTimer();
            video.hasStalled = false;
        }
        cm.time(Math.floor(video.currentTime * 1000));
        displayTime(Math.floor(video.currentTime * 1000));
    });
    video.addEventListener("play", function () {
        cm.startTimer();
    });
    video.addEventListener("pause", function () {
        cm.stopTimer();
    });
    video.addEventListener("waiting", function () {
        cm.stopTimer();
    });
    video.addEventListener("playing", function () {
        cm.startTimer();
    });
};

window.addEventListener("load", function () {
    bind();
    //bindTests();
    bindResize();
    bindDebugger();
    //弹幕初始化
    loadDM();
});