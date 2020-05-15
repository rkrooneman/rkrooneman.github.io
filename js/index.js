$(document).ready(function () {
    function dateTime() {
        var format = "";
        var ndate = new Date();
        var hr = ndate.getHours();
        var h = hr % 12;

        if (hr < 12) {
            greet = 'morning';
            format = 'AM';
        } else if (hr >= 12 && hr <= 17) {
            greet = 'afternoon';
            format = 'PM';
        } else if (hr >= 17 && hr <= 24)
            greet = 'evening';

        var m = ndate.getMinutes().toString();
        var s = ndate.getSeconds().toString();

        if (h < 12) {
            h = "0" + h;
            $(".day__greet").html(greet);
        } else if (h < 18) {
            $(".day__greet").html(greet);
        } else {
            $(".day__greet").html(greet);
        }

        if (s < 10) {
            s = "0" + s;
        }

        if (m < 10) {
            m = "0" + m;
        }

        $('.date').html(h + ":" + m + ":" + s + format);
    }

    setInterval(dateTime, 1000);


    var app = document.getElementById('app');
    var typewriter = new Typewriter(app, {
        loop: false,
        delay: 75,
    });

    typewriter.typeString('Hello there...')
        .pauseFor(1500)
        .deleteAll()
        .typeString('Good <span class="day__greet"></span>...')
        .pauseFor(1500)
        .deleteAll()
        .typeString('you can scroll down...')
        .pauseFor(1500)
        .deleteAll()
        .typeString('or just stay here...')
        .pauseFor(1500)
        .deleteAll()
        .typeString('how about some 🍣?')
        .pauseFor(1500)
        .deleteAll()
        .typeString('or just a cup of ☕?')
        .pauseFor(1500)
        .start();

});
