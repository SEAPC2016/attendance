## 一些用到的算法

### 审核假期（批假）：

原则：根据请假条的状态来确定当前的处理方式，在处理后更新状态，直至请假结束。

对于三种有审核假期的身份（部门经理，分管副总，总经理），他们的处理逻辑相同,为方便叙述记为处理人为 Role，请假条为 Note：

* 若请假条当前状态与 Role 的“判定前状态”（preState）相同，则交由 Role 处理
* 若 Role 不同意申请，置 Note 状态为 0
* 若 Role 同意申请：
  若 Role 的“判定后状态”（postState）与 Note 所需的最高状态 highState 相同，置 Note 状态为 -1（完成）
  否则，置 Note 状态为 Role.postState，交由下一阶段处理。

伪代码如下：
``` javascript

def approve_holiday(note, role):
	if role.Reject:
		note.state = 0
	elif role.Approve:
		if note.highestState == role.postState:
			note.state = -1
		else:
			note.state = role.posteState
```


