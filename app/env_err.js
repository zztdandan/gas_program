let CSException = function(){};
CSException.prototype.BuildCSException = function(bol, msg, data) {
  let a = new CSException();
  a.flag = bol;
  a.msg = msg;
  a.data = data;
  return a;
};
CSException.prototype.BuildBy_REMOTE_CSException = function(bol, msg, data) {
  let a = new CSException();
  a.flag = bol;
  a.msg = msg;
  a.data = data;
  return a;
};
CSException.ShowMsg = function() {
  // console.log(CSEx);
  alert(this.msg);
};

CSException.DoLog = function() {
  console.log(this);
};
CSException.prototype.DefaultLog = function(msg) {
  let re = CSException.BuildCSException(false, msg, {});
  re.DoLog();
};

module.exports = CSException;
