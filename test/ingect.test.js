describe('Ingect module', function() {

  let mut;
  let spy;
  let module;

  beforeEach(function(done) {
    mut = G();
    spy = {};
    module = function() {
      return spy;
    };

    done();
  });

  it('should store and load a module', function(done) {
    mut('test', module);
    mut('test').should.be.equal(module());
    done();
  });

  it('should inject the global object', function(done) {
    mut('main', function(t) {
      should.equal(t, window);
      done();
    }, ['$global']);

    mut('main');
  });

  it('should resolve the deps', function(done) {
    mut('test', module);

    mut('main', function(m) {
      m.should.be.equal(module());
      done();
    }, [ 'test' ]);

    mut('main');
  });
  
  it('should resolve nested deps', function(done) {
    mut('test', module);

    mut('dep', function(m) {
      return {
        test: function() {
          m.should.be.equal(module());
          done();
        }
      };
    }, [ 'test' ]);

    mut('main', function(d) {
      d.test();
    }, [ 'dep' ]);

    mut('main');
  });

  it('should except if the module does not exist', function(done) {
    var test = function() {
      mut('test');
    };

    test.should.throw('test is not defined');
    done();
  });

  it('should except if the module already exists', function(done) {
    mut('test', function() {});

    var test = function() {
      mut('test', function() {});
    };

    test.should.throw('A module with the name test already exists');
    done();
  });

});
