var navBar = $("#topNav");
var hdrHeight = $("header").height();


$(window).scroll(function() {
  if( $(this).scrollTop() > hdrHeight + 50) {
    navBar.addClass("navScrolled");
  } else {
    navBar.removeClass("navScrolled");
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