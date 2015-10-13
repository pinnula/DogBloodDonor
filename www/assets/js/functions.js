//init every page
function appInit() {
    $.support.cors = true;
    $("a").attr('data-ajax', false);
}

function stroageInit() {
    token = window.localStorage.getItem("token");
    userdata = JSON.parse(window.localStorage.getItem("userdata"));
    dogdata = JSON.parse(window.localStorage.getItem("dogdata"));
}

function addNavBar() {
    $.ajax({
        type: 'GET',
        url: 'include/navbar.html',
        dataType: 'html',
        success: function (data) {
            $("body").prepend(data);
            navBarInit();
            navHandler();
        }
    });
}

function navBarInit() {
    //call only if after addNavBar Success callback
    //stick in the fixed 100% height behind the navbar but don't wrap it
    $('#slide-nav.navbar-inverse').after($('<div class="inverse" id="navbar-height-col"></div>'));
    $('#slide-nav.navbar-default').after($('<div id="navbar-height-col"></div>'));
    // Enter your ids or classes
    var toggler = '.navbar-toggle';
    var pagewrapper = '#page-content';
    var navigationwrapper = '.navbar-header';
    var menuwidth = '120%'; // the menu inside the slide menu itself
    var slidewidth = '80%';
    var menuneg = '-100%';
    var slideneg = '-80%';
    $("#slide-nav").on("click", toggler, function (e) {
        var selected = $(this).hasClass('slide-active');
        $('#slidemenu').stop().transit({
            left: selected ? menuneg : '0px'
        }, 300, 'easeOutExpo');
        $('#navbar-height-col').stop().transit({
            left: selected ? slideneg : '0px'
        }, 300, 'easeOutExpo');
        $(pagewrapper).stop().transit({
            left: selected ? '0px' : slidewidth
        }, 300, 'easeOutExpo');
        $(navigationwrapper).stop().transit({
            left: selected ? '0px' : slidewidth
        }, 300, 'easeOutExpo');
        $(this).toggleClass('slide-active', !selected);
        $('#slidemenu').toggleClass('slide-active');
        //$('#page-content, .navbar, body, .navbar-header').toggleClass('slide-active');
        $("body").toggleClass("slide-active");
    });
    var selected = '#slidemenu, #page-content, body, .navbar, .navbar-header';
}

function displayName() {
    //show in navbar, called after navBarInit only
    setTimeout(function () {
        $("#showname").html("<b>" + userdata.firstname + " " + userdata.lastname + "</b>");
        if (userdata.user_image != null) {
            $("#userimgtag").attr("src", userimage + userdata.user_image);
        } else {
            $("#userimgtag").attr("src", "assets/images/user.png");
        }
    }, 300);
}

function pmBadge() {
    var unread = 0;
    $.ajax({
        type: "POST",
        url: api + "pm/pm_threadshow.php",
        data: {"token": token},
        dataType: 'json',
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].isRead === false)
                    ++unread;
            }
            if (unread > 0)
                $(".badge").html(unread);
        }
    });
}

//function to disabled device's back button
function disableBackButton() {
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        document.addEventListener("backbutton", function (e) {
            e.preventDefault();
        }, false);
    }
}

function setTitle(title) {
    setTimeout(function () {
        $(".navbar-brand").transit({"x": "+=500", "opacity": 0}, 1).transit({"x": "-=500", "opacity": 1}, 500, 'easeOutExpo');
        $(".navbar-brand").html(title);
    }, 300);
}

//nav link animation test
function navHandler() {
    $(".navlink").on("click", function (e) {
        var toggler = '.navbar-toggle';
        var pagewrapper = '#page-content';
        var navigationwrapper = '.navbar-header';
        var menuwidth = '100%'; // the menu inside the slide menu itself
        var slidewidth = '80%';
        var menuneg = '-100%';
        var slideneg = '-80%';
        var selected = $(toggler).hasClass('slide-active');
        $('#slidemenu').stop().transit({
            left: selected ? menuneg : '0px'
        });
        $('#navbar-height-col').stop().transit({
            left: selected ? slideneg : '0px'
        });
        $(pagewrapper).stop().transit({
            left: selected ? '0px' : slidewidth
        });
        $(navigationwrapper).stop().transit({
            left: selected ? '0px' : slidewidth
        });
        $(toggler).toggleClass('slide-active', !selected);
        $('#slidemenu').toggleClass('slide-active');
        //$('#page-content, .navbar, body, .navbar-header').toggleClass('slide-active');
        $("body").toggleClass("slide-active");


        var id = $(this).attr("id");
        if (!$("#" + id).parent("li").hasClass("active")) {
            var link = $(this).attr("href");
            console.log(link);
            createLoader();
            setTimeout(function () {
                var options = {
                    "duration": 100, // in milliseconds (ms), default 400
                    "androiddelay": 70, // same as above but for Android, default 70,
                    "href": link
                };
                window.plugins.nativepagetransitions.fade(
                        options
                        );
            }, 600);

            clearMenu();
        }
        setMenu(id);
        e.preventDefault();
        return false;
    });
}


function createLoader() {
    $("body").prepend('<div id="loader"><img src="assets/images/loader2.gif"></div>');
    $("#loader").transit({"opacity": 1, "delay": 200}, 400);
}

function removeLoader() {
    $("#loader").transit({"opacity": 0}, 1000, function () {
        $("#loader").remove();
    });
}

function setMenu(menuid) {
    setTimeout(function () {
        $("#" + menuid).parent("li").addClass("active");
    }, 300);
}

function clearMenu() {
    $("li").removeClass("active");
}

function setStatusBar() {
    if (cordova.platformId == 'android') {
        StatusBar.backgroundColorByHexString("#ac2925");
    }
}

function updateData() {
    $.ajax({
        type: 'POST',
        url: 'https://dogblooddonor.in.th/api/checklogin.php',
        dataType: 'json',
        data: {'token': token},
        success: function (data) {
            if (data.status == 1) {
                window.localStorage.setItem("userdata", JSON.stringify(data.userdata));
                window.localStorage.setItem("dogdata", JSON.stringify(data.dogdata));
                window.localStorage.setItem("requestdata", JSON.stringify(data.requestdata));
                window.localStorage.setItem("donatedata", JSON.stringify(data.donatedata));
            }
        }
    });
}