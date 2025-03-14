'use strict';

describe('test.prefix.js', function () {

  it('Test url prefix', function () {

    var CustomPouch = PouchDB.defaults({
      prefix: testUtils.couchHost()
    });

    var db = new CustomPouch('testdb');

    return db.info().then(function (info) {
      info.adapter.should.equal('http');
    }).then(function () {
      return db.destroy();
    });

  });

  it('Test plain prefix', function () {

    var CustomPouch = PouchDB.defaults({prefix: 'testing'});
    var db = new CustomPouch('testdb');

    return db.info().then(function (info) {
      info.db_name.should.equal('testdb');
    }).then(function () {
      return db.destroy();
    });

  });

});

// This is also tested in test.defaults.js, however I wanted to cover
// the different use cases of prefix in here
if (typeof process !== 'undefined' &&
    !process.env.LEVEL_ADAPTER &&
    !process.env.LEVEL_PREFIX &&
    !process.env.ADAPTERS &&
    // fails on windows with EBUSY - "resource busy or locked", not worth fixing
    require('os').platform() !== 'win32') {

  var rimraf = require('rimraf');
  var fs = require('fs');

  describe('node test.prefix.js', function () {

    it('Test path prefix', function () {

      var prefix = './tmp/testfolder/';
      fs.mkdirSync(prefix, { recursive:true });
      var CustomPouch = PouchDB.defaults({prefix});

      var db = new CustomPouch('testdb');

      return db.info().then(function () {
        // This will throw if the folder does not exist
        fs.lstatSync(prefix + 'testdb');
        rimraf.sync('./tmp/testfolder');
      });

    });

  });

}
