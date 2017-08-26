/**
 * 封装脑图的调用接口
 */


var oldnode = "";	//上一个滑过的节点
var currentnode = "";	//当前滑过的节点
var $cardDiv = $("#card");	//卡片div
var defaultOpts = {'template':"right",'theme':"fresh-blue-compat","expandlevel":null};	//脑图默认样式	
var lockCard = false;	//显示卡片事件是否进行锁定，避免在其他操作的时候捣乱

/**
 * 加载脑图
 * @param mapid 脑图id,在实际系统中应当与具体的业务id一致
 * @param options 默认加载的样式参数
 * 具体格式如下：{'template':"right",'theme':"fresh-blue-compat",'expandlevel':5} //向右展开，风格为紧凑蓝 展开到5级节点
 * 可选参数为 
   'template': {
					'default': '思维导图',
					'tianpan': '天盘图',
					'structure': '组织结构图',
					'filetree': '目录组织图',
					'right': '逻辑结构图',
					'fish-bone': '鱼骨头图'
				},
	'theme': {
					'classic': '脑图经典',
					'classic-compact': '紧凑经典',
					'snow': '温柔冷光',
					'snow-compact': '紧凑冷光',
					'fish': '鱼骨图',
					'wire': '线框',
					'fresh-red': '清新红',
					'fresh-soil': '泥土黄',
					'fresh-green': '文艺绿',
					'fresh-blue': '天空蓝',
					'fresh-purple': '浪漫紫',
					'fresh-pink': '脑残粉',
					'fresh-red-compat': '紧凑红',
					'fresh-soil-compat': '紧凑黄',
					'fresh-green-compat': '紧凑绿',
					'fresh-blue-compat': '紧凑蓝',
					'fresh-purple-compat': '紧凑紫',
					'fresh-pink-compat': '紧凑粉',
					'tianpan':'经典天盘',
					'tianpan-compact': '紧凑天盘'
				},
 */
function loadMindMap(mapid,userid,options,content){
	if(content){
		console.log("动态加载数据");
		initMindMap(options,content);
	}else{
		$.ajax({
			method:"POST",
			url:"http://127.0.0.1:8080/mindmap/scripts/mindmap/mindDemo.json",	//todo 此处为测试参数，请修改为实际接口
			data:{"mapid":mapid,"userid":userid},
			dataType:"json",
			success:function(content){
				console.log("后台请求脑图数据加载");
				initMindMap(options,content);
			}
		});
	}
	
}

/**
 * 初始化脑图
 * @param options	样式参数
 * @param content	json数据
 * @returns
 */
function initMindMap(options,content){
	var CustomizedTemplate = content.template;
	var CustomizedTheme = content.theme;
	
	//如果有个性化的样式则不适用默认样式
	if(CustomizedTemplate){
		options = $.extend({"template":CustomizedTemplate},options);
	}
	if(CustomizedTheme){
		options = $.extend({"theme":CustomizedTheme},options);
	}
	//加载脑图
    editor.minder.importJson(content);
    //调整脑图样式
    options = $.extend(defaultOpts,options);
    
    if(options && options.template){
    	//设置脑图展示模板
        minder.execCommand('template', options.template);
    }
    
    if(options && options.theme){
    	//设置脑图展示模板
        minder.execCommand('theme', options.theme);
    }
    
    if(options && options.expandlevel){
    	minder.execCommand('ExpandToLevel',options.expandlevel);
    }
    
    
    //如果是向右布局则将根节点右移 其他的不做处理
    if("right" == options.template){
    	//默认的焦点向右移动位置比较偏，此处对源码进行了修改，将当前焦点平移至脑图的左侧1/3处
        minder.execCommand('Move', 'center');	//先移动到中心，避免重新加载时候出现脑图超出画布的bug
    	minder.execCommand('Move', 'right2');
    }
    
    window.loading = false; //加载完成
    
}

/**鼠标滑过事件处理
 * 
 * @param e
 * @returns
 */
function handleMousemove(e){
	//判断当前滑过的节点跟上一次事件的触发节点是否是同一个，如果相同，则不做处理，否则进行相应的事件相应操作
    var target = e.getTargetNode();
    //如果不在节点上
    if(target == null){
    	cleanCard();
    }
    if(target){
        currentnode = target.getData("id");
    }
    if(currentnode != oldnode){
        oldnode = currentnode;	//重新指定上一个操作的节点为当前节点
        //使用e.getPosition找到当前事件触发的坐标。此方法有3个参照的坐标系，此处使用相对屏幕的绝对坐标
        //* `"screen"` - 以浏览器屏幕为参照坐标系 
        //* `"minder"` - （默认）以脑图画布为参照坐标系
        //* `{kity.Shape}` - 指定以某个 kity 图形为参照坐标系
        
        //取得node的边界
        var rect = document.getElementById(target.rc.node.id).getBoundingClientRect();
        var right = rect.right;	//节点右侧相对页面的坐标
        var bottom = rect.bottom; //节点底部坐标
        var left = rect.left;
        var top = rect.top;
        var headHeight = $('#main_top').outerHeight(true);//计算脑图上面部分的高度，从坐标中减除
        
        //显示卡片的位置计算
        var x = 0;
        var y = 0;
         
        //根据脑图高度和宽度判断，卡片不能越界
        var totalHeight = $("#outbox").height();
    	var cardHeight = $cardDiv.height();
    	var cardWidth = $cardDiv.width();
    	var cardbottom  = bottom - headHeight ;	//只是初步计算的卡片底部
    	x = right;
    	
    	//如果底部越界 则设置一个最低的
    	if(cardbottom >= (totalHeight-cardHeight) ){
    		y = totalHeight-cardHeight-20;
    	}else{
    		y = cardbottom;
    	}
        showCard(target,x,y);
    }

};

