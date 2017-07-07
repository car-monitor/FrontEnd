window.onload=function(){
        init();
        ready();
    }
    function add(){
        alert("添加运单");
    }
    function init() {
            var map = new qq.maps.Map(document.getElementById("map"), 
            {center: new qq.maps.LatLng(23.0595162735,113.3946990967),zoom:13});
    }

    function ready(){
        var ele=document.getElementById("listlist");
        ele.setAttribute('class', 'box');
        
        var border=document.createElement("div");
        border.setAttribute("class", 'border');
        ele.appendChild(border);

        var Title=document.createElement("div");
        ele.appendChild(Title);

        var bar1=document.createElement("i");
        bar1.setAttribute('class', 'fa fa-exclamation-circle bar1');
        Title.appendChild(bar1);

        var title=document.createElement("span");
        title.innerHTML="运单";
        Title.appendChild(title);

        var bar2=document.createElement("i");
        bar2.setAttribute("class", "fa fa-trash bar2");
        Title.appendChild(bar2);
        bar2.onclick=function(){
            alert("删除运单");
        }

        var content=document.createElement("div");
        content.setAttribute('class', 'content');
        ele.appendChild(content);
        content.onclick=function(){
            alert("打开运单详情");

        };

        var begin=document.createElement("span");
        begin.innerHTML="起点：";
        content.appendChild(begin);
        var Begin=document.createElement("span");
        Begin.innerHTML="这是出发点";
        begin.appendChild(Begin);
        var br1=document.createElement("br");
        content.appendChild(br1);

        var end=document.createElement("span"); 
        end.innerHTML="终点：";
        content.appendChild(end);
        var End=document.createElement("span");
        End.innerHTML="这是目的地";
        end.appendChild(End);
        var br2=document.createElement("br");
        content.appendChild(br2);

        var btime=document.createElement("span");
        btime.innerHTML="出发时间："
        content.appendChild(btime);
        var Btime=document.createElement("span");
        Btime.innerHTML="----/--/--/ --:--"
        content.appendChild(Btime);
        var br3=document.createElement("br");
        content.appendChild(br3);
        
        var etime=document.createElement("span");
        etime.innerHTML="到达时间："
        content.appendChild(etime);
        var Etime=document.createElement("span");
        Etime.innerHTML="----/--/--/ --:--"
        content.appendChild(Etime);
        
    }
