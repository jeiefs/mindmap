#### 对源码的调整

##### kityminder.core.js

- 修改7552行对Move指令的处理，增加right2类型，原来以移动到页面左边太靠边 
- 调整各种默认样式和选中样式，在对应的主题中进行配置 _p[74]-_p[79]

##### kityminder.editor.js

- 注释第17行 assemble(_p.r(13)); 屏蔽右键事件
- 注释第905行 editText(); 屏蔽双击编辑功能
