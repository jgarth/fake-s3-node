var multiparty = require('multiparty');
var http = require('http');
var util = require('util');

http.createServer(function(req, res) {
  var command = 'curl -X POST';
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

  form.on('field', function(name, value) {
    console.log("Got field named: '" + name + "' with value '" + value + "'");
    command += ' -F "' + name + '=' + value + '"';
  });

  // Close emitted after form parsed
  form.on('file', function(name, file) {
    console.log('Got file named: ' + name + '!');
    console.log('streamed to: ' + file.path + ' (' + file.size + ' bytes)');
    command += ' -F "file=@' + file.path + '"';
  });


  // Close emitted after form parsed
  form.on('close', function() {
    console.log('Upload completed!');
    res.setHeader('Content-Type', 'text/plain');
    res.end();

    console.log("---- REQUEST DONE ----\n\n");
    console.log(command);
  });

  // Parse req
  form.parse(req);
}).listen(8080);
