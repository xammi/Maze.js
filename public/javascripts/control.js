/**
 * Created by max on 12.12.14.
 */

$(document).ready(function () {
    $('.entryForm').submit(function (event) {
        event.preventDefault();

        var code = $('input[name=code]').val();
        var socket = io.connect('http://localhost:3000');
        socket.emit('init', {platform: 'mobile', code: code});

        $('.entry').css('visibility', 'hidden');
        $('.control').css('visibility', 'visible');

        var ball = $('.ball');
        var garden = $('.garden');

        var maxX = garden.width() - ball.width();
        var maxY = garden.height() - ball.height();

        var orHandler = function (event) {
            var X = event.beta;
            var Y = event.gamma;

            if (X > 90) { X = 90; }
            if (X < -90) { X = -90; }

            X += 90;
            Y += 90;

            ball.css("top", (maxX * X/180 - 10) + "px");
            ball.css("left", (maxY * Y/180 - 10) + "px");

            socket.emit('control', {X: X, Y: Y});
        };

        $(document).on('deviceorientation', orHandler);
    });
});