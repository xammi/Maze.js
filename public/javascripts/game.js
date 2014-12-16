/**
 * Created by max on 12.12.14.
 */

var Sphere = {
    X: 100, Y: 100,
    dX: 0, dY: 0,
    radius: 40,
    color: '#ff0000',

    move: function () {
        var newX = this.X + this.dX;
        var newY = this.Y + this.dY;

        if (newX - this.radius > 0 && newX + this.radius < 900)
            this.X = newX;

        if (newY - this.radius > 0 && newY + this.radius < 600)
            this.Y = newY;
    },

    draw: function (context, extColor) {
        var color = extColor || this.color;

        context.beginPath();

        context.arc(this.X, this.Y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.fill();

        context.lineWidth = 2;
        context.strokeStyle = color;
        context.stroke();
    },

    setColor: function (color) {
        this.color = color;
    }
};

$(document).ready(function () {
    var code = $('.codeValue').text();
    var socket = io.connect('http://127.0.0.1:3000');

    var canvas = document.getElementById('gameCanvas');
    var context = canvas.getContext('2d');
    var color = '#ff0000';

    socket.on('start', function () {
        $('.entry').css('display', 'none');
        $('.error').css('display', 'none');
        $('.game').css('display', 'block');

        setInterval(function () {
            Sphere.draw(context, '#ffffff');
            Sphere.move();
            Sphere.draw(context);
        }, 40);
    });

    socket.on('control', function (data) {
        // console.log(data);
        Sphere.dX = data.X;
        Sphere.dY = data.Y;
    });

    socket.on('set color', function (data) {
        Sphere.setColor(data.color);
    });

    socket.on('disconnect', function () {
        $('.game').css('display', 'none');
        $('.entry').css('display', 'block');

        var divError = $('.error');
        divError.html('Disconnected');
        divError.fadeIn('slow').delay(10000).fadeOut('slow');
    });

    socket.emit('init', {platform: 'desktop', code: code});
});