/**
 * Created by max on 12.12.14.
 */

var Sphere = {
    X: 100, Y: 100,
    dX: 0, dY: 0,
    radius: 40,

    move: function () {
        this.X += this.dX;
        this.Y += this.dY;
    },

    draw: function (context, color) {
        context.beginPath();

        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.fill();

        context.lineWidth = 2;
        context.strokeStyle = color;
        context.stroke();
    }
};

$(document).ready(function () {
    var code = $('.codeValue').text();
    var socket = io.connect('http://localhost:3000');
    socket.emit('init', {platform: 'desktop', code: code});

    var canvas = document.getElementById('gameCanvas');
    var context = canvas.getContext('2d');
    var color = '#ff0000';

    socket.on('start', function () {
        $('.entry').css('visibility', 'hidden');
        $('.game').css('visibility', 'visible');
        Sphere.draw(context, color);
    });

    socket.on('control', function (data) {
        Sphere.dX = data.X;
        Sphere.dY = data.Y;
    });

    setInterval(function () {
        Sphere.move();
        Sphere.draw(context, color);
    }, 1000);
});