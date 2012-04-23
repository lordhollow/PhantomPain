var skinName = "PhantomPain3";
var skinVer  = "ver. \"closed alpha\"";
var ownerApp;

var Preference =
{
	ResPopupDelay: 250,			//ポップアップ表示ディレイ(ms)
	PostScheme: "bbs2ch:post:",	//投稿リンクのスキーマ
	ReplyCheckMaxWidth: 10,		//これ以上の数のレスに言及する場合は逆参照としない(>>1-1000とか)
	TemplateAnchor: ">>1-6",	//テンプレポップアップで表示するアンカー
	PopupOffsetX: 16,			//ポップアップのオフセット(基準要素右上からのオフセットで、ヒゲが指す位置）
	PopupOffsetY: 16,			//ポップアップのオフセット
	PopupMargin: 0,				//画面外にはみ出すポップアップを押し戻す量
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
		{	//レスアンカーにポイント → レスポップアップ
			new ResPopup(t);
		}
		else if (t.className == "outLink")
		{
			var p = OutlinkPlugins.getOutlinkPlugin(t);
			if (p) OutlinkPlugins.popupPreview(p, t, aEvent);
		}
		//リソース(画像とか動画とか)リンクにポイント → リソースポップアップ
		//スレURLにポイント → スレタイのポップアップ
		//その他URLにポイント → simpleapi
		//名前が数字 → ポップアップ
		//
	},
	mouseClick: function (aEvent)
	{
		var t = aEvent.target;
		var cancel = false;
		if (t.className == "resPointer")
		{
			//TODO: jumpTo
			if(t.textContent.match(/(\d+)/))
			{
				var id = parseInt(RegExp.$1);
				MessageUtil.focus(id);
			}
			cancel = true;
		}
		if(cancel){
			aEvent.preventDefault();
			aEvent.stopPropagation();
		}
	},
	aboneImmidiate: function (aEvent)
	{
	},
};


