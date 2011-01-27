/*!
 * Nodeunit
 * Copyright (c) 2010 Caolan McMahon
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var nodeunit = require('../nodeunit'),
    utils = require('../utils'),
    fs = require('fs'),
    sys = require('sys'),
    path = require('path'),
    AssertionError = require('assert').AssertionError;

/**
 * Reporter info string
 */

exports.info = "Report tests result as HTML";

/**
 * Run all tests within each module, reporting the results to the command-line.
 *
 * @param {Array} files
 * @api public
 */

exports.run = function (files, cb, options) {

    var start = new Date().getTime();
    var paths = files.map(function (p) {
        return path.join(process.cwd(), p);
    });

    var result = '';
    function puts(str) {
      result += str;
    }

    puts('<html>');
    puts('<head>');
    puts('<title></title>');
    puts('<style type="text/css">');
    puts('body { font: 12px Helvetica Neue }');
    puts('h2 { margin:0 ; padding:0 }');
    puts('pre { font: 11px Andale Mono; margin-left: 1em; padding-left: 1em; margin-top:0; font-size:smaller;}');
    puts('.assertion_message { margin-left: 1em; }');
    puts('  ol {' +
    '	list-style: none;' +
    '	margin-left: 1em;' +
    '	padding-left: 1em;' +
    '	text-indent: -1em;' +
    '}');
    puts('  ol li.pass:before { content: "\\2714 \\0020"; }');
    puts('  ol li.fail:before { content: "\\2716 \\0020"; }');
    puts('</style>');
    puts('</head>');
    puts('<body>');


    nodeunit.runFiles(paths, {
        moduleStart: function (name) {
            puts('<h2>' + name + '</h2>');
            puts('<ol>');
        },
        testDone: function (name, assertions) {
            if (!assertions.failures()) {
                puts('<li class="pass">' + name + '</li>');
            }
            else {
                puts('<li class="fail">' + name);
                assertions.forEach(function (a) {
                    if (a.failed()) {
                        a = utils.betterErrors(a);
                        if (a.message) {
                            puts('<div class="assertion_message">' +
                                'Assertion Message: ' + a.message +
                            '</div>');
                        }
                        puts('<pre>');
                        puts(a.error.stack);
                        puts('</pre>');
                    }
                });
                puts('</li>');
            }
        },
        moduleDone: function () {
            puts('</ol>');
        },
        done: function (assertions) {
            var end = new Date().getTime();
            var duration = end - start;
            if (assertions.failures()) {
                puts(
                    '<h3>FAILURES: '  + assertions.failures() +
                    '/' + assertions.length + ' assertions failed (' +
                    assertions.duration + 'ms)</h3>'
                );
            }
            else {
                puts(
                    '<h3>OK: ' + assertions.length +
                    ' assertions (' + assertions.duration + 'ms)</h3>'
                );
            }
            puts('</body>');
            // should be able to flush stdout here, but doesn't seem to work,
            // instead delay the exit to give enough to time flush.
            setTimeout(function () {
                //process.reallyExit(assertions.failures());
            }, 10);
            //
            cb(result);
        }
    });
};

