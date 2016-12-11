#业务逻辑中可能的路由信息
//登录
METHOD： POST
URI : user/signin
PARAMS: {'user':user}
RES: /index

//index中请求请假页面reqHoliday
METHOD ： GET
URI: /holandUser
PARAMS:{‘userId’:_id}
RES: /reqHoliday
