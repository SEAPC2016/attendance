mongoose


  User
    .find({"_id":id}) //注意这里的参数设置 如果 "_id" 不填家双引号，汇出错的
    .populate({path:'userRole'})
    .exec(function(err, user){
      res.send(user);
    });

结果：

[
  {
    "_id": "584aab9f23ac5520a7cf0947",
    "userRole": {
      "_id": "584aab46b4f2d71f8a186278",
      "postState": 1,
      "preState": 0,
      "roleName": "员工",
      "__v": 0,
      "meta": {
        "updateAt": "2016-12-09T13:01:58.102Z",
        "createAt": "2016-12-09T13:01:58.102Z"
      }
    },
    "userPwd": "$2a$10$HVl5Bm1HpPjoeCegwaC/Wez6kH8R/lg.gQlqzXiyvDx2KpwzYLTky",
    "userName": "Bruce",
    "__v": 0,
    "meta": {
      "updateAt": "2016-12-09T13:03:27.258Z",
      "createAt": "2016-12-09T13:03:27.258Z"
    }
  }
]


//删除集合
db.users.drop() // users指集合名称

//mapReduce
Note.mapReduce(
  function(){emit(_holidayTypeId, 1);},
  function(key,values){return Array.sum(values);},
  {
     query:{user: },
     out:"holidayLength"
  }
).find()








>db.notes.mapReduce(function(){emit(this.startTime,this.timeLength);}, function(key,values){return Array.sum(values)},{out:'timeLength'}).find()
{ "_id" : ISODate("2016-10-01T00:00:00Z"), "value" : 21 }


> db.notes.mapReduce(function(){emit(this.startTime,this.timeLength);}, function(key,values){return Array.sum(values)},{out:'timeLength'})
{
	"result" : "timeLength",
	"timeMillis" : 4,
	"counts" : {
		"input" : 3,
		"emit" : 3,
		"reduce" : 1,
		"output" : 1
	},
	"ok" : 1
}