/* ■板一覧ペイン■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var BoardPane = {
	init: function()
	{
		this.container = $("boardPane");
		this.container.innerHTML = "";	//全子供殺す

		this.boardList = document.createElement("IFRAME");
		this.boardList.id = "boardList";

		this.container.appendChild(this.boardList);
		
		$("bpHandle").addEventListener("dblclick", this.toggle.bind(this), false);
	},
	toggle: function()
	{
		this._size = this._size ? 0 : window.innerHeight /2;
		this.update();
	},
	update: function()
	{
		this.container.style.height = this._size + "px";
		if (this._size)
		{
			var url = "bbs2ch:board:" + ThreadInfo.Board;
			if (!this.boardList.src) this.boardList.src = url;
		}
	},
};

/* ■レスメニューの処理■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var MessageMenu = {
	init: function()
	{
		this._menu = $("resMenu");
		$("RMenu.Gear").addEventListener("DOMMouseScroll",this.GearWheel.bind(this),false);
		
		this._menu.parentNode.removeChild(this._menu);	//これあったほうが安心感がある
	},

	attach: function(node)
	{	//nodeはARTICLEでなければならない。ARTICLE以外(nullを含む)を指定すると、メニューはどこにも表示されなくなる。
		var m = this._menu;		//参照コピ～
		if (m == null) return;	//レスメニューなし
		if (node == m.parentNode) return;	//同じとこに割り当て→無視
		if (m.parentNode != null) m.parentNode.removeChild(m);	//デタッチ
		this.gearNode = null;
		this.popTrack = null;
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
		var pp = new ResPopup(null);
		pp.offsetX = 8; pp.offsetY = 16;
		pp.popupNumbers(MessageStructure.nodesReplyFrom[this._menu.dataset.binding], Util.getElementPagePos($("RMenu.Ref")) , false);
	},
	ExtractRef: function(event)
	{
	},
	CreateRefTree: function(event)
	{	//参照ツリーを構築する
		this.DeleteRefTree(event);	//一回削除
		
		var current = this._menu.dataset.binding;
		if (current == 0) return;
		var node = this._menu.parentNode;
		if (node == null) return;
		node.dataset.treed = "y";
		this._createNodeTree(current, node);
	},
	
	DeleteRefTree: function(event)
	{	//既存のツリーを削除
		var node = this._menu.parentNode;
		if (node == null) return;
		node.dataset.treed = "n";
		
		while(node.childNodes.length > 3)
		{	//3なのはレスメニューが居るときだけ。居ないときは2ですが、必ず居るので3にする。
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
				var node = ThreadMessages.getNode(rf[i], true, false, function(){});	//ARTICLE
				if (rf[i] > from)
				{	//基点より前のレスは再帰的に開かない（無限ループ対策）
					this._createNodeTree(rf[i], node);
				}
				c.appendChild(node);
			}
		}
	},
	
	SetBookmark: function(event)
	{
		Bookmark.set(this._menu.dataset.binding);
	},
	ResetBookmark: function(event)
	{
		if (Bookmark.no == this._menu.dataset.binding)
		{
			Bookmark.reset();
		}
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
	BeginGear: function(event)
	{
		if (this.gearNode)
		{	//今のところ表示に戻す？
			return;
		}
		var pp = new ResPopup(null);
		pp.offsetX = 8; pp.offsetY = 16; pp.offsetXe = 20;
		pp.popupNumbers([this._menu.dataset.binding], Util.getElementPagePos($("RMenu.Gear")) , false);
		pp.onClose = (function(p){this.gearNode = NULL;}).bind(this);
		var c = pp.container;
		c.dataset.gearmode = "y";
		this.gearNode = c.childNodes[0];
		this.gearPopup = pp;
	},
	GearWheel: function(event)
	{
		if (this.gearNode == null)
		{	//TODO::もしかして必ずしも自動開始したくないかも？
			this.BeginGear(event);
		}
		var id = parseInt(this.gearNode.firstChild.dataset.no);
		id += (event.detail < 0 ) ? -1 : +1;
		if (ThreadMessages.isReady(id))
		{	//TODO::読み込んでくるのもアリのはず
			var n = ThreadMessages.getNode(id, true, false, function(){});
			if (n != null)
			{
				this.gearNode.removeChild(this.gearNode.firstChild);
				this.gearNode.appendChild(n);
				this.gearPopup.adjust(this.gearNode, Util.getElementPagePos($("RMenu.Gear")));
			}
		}
		
		event.preventDefault();
	},
	BeginTracking: function(event)
	{	//トラッキングの開始。指定レスのIDと同じレスを全部強調表示する。
		//IDとtripで個人特定し、連鎖的に強調表示。
		Tracker.BeginTracking(ThreadMessages.jsobj[this._menu.dataset.binding]);
	},
	EndTracking: function(event)
	{	//トラッキングの終了
		Tracker.EndTracking(ThreadMessages.jsobj[this._menu.dataset.binding]);
	},
	PopupTracked: function(event)
	{
		if (this.popTrack)return;	//すでに表示されている
		var obj =ThreadMessages.jsobj[this._menu.dataset.binding];
		if (obj && obj.tracking)
		{
			var ids = obj.tracking.getTrackingNumbers();
			var pp = new ResPopup(null);
			pp.offsetX = 8; pp.offsetY = 16;
			pp.popupNumbers(ids, Util.getElementPagePos($("RMenu.TrPop")) , false);
			this.popTrack = pp;
		}
	}
};

var Menu = {

	PopupTemplate: function()
	{
		var pp = new ResPopup(null);
		pp.offsetX = 8; pp.offsetY = 16;
		pp.popup(Preference.TemplateAnchor, Util.getElementPagePos($("Menu.Template")), true);
	},
	
	JumpToNewMark: function()
	{
	},
	
	JumpToBookmark: function()
	{
		MessageUtil.focus(Bookmark.no);
	},
	
	ResetBookmark: function()
	{
		Bookmark.reset();
	},
};

/* ■レスの処理■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var ThreadMessages = {
	domobj: new Array(),	//DOMオブジェクト。indexはレス番号
	jsobj: new Array(),		//DOMオブジェクトから抽出したコンテンツ。indexはレス番号

	deployedMin: 0,
	deployedMax: 0,
	
	init: function()
	{
		var e = $("resContainer");
		for(var i=0; i<e.childNodes.length; i++)
		{	//これ、キューに登録して非同期とかにしたほうがいいのかも。
			this.processMessage(e.childNodes[i]);
		}
		this.deployedMin = parseInt(e.firstElementChild.dataset.no);
		this.deployedMax = parseInt(e.lastElementChild.dataset.no);
	},
	
	contains: function(no)
	{
		return (this.jsobj[no] != null)
	},

	load: function(min, max, deploy)
	{	//指定範囲のレス(f-t)を読み込み。chaikaが未取得のレスはアクセスしない。
		//deploy=trueのとき、画面にも表示する。
		var r=(min==max)? min+"n" : min+"-"+max+"n";
		var loardUrlStr = ThreadInfo.Server + ThreadInfo.Url + r;
		var req = new XMLHttpRequest();
		req.open('GET', loardUrlStr, false);	//sync
		req.setRequestHeader("If-Modified-Since", "Wed, 15 Nov 1995 00:00:00 GMT");	//キャッシュから読まない
		req.send(null);	
		if ((req.readyState==4)&&(req.status==200)){
			var html = req.responseText;
			if (html.match(/<!--BODY.START-->([\s\S]+)<!--BODY.END-->/))
			{
				var nc = document.createElement("DIV");
				nc.innerHTML = RegExp.$1;
				this.push($A(nc.getElementsByTagName("ARTICLE")), deploy);
			}
		}
		else
		{
			return false;
		}
	},
	
	push: function(nodes, deploy)
	{
		for (var i=0, j=nodes.length; i<j; i++)
		{
			var node = nodes[i];
			var no = parseInt(node.dataset.no);
			if (!this.isReady(no))
			{
				this.processMessage(node);
			}
			if (deploy && !this.isDeployed(no))
			{
				this.deployNode(node)
			}
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
			obj.idcolor = node.dataset.idcolor;
			obj.idbackcolor = node.dataset.idbackcolor;
			obj.author = node.childNodes[0].childNodes[3].textContent;	//authorもトリップに対してaが付与されるようなので、こちらで。
			obj.date = node.dataset.date;
			obj.message = msgNode.textContent;
			//mail, beidは要らんのじゃないかな？
			this.jsobj[no] = obj;
			
			//名前とトリップの抽出
			var name = node.childNodes[0].childNodes[3].textContent;
			node.dataset.author = obj.author = name;
			if (name.match(/◆([^\s]+)/))
			{
				node.dataset.trip = obj.trip = RegExp.$1;
			}
			if (name.match(/^(\d+)(◆.+)?/))
			{
				node.dataset.numberdName = "y";
				obj.numberdName = true;
			}
			//メッセージ構造解析
			MessageStructure.push(node, obj);
		}
	},
	
	deployNode: function(node)
	{
		if (node.parentNode)
		{	//既存の親を除外。loadから来た仮のdivだと思われる。
			node.parentNode.removeChild(node);
		}
		var rc = $("resContainer");
		var nn =  parseInt(node.dataset.no);
		var nextSibling = this.findDeployedNextSibling(nn);
		if (nextSibling)
		{
			rc.insertBefore(node, nextSibling);
		}
		else
		{
			rc.appendChild(node);
		}
		if (nn < this.deployedMin) this.deployedMin = nn;
		if (nn > this.deployedMax) this.deployedMax = nn;
	},
	
	findDeployedNextSibling: function(no)
	{	//insertBeforeの第２引数に使うために、noを超えるnoを持つdeployedアイテムのうち、最もnoの小さいものを返す。
		for(var i=no; i<99999; i++)
		{
			if(this.isDeployed(i))
			{
				return this.domobj[i];
			}
		}
		return null;
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
	getNode: function(id, clone, load, loaded)
	{
		if (this.domobj[id] != null)
		{
			var obj = this.domobj[id];
			if (clone)
			{
				obj = obj.cloneNode(true);
				//objから、本来備わっていないもの(=レスメニューと展開済みツリー、展開済み画像）を削除する。
				//article> { H , (div) , p , オマケたち } の順に並んでいるので、divとオマケを削除する。
				if (obj.childNodes[1].tagName == "DIV")
				{
					obj.removeChild(obj.childNodes[1]);
				}
				while(obj.childNodes.length > 2)
				{
					obj.removeChild(obj.childNodes[2]);
				}
			}
			return obj;
		}
		else
		{	
			if (load)
			{	//TODO: XmlHttpRequest
				//非同期で読み出しかけて、結果はコールバック関数(loaded)で返す。
			}
			//ここがnullを返すのは固定。
			return null;
		}
	},
	isReady: function(id)
	{	//読み込み済みか？
		return (this.domobj[id]);
	},
	isDeployed: function(id)
	{	//普通に表示されているか？
		if ( this.domobj[id])
			if (this.domobj[id].parentNode)
				if (this.domobj[id].parentNode.id == "resContainer")
					return true;
		return false;
	},
	_dblSizeAnchorRegExp: new RegExp("(＞＞|＞|&gt;&gt;|&gt;)([0-9０-９,\-]+)","g"),
	
};

/* ■ブックマーク■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var Bookmark = {

	init: function()
	{
		var no = 0;
		try{
			no = parseInt(CommonPref.getBookmark());
		} finally {}
		if(!no)
		{
			no=0;
		}
		else
		{
			this.set(no);
		}
	},
	
	set: function(no)
	{
		if (this.no) this.reset();
		if (ThreadMessages.jsobj[no])
		{
			ThreadMessages.jsobj[no].marked = true;
			var domobj = document.body.getElementsByTagName("ARTICLE");
			for (var i=0, j=domobj.length; i<j; i++)
			{
				if (domobj[i].dataset.no == no)
				{
					domobj[i].dataset.bm = "y";
				}
			}
			$("Menu.Bookmark").dataset.bm = "y";
			$("Menu.Bookmark").dataset.bmn= no;
			this.no = no;
			CommonPref.setBookmark(no);
		}
	},
	reset: function()
	{
		if (this.no)
		{
			var domobj = document.body.getElementsByTagName("ARTICLE");
			for (var i=0, j=domobj.length; i<j; i++)
			{
				if (domobj[i].dataset.no == this.no)
				{
					domobj[i].dataset.bm = "";
				}
			}
			ThreadMessages.jsobj[this.no].marked = false;
		}
		this.no = 0;
		$("Menu.Bookmark").dataset.bm = "n";
		CommonPref.setBookmark(0);
	},

};


/* ■トラッカー■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var Tracker= {
	_trackers: [],
	
	BeginTracking: function(jsobj)
	{
		for(var i=0, j=this._trackers.length; i<j; i++)
		{
			if (this._trackers[i].check(jsobj)) 
			{
				return; //already tracking
			}
		}
		var tr = new TrackerEntry(jsobj);
		tr.index = this.findBrankIndex();
		this._trackers.push(tr);
		tr.setMark();
	},
	EndTracking: function(jsobj)
	{
		var nt = new Array();
		var tr = null;
		for(var i=0, j=this._trackers.length; i<j; i++)
		{
			if (this._trackers[i].check(jsobj))
			{
				tr = this._trackers[i];
			}
			else
			{
				nt.push(this._trackers[i]);
			}
		}
		this._trackers = nt;
		if (tr) tr.resetMark();
	},
	findBrankIndex: function()
	{
		//空いてる番号を探す
		for(var ni=0; ni<1001; ni++)
		{
			var used = false;
			for(var i=0,j=this._trackers.length; i<j; i++)
			{
				if (this._trackers[i].index == ni)
				{
					used = true;
					break;
				}
			}
			if (!used) return ni;
		}
		return 0;
	},
};

function TrackerEntry(jsobj){ this.init(jsobj); };
TrackerEntry.prototype = {
	aid: null,
	trip: null,
	index: 0,
	
	init: function(jsobj)
	{
		this.trip = [];
		this.aid = [];
		if (jsobj.trip)
		{
			this.trip.push(jsobj.trip);
		}
		if (jsobj.aid.length > 5)
		{
			this.aid.push(jsobj.aid);
		}
	},
	check: function(obj)
	{	//Tripだけひっかかったら1, IDだけひっかかったら2, 両方引っかかったら3
		var m = 0;
		if (!obj) return 0;
		if (obj.trip)
		{
			if (this.containsTrip(obj.trip)) m += 1;
		}
		if (!m && (obj.aid.length > 5))
		{
			if (this.containsId(obj.aid)) m += 2;
		}
		return m;
	},
	containsId: function(id)
	{
		return this.aid.include(id);
	},
	containsTrip: function(trip)
	{
		return this.trip.include(trip);
	},

	setMark: function()
	{
		//alert("setMark {0} {1}".format(entry.aid, entry.trip));
		for (var i=0, j=ThreadMessages.jsobj.length; i<j;i++)
		{
			var obj = ThreadMessages.jsobj[i];
			var m = this.check(obj);	//0:Tracking対象外, 1:Tripによる追跡, 2: Idによる追跡
			if (m > 0)
			{
				obj.tracking = this;
				ThreadMessages.domobj[obj.no].dataset.track = "m" + this.index;
				if ((m == 1) && (obj.aid.length > 5) && (!this.containsId(obj.aid)))
				{	//トリップで引っかかってIDがあるけどID未登録→ID登録
					this.aid.push(obj.aid);
					this.setMark();
				}
				else if ((m==2) && (obj.trip) && (!this.containsTrip(obj.trip)))
				{	//IDで引っかかって、トリップついてるけどそれが登録されていない→登録
					this.trip.push(obj.trip);
					this.setMark();
				}
				var ps = $("popupContainer").getElementsByTagName("ARTICLE");
				for(var l=0, ll=ps.length; l<ll; l++)
				{
					if (ps[l].dataset.no == obj.no) ps[l].dataset.track = "m" + this.index;
				}
			}
		}
	},
	resetMark: function()
	{
		for (var i=0, j=ThreadMessages.jsobj.length; i<j;i++)
		{
			var obj = ThreadMessages.jsobj[i];
			var m = this.check(obj);	//0:Tracking対象外, 1:Tripによる追跡, 2: Idによる追跡
			if (m > 0)
			{
				obj.tracking = null;
				ThreadMessages.domobj[obj.no].dataset.track = "";
				var ps = $("popupContainer").getElementsByTagName("ARTICLE");
				for(var l=0, ll=ps.length; l<ll; l++)
				{
					if (ps[l].dataset.no == obj.no) ps[l].dataset.track = "";
				}
			}
		}
	},
	getTrackingNumbers: function()
	{
		var res = new Array();
		for (var i=0, j=ThreadMessages.jsobj.length; i<j;i++)
		{
			var obj = ThreadMessages.jsobj[i];
			var m = this.check(obj);	//0:Tracking対象外, 1:Tripによる追跡, 2: Idによる追跡
			if (m > 0)
			{
				res.push(obj.no);
			}
		}
		return res;
	},

};

/* ■スレッド構造■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var MessageStructure = {
	nodesById: new Array(),		//いわゆるID
	nodesReplyFrom: new Array(),	//いわゆる逆参照情報
	//ノードを構造に追加。
	push: function(node, obj)
	{
		if (this._scriptedStyle == null)
		{
			this._scriptedStyle = $("scriptedStyle");
		}
		//IDによる構造
		if (obj.aid.length > 5)		//"????"回避
		{
			if (!this.nodesById[obj.aid]) this.nodesById[obj.aid] = new Array();
			this.nodesById[obj.aid].push(obj.no);
			if (this.nodesById[obj.aid].length == 2)
			{	//IDの強調表示。複数あるものだけIDCOLORとIDBACKGROUNDCOLORが有効。そして太字。
				this._scriptedStyle.innerHTML 
					+= "article[data-aid=\"{0}\"] > h2 > .id { color: {1}; background-color: {2}; font-weight: bold; }"
						.format(obj.aid, obj.idcolor, obj.idbackcolor);
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
				//逆参照ありの強調表示。とりあえず逆参照がないときはメニューが表示されない（わかりにくいので強調は必要）
				this._scriptedStyle.innerHTML += 
					("article[data-no=\"{0}\"] > .menu > ul > .resto { display:table-cell; }\n"
					+ "article[data-no=\"{0}\"] > h2 > .no { font-weight: bold; }\n")
						.format(t);
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

//レスのアノテーション情報。検索処理などにはこれを使う。
function messageAnnotation(){ };
messageAnnotation.prototype = {
	no: 0,
	aid: "",
	idcolor: "black",
	idbackcolor: "transparent",
	author: "",
	date: "",
	message: "",
};

/* ■外部リンク■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
const OUTLINK_NON   = 0;	//outlinkじゃない
const OUTLINK_IMAGE = 1;	//画像
const OUTLINK_MOVIE = 2;	//動画
const OUTLINK_2CH   = 3;	//2ch
const OUTLINK_ETC   = 4;	//その他

var OutlinkPlugins = {

	getOutlinkPlugin: function(node)
	{	//適合するアウトリンクプラグインを求める。
		//適合率1ならそれに決定。
		//そうでなければ、より適合率の高そうなものが出るまで繰り返す。
		if (node.className != "outLink") return null;
		var mp = 0;
		var mpt = null;
		for(var i=0, j=this.plugins.length; i < j ; i++)
		{
			var p = this.plugins[i].posivility(node.href);
			if (p >= 1)
			{
				return this.plugins[i];
			}
			else
			{
				if (mp < p)
				{
					mp = p;
					mpt = this.plugins[i];
				}
			}
		}
		return mpt;
	},
	popupPreview: function(plugin, anchor, ev)
	{	//Outlinkのプレビューをポップアップする
	},
};

//画像URL用
var OutlinkPluginForImage = {
	type: OUTLINK_IMAGE,
	posivility: function(href)
	{
		if (href.match(/\.jpg$|jpeg$|bmp$|png$|gif$/i))
		{
			return 1;
		}
		return 0;
	},
	getPopupContent: function()
	{
	},
};

//動画URL用
var OutlinkPluginForMovie = {
	type: OUTLINK_MOVIE,
	posivility: function(href)
	{
		return 0;
	},
	getPopupContent: function()
	{
	},
};

var OutlinkPluginFor2ch = {
	type: OUTLINK_2CH,
	posivility: function(href)
	{
		return (this.is2ch(href)) ? 1 : 0;
	},
	getPopupContent: function()
	{
	},
	//b2rで読めそうなアドレスだとtrueを返す
	is2ch: function(url)
	{
		return (url.match(/\/test\/read.cgi\//));
	},
	//2ch.net, bbspinkならtrue
	isPure2ch: function(url)
	{
		return (url.match(/(2ch.net|bbspink.com|machi.to)\//));
	},
	
	//b2rで表示中？
	isb2r: function(url)
	{
		return (url.match(/\/\/127.0.0.1:\d+\/thread\//));
	},
};

var OutlinkPluginForDefault = {
	type: OUTLINK_ETC,
	posivility: function(href)
	{
		return 1;
	},
	getPopupContent: function()
	{
	},
};

OutlinkPlugins.plugins = [OutlinkPluginForImage, OutlinkPluginForMovie, OutlinkPluginFor2ch, OutlinkPluginForDefault];


/* ■ポップアップ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
function Popup() { }
Popup.prototype = {
	offsetX: Preference.PopupOffsetX,
	offsetY: Preference.PopupOffsetY,
	offsetXe: 0,
	show: function(content, pos, fixed)
	{
		var container = document.createElement("DIV");
		container.appendChild(content);
		container.className = "popup";
		if (fixed) container.style.position = "fixed";
		this.fixed = fixed;
		container.addEventListener("mouseleave", this.close.bind(this), false);
		$("popupContainer").appendChild(container);
		this.limitSize(content, pos);
		this.adjust(content, pos);
		this.container = container;
	},
	
	close: function()
	{
		this.container.parentNode.removeChild(this.container);
		if (this.onClose) this.onClose(this);
	},
	//サイズ制限
	limitSize: function(e, pos)
	{
		//幅・・・画面幅の80%
		//高さ・・・アンカー位置の下側で画面下端まで(40は吹き出しのヒゲの分と若干の余裕）：最低保障３割
		var maxWidth = window.innerWidth *0.8;
		var maxHeight = window.innerHeight - (pos.pageY + Preference.PopupOffsetY - window.pageYOffset) - 40;
		if (maxHeight < window.innerHeight*0.3) maxHeight = window.innerHeight*0.3;
		if(e.clientWidth > maxWidth)
		{
			e.style.width = maxWidth + "px";
		}
		if(e.clientHeight > maxHeight)
		{
			e.style.height = maxHeight + "px";
		}
	},
	//画面内に押し込む(サイズ制限されているので必ず入るはず)。下にしか出ないし、縦にはスクロールできるので横だけ押し込む。
	adjust: function(e , pos)
	{
		//指定アンカー位置からのオフセット
		pos.pageX += this.offsetX;
		pos.pageY += this.offsetY;
		
		//そこに置いたとき、横方向にはみ出す量
		// x = (位置X + 幅 + マージン) - (描画領域幅 - スクロールバー幅 + 追加オフセット)
		var x = (pos.pageX + e.clientWidth +  Preference.PopupMargin) - (window.innerWidth - ScrollBar.size + this.offsetXe) ; 
		if (x < 0) x = 0;	//動かす必要がないときは動かさない
		
		//ポインタ（ひげの先）を持ってくる
		e.parentNode.style.left = pos.pageX + "px";
		e.parentNode.style.top  = pos.pageY + "px";
		
		//箱を持ってくる
		e.style.marginLeft = -(x + 20) + "px";
	},
};

function ResPopup(anchor){ this.init(anchor); }
ResPopup.prototype = new Popup();

	ResPopup.prototype.init = function(anchor)
	{
		//Delayを仕掛ける
		if (anchor != null)
		{
			var tid = setTimeout(this.popup.bind(this, anchor.textContent, Util.getElementPagePos(anchor), false), Preference.ResPopupDelay);
			anchor.addEventListener("mouseout", 
				function(){
					clearTimeout(tid);
					anchor.removeEventListener("mouseout", arguments.callee, false);
				},false);
		}
	};
	ResPopup.prototype.popup =  function(target, pos, fixed)
	{	//ポップアップを表示, targetはレスアンカーの文字列。posはどの要素からポップアップするか
		this.used = true;
		var ids = MessageUtil.splitResNumbers(target);
		this.showPopup(ids, pos, fixed);
	};
	ResPopup.prototype.popupNumbers =  function(ids, pos, fixed)
	{	//ポップアップを表示, idsはレス番号の配列。
		this.used = true;
		this.showPopup(ids, pos, fixed);
	};
	ResPopup.prototype.showPopup =  function(ids, pos, fixed)
	{
		var innerContainer = document.createElement("DIV");
		for(var i=0, len=ids.length; i < len ; i++)
		{
			var node = ThreadMessages.getNode(ids[i], true, false, function(){});
			if (node != null)
			{
				innerContainer.appendChild(node);
			}
		}
		this.show(innerContainer, pos, fixed);
	};



/* ■スクロールバーユーティリティ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var ScrollBar=
{
	size: 26,	//残低地
	VScroll: function(){
		if(window.innerWidth!=document.body.clientWidth){
			this.size=window.innerWidth-document.body.clientWidth;
			return true;
		}else{
			return false;
		}
	},
	HScroll: function(){
		if(window.innerHeight!=document.body.clientHeight){
			this.size=window.innerWidth-document.body.clientHeight;
			return true;
		}else{
			return false;
		}
	}
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
	
	focus: function(no)
	{
		if (ThreadMessages.isDeployed(no))
		{
			var node = ThreadMessages.domobj[no];
			//飛ぶ
			window.scrollTo(0, Util.getElementPagePos(node).pageY - (window.innerHeight * 0.3));
			//目立たせる
			node.dataset.focus = "on";
			setTimeout(function(){ node.dataset.focus = "no"; }, 1000)
		}
	},
}











function init()
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
	ThreadMessages.init();
	ScrollBar.VScroll();	//縦のスクロールバーを基準にサイズを求める。
	MessageMenu.init();
	BoardPane.init();
	Bookmark.init();
	EventHandlers.init();
	ownerApp = $("wa").href.substr(0,6) == "chaika" ? "chaika" : "bbs2chReader";				//アプリ判定
	$("footer").innerHTML = "powerd by {0} with {1} {2}".format(ownerApp, skinName, skinVer);	//フッタ構築
	document.title = ThreadInfo.Title + " - {0}({1})".format(ownerApp, skinName);				//タイトル修正
};

//簡易版string.format。置換しかできない。
// http://www.geekdaily.net/2007/06/21/cs-stringformat-for-javascript/
String.format = function(p_txt){
	if ( arguments.length <= 1 ) {
		return p_txt;
	}
	for( var v_idx = 1, v_num = arguments.length; v_idx < v_num; v_idx++ )
	{
		p_txt = p_txt.replace(new RegExp("\\{" + (v_idx - 1) + "\\}", "gi"), arguments[v_idx]);
	}
	return p_txt;
};

String.prototype.format = function(){
Array.prototype.unshift.apply(arguments, [this]);
return String.format.apply(String, arguments);
};

