
Accounts.certifyFunc(function(options, user) {
    // check certificate
    var cert = options.cert;
    var uname = options.username;

    var ok = idp_check("register", uname, cert, idpkey);

    if (!ok) {
	user._validate = false;
    } else {
	user._validate = true;
    }

    return user;
});


//gets called after onCreateUser
Accounts.validateNewUser(function(user){
    return user._validate;
});


Accounts.registerLoginHandler(function (options) {
  if (!options.idp)
    return undefined;

  var config = Accounts.loginServiceConfiguration.findOne({service: 'idp'});
  if (!config)
    throw new Accounts.ConfigError("Service not configured");

  // XXX figure out how cert is encoded
  check(options.idp, {cert: String});
  var cert = options.idp.cert;
  console.log('idp_login', cert);

  var pubkey = config.pubkey;

  // XXX verify cert with pubkey

  // XXX extract username from cert
  var userid = cert;

  return Accounts.updateOrCreateUserFromExternalService('idp', {id: userid});
});