/**
 * 鼠标事件处理
 * @param e 
 * @returns
 */
function handleMousedown(e){
    cleanCard();	//如果之前有打开卡片，则进行清理
    var node = minder.getSelectedNode();	
    if(!node){
		//点击空白处，则隐藏右侧栏
    	hideRight();
    	hideMenu();
		return;
	}
    //右击事件处理
    if(e.isRightMB()){
    	handleRight(node,e);
    }else{
    	//单击事件处理
        handleClick(node);
    }
    //点击事件后清理 currentnode 避免重新滑过上一个节点的时候不再显示
	currentnode = "";
	
};

/**
 * 右键事件的实际处理函数
 * @param node 右击的节点
 * @returns
 */
function handleRight(node,e){
	if(!node) return;
	cleanCard(); //隐藏卡片，避免互相影响
	
    var nodeLevel = node.getLevel();
    var nodeHeight = 0;
    if(nodeLevel == 0 ){
    	nodeHeight = $("#menu1").height();
    }else{
    	nodeHeight = $("#menu2").height();
    }
	//找到右键的显示位置,避免越界
	var rect = document.getElementById(node.rc.node.id).getBoundingClientRect();
    var right = rect.right;	//节点右侧相对页面的坐标
    var bottom = rect.bottom; //节点底部坐标
    var headHeight = $('#main_top').outerHeight(true);//计算脑图上面部分的高度，从坐标中减除
    
    //显示右键的位置计算
    var x = right;
    var y = bottom;
    
    hideMenu();	//隐藏以前的右键
    showMenu(node,x,y);
}

/**
 * 禁用card一段时间(秒钟)
 * @param second
 * @returns
 */
function doLockCard(second){
	cleanCard();	
	lockCard = true;
	var unlock= function(){
		lockCard = false;
	}
	setTimeout(unlock,second*1000);
}

/**
 * 显示右键菜单
 * @param node
 * @param x
 * @param y
 * @returns
 */
function showMenu(node,x,y){
	if(node.getLevel() == 0){
		$("#menu1").css("left",x).css("top",y).show();
	}else{
		$("#menu2").css("left",x).css("top",y).show();
	}
	doLockCard(2);
}
/**
 * 隐藏右键菜单
 * @returns
 */
function hideMenu(){
	$("#menu1").hide();
	$("#menu2").hide();
}


/**
 * 单击事件响应
 * @param node 单击的节点
 * @returns
 */
function handleClick(node){
	showRight(node.getData('id'));
	console.log('单击事件:'+node.getText()+' ,节点id : '+node.getData('id'));
	setNodeStyleWhenClick(node);
}

//设置节点点击时候的样式
function setNodeStyleWhenClick(node){
	//minder.execCommand('background', "red");	//设置填充色
	//minder.execCommand('forecolor', "green");	//设置前景色 文字颜色 ，与node.setData('color', color) 后进行render效果一样
	//minder.execCommand('fontsize', "18");		//设置文字大小
	
	//node.setData('color', "red");
	//node.render(); //通过这种方式操作后,焦点离开后不会恢复
	var outline = node.getRenderer("OutlineRenderer").getRenderShape();	//取得边框对象
	var textnode = node.getRenderer("TextRenderer").getRenderShape();	//取得文本对象
	
	//后面的内容需要在node.render()之后生效，否则会被覆盖,此种写法在焦点离开后会恢复
	outline.stroke("green",3);	
	outline.fill("red");
	textnode.fill("orange");
	
}

/**
 * 显示卡片
 * @param node	鼠标滑过的节点
 * @param position	鼠标所在位置
 * @returns
 */
function showCard(node,x,y){
	if(lockCard) return;	//如果显示卡片的状态是锁定的 则不显示
	if(!node) return;
	$cardDiv.hide();
	//判断如何浮出
	$cardDiv.css("left",x).css("top",y).show();
}

/**
 * 隐藏并清理卡片内容
 * @returns
 */
function cleanCard(){
	$cardDiv.hide();
}

/**
 * 隐藏右侧栏
 * @returns
 */
function hideRight(){
	$("#rightbox").hide();
}

function showRight(nodeid){
	$("#rightbox").show();
}
/**
 * 保存事件的处理
 * @returns
 */
function handleSave(){
	console.log("触发保存事件后处理,调用saveMindMap");
	saveMindMap();
}

/**
 * 内容发生变更则触发保存
 * @returns
 */
function handleChange(){
	//console.log("是否加载完成:",!window.loading);
	if(!window.loading){
		//console.log("发生变化");
	}
}
/**
 * 重新保存脑图
 * @returns
 */
function saveMindMap() {
    editor.minder.exportData('json').then(function (content) {
        //todo 需要调用保存脑图的接口
    	
    });
}


