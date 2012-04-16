
var Preference =
{
	ResPopupDelay: 500,
	PostScheme: "bbs2ch:post:",
	ReplyCheckMaxWidth: 10,	//これ以上の数のレスに言及する場合は逆参照としない(>>1-1000とか)
};


/* ■prototype.js■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
Function.prototype.bind = function() {
  var __method = this, args = $A(arguments), object = args.shift();
  return function() {
    return __method.apply(object, args.concat($A(arguments)));
  }
}
var $A = Array.from = function(iterable) {
  if (!iterable) return [];
  if (iterable.toArray) {
    return iterable.toArray();
  } else {
    var results = [];
    for (var i = 0, length = iterable.length; i < length; i++)
      results.push(iterable[i]);
    return results;
  }
}
Array.prototype.include = function(val) {
	for(var i=0;i<this.length;i++){
		if (this[i]==val) return true;
	}
	return false;
}
var $=function(id){return document.getElementById(id);}


/* ■イベントハンドラ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var EventHandlers = {
	//インスタンスが複数あるものについては、ここでハンドラを登録。
	//ひとつしかないものは、HTMLやらにnodeに直接登録してしまえばOK。
	init: function()
	{
		document.addEventListener("mouseover", this.mouseOver.bind(this), false);
		document.addEventListener("click",     this.mouseClick.bind(this), false);
		document.addEventListener("b2raboneadd", this.aboneImmidiate.bind(this), false);
	},
	mouseOver: function(aEvent)
	{
		var t = aEvent.target;
		if (Util.isDecendantOf(t, "resMenu"))
		{	//レスメニューにポイント → 何もしない
			//(resMenuがArticleの子要素になるので、これがないと干渉してしまう
			return;
		}
		var res = Util.getDecendantNode(t, "ARTICLE");
		if (res != null)
		{	//レスの上にポイント → レスメニューを持ってくる
			MessageMenu.attach(res);
		}
		if (t.className=="resPointer")
		{
			new ResPopup(t);
		}		//レスアンカーにポイント → レスポップアップ
		//リソース(画像とか動画とか)リンクにポイント → リソースポップアップ
		//スレURLにポイント → スレタイのポップアップ
		//その他URLにポイント → simpleapi
		//名前が数字 → ポップアップ
		//
	},
	mouseClick: function (aEvent)
	{
	},
	aboneImmidiate: function (aEvent)
	{
	},
};

/* ■レスメニューの処理■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var MessageMenu = {
	init: function()
	{
		this._menu = $("resMenu");
		this._menu.parentNode.removeChild(this._menu);	//これあったほうが安心感がある
	},

	attach: function(node)
	{	//nodeはARTICLEでなければならない。ARTICLE以外(nullを含む)を指定すると、メニューはどこにも表示されなくなる。
		var m = this._menu;		//参照コピ～
		if (m == null) return;	//レスメニューなし
		if (m.parentNode != null) m.parentNode.removeChild(m);	//デタッチ
		if ((node != null) && (node.tagName == "ARTICLE"))
		{
			m.dataset.binding = node.dataset.no;
			//node.childNodes[0].appendChild(m);
			node.insertBefore(m, node.childNodes[1]);
			//node.appendChild(m);
			//TODO: pickup, bookmark, hiding状態の反映
		}
		else
		{
			m.dataset.binding = 0;
		}
	},
	ResTo: function(event)
	{	//これにレス
		var resTo = this._menu.dataset.binding;
		var url = Preference.PostScheme + ThreadInfo.Url;
		if(resTo) url += resTo;
		window.location.href = url;
	},
	PopupRef: function(event)
	{
	},
	ExtractRef: function(event)
	{
	},
	CreateRefTreeHear: function(event)
	{	//参照ツリーを構築する
		var current = this._menu.dataset.binding;
		if (current == 0) return;
		var node = this._menu.parentNode;
		if (node == null) return;
		this._deleteExistTree(node);
		this._createNodeTree(current, node);
	},
	_deleteExistTree: function(node)
	{	//既存のツリーを削除
		while(node.childNodes.length > 3)
		{
			node.removeChild(node.childNodes[3]);
		}
	},
	_createNodeTree: function(from, c)
	{	//使ったノードを削除するかどうかは、議論が分かれるところ。とりあえず残しておく。
		if (MessageStructure.nodesReplyFrom[from])
		{	//fromにレスしているコメントがある・・・
			var rf = MessageStructure.nodesReplyFrom[from];
			for(var i=0, j = rf.length; i < j; i++)
			{
				var node = ThreadMessages.domobj[rf[i]].cloneNode(true);	//ARTICLE
				if (rf[i] > from)
				{	//基点より前のレスは再帰的に開かない（無限ループ対策）
					this._createNodeTree(rf[i], node);
				}
				this._deleteExistTree(node);
				c.appendChild(node);
			}
		}
	},
	
	SetBookmark: function(event)
	{
	},
	ResetBookmark: function(event)
	{
	},
	SetPickup: function(event)
	{
	},
	ResetPickup: function(event)
	{
	},
	ToggleHiding: function(event)
	{
	},
	ExtractImages: function(event)
	{
	},

};

/* ■レスの処理■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var ThreadMessages = {
	domobj: new Array(),	//DOMオブジェクト。indexはレス番号
	jsobj: new Array(),		//DOMオブジェクトから抽出したコンテンツ。indexはレス番号

	contains: function(no)
	{
		return (this.jsobj[no] != null)
	},

	processMessages: function (e)
	{	//e: articleのコンテナ
		for(var i=0; i<e.childNodes.length; i++)
		{	//これ、キューに登録して非同期とかにしたほうがいいのかも。
			this.processMessage(e.childNodes[i]);
		}
	},
	processMessage: function (node)
	{
		if (node.tagName == "ARTICLE")
		{
				var no = new Number(node.dataset.no) + 0;
				var msgNode = node.childNodes[1];
				this.extendAnchor(msgNode);
				this.replaceStr(msgNode);
				this.domobj[no] = node;
				
				//アノテーション作成
				var obj = new messageAnnotation();
				obj.no = no;
				obj.aid = node.dataset.aid;
				obj.author = node.childNodes[0].childNodes[3].textContent;	//authorもトリップに対してaが付与されるようなので、こちらで。
				obj.date = node.dataset.date;
				obj.message = msgNode.textContent;
				//mail, beidは要らんのじゃないかな？
				this.jsobj[no] = obj;
				
				//メッセージ構造解析
				MessageStructure.push(node, obj);
		}
	},
	extendAnchor: function(e)
	{	//全角アンカー等拡張
		var as=e.getElementsByTagName("A");
		//var ml=Profiles.maxLinkContent.value;
		for(var i=0;i<as.length;i++){
			var a=as[i];
			//コンマを拡張
			if(a.className=="resPointer"){
				var bro=a.nextSibling;
				var n=bro.textContent;
				if((n)&&(n.match(/^([0-9,\-]+)/))){
					var c=RegExp.$1;
					a.appendChild(document.createTextNode(c));
					bro.data=n.substr(c.length);
				}
			}
			//長すぎるoutLinkを適当に刈り込み
			//else if(a.textContent.length>ml){
			//	var t=a.textContent;
			//	if(t.match(/(h?[ft]?tp:\/\/[^\/]+\/)/)){
			//		a.textContent=RegExp.$1+Message.longUrl;
			//		a.title=t;
			//		classTokenPlus(a,"trimedURL")
			//	}
			//}
		}
		//全角アンカーを拾う("０-９"はFx3だと\dだけで拾えなかったから追加)
		var res=e.innerHTML;
		if(this._dblSizeAnchorRegExp.test(res)){
			res=res.replace(this._dblSizeAnchorRegExp,function (a,b,c){
				c=Util.toNarrowString(c);
				return "<a href='#"+c+"' class='resPointer'>&gt;&gt;"+c+"</a>";});
			e.innerHTML=res;
		}
	},
	replaceStr: function(e)
	{	//replaceStr.txtによる置換
	},
	_dblSizeAnchorRegExp: new RegExp("(＞＞|＞|&gt;&gt;|&gt;)([0-9０-９,\-]+)","g"),
	
};

//スレッド構造
var MessageStructure = {
	nodesById: new Array(),		//いわゆるID
	nodesReplyFrom: new Array(),	//いわゆる逆参照情報
	//ノードを構造に追加。
	push: function(node, obj)
	{
		//IDによる構造
		if (obj.aid.length > 5)		//"????"回避
		{
			if (!this.nodesById[obj.aid]) this.nodesById[obj.aid] = new Array();
			this.nodesById[obj.aid].push(obj.no);
			if (this.nodesById[obj.aid].length == 2)
			{	//TODO: これで複数IDになるので、何かしらの強調表示をする
				var s = $("scriptedStyle");
				s.innerHTML += "article[data-aid=\"" + obj.aid +"\"]{}\n";
			}
		}
		
		//Replyによる構造
		var replyTo = this.getReplyTo(node);
		for(var i=0, j=replyTo.length; i < j; i++)
		{
			var t = replyTo[i];
			if(!this.nodesReplyFrom[t])
			{
				this.nodesReplyFrom[t] = new Array();
				var s = $("scriptedStyle");
				s.innerHTML += "article[data-no=\"" + t +"\"] .menu .resto { display:table-cell; }\n";
			}
			this.nodesReplyFrom[t].push(obj.no);
		}
	},
	getReplyTo: function(node)
	{	//あるノードがレスしている番号の配列を取得する
		var anchors = node.getElementsByClassName("resPointer");
		var replyTo = new Array();
		for (var i=0, j=anchors.length; i<j; i++)
		{
			var target = anchors[i].textContent;
			var ids = MessageUtil.splitResNumbers(target);
			if (ids.length < Preference.ReplyCheckMaxWidth)
			{
				for (var ii=0, jj = ids.length; ii < jj; ii++)
				{
					replyTo[ids[ii]] = 1;
				}
			}
		}
		var ret = new Array();
		for(var i=0, j=replyTo.length; i<j; i++)
		{
			if (replyTo[i]) ret.push(i);
		}
		return ret;
	},
};

//レスのあのテーション情報。検索処理などにはこれを使う。
function messageAnnotation(){ };
messageAnnotation.prototype = {
	no: 0,
	aid: "",
	author: "",
	date: "",
	message: "",
};

/* ■ポップアップ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
function ResPopup(anchor){ this.init(anchor); }
ResPopup.prototype = 
{
	a: null,
	used: false,
	init: function(anchor)
	{
		this.a = anchor;
		var pp = this;

		//Delayを仕掛ける
		var tid = setTimeout(this.popup.bind(this), Preference.ResPopupDelay);
		anchor.addEventListener("mouseout", 
			function(){
					//うっかり同じtidが頒布されても大丈夫なように。
					if (pp.used == false) clearTimeout(tid);
					var arg = arguments.callee;
					anchor.removeEventListener("mouseout", arg, false);
					//alert(tid);	//これを見る限り、常にインクリメントされてる様子ではある
					//if (pp.used != false) alert("OUT");
					//if (pp.used == false) alert("out");
			},false);
	},
	popup: function()
	{	//ポップアップを表示
		this.used = true;
		var target = this.a.textContent;
		var ids = MessageUtil.splitResNumbers(target);
		var pos = Util.getElementPagePos(this.a);
		this.showPopup(ids, pos);
	},
	showPopup: function(ids, pos)
	{
		var container = document.createElement("DIV");
		for(var i=0, len=ids.length; i < len ; i++)
		{
			var c = ThreadMessages.domobj[ids[i]];
			if (c != null)
			{
				var node = c.cloneNode(true);
				container.appendChild(node);
			}
		}
		container.className = "popup";
		container.style.left = pos.pageX + "px";
		container.style.top = pos.pageY + "px";
		//console.log(pos.pageX + " , " + pos.pageY);
		$("popupContainer").appendChild(container);
	},
};


/* ■ユーティリティ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var Util = {
	//数字をﾊﾝｶｸにする
	toNarrowString: function(src)
	{
		var str=new String;
		var len=src.length;
		for(var i=0;i<len;i++){
			var c=src.charCodeAt(i);
			if(c>=65281&&c<=65374&&c!=65340){
				str+=String.fromCharCode(c-65248);
			}else{
				str+=src.charAt(i);
			} 
		}
		return str;
	},
	
	isDecendantOf: function(e, id)
	{
		if (e.id == id) return e;
		if (e.parentNode  == null) return null;
		return this.isDecendantOf(e.parentNode, id);
	},
	getDecendantNode: function(e, tagName)
	{
		if (e.tagName == tagName) return e;
		if (e.parentNode  == null) return null;
		return this.getDecendantNode(e.parentNode, tagName);
	},
	getElementPagePos: function(e)
	{	//要素の絶対座標を求める
		var pos = {pageX: 0, pageY: 0};
		while(e != null)
		{
			pos.pageX += e.offsetLeft;
			pos.pageY += e.offsetTop;
			e = e.offsetParent;
		}
		return pos;
	},
};

var MessageUtil = {
	splitResNumbers: function (str)
	{	//レス番号の切り分け（10-11とかを10,11,12,13,14...に分ける）。戻り値は数字の配列。
		str=str.replace(/>/g,"");
		var e=str.split(",");
		var r=new Array();
		for(var i=0;i<e.length;i++){
			if(e[i].match(/(\d+)-(\d+)/)){
				for(var j=parseInt(RegExp.$1);j <= parseInt(RegExp.$2);j++){
					r.push(j);
				}
			}else if(!isNaN(parseInt(e[i])))r.push(parseInt(e[i]));
		}
		return r;
	},
}











function test()
{
/*  //マルチスレッド処理：通常の処理。しばらく固まって、一気に２００まで表示した
	for(var i=0; i< 200 ;i++)
	{
            document.body.innerHTML += i++ + "<br>";
	}
	alert("FINISH");
//*/
/*	//マルチスレッド処理：Workerを用いた処理。二回postすると、それを順番に処理するようでガス 
	var worker = new Worker("http://127.0.0.1:8823/skin/th.js");
	var container = document.createElement("DIV");
	var dd = {cont: container};
	worker.onmessage = function(event)
	{
		var d = event.data;
		if (d.code == -1)
		{
			alert("FINISH" + d.begins);
			//document.body.appendChild(container);
		}
		else
		{
			//container.appendChild(d.node);
		}
	};
	worker.postMessage({begins: 0});
//*/
	ThreadMessages.processMessages($("resContainer"));
	MessageMenu.init();
	EventHandlers.init();
};

