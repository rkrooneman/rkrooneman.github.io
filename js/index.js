var   app = document.getElementById('app');
var   typewriter = new Typewriter(app, {
        loop: false,
        delay: 75,
});

typewriter.typeString('Hello there...')
    .pauseFor(1500)
    .deleteAll()
    .typeString('How are you doing?')
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
