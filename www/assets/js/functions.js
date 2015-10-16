//init every page
function appInit() {
    $.support.cors = true;
    $("a").attr('data-ajax', false);
}

function storageInit() {
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
            blindLogout();
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
        }, 500, 'easeOutExpo');
        $('#navbar-height-col').stop().transit({
            left: selected ? slideneg : '0px'
        }, 500, 'easeOutExpo');
        $(pagewrapper).stop().transit({
            left: selected ? '0px' : slidewidth
        }, 500, 'easeOutExpo');
        $(navigationwrapper).stop().transit({
            left: selected ? '0px' : slidewidth
        }, 500, 'easeOutExpo');
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

function updateData(data) {
    window.localStorage.setItem("userdata", JSON.stringify(data.userdata));
    window.localStorage.setItem("dogdata", JSON.stringify(data.dogdata));
}


function appLogout() {
    var devid = window.localStorage.getItem("deviceid");
    window.plugins.spinnerDialog.show("กำลังออกจากระบบ...", "กรุณารอสักครู่", true);
    $.ajax({
        type: 'POST',
        url: api + "auth/logout.php",
        data: {"token": token, "device_id": devid},
        dataType: 'json',
        success: function (data) {
            setTimeout(function () {
                window.plugins.spinnerDialog.hide();
                window.localStorage.clear();
                var options = {
                    "direction": "down",
                    "duration": 500, // in milliseconds (ms), default 400
                    "androiddelay": 70, // same as above but for Android, default 70,
                    "href": "index.html"
                };
                window.plugins.nativepagetransitions.slide(
                        options
                        );
            }, 1000);
        }
    });
}

function blindLogout() {
    $("#nav-logout").on("click", function (e) {
        appLogout();
    });
}

function notificationRegister() {
    pushNotification = window.plugins.pushNotification;
    pushNotification.register(notificationListener, function () {
        alert("GCM Registration Error");
    },
            {
                "senderID": "908885041726",
                "ecb": "notificationListener"
            }
    );
}

function notificationListener(e) {

    switch (e.event) {
        case 'registered':
            if (e.regid.length > 0) {
                //save regid to db
                window.localStorage.setItem("deviceid", e.regid);
                $.ajax({
                    url: api + "auth/registerDevice.php",
                    type: "POST",
                    data: {"token": token, "deviceid": e.regid},
                    dataType: "html",
                    success: function (returndata) {
                    }
                });
            }
        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground) {
                navigator.notification.beep(1);
                var message = e.payload.message;
                var title = e.payload.title;
                var type = e.payload.type;
                var typedata = e.payload.typedata;
                if (type == "pm") {
                    navigator.notification.confirm(
                            message, // message
                            function (buttonIndex) {
                                if (buttonIndex == 1) {
                                    createLoader();
                                    document.location = "pm.html";
                                }
                            },
                            title, // title
                            ['ดูข้อความ', 'ปิด']     // buttonLabels
                            );
                } else if (type == "request") {
                    navigator.notification.confirm(
                            message, // message
                            function (buttonIndex) {
                                if (buttonIndex == 1) {
                                    createLoader();
                                    document.location = "main.html";
                                }
                            },
                            title, // title
                            ['ดูประกาศ', 'ปิด']     // buttonLabels
                            );
                } else if (type == "donator") {
                    navigator.notification.confirm(
                            message, // message
                            function (buttonIndex) {
                                if (buttonIndex == 1) {
                                    createLoader();
                                    document.location = "donor_status.html";
                                }
                            },
                            title, // title
                            ['ดูสถานะ', 'ปิด']     // buttonLabels
                            );
                } else if (type == "requester") {
                    navigator.notification.confirm(
                            message, // message
                            function (buttonIndex) {
                                if (buttonIndex == 1) {
                                    createLoader();
                                    document.location = "requestor_show.html";
                                }
                            },
                            title, // title
                            ['ดูการขอเลือด', 'ปิด']     // buttonLabels
                            );
                } else if (type == "confirmalert") {
                    navigator.notification.confirm(
                            message, // message
                            function (buttonIndex) {
                                if (buttonIndex == 1) {
                                    createLoader();
                                    document.location = "confirmList.html";
                                }
                            },
                            title, // title
                            ['ดูการยืนยันผู้บริจาค', 'ปิด']     // buttonLabels
                            );
                }
            }
            else {  // otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart) {
                    var message = e.payload.message;
                    var title = e.payload.title;
                    var type = e.payload.type;
                    var typedata = e.payload.typedata;
                    if (type == "pm") {
                        createLoader();
                        document.location = "pm.html";
                    } else if (type == "request") {
                        createLoader();
                        document.location = "main.html";
                    } else if (type == "donator") {
                        createLoader();
                        document.location = "donor_status.html";
                    } else if (type == "requester") {
                        createLoader();
                        document.location = "requestor_show.html";
                    } else if (type == "confirmalert") {
                        createLoader();
                        document.location = "confirmList.html";
                    }
                } else {
                    if (e.payload != null) {
                        var message = e.payload.message;
                        var title = e.payload.title;
                        var type = e.payload.type;
                        var typedata = e.payload.typedata;
                        if (type == "pm") {
                            createLoader();
                            document.location = "pm.html";
                        } else if (type == "request") {
                            createLoader();
                            document.location = "main.html";
                        } else if (type == "donator") {
                            createLoader();
                            document.location = "donor_status.html";
                        } else if (type == "requester") {
                            createLoader();
                            document.location = "requestor_show.html";
                        } else if (type == "confirmalert") {
                            createLoader();
                            document.location = "confirmList.html";
                        }
                    }
                }
            }
            break;
    }
}

function onConfirm(buttonIndex) {
    alert('You selected button ' + buttonIndex);
}

function onDeviceReady() {
    notificationRegister();
}
