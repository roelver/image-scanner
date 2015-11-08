var express = require("express"),
    app = express(),
    fs = require("fs"),
    http = require("http"),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    hostname = process.env.HOSTNAME || 'localhost',
    url = require('url'),
    port = 8080,
    publicDir = process.argv[2] || __dirname + '/public';

app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(publicDir));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));

app.get("/img/:img", function (req, res) {
  console.log('Request for image', publicDir+'/'+req.params.img);
  if (req.params.img) {
      var data = fs.readFileSync(publicDir+'/'+req.params.img);

      if (!data) {
        res.status(404);
      }
      else {
        console.log('Sending image', data.length);
        res.writeHead(200, {'Content-Type': 'image/jpeg' });
        res.end(data);
      }
  }
  else {
    console.log('Error occurred');
    res.status(500).send(req.params.img + ' is not a valid name');
  }
});

app.get("/", function (req, res) {
  res.redirect("/index.html");
});

app.delete("/img", function (req, res) {

  var filename = req.query.filename;
  console.log('Request for image', publicDir+'/'+filename);
  if (filename) {

      try {
        fs.unlinkSync(publicDir+'/'+filename);
      }
      catch(err) {
        console.log( err.message);
      }
  }
  res.status(200);
});

app.post("/store", function (req, res) {
  var imgUrl = req.body.myurl;
  console.log('Storing locally:',imgUrl);
  var lastSlash = imgUrl.lastIndexOf('/');
  var filenm = imgUrl;
  if (lastSlash >= 0) {
    filenm = imgUrl.substring(lastSlash+1);
  }
  try {
    fs.unlinkSync(publicDir+'/'+filenm);
  }
  catch(err) {
    console.log( err.message);
  }
  var urldata = url.parse(imgUrl);
  var opts = { host: urldata.host,
      port: urldata.port || 80,
      path: urldata.path,
      protocol: 'http:',
      headers: {
          'User-Agent': 'Mozilla/5.0'
         } 
      };

  var f=fs.createWriteStream(publicDir+'/'+filenm);

  http.get(opts,function(resp){
      resp.on('data', function (chunk) {
          f.write(chunk);
      });
      resp.on('error', function (chunk) {
          f.end();
          res.status(404);
      });
      resp.on('end',function(){
          f.end();

          fs.stat(publicDir+'/'+filenm, function(err, stats) {
            console.log(filenm + ' is created');
            console.log('Stats',stats);
          });
          res.status(200).send(filenm);
      });
  });
});

console.log("Simple static server showing %s listening at http://%s:%s", publicDir, hostname, port);
app.listen(port, hostname);
