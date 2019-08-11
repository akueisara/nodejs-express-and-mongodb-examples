var rect = require('./rectangle');

function solveRect(l, b) {
    console.log("Solving for rectangle with l = " + l + " and b = " + b);
    rect(l, b, (err, rectangle) => {
        if(err) {
            console.log("ERROR: ", err.message)
        } else {
            console.log("The area of the rectangle of dimensions l = " + l + " and b = " + b + " is " + rectangle.area());
            console.log("The perimeter of the rectangle is " + rectangle.perimeter());
        }
    });
    console.log("This statement is after the call to rect()")
}

solveRect(2, 4);
solveRect(3, 5);
solveRect(0, 5);
solveRect(-3, 5);

const http = require('http');
const server = http.createServer(function (req, res) {
    // req.headers, req.body
    res.setRequestHeader("Content-Type", "text/html");
    res.statusCode = 200;
    res.write('Hello World!');
    res.end('<html><body><h1>Hello World</h1></body></html>');

});
server.listen(port);

const path = require('path');
path.resolve('./public' + fileUrl);
path.extname(filePath);

const fs = require('fs');
fs.exists(filePath, function (exists) {});
fs.createReadStream(filePath).pipe(res);