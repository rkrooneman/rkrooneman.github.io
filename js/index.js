$(document).ready(function () {
    function dateTime() {
        var hr = ndate.getHours();
        var h = hr % 12;

        if (hr < 12) {
            greet = 'Good morning...';
            format = 'AM';
        } else if (hr >= 12 && hr <= 17) {
            greet = 'Good afternoon...';
            format = 'PM';
        } else if (hr >= 17 && hr <= 24)
            greet = 'Good evening...';

        if (h < 12) {
            h = "0" + h;
            $("strong.day__greet").html(greet);
        } else if (h < 18) {
            $("strong.day__greet").html(greet);
        } else {
            $("strong.day__greet").html(greet);
        }

    }

    setInterval(dateTime, 1000); 
});

var app = document.getElementById('app');
var typewriter = new Typewriter(app, {
    loop: false,
    delay: 75,
});

typewriter.typeString('Hello there...')
    .pauseFor(1500)
    .deleteAll()
    .typeString('Good <strong class="day__greet></strong>"')
    .pauseFor(1500)
    .deleteAll()
    .typeString('please come closer...')
    .pauseFor(1500)
    .deleteAll()
    .typeString('or scroll down...')
    .pauseFor(1500)
    .deleteAll()
    .typeString('Coffee?')
    .pauseFor(1500)
    .start();
