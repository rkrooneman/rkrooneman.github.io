$(document).ready(function () {
    function dateTime() {
        var format = "";
        var ndate = new Date();
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
    .typeString('')
    .pauseFor(1500)
    .deleteAll()
    .typeString('Please come closer...')
    .pauseFor(1500)
    .deleteAll()
    .typeString('or scroll down...')
    .pauseFor(1500)
    .deleteAll()
    .typeString('Coffee?')
    .pauseFor(1500)
    .start();
    
});
