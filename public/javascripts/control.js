/**
 * Created by max on 12.12.14.
 */

$(document).ready(function () {
    //var socket = io.connect('http://192.168.43.149:3000');
    var socket = io.connect('http://localhost:3000');

    $('.entryForm').submit(function (event) {
        event.preventDefault();

        socket.on('start', function () {
            $('.entry').css('display', 'none');
            $('.error').css('display', 'none');
            $('.control').css('display', 'block');

            var ball = $('.ball');
            var garden = $('.garden');

            var maxX = garden.width() - ball.width();
            var maxY = garden.height() - ball.height();

            var orHandler = function (event) {
                var X = event.beta; // [-180,180]
                var Y = event.gamma; // [-90,90]

                if (X > 90) { X = 90; }
                if (X < -90) { X = -90; }

                var ballX = maxX * (X + 90) / 180 - 10;
                var ballY = maxY * (Y + 90) / 180 - 10;

                ball.css('top', ballX + 'px');
                ball.css('left', ballY + 'px');

                socket.emit('control', {X: X, Y: Y});
            };

            window.addEventListener('deviceorientation', orHandler);
            // $(document).on('deviceorientation', orHandler);
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