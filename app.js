window.onload = function(){

    var requesting = false;
	var columnWidth = 200;
    var columnNum;       //列数
    var container = document.getElementById("container");
    var columnHeight;          //每列高度
    var items = [];

    resetColumn();
    requestHandler();

    window.onresize = resizeHandler;        //窗体尺寸变更
    window.onscroll = scrollHandler;        //监听滚动事件

    //重置列数
    function resetColumn(num){
        var temp = Math.max(1, Math.floor(getClientWidth() / columnWidth));
        if(!columnNum || columnNum != temp){            //判断列数是否发生了变更
            columnNum = temp;
            container.style.width = (columnNum * columnWidth) + "px";
            columnHeight = [];
            //重置高度
            for(var i = 0; i<columnNum; ++i)
                columnHeight[i] = 0;
            return true;
        }
    }

    //请求方法，用来获取新的图片，这里都是假的……
    function requestHandler(){
        if(requesting)
            return;
        requesting = true;
        var arr = requestImgs();
        var completeArr = arr.map(function(item){
            return false;
        });
        arr.forEach(function(obj, i){
            var item = document.createElement("div");
            var img = document.createElement("img");
            img.className = "img";
            img.src = obj.url;
            item.appendChild(img);
            container.appendChild(item);
            items.push(item);
            img.onload = function(){            //加载完成之后调用布局方法
                item.className = "item";
                updateLayout(item);
                resetContainerHeight();
                completeArr[i] = true;
                requesting = completeArr.some(function(item){return !item});
            };
        });
    }

    function resetContainerHeight(){
        var max = Math.max.apply(null, columnHeight);
        container.style.height = max+"px";
    }

	function requestImgs(){
		var arr = [];
		for(var i = 0; i<10; ++i)
			arr.push({url: "img/" + i + ".jpg"});
		return arr;
	}

    function updateLayout(item){
        var minHeight = Math.min.apply(null, columnHeight); //列最小高度
        var index = columnHeight.indexOf(minHeight);        //所处列
        item.style.left = (index * columnWidth) + "px";
        item.style.top = minHeight + "px";
        columnHeight[index] += item.offsetHeight;
    }

    function getClientWidth(){
        return document.documentElement.clientWidth || document.body.clientWidth;
    }
    function getClientHeight(){
        return document.documentElement.clientHeight || document.body.clientHeight;
    }
    function getScrollTop(){
        return document.documentElement.scrollTop || document.body.scrollTop;
    }
    function getOffsetHeight(){
        return document.documentElement.offsetHeight || document.body.offsetHeight;
    }

    //窗体尺寸发生改变
    function resizeHandler(){
        if(resetColumn()){
            items.forEach(updateLayout);
            resetContainerHeight();
        }
    }

    function scrollHandler(){
        var documentHeight = getOffsetHeight();                 //页面文档高度
        var clientHeight = getClientHeight();                   //视窗内页面可见区域高度
        var scrollTop = getScrollTop();                         //移动距离
        //在滚动到最底部时：documentHeight = clientHeight + scrollTop;
        //当剩余滑动部分不足视窗内页面可见区域的一半时，发起一次请求
        if(documentHeight - clientHeight - scrollTop < clientHeight / 2){
            requestHandler();
        }
    }
};