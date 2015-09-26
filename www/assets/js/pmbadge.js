var token = window.localStorage.getItem("token");
var unread = 0;
$.ajax({
    type: "POST",
    url: "https://dogblooddonor.in.th/api/pm/pm_threadshow.php",
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
