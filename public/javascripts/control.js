/**
 * Created by max on 12.12.14.
 */

function contains(element, point) {
    var pos = element.offset();
    pos['right'] = pos.left + element.width();
    pos['bottom'] = pos.top + element.height();

    if (point.X > pos.left && point.X < pos.right)
        if (point.Y > pos.top && point.Y < pos.bottom)
            return true;
    return false;
}

function orientation() {
    var orHandler = function (event) {
        event.preventDefault();
    };
    window.addEventListener('orientationchange', orHandler);
}

function hyroscope(external) {
    var ball = $('.ball');
    var garden = $('.garden');

    var maxX = garden.width() - ball.width();
    var maxY = garden.height() - ball.height();

    var hyroHandler = function (event) {
        var X = event.beta; // [-180,180]
        var Y = event.gamma; // [-90,90]

        if (X > 90) { X = 90; }
        if (X < -90) { X = -90; }

        var ballX = maxX * (X + 90) / 180 - 10;
        var ballY = maxY * (Y + 90) / 180 - 10;

        ball.css('top', ballX + 'px');
        ball.css('left', ballY + 'px');

        external(X, Y);
    };
    window.addEventListener('deviceorientation', hyroHandler);
}

function toucher(external) {
    var touchStart = function (event) {
        event.preventDefault();
        var touch = event.touches.item(0);

        var point = {X: touch.pageX, Y: touch.pageY};

        $('.sphereColor').each(function () {
            var button = $(this);

            if (contains(button, point)) {
                button.siblings('.checked').removeClass('checked');
                button.addClass('checked');

                var color = button.css('background-color');
                external(color);

                return false;
            }
        });
    };

    window.addEventListener('touchstart', touchStart);
}

$(document).ready(function () {
    $('.entryForm').submit(function (event) {
        event.preventDefault();

        var socket = io.connect('http://192.168.43.149:3000');
//        var socket = io.connect('http://localhost:3000');

        socket.on('start', function () {
            $('.entry').css('display', 'none');
            $('.error').css('display', 'none');
            $('.control').css('display', 'block');

            hyroscope(function (X, Y) {
                socket.emit('control', {X: X, Y: Y});
            });

            toucher(function (color) {
                socket.emit('set color', {color: color});
            });

            orientation();
        });

        socket.on('client-error', function (data) {
            var divError = $('.error');
            divError.html(data.msg);
            divError.fadeIn('slow').delay(10000).fadeOut('slow');
        });

        socket.on('disconnect', function () {
            $('.control').css('display', 'none');
            $('.entry').css('display', 'block');

            var divError = $('.error');
            divError.html('Disconnected');
            divError.fadeIn('slow').delay(10000).fadeOut('slow');
        });

        var code = $('input[name=code]').val();
        socket.emit('init', {platform: 'mobile', code: code});
    });
});