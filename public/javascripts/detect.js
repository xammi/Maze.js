/**
 * Created by max on 18.12.14.
 */

$(document).ready(function () {
    var md = new MobileDetect(window.navigator.userAgent);
    var info = 'Your device was detected as ';

    if (md.is('mobile'))
        info += '[mobile]';
    else if (md.is('desktop'))
        info += '[desktop]';
    else
        info += '[unknown]';

    $('.detect').html(info);
});
