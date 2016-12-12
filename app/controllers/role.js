var Role = require('../models/role');



function setState(_role){
  if(_role.roleName === "员工"){
    _role.preState = 0;
    _role.postState = 1;
  }else if(_role.roleName === "部门经理"){
    _role.preState = 1;
    _role.postState = 10;
  }else if(_role.roleName === "副总经理"){
    _role.preState = 10;
    _role.postState = 20;
  }else if(_role.roleName === "总经理"){
    _role.preState = 20;
    _role.postState = 30;
  }
  return _role;
}






//添加角色
exports.new = function(req, res){
  var _role = req.body.role;
  var role = new Role(_role);
  //测试
  //role.roleName = '员工' ;
  role = setState(role);

  role.save(function(err, role){
    if(err){
      console.log(err);
    }
    res.send(role);
  });
};
