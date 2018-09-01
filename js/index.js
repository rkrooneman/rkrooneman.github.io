var nav = $("nav");
var hdrHeight = $("header").height();


$(window).scroll(function() {
  if( $(this).scrollTop() > hdrHeight + 50) {
    nav.addClass("navScrolled");
  } else {
    nav.removeClass("navScrolled");
  }
});

$l = $('.left');
$r = $('.right');

$l.mouseenter(function() {
  $('.container').addClass('left-is-hovered');
}).mouseleave(function() {
  $('.container').removeClass('left-is-hovered');
});

$r.mouseenter(function() {
  $('.container').addClass('right-is-hovered');
}).mouseleave(function() {
  $('.container').removeClass('right-is-hovered');
});

var amountScrolled = 200;
var amountScrolledNav = 25;

$(window).scroll(function() {
  if ( $(window).scrollTop() > amountScrolled ) {
    $('button.back-to-top').addClass('show');
  } else {
    $('button.back-to-top').removeClass('show');
  }
});

$('button.back-to-top').click(function() {
  $('html, body').animate({
    scrollTop: 0
  }, 800);
  return false;
});

Waves.attach('button.back-to-top', 'waves-effect');
Waves.init();