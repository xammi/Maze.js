var express = require('express');
var router = express.Router();

//--------------------------------------------------------------------------------------

var generateCode = function (length) {
    var code = '';
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < length; i++ )
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    return code;
};

router.get('/desktop', function(req, res) {
    var newCode = generateCode(4);
    res.render('desktop', { title: 'Start page', code: newCode });
});

router.get('/mobile', function(req, res) {
    res.render('mobile', { title: 'Mobile page' });
});

module.exports = router;
