exports.resetPassword = function resetPassword(req, res) {
  var accountId = req.param('accountId', null);
  var password = req.param('password', null);

  if( null != accountId && null != password){
      Account.changePassword(accountId, password);
  }

  res.render('resetPasswordSuccess.jade');
}
