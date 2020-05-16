$(document).ready(function () {
    function dateTime() {
        var format = "";
        var ndate = new Date();
        var hr = ndate.getHours();
        var h = hr % 12;

        if (hr < 12) {
            greet = 'Goodmorning';
            format = 'AM';
        } else if (hr >= 12 && hr <= 17) {
            greet = 'Good afternoon';
            format = 'PM';
        } else if (hr >= 17 && hr <= 24)
            greet = 'Good evening';

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

    setInterval(dateTime, 100);


    var app = document.getElementById('app');
    var typewriter = new Typewriter(app, {
        loop: false,
        delay: 75,
    });

    typewriter.typeString('Hello there...')
        .pauseFor(1500)
        .deleteAll()
        .typeString('How are you doing?')
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

$(document).ready(function () {
    $(window).scroll(function () {
        var dark_pos = $('.section__dark').offset().top;
        var dark_height = $('.section__dark').height();
        var menu_pos = $('.top').offset().top;
        var menu_height = $('.top').height();
        var scroll = $(window).scrollTop();
        
        console.log('dark', dark_pos);
        console.log('menu', menu_pos);
        console.log('scroll', scroll);
        
        if (menu_pos > dark_pos && menu_pos < (dark_pos + dark_height)) {
            $('.top').addClass('nav__white');
            $('.top').removeClass('nav__black');
        } else {
            $('.top').removeClass('nav__black');
            $('.top').addClass('nav__white');
        }

    })
})
