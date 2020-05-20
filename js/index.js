$(document).ready(function () {

    var textArray = [
    '🕹🏿',
    '🏂',
    '🏋️‍♂️',
    '🏑',
    '🎬',
    '🛫',
    '⛵️',
    '🏄',
    '👨‍🍳',
    '👨‍👩‍👧‍👦',
    '👨🏼‍💻',
    '🎧',
    '🍣',
    ];

    var arr = [];
    while (arr.length < 3) {
        var r = Math.floor(Math.random() * textArray.length);
        if (arr.indexOf(r) === -1) arr.push(r);
    }

    console.log(arr);
    console.log('interest1', textArray[arr[0]]);
    console.log('interest2', textArray[arr[1]]);
    console.log('interest3', textArray[arr[2]]);

    setInterval(function checkcontent() {

        if ($(".interest1").length > 0) {
            $('.interest1').text(textArray[arr[0]]);
        } else if ($(".interest2").length > 0) {
            $('.interest2').text(textArray[arr[1]]);
        } else if ($(".interest3").length > 0) {
            $('.interest3').text(textArray[arr[2]]);
        }

    }, 500);

});

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
        .typeString('you could scroll down...')
        .pauseFor(1500)
        .deleteAll()
        .typeString('or just stay here...')
        .pauseFor(1500)
        .deleteAll()
        .typeString('did you know I love <span class="interest1"></span>?')
        .pauseFor(1500)
        .deleteAll()
        .typeString('...and I really enjoy <span class="interest2"></span>')
        .pauseFor(1500)
        .deleteAll()
        .typeString('...and ofcourse <span class="interest3"></span>')
        .pauseFor(1500)
        .deleteAll()
        .typeString('how about a cup of ☕?')
        .pauseFor(1500)
        .start();

});

$(document).ready(function () {
    $(window).scroll(function () {
        var dark_pos = $('.section__dark').offset().top;
        var dark_height = $('.section__dark').height();
        var dark_pos2 = $('.section__dark2').offset().top;
        var dark_height2 = $('.section__dark2').height();
        var svg_height = $('.section__svg').height();
        var menu_pos1 = $('.top').offset().top;
        var menu_width1 = $('.top').width();
        var scroll = $(window).scrollTop();

        console.log('dark', dark_pos);
        console.log('menu1', menu_pos1);
        console.log('scroll', scroll);

        if (scroll > (dark_pos - 150) && menu_pos1 < (dark_pos + dark_height + 150)) {
            $('.top').addClass('nav__white');
            $('#krooneman__logo').attr('class', 'nav__black nav__white');
            $('.top').removeClass('nav__black');
        } else if (scroll > (dark_pos2 - 150) && menu_pos1 < (dark_pos2 + dark_height2 + 150)) {
            $('.top').addClass('nav__white');
            $('#krooneman__logo').attr('class', 'nav__black nav__white');
            $('.top').removeClass('nav__black');
        } else {
            $('.top').removeClass('nav__white');
            $('#krooneman__logo').attr('class', 'nav__black');
            $('.top').addClass('nav__black');
        }

    });
});

$(document).ready(function () {
    $(window).scroll(function () {
        var dark_pos = $('.section__dark').offset().top;
        var dark_height = $('.section__dark').height();
        var windowheight = $(window).height();
        var dark_pos2 = $('.section__dark2').offset().top;
        var dark_height2 = $('.section__dark2').height();
        var svg_height = $('.section__svg').height();
        var menu_pos2 = $('.bottom').offset().top;
        var menu_width2 = $('.bottom').width();
        var scroll = $(window).scrollTop();

        console.log('menu2', menu_pos2);

        if (scroll > (dark_pos - windowheight) && menu_pos2 < (dark_pos + dark_height + 150)) {
            $('.bottom').addClass('nav__white');
            $('.bottom').removeClass('nav__black');
            $('.side__icon').addClass('nav__white');
            $('.side__icon').removeClass('nav__black');
        } else if (scroll > (dark_pos2 - windowheight) && menu_pos2 < (dark_pos2 + dark_height2 + 150)) {
            $('.bottom').addClass('nav__white');
            $('.bottom').removeClass('nav__black');
            $('.side__icon').addClass('nav__white');
            $('.side__icon').removeClass('nav__black');
        } else {
            $('.bottom').removeClass('nav__white');
            $('.bottom').addClass('nav__black');
            $('.side__icon').removeClass('nav__white');
            $('.side__icon').addClass('nav__black');
        }

    });
});

$(document).ready(function () {

    var dot_Function = function () {
        if ($(".control__dot").hasClass("dot__inactive")) {
            $(this)
                .addClass("dot__active")
                .removeClass("dot__inactive");
            $(this).siblings()
                .addClass("dot__inactive")
                .removeClass("dot__active");
        }
    }

    var xp1_Function = function () {
        $("#exp__c")
            .removeClass("dot__right")
            .addClass("dot__left");
        $("#exp__b")
            .removeClass("dot__left")
            .addClass("dot__right");
        $("#exp__1").show();
        $("#exp__1").fadeTo("slow", 1);
        $("#exp__2").hide();
        $("#exp__2").css("opacity", "0");
        $("#exp__3").hide();
        $("#exp__3").css("opacity", "0");
        $(".control__dot").removeClass("dot__active");
        $(".control__dot:nth-child(1)").addClass("dot__active");
//        $("#exp__a").delay(300)
//            .removeClass("dot__right")
//            .removeClass("dot__left");
    }

    var xp2_Function = function () {
        $("#exp__a")
            .removeClass("dot__right")
            .addClass("dot__left");
        $("#exp__c")
            .removeClass("dot__left")
            .addClass("dot__right");
        $("#exp__1").hide();
        $("#exp__1").css("opacity", "0");
        $("#exp__2").show();
        $("#exp__2").fadeTo("slow", 1);
        $("#exp__3").hide();
        $("#exp__3").css("opacity", "0");
        $(".control__dot").removeClass("dot__active");
        $(".control__dot:nth-child(2)").addClass("dot__active");
//        $("#exp__b").delay(300)
//            .removeClass("dot__right")
//            .removeClass("dot__left");
    };

    var xp3_Function = function () {
        $("#exp__b")
            .removeClass("dot__right")
            .addClass("dot__left");
        $("#exp__a")
            .removeClass("dot__left")
            .addClass("dot__right");
        $("#exp__1").hide();
        $("#exp__1").css("opacity", "0");
        $("#exp__2").hide();
        $("#exp__2").css("opacity", "0");
        $("#exp__3").show();
        $("#exp__3").fadeTo("slow", 1);
        $(".control__dot").removeClass("dot__active");
        $(".control__dot:nth-child(3)").addClass("dot__active");
//        $("#exp__c").delay(300)
//            .removeClass("dot__right")
//            .removeClass("dot__left");
    };

    $(".control__dot").click(dot_Function);

    $("#exp__a").click(xp1_Function);
    $("#exp__b").click(xp2_Function);
    $("#exp__c").click(xp3_Function);

    $("#exp__1").touchwipe({
        wipeLeft: xp2_Function,
        wipeRight: xp3_Function,
        min_move_x: 20,
        min_move_y: 20,
        preventDefaultEvents: true
    });


    $("#exp__2").touchwipe({
        wipeLeft: xp3_Function,
        wipeRight: xp1_Function,
        min_move_x: 20,
        min_move_y: 20,
        preventDefaultEvents: true
    });

    $("#exp__3").touchwipe({
        wipeLeft: xp1_Function,
        wipeRight: xp2_Function,
        min_move_x: 20,
        min_move_y: 20,
        preventDefaultEvents: true
    });

});
