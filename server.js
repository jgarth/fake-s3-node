var multiparty = require('multiparty');
var http = require('http');
var util = require('util');

http.createServer(function(req, res) {
  var form = new multiparty.Form({
    autoFiles: true,
    uploadDir: './images/'
  });

  // Errors may be emitted
  // Note that if you are listening to 'part' events, the same error may be
  // emitted from the `form` and the `part`.
  form.on('error', function(err) {
    console.log('Error parsing form: ' + err.stack);
  });

  // Parts are emitted when parsing the form
  form.on('part', function(part) {
    // You *must* act on the part by reading it
    // NOTE: if you want to ignore it, just call "part.resume()"

    if (!part.filename) {

      console.log('got field named "' + part.name + "'");

      // ignore field's content
      part.resume();
    }

    if (part.filename) {
      // filename is defined when this is a file
      count++;
      console.log('got file named ' + part.name);
      // ignore file's content here
      part.resume();
    }

    part.on('error', function(err) {
      console.log("ERROR: " + err);
      // decide what to do
    });
  });

  form.on('field', function(name, value) {
    console.log("Got field named: '" + name + "' with value '" + value + "'")
  });

  // Close emitted after form parsed
  form.on('file', function(name, file) {
    console.log('Got file named: ' + name + '!');
    console.log('streamed to: ' + file.path + ' (' + file.size + ' bytes)');
  });


  // Close emitted after form parsed
  form.on('close', function() {
    console.log('Upload completed!');
    res.setHeader('Content-Type', 'text/plain');
    res.end();

    console.log("---- REQUEST DONE ----\n\n")
  });

  // Parse req
  form.parse(req);
}).listen(8080);
