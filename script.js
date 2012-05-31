var skinName = "PhantomPain3";
var skinVer  = "ver. \"closed alpha\"";
var ownerApp;

var _Preference =
{	//設定初期値
	ResMenuAttachDelay: 250,	//レスメニューがアタッチされるまでのディレイ(ms)
	ResPopupDelay: 250,			//ポップアップ表示ディレイ(ms)
	PostScheme: "bbs2ch:post:",	//投稿リンクのスキーマ
	ReplyCheckMaxWidth: 10,		//これ以上の数のレスに言及する場合は逆参照としない(>>1-1000とか)
	TemplateLength: 0,			//テンプレポップアップで表示するレスの数
	PopupOffsetX: 16,			//ポップアップのオフセット(基準要素右上からのオフセットで、ヒゲが指す位置）
	PopupOffsetY: 16,			//ポップアップのオフセット
	PopupLeft: 24,				//ポップアップコンテンツ左端～吹き出し右端までの最短距離
	PopupRightMargin: 16,		//ポップアップコンテンツ右端～画面端までの距離
	MoreWidth: 100,				//moreで読み込む幅。0なら全部。
	AutoReloadInterval: 300,	//オートロード間隔(秒)
	ImagePopupSize: 200,		//画像ポップアップのサイズ
	FocusNewResAfterLoad: true,	//ロード時、新着レスにジャンプ
	ViewerPreloadWidth: -1,		//ビューアーの先読み幅。-1はロード時に全て。0は先読みなし。1～は件数（ただし未実装）
	ViewerCursorHideAt: 5,		//メディアビューアでカーソルが消えるまでの時間（秒）
	SlideshowInterval: 5,		//スライドショーの間隔(秒)
	LoadBackwardOnTopWheel: true,	//一番上で上にスクロールしようとするとロードが掛かる
	LoadForwardOnBottomWheel: true,	//一番下で下にスクロールしようとするとロードが掛かる
	LoadOnWheelWidth: 30,		//LoadOnWheelで読み出すレスの数
	LoadOnWheelCheckNew: false,	//LoadOnWheelで新着チェックするか？
	LoadOnWheelDelta: 10,		//LoadBackwardOnTopWheel,LoadForwardOnBottomWheelのかかる回転数
	NoticeLength: 10,			//表示するお知らせの数
};
var Preference = clone(_Preference);

/* ■prototype.js■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
Function.prototype.bind = function prototype_bind() {
	var __method = this, args = $A(arguments), object = args.shift();
	return function() {
		return __method.apply(object, args.concat($A(arguments)));
	}
}
var $A = Array.from = function prototype_arrayFrom(iterable) {
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

var $qA = function prototype_quoteArrayFrom(iterable)
{	//$Aなんだけどクオートで囲む。クオートが入っていればエスケープ。
	if (!iterable) return [];
	var results = [];
	for (var i=0, j=iterable.length; i<j; i++)
	{
		var str = iterable[i];
		str=str.replace(/\"/g, '\\"');
		results.push('"' + str + '"');
	}
	 return results;
}

Array.prototype.include = function prototype_include(val) {
	for(var i=0;i<this.length;i++){
		if (this[i]==val) return true;
	}
	return false;
}

Array.prototype.clone = function() {
	return Array.apply(null, this);
}

function clone(obj) {
	var f = function(){};
	f.prototype = obj;
	return new f;
}

var $=function prototype_getElementById(id){return document.getElementById(id);}

/* ■スキンの設定■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var SkinPref = {

	_skinName: "PhantomPain",
	_storage: localStorage,
	
	_resolvePrefName: function(aPrefName){
		return this._skinName + "_" + aPrefName;
	},
	
	getStr: function(aPrefName, aDefaultValue){
		var item = this._storage.getItem(this._resolvePrefName(aPrefName));
		if(item == null) return aDefaultValue || "";
		return item;
	},
	setStr: function(aPrefName, aValue){
		var value = String(aValue);
		this._storage.setItem(this._resolvePrefName(aPrefName), value);
		return value;
	},

	getInt: function(aPrefName, aDefaultValue){
		var item = this._storage.getItem(this._resolvePrefName(aPrefName));
		if(item == null) return aDefaultValue || 0;
		return parseInt(item);
	},
	setInt: function(aPrefName, aValue){
		var value = parseInt(aValue);
		this._storage.setItem(this._resolvePrefName(aPrefName), value);
		return value;
	},
		
	getBool: function(aPrefName, aDefaultValue){
		var item = this._storage.getItem(this._resolvePrefName(aPrefName));
		if(item == null) return aDefaultValue || false;
		return (item == "true");
	},
	setBool: function(aPrefName, aValue){
		var value = (aValue) ? "true" : "false";
		this._storage.setItem(this._resolvePrefName(aPrefName), value);
		return value;
	}

};

/* ■共通の設定■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var CommonPref = {

	_identifier: new String("UNKNOWN"),
	
	_storage: localStorage,
	
	_resolvePrefName: function CommonPref__resolvePrefName(aPrefName){
		return "bbs2chSkin.common." + aPrefName + this._identifier;
	},
	
	setIdentifier: function CommonPref_setIdentifier(aThreadURL) {
		if (aThreadURL.match(/machi\.to/)) {
			//まちBBS
			var _bbskey ="";
			var _thread = "";
			if (document.location.href.match(/BBS=([^&]+)/i)) {
				_bbskey = RegExp.$1;
			}
			if (document.location.href.match(/KEY=([0-9]+)/i)) {
				_thread = RegExp.$1;
			}
			this._identifier = "machi." + _bbskey + "." + _thread;
		} else {
			//2ch
			if (aThreadURL.match(/([^\/]+)\/([^\/]+)\/$/)) {
				this._identifier = RegExp.$1 + "." + RegExp.$2;
			}
		}
	},
	
	getThreadObjectKey: function(objName)
	{
		return "bbs2chSkin.common." + objName + "." + this._identifier;
	},
	getGlobalObjectKey: function(objName)
	{
		return "bbs2chSkin.common." + objName;
	},
	
	//objName = ブックマーク：bm, ピックアップ：pk, Ignores: ig
	writeThreadObject: function CommonPref_wroteThreadObject(objName, str)
	{
		var pn = "bbs2chSkin.common." + objName + "." + this._identifier;
		this._storage.setItem(pn, str);
	},
	readThreadObject: function CommonPref_readThreadObject(objName,eval)
	{
		var pn = "bbs2chSkin.common." + objName + "." + this._identifier;
		return this._storage.getItem(pn);
	},
	writeGlobalObject: function CommonPref_writeGlobalObject(objName, str)
	{
		var pn = "bbs2chSkin.common." + objName;
		this._storage.setItem(pn, str);
	},
	readGlobalObject: function CommonPref_readGlobalObject(objName)
	{
		var pn = "bbs2chSkin.common." + objName;
		return this._storage.getItem(pn);
	},
};

/* ■イベントハンドラ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var EventHandlers = {
	//インスタンスが複数あるものについては、ここでハンドラを登録。
	//ひとつしかないものは、HTMLやらにnodeに直接登録してしまえばOK。
	init: function EventHandlers_init()
	{
		this.mode = "thread";
		document.addEventListener("keydown", this.keydown.bind(this),false);
		document.addEventListener("mouseover", this.mouseOver.bind(this), false);
		document.addEventListener("click",     this.mouseClick.bind(this), false);
		document.addEventListener("b2raboneadd", this.aboneImmidiate.bind(this), false);
		document.addEventListener("DOMMouseScroll", this.mouseWheel.bind(this), false);
		document.addEventListener("animationstart", this.animationStart.bind(this),false);
		document.addEventListener("animationend", this.animationEnd.bind(this),false);
	},
	enter: function EventHandlers_enter(mode)
	{	//本当はしっかり画面遷移を定義してそれに合わせて勝手に追従すべきなんだろうけど面倒すぎるので普通にモード上書き
		this.mode = mode;
	},
	leave: function EventHandlers_leave(mode)
	{
		this.mode = "thread";
	},
	keydown: function EventHandlers_keydown(e)
	{	//本当はdownで覚える→{keyup(esc)で覚えた分は消える}→keyupで押したキー覚えていれば発火とかがいいんだろうけど面倒すぎる
		var p = true;
		if (this.mode == "thread")
		{
			p = this.invokeThreadKeyHandler(e);
		}
		else if (this.mode == "viewer")
		{
			p = this.invokeViewerKeyHandler(e);
		}
		if (p) e.preventDefault();
	},
	invokeThreadKeyHandler: function EventHandlers_invokeThreadKeyHandler(e)
	{
		switch(e.keyCode)
		{
			case 13:	//Enter
				var url = Preference.PostScheme + ThreadInfo.Url;
				window.location.href = url;
				break;
			default:
				return false;
				break;
		}
		return true;
	},
	invokeViewerKeyHandler: function EventHandlers_invokeViewerKeyHandler(e)
	{
		switch(e.keyCode)
		{
		case 27:
			Viewer.leaveViewerMode();
			break;
		case 33:	//PageUp
		case 37:	//←
			Viewer.prev();
			break;
		case 13:	//Enter
		case 32:	//Sp
		case 34:	//PageDown
		case 39:	//→
			Viewer.next();
			break;
		case 35:	//End
		case 40:	//↓
			Viewer.last();
			break;
		case 36:	//Home
		case 38:	//↑
			Viewer.first();
			break;
		default:
			return false;
			break;
		}
		return true;
	},
	mouseOver: function EventHandlers_mouseOver(aEvent)
	{
		var t = aEvent.target;
		if (Util.isDecendantOf(t, "resMenu"))
		{	//レスメニューにポイント → 何もしない
			//(resMenuがArticleの子要素になるので、これがないと干渉してしまう
			return;
		}
		var res = Util.getDecendantNode(t, "ARTICLE");
		if (res != null)
		{	//レスの上にポイント → レスメニューを(時間差で)持ってくる
			var tid = setTimeout(MessageMenu.attach.bind(MessageMenu, res), Preference.ResMenuAttachDelay);
			res.addEventListener("mouseout",
				function(){
					clearTimeout(tid);
					res.removeEventListener("mouseout", arguments.callee, false);
			}, false);
		}
		if (t.className=="resPointer")
		{	//レスアンカーにポイント → レスポップアップ
			new ResPopup(t);
		}
		else if (t.className == "outLink")
		{	//リソース(画像とか動画とか)リンクにポイント → リソースポップアップ
			var p = OutlinkPlugins.getOutlinkPlugin(t);
			if (p) OutlinkPlugins.popupPreview(p, t, aEvent);
		}
		//スレURLにポイント → スレタイのポップアップ
		//名前が数字 → ポップアップ
	},
	mouseClick: function EventHandlers_mouseClick(aEvent)
	{
		var t = aEvent.target;
		var cancel = false;
		if (t.className == "resPointer")
		{
			//jumpTo
			if(t.textContent.match(/(\d+)/))
			{
				var id = parseInt(RegExp.$1);
				MessageUtil.focus(id);
			}
			cancel = true;
		}
		else if(t.className == "id")
		{	//IDポップアップ
			if (t.__idpopup)
			{
				t.__idpopup.close();
			}
			else
			{
				var ids = MessageStructure.nodesById[t.textContent];
				if (ids)
				{
					ids = ids.sort(function(a,b){return a-b;});
					var pp = new ResPopup(null);
					pp.offsetX = 32; pp.offsetY = 16;
					pp.popupNumbers(ids, Util.getElementPagePos(t) , false);
					t.__idpopup = pp;
					pp.onClose = function(){ t.__idpopup = null; } ;
				}
			}
		}
		else if (t.id == "footer")
		{
			if (Notice.container) Util.notifyRefreshInternal(Notice.container);
		}
		if(cancel){
			aEvent.preventDefault();
			aEvent.stopPropagation();
		}
	},
	LoadOnWheelDelta: 0,
	mouseWheel: function EventHandlers_mouseWheel(e)
	{
		if (e.target.id == "RMenu_Gear")
		{
			if (e.target.enchantedGear)
			{
				if (e.target.enchantedGear.origin != parseInt(MessageMenu._menu.dataset.binding))
				{	//adjust
					e.target.enchantedGear.changePos(Util.getElementPagePos(e.target));
					e.target.enchantedGear.changeOrigin(parseInt(MessageMenu._menu.dataset.binding));
					e.preventDefault();
					return;
				}
			}
			else
			{
				MessageMenu.BeginGear();
				e.preventDefault();
				return;
			}
		}
		var t = Util.getDecendantNodeByData(e.target, "gearEnchanted", "y");
		if (t)
		{
			t.enchantedGear.step(e.detail < 0 ? -1 : 1);
			e.preventDefault();
			return;
		}
		t = Util.getDecendantNodeByData(e.target, "popupEnchanted", "y");
		if (t)
		{
			t = t.childNodes[0];
			if(((e.detail<0)&&(t.scrollTop==0))||
			   ((e.detail>0)&&(t.offsetHeight+t.scrollTop+1>=t.scrollHeight))){
				e.preventDefault();
				return;
			}
		}
		else if (this.mode=="thread")
		{
			if (Preference.LoadBackwardOnTopWheel || Preference.LoadForwardOnBottomWheel)this.resolveLoadOnWheel(e);
		}
	},
	resolveLoadOnWheel: function EventHandlers_resolveLoadOnWheel(e)
	{
		if (Preference.LoadBackwardOnTopWheel 
			&& (window.scrollY == 0)
			&& (e.detail < 0)
			&& (ThreadMessages.deployedMin != 1))
		{
			if (--this.LoadOnWheelDelta < -Preference.LoadOnWheelDelta)
			{
				this.LoadOnWheelDelta = 0;
				var focusTo = ThreadMessages.deployedMin - 1;
				Thread.deploy(-Preference.LoadOnWheelWidth);
				MessageUtil.focus(focusTo);
			}
			e.preventDefault();
		}
		else if (Preference.LoadForwardOnBottomWheel
			 && (window.scrollY >= document.body.offsetHeight - window.innerHeight - 20)
			 && (e.detail > 0)
			 && (ThreadMessages.deployedMax != ThreadInfo.Total))
		{
			if (++this.LoadOnWheelDelta > Preference.LoadOnWheelDelta)
			{
				this.LoadOnWheelDelta = 0;
				var focusTo = ThreadMessages.deployedMax + 1;
				Thread.deploy(Preference.LoadOnWheelWidth);
				MessageUtil.focus(focusTo);
			}
		}
		else
		{
			this.LoadOnWheelDelta = 0;
		}
	},
	animationStart: function EventHandlers_animationStart(aEvent)
	{
		//アニメーション名のラストが「AndClose」である場合、開始時にdisplayを初期化（CSSの定義に従う）
		if (aEvent.animationName.match(/AndClose$/))
		{
			aEvent.target.style.display = "";
		}
	},
	animationEnd: function EventHandlers_animationEnd(aEvent)
	{
		//アニメーション名のラストが「AndClose」である場合、終了時にdisplayをnoneにする
		if (aEvent.animationName.match(/AndClose$/))
		{
			aEvent.target.style.display = "none";
		}
	},
	aboneImmidiate: function EventHandlers_aboneImmidiate(aEvent)
	{
	},
};


/* ■板一覧ペイン■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var BoardPane = {
	init: function BoardPane_init()
	{
		this.container = $("boardPane");
		this.container.innerHTML = "";	//全子供殺す

		this.boardList = document.createElement("IFRAME");
		this.boardList.id = "boardList";

		this.container.appendChild(this.boardList);
		
		$("bpHandle").addEventListener("dblclick", this.toggle.bind(this), false);
	},
	toggle: function BoardPane_toggle()
	{
		this._size = this._size ? 0 : window.innerHeight /2;
		this.update();
	},
	update: function BoardPane_update()
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
	init: function MessageMenu_init()
	{
		this._menu = $("resMenu");
		this._menu.parentNode.removeChild(this._menu);	//これあったほうが安心感がある
	},

	attach: function MessageMenu_attach(node)
	{	//nodeはARTICLEでなければならない。ARTICLE以外(nullを含む)を指定すると、メニューはどこにも表示されなくなる。
		var m = this._menu;		//参照コピ～
		if (m == null) return;	//レスメニューなし
		if (node == m.parentNode) return;	//同じとこに割り当て→無視
		if (m.parentNode != null) m.parentNode.removeChild(m);	//デタッチ
		this.popTrack = null;
		if ((node != null) && (node.tagName == "ARTICLE"))
		{
			m.dataset.binding = node.dataset.no;
			node.insertBefore(m, node.childNodes[1]);
		}
		else
		{
			m.dataset.binding = 0;
		}
	},
	ResTo: function MessageMenu_ResTo(event)
	{	//これにレス
		var resTo = this._menu.dataset.binding;
		var url = Preference.PostScheme + ThreadInfo.Url;
		if(resTo) url += resTo;
		window.location.href = url;
	},
	PopupRef: function MessageMenu_PopupRef(event)
	{
		var node = this._menu.parentNode;
		if (node.dataset.popupRefShowing != "y")
		{
			node.dataset.popupRefShowing = "y";
			var pp = new ResPopup(null);
			pp.offsetX = 8; pp.offsetY = 16;
			pp.onClose = function(){ node.dataset.popupRefShowing = ""; node.refPopup = null; }
			pp.popupNumbers(MessageStructure.nodesReplyFrom[this._menu.dataset.binding], Util.getElementPagePos($("RMenu.Ref")) , false);
			node.refPopup = pp;	//ややこしくなるからdomにobjを持たせたくないけどなぁ・・・
		}
		else
		{
			if (node.refPopup) node.refPopup.close();
		}
	},
	ExtractRef: function MessageMenu_ExtractRef(event)
	{
	},
	CreateRefTree: function MessageMenu_CreateRefTree(event)
	{	//参照ツリーを構築する
		this.DeleteRefTree(event);	//一回削除
		
		var current = this._menu.dataset.binding;
		if (current == 0) return;
		var node = this._menu.parentNode;
		if (node == null) return;
		node.dataset.treed = "y";
		this._createNodeTree(current, node);
	},
	
	DeleteRefTree: function MessageMenu_DeleteRefTree(event)
	{	//既存のツリーを削除
		var node = this._menu.parentNode;
		if (node == null) return;
		node.dataset.treed = "n";
		
		var nodes = $A(node.childNodes).filter(function(x){ return x.tagName == "ARTICLE"; });
		for(var i=0,j=nodes.length; i<j; i++)
		{
			node.removeChild(nodes[i]);
		}
	},
	_createNodeTree: function MessageMenu__createNodeTree(from, c)
	{	//使ったノードを削除するかどうかは、議論が分かれるところ。とりあえず残しておく。
		if (MessageStructure.nodesReplyFrom[from])
		{	//fromにレスしているコメントがある・・・
			var rf = MessageStructure.nodesReplyFrom[from];
			for(var i=0, j = rf.length; i < j; i++)
			{
				var node = ThreadMessages.getNode(rf[i], true);	//ARTICLE
				if (rf[i] > from)
				{	//基点より前のレスは再帰的に開かない（無限ループ対策）
					this._createNodeTree(rf[i], node);
				}
				c.appendChild(node);
			}
		}
	},
	
	SetBookmark: function MessageMenu_SetBookmark(event)
	{
		Bookmark.add(this._menu.dataset.binding);
	},
	ResetBookmark: function MessageMenu_ResetBookmark(event)
	{
		Bookmark.del(this._menu.dataset.binding);
	},
	SetPickup: function MessageMenu_SetPickup(event)
	{
		if (this._menu.dataset.binding != 0)
		{
			Pickup.add(this._menu.dataset.binding);
		}
	},
	ResetPickup: function MessageMenu_ResetPickup(event)
	{
		if (this._menu.dataset.binding != 0)
		{
			Pickup.del(this._menu.dataset.binding);
		}
	},
	ToggleHiding: function MessageMenu_ToggleHiding(event)
	{
	},
	ExtractImages: function MessageMenu_ExtractImages(event)
	{
		OutlinkPlugins.preview(this._menu.parentNode);
	},
	BeginGear: function MessageMenu_BeginGear(event)
	{
		var e = $("RMenu_Gear");
		if (e.enchantedGear)
		{
			e.enchantedGear.close();
		}
		else
		{
			var pp = new GearPopup(e);
			pp.offsetX = 8; pp.offsetY = 16;
			pp.showPopup(parseInt(this._menu.dataset.binding), Util.getElementPagePos(e), false);
		}
	},
	BeginTracking: function MessageMenu_BeginTracking(event)
	{	//トラッキングの開始。指定レスのIDと同じレスを全部強調表示する。
		//IDとtripで個人特定し、連鎖的に強調表示。
		Tracker.add(this._menu.dataset.binding);
	},
	EndTracking: function MessageMenu_EndTracking(event)
	{	//トラッキングの終了
		Tracker.del(this._menu.dataset.binding);
	},
	PopupTracked: function MessageMenu_PopupTracked(event)
	{
		if (this.popTrack)return;	//すでに表示されている
		var tracking = Tracker.getTracker(this._menu.dataset.binding);
		if (tracking)
		{
			var ids = tracking.getTrackingNumbers();
			var pp = new ResPopup(null);
			pp.offsetX = 8; pp.offsetY = 16;
			pp.popupNumbers(ids, Util.getElementPagePos($("RMenu.TrPop")) , false);
			this.popTrack = pp;
		}
	}
};

var Menu = {

	PopupTemplate: function Menu_PopupTemplate(e)
	{
		if (!e) e = $("Menu.Template");
		if (Preference.TemplateLength)
		{
			var pp = new ResPopup(null);
			pp.offsetX = 8; pp.offsetY = 16;
			MessageLoader.load(1, Preference.TemplateLength);
			var tids = [];
			for(var i=1; i<=Preference.TemplateLength; i++) tids.push(i);
			pp.popupNumbers(tids, Util.getElementPagePos(e), true);
		}
		else 
		{	//TemplateLength = 0設定時はギアとして出す
			if (e.enchantedGear)
			{
				e.enchantedGear.close();
			}
			else
			{
				var pp = new GearPopup(e);
				pp.offsetX = 8; pp.offsetY = 16;
				pp.showPopup(1, Util.getElementPagePos(e), true);
			}
		}
	},
	
	JumpToNewMark: function Menu_JumpToNewMark()
	{
		var nn = ThreadInfo.Fetched + 1;
		MessageUtil.focus(nn);
	},
	
	JumpToBookmark: function Menu_JumpToBookmark()
	{
		Bookmark.focus();
	},
	
	ResetBookmark: function Menu_ResetBookmark()
	{
		Bookmark.add(0);
	},
	PopupPickups: function Menu_PopupPickups()
	{
		var pp = new ResPopup(null);
		pp.offsetX = 8; pp.offsetY = 16;
		MessageLoader.load(Pickup.pickups);
		pp.popupNumbers(Pickup.pickups, Util.getElementPagePos($("Menu.Pickup")), true);
	},
	More: function Menu_More()
	{
		if (ThreadMessages.deployedMax == ThreadInfo.Total)
		{
			Thread.check();
		}
		else
		{
			var focusTo = ThreadMessages.deployedMax+1;
			Thread.deploy(30);
			MessageUtil.focus(focusTo);
		}
	},
	MoreBack: function Menu_MoreBack()
	{
		console.log("moreback");
		var focusTo = ThreadMessages.deployedMin-1;
		Thread.deploy(-30);
		MessageUtil.focus(focusTo);
	},
	ToggleAutoMore: function Menu_ToggleAutoMore()
	{
		Thread.toggleAutoCheck();
	},
	PreviewOutlinks: function Menu_PreviewOutlinks()
	{
		for(var i=1; i< ThreadInfo.Total; i++)
		{
			if (ThreadMessages.isDeployed(i))
			{
				OutlinkPlugins.preview(ThreadMessages.domobj[i]);
			}
		}
	},
	ToggleFinder: function Menu_ToggleFinder()
	{
		if (Finder.showing())
		{
			Finder.closeFinderPopup();
		}
		else
		{
			Finder.popupFinderForm(Util.getElementPagePos($("Menu.Finder")), true);
		}
	},
	ShowViewer: function Menu_ShowViewer()
	{
		Viewer.show();
	},
};

var Thread = {
	init: function Thread_init()
	{
		//identifier設定
		var url = new URL(ThreadInfo.Url);
		this.boardId = "{0}.{1}".format(url.type == "2CH" ? "" : url.domain, url.boardId).toLowerCase();
		this.threadId = this.boardId + "." + url.threadId;
		//スレタイ表示部のdeta-boardに登録（なぜスレタイかといわれれば見た目に関することなので、設定で変えられるほうがいいかも）
		var e = $("threadName");
		if (e) e.dataset.board = this.boardId;
	},
	check: function Thread_check()
	{	//新着レスの確認を開始
		this.autoTickCount = 0;	//一回読み込んだらそのときに自動ロードカウンタリセット
		if (ThreadMessages.deployedMax != ThreadInfo.Total)
		{	//最後まで表示されていないときは全部表示してから。
			Thread.deployTo(ThreadInfo.Total);
		}
		if (!this.checking)
		{
			this.checking = true;
			document.body.dataset.loading = "y";
			var req = new XMLHttpRequest();
			req.onreadystatechange = this._loadCheck.bind(this, req);
			req.open('GET', ThreadInfo.Server + ThreadInfo.Url + "l1n", true);
			req.setRequestHeader("If-Modified-Since", "Wed, 15 Nov 1995 00:00:00 GMT");
			req.send(null);
		}
	},
	_loadCheck: function Thread__loadCheck(req, e)
	{
		if (req.readyState==4)
		{	//XmlHttpRequest完了時
			if (!this._update(req.status, req.responseText))
			{	//なんかエラー
				Notice.add("ロードエラー");
			}
			document.body.dataset.loading = "";
			this.checking = false;
		}
	},
	_update: function Thread__update(status, html)
	{
		if ((status >= 200) && (status<300))
		{
			if (html.match(/<\!\-\- INFO(\{.+?\})\-\->/))
			{
				var obj;
				eval("obj = "+ RegExp.$1);	//{ status, total, new }
				if (obj.new)
				{	//新着があるとき～
					if (html.match(/<!--BODY.START-->([\s\S]+)<!--BODY.END-->/))
					{
						var nc = document.createElement("DIV");
						nc.innerHTML = RegExp.$1;
						ThreadMessages.push($A(nc.getElementsByTagName("ARTICLE")));
					}
					this.deployTo(obj.Total);
					MessageUtil.focus(obj.Total - obj.new + 1)
				}
				Notice.add("新着{0}".format(obj.new ? obj.new + "件" : "なし"));
				return true;
			}
		}
		return false;
	},
	beginAutoCheck: function Thread_beginAutoCheck()
	{
		if(this.auto)return;
		this.auto = true
		document.body.dataset.autoload = "y";
		this.autoTickCount = 0;
		this.autoTimer = setInterval(this.autocheckTick.bind(this), 1000);
	},
	endAutoCheck: function Thread_endAutoCheck()
	{
		if (!this.auto)return;
		this.auto = false;
		document.body.dataset.autoload = "";
		clearInterval(this.autoTimer);
		this.autoTimer = 0;
	},
	toggleAutoCheck: function Thread_toggleAutoCheck()
	{
		if (this.auto)
		{
			this.endAutoCheck();
		}
		else
		{
			this.beginAutoCheck();
		}
	},
	autocheckTick: function Thread_autocheckTick()
	{
		if (++this.autoTickCount >= Preference.AutoReloadInterval)
		{
			this.check();
		}
	},
	deploy: function Thread_deploy(width)
	{	//widthが負のときは前方にdeploy, 正のときは後方にdeploy
		this.deployTo(width < 0 ? ThreadMessages.deployedMin + width : ThreadMessages.deployedMax + width);
	},
	deployTo: function Thread_deployTo(to)
	{
		if (to <= 0) to = 1;
		if (to >= ThreadInfo.Total) to = ThreadInfo.Total;
		var min = to,  max = to;
		if (to < ThreadMessages.deployedMin)
		{
			max = ThreadMessages.deployedMin-1;
		}
		if (to > ThreadMessages.deployedMax)
		{
			min = ThreadMessages.deployedMax+1;
		}
		console.log("deployTo: {0}->{1}".format(min,max));
		MessageLoader.load(min, max);
		ThreadMessages.deploy(min, max);
	},

};

/* ■レスの処理■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var ThreadMessages = {
	domobj: new Array(),	//DOMオブジェクト。indexはレス番号
	outLinks: new Array(),
	
	deployedMin: 0,
	deployedMax: 0,
	
	init: function ThreadMessages_init()
	{
		var e = $("resContainer");
		for(var i=0; i<e.children.length; i++)
		{	//これ、キューに登録して非同期とかにしたほうがいいのかも。
			this.processMessage(e.children[i]);
		}
		this.deployedMin = parseInt(e.firstElementChild.dataset.no);
		this.deployedMax = parseInt(e.lastElementChild.dataset.no);
	},
	
	deploy: function ThreadMessages_deploy(min, max)
	{	//minからmaxまでをdeployNodeする。
		//ロードされていないものはロードしないのであらかじめload(min, maxしておくように!）
		for(var i=min; i<=max; i++)
		{
			this.deployNode(this.domobj[i]);
		}
	},
	
	push: function ThreadMessages_push(nodes)
	{
		for (var i=0, j=nodes.length; i<j; i++)
		{
			var node = nodes[i];
			var no = parseInt(node.dataset.no);
			if (!this.isReady(no))
			{
				this.processMessage(node);
			}
		}
	},

	processMessage: function ThreadMessages_processMessage(node)
	{
		if (node.tagName == "ARTICLE")
		{
			var no = new Number(node.dataset.no) + 0;
			var msgNode = node.childNodes[1];
			this.extendAnchor(msgNode);
			this.replaceStr(msgNode);
			this.domobj[no] = node;
			this.outLinks[no] = $A( node.getElementsByClassName("outLink"));
			//新着判定
			if(node.childNodes[0].className=="new")
			{
				document.body.dataset.hasNew = "y";
			}
			
			//名前とトリップの抽出
			var name = node.childNodes[0].childNodes[3].textContent;
			node.dataset.author = name;
			if (name.match(/◆([^\s]+)/))
			{
				node.dataset.trip = RegExp.$1;
			}
			if (name.match(/^(\d+)(◆.+)?/))
			{
				node.dataset.numberdName = "y";
			}
			//メッセージ構造解析
			MessageStructure.push(node);
			
			MarkerServices.nodeLoaded(node);
		}
	},
	
	deployNode: function ThreadMessages_deployNode(node)
	{
		if(!node)return;	//ほぎゃ！
		if(node.tagName != "ARTICLE") return;	//ほぎゃ！
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
	
	findDeployedNextSibling: function ThreadMessages_findDeployedNextSibing(no)
	{	//insertBeforeの第２引数に使うために、noを超えるnoを持つdeployedアイテムのうち、最もnoの小さいものを返す。
		for(var i=no; i<=this.deployedMax; i++)
		{
			if(this.isDeployed(i))
			{
				return this.domobj[i];
			}
		}
		return null;
	},
	
	extendAnchor: function ThreadMessages_extendAnchor(e)
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
			else if (a.className=="outLink")
			{	//あまりよろしくないけどここが一番効率的かも
				if (OutlinkPluginForImage.posivility(a.href))
				{
					e.parentNode.dataset.hasImage = "y";
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
	replaceStr: function ThreadMessages_replaceStr(e)
	{	//replaceStr.txtによる置換
	},
	getNode: function ThreadMessages_getNode(id, clone)
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
				//outlinkのpreviewShowingをすべてnにする
				var outlinks = obj.getElementsByClassName("outLink");
				for(var i=0, j=outlinks.length; i<j; i++)
				{
					outlinks[i].dataset.previewShowing = "n";
				}
			}
			return obj;
		}
		return null;
	},
	foreach: function ThreadMessages_foreach(func, includePopup)
	{
		var nodes = includePopup ? $A(document.body.getElementsByTagName("ARTICLE")) : this.domobj;
		for (var i=0, j=nodes.length; i<j; i++)
		{
			if (nodes[i]) func(nodes[i]);
		}
	},
	getDeployMode: function ThreadMessages_getDeployMode(no)
	{	//ブックマークの位置によってn(変),yb(表示範囲より前),y(表示範囲内),ya(表示範囲より後ろ)のいずれかを返す
		if (no <= 0)
		{
			return "n";
		}
		else if (no < ThreadMessages.deployedMin)
		{
			return "yb";
		}
		else if (no > ThreadMessages.deployedMax)
		{
			return "ya";
		}
		else
		{
			return "y";
		}
	},
	isReady: function ThreadMessages_isReady(id)
	{	//読み込み済みか？
		return (this.domobj[id]);
	},
	isDeployed: function ThreadMessages_isDeployed(id)
	{	//普通に表示されているか？
		if ( this.domobj[id])
			if (this.domobj[id].parentNode)
				if (this.domobj[id].parentNode.id == "resContainer")
					return true;
		return false;
	},
	_dblSizeAnchorRegExp: new RegExp("(＞＞|＞|&gt;&gt;|&gt;)([0-9０-９,\-]+)","g"),
	
};


/* ■ローダー■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var MessageLoader = {
	load: function MessageLoader_load(min, max)
	{	//minからmaxまでをログピックアップモードで読み出してReadyにする。
		//alert([min, max]);
		if (min instanceof Array)
		{
			for(var i=0; i<min.length; i++)
			{
				this.load(min[i],min[i]);
			}
			return;
		}
		var tmin = min;
		var tmax = max;
		if (tmax > ThreadInfo.Total) tmax = ThreadInfo.Total;	//絶対取れないところはとりに行かない。
		for(; tmin <= tmax; tmin++)
		{	//tmin位置が読み込み済みならtminを+1
			if (!ThreadMessages.isReady(tmin))	break;
		}
		for(; tmax >= tmin; tmax--)
		{	//tmax位置が読み込み済みならtmaxを-1
			if (!ThreadMessages.isReady(tmax))	break;	
		}
		if ((tmin <= tmax) && (tmin != 0))
		{	//min-maxの範囲に少なくとも１個は取得すべきレスあり
			var loardUrlStr = ThreadInfo.Server + ThreadInfo.Url + tmin + "-" + tmax;
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
					ThreadMessages.push($A(nc.getElementsByTagName("ARTICLE")));
					return true;
				}
				return false;
			}
		}
	},
	
	loadByAnchorStr: function MessageLoader_loadByAnchorStr(str)
	{
		str=str.replace(/>/g,"");
		var e=str.split(",");
		var r=new Array();
		for(var i=0;i<e.length;i++)
		{
			if(e[i].match(/(\d+)(-(\d+))?/))
			{
				var min = parseInt(RegExp.$1);
				var max = parseInt(RegExp.$3);
				if (!max) max = min;
				this.load(min, max);
			}
		}
	},
};

/* ■マーカーサービス■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
function MarkerService(g,k,m,ma){this.init(g,k,m,ma);}
MarkerService.prototype = {
	global: false,	//スレごとに覚えるマーカーはfalse, 全体で覚えるマーカーはtrueにする
	storageKey: "_markerservice",	//ストレージのキー
	mark: "mk",	//レスにマーキングする時のデータセットの名前。mkならnode.dataset.mk="y"(yの部分はMarkerService_getMarkerClassで取得)となる。
	markAllNode: true,	//全ノードマーク？検索みたいな、domobjにしか影響ないものはfalseにしておくと若干速度アップするかも

	init: function MarkerService_init(g,k,m,ma)
	{
		this.global = g;
		this.storageKey = k;
		this.mark = m;
		this.markAllNode = ma;
	},
	onStorageChanged: function MarkerService_onStorageChanged(e)
	{	//ストレージ内容が変化したときよびだされる。
		//console.log("{0}:{1} => {2}".format(e.key, e.oldValue, e.newValue));
		if (this.isMineStorageDataChanged(e.key))
		{
			this.refresh(e.newValue, e.oldValue);
		}
	},
	isMineStorageDataChanged: function MarkerService_isMineStorageDataChanged(key)
	{
		if(this.global)
		{
			return (CommonPref.getGlobalObjectKey(this.storageKey) == key);
		}
		else
		{
			return (CommonPref.getThreadObjectKey(this.storageKey) == key);
		}
	},
	save: function MarkserService_save()
	{
		var str = this.getSaveStr();
		if (this.global)
		{
			CommonPref.writeGlobalObject(this.storageKey, str);
		}
		else
		{
			CommonPref.writeThreadObject(this.storageKey, str);
		}
	},
	load: function MarkerService_load()
	{
		return (this.global) ?
			CommonPref.readGlobalObject(this.storageKey) : CommonPref.readThreadObject(this.storageKey);
	},
	refresh: function MarkerService_refresh(newValue, oldValue)
	{	//マーキングしたりされたりするごとにちゃんと保存しておけば、自分が書いたものとの差分によって処理できると見た！
		
	},
	add: function MarkerService_set(no)
	{	//こいつをマーキングしろ！という指示
		if (this._add(no))
		{
			this.setMark();
			this.save();
		}
	},
	del: function MarkerService_del(no)
	{	//こいつのマーキングを解除しろ！という指示
		if (this._del(no))
		{
			this.setMark();
			this.save();
		}
	},
	isMarked: function MarkerService_isMarked(no)
	{	//こいつはマーキングされていますか？
		//逐次マーキングが反映されていれば、これでいいはず。
		//検索はポップアップとかに及ばないけど、domobjには及ぶので。
		//var node = ThreadMessages.domobj[no];
		//return (node && (node.getAttribute("data-" + this.mark)=="y");
		return false;
	},
	setMark: function MarkerService_mark()
	{
		var mark = this.mark;
		var T = this;
		ThreadMessages.foreach(function(node){
			node.dataset[mark] = T.getMarkerClass(node);
		}, this.markAllNode);
		if(this.marked) this.marked();	//マーク後処理
	},
	getMarkerClass: function MarkerService_getMarkerClass(node)
	{
		return "";
	},
	nodeLoaded: function MarkerService_nodeLoaded(node)
	{	//markAllNodeがtrueのときは、ロードされたときにこれが発動する。
		node.dataset[this.mark] = this.getMarkerClass(node);
		if(this.marked) this.marked();	//マーク後処理
	},
};

var MarkerServices = {
	service: new Array(),
	
	push: function MarkerServices_push(service)
	{
		if(service)
		{
			this.service.push(service);
			if(this.service.length==1)
			{	//最初の一個登録時→ストレージイベントを追加
				window.addEventListener("storage", this.onStorageChanged.bind(this), false);
			}
		}
	},
	nodeLoaded: function MarkerServices_nodeLoaded(node)
	{
		for(var i=0, j=this.service.length; i<j;i++)
		{
			var s = this.service[i].nodeLoaded(node);
		}
	},
	onStorageChanged: function MarkerServices_onStorageChanged(ev)
	{
		if (e.newValue == e.oldValue) return;	//変化なしなら帰る（そんなことがあるかどうかは知らない）
		for(var i=0, j=this.service.length; i<j;i++)
		{
			var s = this.service[i].onStorageChanged(ev);
		}
	},
};


/* ■ブックマーク■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var Bookmark = new MarkerService(false, "bm", "bm", true);
	Bookmark.init = function Bookmark_init()
	{
		this.no = 0;
		var no = parseInt(this.load());
		no = !no ? 0 : no;
		this.refresh(no, no);
		MarkerServices.push(this);
	}
	Bookmark.getSaveStr = function Bookmark_getSaveStr()
	{
		return this.no;
	}
	Bookmark._add = function Bookmark_add(no)
	{
		this.no = no;
		return true;
	}
	Bookmark._del = function Bookmark_del(no)
	{
		if (this.no == no)
		{
			this.add(0);
			return true;
		}
		return false;
	}
	Bookmark.refresh = function Bookmark_refresh(newValue, oldValue)
	{
		this.add(newValue);
	}
	Bookmark.getMarkerClass = function Bookmark_getMarkerClass(node)
	{
		return (node.dataset.no == this.no) ? "y" : "";
	}
	Bookmark.marked = function Bookmark_marked()
	{
		$("Menu_Bookmark").dataset.bm = ThreadMessages.getDeployMode(this.no);
		$("Menu_Bookmark").dataset.bmn= this.no;
	}
	Bookmark.focus = function Bookmark_focus()
	{
		Thread.deployTo(this.no);
		MessageUtil.focus(this.no)
	}

/* ■ピックアップ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var Pickup = new MarkerService(false, "pk", "pickuped", true);
	Pickup.init = function Pickup_init()
	{
		var pickups = this.load();
		if (!pickups) pickups = "";
		this.refresh(pickups, pickups);
		MarkerServices.push(this);
	}
	Pickup.getSaveStr = function Pickup_getSaveStr()
	{
		return this.pickups + "";
	}
	Pickup._add = function Pickup_add(no)
	{
		if (!this.pickups.include(no))
		{
			this.pickups.push(no);
			this.pickups.sort(function(a,b){return a-b;});
			return true;
		}
		return false;
	}
	Pickup._del = function Pickup_del(no)
	{
		if (this.pickups.include(no))
		{
			this.pickups = this.pickups.filter(function(item, index, array){ return item != no });
			return true;
		}
		return false;
	}
	Pickup.refresh = function Pickup_refresh(nV, oV)
	{
		this.pickups = eval("[" + nV + "]");
		this.setMark();
	}
	Pickup.getMarkerClass = function Pickup_getMarkerClass(node)
	{
		return (this.pickups.include(node.dataset.no)) ? "y" : "";
	}
	Pickup.marked = function Pickup_marked()
	{
		$("Menu.Pickup").dataset.pk = this.pickups.length ? "y" : "n";
		$("Menu.Pickup").dataset.pkc= this.pickups.length;
	}

/* ■トラッカー■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var Tracker =  new MarkerService(true, "tracker", "track", true);
	Tracker.init = function Tracker_init()
	{
		this._trackers = new Array();
		var trackers = this.load();
		if (!trackers) trackers = "";
		this.refresh(trackers, "");
		MarkerServices.push(this);
	}
	Tracker.getSaveStr = function Tracker_getSaveStr()
	{
		var tss = [];
		for(var i=0,j=this._trackers.length; i<j; i++)
		{
			if(this._trackers[i])
			{
				tss.push(this._trackers[i].toString());
			}
		}
		return "[{0}]".format(tss);
	}
	Tracker._add = function Tracker_add(no)
	{
		var node = ThreadMessages.domobj[no];
		if(!node) return false;
		//トラック済みならトラッキングしない
			//if (ThreadMessages.domobj[no].dataset.tracker != "") return false;	//←でいいのかも
		for(var i=0, j=this._trackers.length; i<j; i++)
		{
			if (this._trackers[i].check(no)) return false;
		}
		//新規でトラック
		var trip = new Array();
		var aid = new Array();
		if (node.dataset.aid.length > 5) aid.push(node.dataset.aid);
		if (node.dataset.trip) trip.push(node.dataset.trip);
		var tr = new TrackerEntry(this.findBlankIndex(), trip, aid);
		tr.update();
		this._trackers.push(tr);
		return true;
	}
	Tracker._del = function Tracker_del(no)
	{
		var nt = new Array();
		for(var i=0, j=this._trackers.length; i<j; i++)
		{
			var tracker = this._trackers[i];
			if(tracker.check(no) == 0)
			{
				nt.push(tracker);
			}
		}
		if (nt.length != this._trackers.length)
		{
			this._trackers = nt;
			return true;
		}
		return false;
	}
	Tracker.refresh = function Tracker_refresh(nV, oV)
	{
		if (nV == oV) return;
		var obj;
		try
		{
			obj = eval(nV);
		} catch(e){ obj = new Array(); }
		var trackers = new Array();
		for (var i=0, j=obj.length; i<j; i++)
		{
			var o = obj[i];
			var tr = new TrackerEntry(o.index, o.trip, o.aid);
			tr.update();	//他のスレからの分もあるので、今のスレで引っかかるものがないか更新かける
			trackers.push(tr);
		}
		this._trackers = trackers;
		this.save();
		this.setMark();
	}
	Tracker.getMarkerClass = function Tracker_getMarkerClass(node)
	{
		var a = this._trackers;
		for(var i=0, j=a.length; i<j; i++)
		{
			if (a[i].check(node.dataset.no))
			{
				return "m" + a[i].index;
			}
		}
		return "";
	}
	Tracker.getTracker = function Tracker_getTracker(no)
	{
		var tr = ThreadMessages.domobj[no].dataset.track + "";
		if (tr.match(/^m(\d+)$/))
		{
			var index = RegExp.$1;
			for(var i=0, j=this._trackers.length; i<j; i++)
			{
				if (this._trackers[i].index == index)
				{
					return this._trackers[i];
				}
			}
		}
	}
	Tracker.findBlankIndex = function Tracker_findBlankIndex()
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
	}

function TrackerEntry(index, trip, aid){ this.init(index, trip, aid); };
TrackerEntry.prototype = {
	aid: null,
	trip: null,
	index: 0,
	
	init: function TrackerEntry_init(index, trip, aid)
	{
		this.aid = aid;
		this.trip = trip;
		this.index = index;
	},
	
	toString: function TrackerEntry_toString()
	{
		return "{index: {0}, aid: [{1}], trip: [{2}]}".format(this.index, $qA(this.aid), $qA(this.trip));
	},
	update: function TrackerEntry_update()
	{	//既存データがマッチしていれば再帰的に追加していく
		var tr = this;
		ThreadMessages.foreach(function(node){
			var m = tr.check(node.dataset.no);
			if (m > 0)
			{
				if ((m & 1) && (node.dataset.aid.length > 5) && (!tr.containsId(node.dataset.aid)))
				{	//トリップで引っかかってIDがあるけどID未登録→ID登録
					tr.aid.push(node.dataset.aid);
					tr.update();
				}
				else if ((m&2) && (node.dataset.trip) && (!tr.containsTrip(node.dataset.trip)))
				{	//IDで引っかかって、トリップついてるけどそれが登録されていない→登録
					tr.trip.push(node.dataset.trip);
					tr.update();
				}
			}
		},false);
	},
	check: function TrackerEntry_check(no)
	{	//Tripだけひっかかったら1, IDだけひっかかったら2, 両方引っかかったら3
		var m = 0;
		if (!ThreadMessages.isReady(no)) return 0;
		var node = ThreadMessages.domobj[no];
		if (node.dataset.trip)
		{
			if (this.containsTrip(node.dataset.trip)) m += 1;
		}
		if (!m && (node.dataset.aid.length > 5))
		{
			if (this.containsId(node.dataset.aid)) m += 2;
		}
		return m;
	},
	containsId: function TrackerEntry_containsId(id)
	{
		return this.aid.include(id);
	},
	containsTrip: function TrackerEntry_containsTrip(trip)
	{
		return this.trip.include(trip);
	},
	getTrackingNumbers: function TrackerEntry_getTrackingNumbers()
	{
		var res = new Array();
		var tr = this;
		ThreadMessages.foreach(function(node){
			if (tr.check(node.dataset.no) > 0)
		{
				res.push(node.dataset.no);
			}
		}, false);
		return res;
	},

};

/* ■スレッド構造■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var MessageStructure = {
	nodesById: new Array(),		//いわゆるID
	nodesReplyFrom: new Array(),	//いわゆる逆参照情報
	//ノードを構造に追加。
	push: function MessageStructure_push(node)
	{
		var obj = node.dataset;
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
	getReplyTo: function MessageStructure_getReplyTo(node)
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
/* ■URL分析 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
function URL(url){ this.init(url); }
URL.prototype = {
	init: function URL_init(url)
	{
		this.url = url;
		//bbs2chreader/chaika スレッド表示URL
		this.isReaderUrl = (this.startWith(ThreadInfo.Server));
		if(this.isReaderUrl) url = url.substr(ThreadInfo.Server.length);
		//bbs2chreader/chaika スキン
		this.isReaderSkinUrl = (this.startWith(ThreadInfo.Skin));
		if(this.isReaderSkinUrl) url = url.substr(ThreadInfo.Skin.length);
		//bbs2chreader/chaika 板一覧
		var readerBoardScheme = "bbs2ch:board:";
		this.isReaderBoardUrl = (this.startWith(readerBoardScheme));
		if(this.isReaderBoardUrl) url = url.substr(readerBoardScheme.length);
		readerBoardScheme = "chaika://board/";
		this.isReaderBoardUrl = (this.startWith(readerBoardScheme));
		if(this.isReaderBoardUrl) url = url.substr(readerBoardScheme.length);

		//ドメインとパスの切り分け
		if (url.match(/http:\/\/([^\/]+)(.+)/i))
		{
			this.domain = RegExp.$1;
			this.path   = RegExp.$2;
		}
		
		//スレッド判定
		this.maybeThread = url.match(/\/test\/read.cgi\//) ? true : false;
		
		//4つ(2chか町BBSか2chのクローンかその他WWWか）に分類
		if (this.domain.match(/(2ch.net|bbspink.com)$/))
		{
			this.type =  "2CH";
		}
		else if(this.domain.match(/(machi.to)$/))
		{
			this.type = "MACHI";
		}
		else if(this.maybeThread)
		{
			this.type = "CLONE";
		}
		else
		{
			this.type = "WWW";
		}
		
		//スレッドなら、板とスレッドと表示範囲の指定を取得
		if (this.maybeThread)
		{
			if (url.match(/\/test\/read.cgi\/([^\/]+)\/([^\/]+)(\/(.+))?/))
			{
				this.boardId = RegExp.$1;
				this.threadId= RegExp.$2;
				if (RegExp.$4)
				{
					this.range = RegExp.$4;
				}
				else
				{
					this.range = "";
				}
			}
		}
		//console.log(this);
	},
	startWith: function URL_startWith(x)
	{
		return this.url.substr(0, x.length) == x;
	},
};

/* ■外部リンク■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
const OUTLINK_NON   = 0;	//outlinkじゃない
const OUTLINK_IMAGE = 1;	//画像
const OUTLINK_MOVIE = 2;	//動画
const OUTLINK_2CH   = 3;	//2ch
const OUTLINK_ETC   = 4;	//その他

var OutlinkPlugins = {

	getOutlinkPlugin: function OutlinkPlugins_getOutlinkPlugin(node)
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
	popupPreview: function OutlinkPlugins_popupPreview(plugin, anchor, ev)
	{	//Outlinkのプレビューをポップアップする
		if (anchor != null)
		{
			var tid = setTimeout(this.popup.bind(this, plugin, anchor, Util.isFixedElement(anchor)), Preference.ResPopupDelay);
			anchor.addEventListener("mouseout", 
				function(){
					clearTimeout(tid);
					anchor.removeEventListener("mouseout", arguments.callee, false);
				},false);
		}
	},
	popup: function OutlinkPlugins_popup(plugin, anchor, fixed)
	{
		if (anchor.dataset.previewShowing!="y")
		{
			var p = new Popup();
			pos = Util.getElementPagePos(anchor);
			pos.pageX += anchor.offsetWidth;
			var c = plugin.getPreview(anchor.href, p.adjust.bind(p, pos));
			if (c)
			{
				anchor.dataset.previewShowing = "y";
				var innerCont = document.createElement("DIV");
				innerCont.appendChild(c);
				p.offsetX = 0;
				p.show(innerCont, pos, fixed);
				p.onClose = function(){ anchor.dataset.previewShowing = "n" };
			}
		}
	},
	preview: function OutlinkPlugins_preview(resNode)
	{
		var outlinks = resNode.getElementsByClassName("outLink");
		var container = resNode.getElementsByClassName("outLinkPreview");
		if ((outlinks.length > 0) && (container.length == 0))
		{
			container = document.createElement("DIV");
			container.className = "outLinkPreview";
			resNode.appendChild(container);
			for(var i=0,j=outlinks.length; i<j; i++)
			{
				var plugin = this.getOutlinkPlugin(outlinks[i]);
				var c = plugin.getPreview(outlinks[i].href);
				if (c) container.appendChild(c);
			}
		}
		else
		{	//展開済み or Outlinkなし
			return;
		}
	},
};

//画像URL用
var OutlinkPluginForImage = {
	type: OUTLINK_IMAGE,
	posivility: function OutlinkPluginForImage_posivility(href)
	{
		if (href.match(/\.jpg$|jpeg$|bmp$|png$|gif$/i))
		{
			return 1;
		}
		return 0;
	},
	getPreview: function OutlinkPluginForImage_getPreview(href, onload)
	{
		var p = (new ImageThumbnailOnClickOverlay(href,Preference.ImagePopupSize));
		p.onload = onload;
		return p.container;
	},
};

//動画URL用
var OutlinkPluginForMovie = {
	type: OUTLINK_MOVIE,
	posivility: function OutlinkPluginForMovie_posivility(href)
	{
		return 0;
	},
	getPreview: function OutlinkPluginForMovie_getPreview(href, onload)
	{
		return null;
	},
};

var OutlinkPluginForNicoNico = {
	type: OUTLINK_MOVIE,
	posivility: function OutlinkPluginForNicoNico_posivility(href)
	{	
		if(href.match(/http:\/\/www.nicovideo.jp\/watch\/sm\d+/i))
		{
			return 1;
		}
		return 0;
	},
	getPreview: function OutlinkPluginForNicoNico_getPreview(href, onload)
	{
		if(href.match(/http:\/\/www.nicovideo.jp\/watch\/(sm\d+)/i))
		{
			var c = document.createElement("DIV");
			var thurl = "http://ext.nicovideo.jp/thumb/" + RegExp.$1
			c.innerHTML = '<iframe width="312" height="176" src="{0}" scrolling="no" style="border:solid 1px #CCC;margin-top:12px;" frameborder="0"></iframe>'.format(thurl);
			return c;
		}
		return null;
	},
};

var OutlinkPluginFor2ch = {
	type: OUTLINK_2CH,
	posivility: function OutlinkPluginFor2ch_posivility(href)
	{
		return (this.is2ch(href)) ? 1 : 0;
	},
	getPreview: function OutlinkPluginFor2ch_getPreview(href, onload)
	{
		return null;
	},
	//b2rで読めそうなアドレスだとtrueを返す
	is2ch: function OutlinkPluginFor2ch_is2ch(url)
	{
		return (url.match(/\/test\/read.cgi\//));
	},
	//2ch.net, bbspinkならtrue
	isPure2ch: function OutlinkPluginFor2ch_isPure2ch(url)
	{
		return (url.match(/(2ch.net|bbspink.com|machi.to)\//));
	},
	
	//b2rで表示中？
	isb2r: function OutlinkPluginFor2ch_isb2r(url)
	{
		return (url.match(/\/\/127.0.0.1:\d+\/thread\//));
	},
};

var OutlinkPluginForDefault = {
	type: OUTLINK_ETC,
	posivility: function OutlinkPluginForDefault_posivility(href)
	{
		return 1;
	},
	getPreview: function OutlinkPluginForDefault_getPreview(href, onload)
	{
		var p = new ImageThumbnailOnClickOverlayFrame("http://img.simpleapi.net/small/" + href,Preference.ImagePopupSize);
		p.rel = href;
		return p.container;
	},
};

OutlinkPlugins.plugins = [OutlinkPluginForImage, OutlinkPluginForMovie, OutlinkPluginForNicoNico, OutlinkPluginFor2ch, OutlinkPluginForDefault];

/* ■ロードマネージャ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
function loadManager(){ }
loadManager.prototype = {
	queue: new Array(),
	loadWidth: 5,		//同時ロード要求数。キューがあるときに変えても意味ない
	b: false,
	push: function loadManager_push(href, callback)
	{	//ロード要求突っ込む。有効期限(expired)あったほうがいいかも？
		var qs = this.queue.length;
		this.queue.push({href: href, callback: callback});
		if (!this.b)
		{
			this.b = true;
			setTimeout(this.begin.bind(this), 1);
		}
	},
	begin: function loadManager_begin()
	{
		this.b = false;
		for(var i=0, j = Math.min(this.loadWidth, this.queue.length); i<j; i++)
		{
			this.request(this.queue.shift());
		}
	},
	request: function loadManager_request(obj)
	{
	},
	response: function loadmanager_response(obj, status)
	{
		//console.log("response "+ status + " " + obj.href);
		obj.status = status;
		if(obj.callback)obj.callback(obj);
		this.checkNext();
	},
	checkNext: function()
	{
		if (this.queue.length)
		{
			this.request(this.queue.shift());
		}
	},
};
var ImageLoadManager = new loadManager();
	ImageLoadManager.request = function ImageLoadManager_request(obj)
	{
		obj.img = new Image();
		obj.img.addEventListener("load", this.response.bind(this, obj, "OK"), false);
		obj.img.addEventListener("error", this.response.bind(this, obj, "NG"), false);
		obj.img.src = obj.href;
		//console.log("request "+obj.href);
	}

/* ■画像サムネイル■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
function ImageThumbnail(url, sz){this.thumbSize = sz; if(url) {this.init(url);}}
ImageThumbnail.prototype = {
	//thumbSizeを超えない範囲の大きさを持つ、DIV.ithumbcontainer>CANVASという形の要素を作る。
	//canvasができるのは画像ロード完了後のみ。エラー時はできない。
	thumbSize: 200,
	container: null,	//nodeの子。
	loading: true,
	init: function ImageThumbnail_init(href)
	{
		this.src = href;
		this.container = document.createElement("DIV");
		this.container.className = "ithumbcontainer";
		this.container.dataset.state="loading";	//画像を表示させたいけどURLをここに入れたくないのでこれで頑張って設定
		//this.container.style.width = this.container.style.height = this.thumbSize + "px";

		ImageLoadManager.push(href, this.onLoaderResponse.bind(this));
	},
	
	onLoaderResponse: function ImageThumbnail_onLoaderResponse(obj)
	{
		if (obj.status == "OK")
		{
			this.loaded(obj);
		}
		else
		{
			this.error(obj);
		}
	},
	
	loaded: function ImageThumbnail_loaded(obj)
	{
		this.loading = false;
		var ds = this.ds(obj.img.naturalWidth, obj.img.naturalHeight);
		var c = document.createElement("IMG");
		c.width = ds.width;
		c.height= ds.height;
		c.src   = obj.href;
		this.container.innerHTML = "";
		this.container.appendChild(c);
		this.container.dataset.state="ok";
		if (this.onload) this.onload();
	},
	error: function ImageThumbnail_error(e)
	{
		this.loading = false;
		this.container.dataset.state="error";
		if (this.onload) this.onload();
	},
	ds: function ImageThumbnail_ds(w, h)
	{	//w, hをthmbSizeの矩形に押し込んだときの縦横のサイズを求める。戻り値は{width:?, height:? }
		var r = 1;
		var ms = this.thumbSize;
		if((ms>w)&&(ms>h)){
			r =  1;
		}else{
			r = (w>h)?(ms/w):(ms/h);
		}
		w = Math.floor(w*r);
		h = Math.floor(h*r);
		return {width: w, height: h, offsetX: Math.floor(ms-w)/2, offsetY: Math.floor(ms-h)/2 };
	},
};
/* 下は、クリックするとsrcの内容をオーバーレイで表示するサムネイル */
function ImageThumbnailOnClickOverlay(url, sz){this.thumbSize = sz; this.init(url);}
ImageThumbnailOnClickOverlay.prototype = new ImageThumbnail();
ImageThumbnailOnClickOverlay.prototype.loaded = function ImageThumbnailOnClickOverlay_loaded(e)
{
	ImageThumbnail.prototype.loaded.call(this, e);
	this.container.addEventListener("click", this.showOverlay.bind(this), false);
}
ImageThumbnailOnClickOverlay.prototype.showOverlay = function ImageThumbnailOnClickOverlay_showOverlay()
{
	var ov = document.createElement("DIV");
	ov.className="overlay";
	ov.innerHTML = '<div><img src="{0}" class="ovlImg" style="max-height:{1}px; max-width:{2}px;margin:{3}px"></div>'.format(this.src, window.innerHeight-4, window.innerWidth-2,2);
	document.body.dataset.contentsOverlay = "y";
	ov.addEventListener("click", function(){ ov.parentNode.removeChild(ov); document.body.dataset.contentsOverlay = "";}, false);
	ov.addEventListener("DOMMouseScroll", function(e){ e.preventDefault(); } , false);
	document.body.appendChild(ov);
}

/* 下は、クリックするとsrcの内容をオーバーレイで表示するサムネイル */
function ImageThumbnailOnClickOverlayFrame(url, sz){this.thumbSize = sz; this.init(url);}
ImageThumbnailOnClickOverlayFrame.prototype = new ImageThumbnail();
ImageThumbnailOnClickOverlayFrame.prototype.loaded = function ImageThumbnailOnClickOverlayFrame_loaded(e)
{
	ImageThumbnail.prototype.loaded.call(this, e);
	this.container.addEventListener("click", this.showOverlay.bind(this), false);
}
ImageThumbnailOnClickOverlayFrame.prototype.showOverlay = function ImageThumbnailOnClickOverlayFrame_showOverlay()
{
	var ov = document.createElement("DIV");
	ov.className="overlay";
	ov.innerHTML = '<div><iframe src="{0}" style="height:{1}px"></div>'.format(this.rel, window.innerHeight-32);
	document.body.dataset.contentsOverlay = "y";
	ov.addEventListener("click", function(){ ov.parentNode.removeChild(ov); document.body.dataset.contentsOverlay = ""; }, false);
	document.body.appendChild(ov);
}

/* ■ポップアップ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
function Popup() { }
Popup.prototype = {
	offsetX: Preference.PopupOffsetX,
	offsetY: Preference.PopupOffsetY,
	closeOnMouseLeave: true,
	show: function Popup_show(content, pos, fixed)
	{
		var container = document.createElement("DIV");
		container.appendChild(content);
		container.className = "popup";
		if (fixed) container.style.position = "fixed";
		this.fixed = fixed;
		if (this.closeOnMouseLeave) container.addEventListener("mouseleave", this.checkClose.bind(this), false);
		$("popupContainer").appendChild(container);
		this.container = container;
		this.limitSize(pos);
		this.adjust(pos);
		container.dataset.popupEnchanted = "y";
	},
	checkClose: function Popup_checkClose(aEvent)
	{
		var e=this.container.firstChild;
		if (this.fixed)
		{
			pos = {x: aEvent.clientX, y: aEvent.clientY};
		}
		else
		{
			pos = {x: aEvent.pageX, y: aEvent.pageY};
		}
		var p = Util.getElementPagePos(e);
		console.log(p);
		p.pageX += 12;	//なんかズレてるので補正。この12はなんだろう？PopupOffsetが正しいのか？
		console.log("({2},{3})-({4},{5}): {0},{1}".format(pos.x, pos.y, p.pageX, p.pageY, p.pageX+e.offsetWidth,p.pageY+e.offsetHeight));
		if(pos.x<=p.pageX||
		   pos.y<=p.pageY||
		   pos.x>=p.pageX+e.offsetWidth||
		   pos.y>=p.pageY+e.offsetHeight)this.close();
	},
	close: function Popup_close()
	{
		if (this.closed) return;
		this.closed = true;
		this.container.parentNode.removeChild(this.container);
		if (this.onClose) this.onClose(this);
	},
	//サイズ制限
	limitSize: function Popup_limitSize(pos)
	{
		var e = this.container.firstChild;
		//幅・・・画面幅の80%
		//高さ・・・アンカー位置の下側で画面下端まで(40は吹き出しのヒゲの分と若干の余裕）：最低保障３割
		var maxWidth = window.innerWidth *0.8;
		var poy = (this.fixed) ? 0 : window.pageYOffset;	//固定の時はスクロール位置を気にしない
		var maxHeight = window.innerHeight - (pos.pageY + Preference.PopupOffsetY - poy) - 40;
		if (maxHeight < window.innerHeight*0.3) maxHeight = window.innerHeight*0.3;
		e.style.maxWidth = maxWidth + "px";
		e.style.maxHeight = maxHeight + "px";
	},
	//画面内に押し込む(サイズ制限されているので必ず入るはず)。下にしか出ないし、縦にはスクロールできるので横だけ押し込む。
	adjust: function Popup_adjust(pos)
	{
		this.container.style.left = "-10000px";	//調整前に一度外に追い出さないと折り返した幅になってる
		var px = pos.pageX + this.offsetX, py = pos.pageY + this.offsetY;
		var x = px + this.container.firstChild.offsetWidth - document.body.offsetWidth;
		this.container.style.left = px + "px";
		this.container.style.top  = py + "px";
		x = (x < 0) ?  -Preference.PopupLeft : -(x + Preference. PopupRightMargin);	//吹き出し位置調整
		this.container.firstChild.style.marginLeft = x + "px";
	},
};

function ResPopup(anchor){ this.init(anchor); }
ResPopup.prototype = new Popup();

	ResPopup.prototype.init = function ResPopup_init(anchor)
	{
		//Delayを仕掛ける
		if (anchor != null)
		{
			var tid = setTimeout(this.popup.bind(this, anchor.textContent, Util.getElementPagePos(anchor), Util.isFixedElement(anchor)), Preference.ResPopupDelay);
			anchor.addEventListener("mouseout", 
				function(){
					clearTimeout(tid);
					anchor.removeEventListener("mouseout", arguments.callee, false);
				},false);
		}
	};
	ResPopup.prototype.popup =  function ResPopup_popup(target, pos, fixed)
	{	//ポップアップを表示, targetはレスアンカーの文字列。posはどの要素からポップアップするか
		this.used = true;
		MessageLoader.loadByAnchorStr(target);
		var ids = MessageUtil.splitResNumbers(target);
		this.showPopup(ids, pos, fixed);
	};
	ResPopup.prototype.popupNumbers =  function ResPopup_popupNumbers(ids, pos, fixed)
	{	//ポップアップを表示, idsはレス番号の配列。
		this.used = true;
		this.showPopup(ids, pos, fixed);
	};
	ResPopup.prototype.showPopup =  function ResPopup_showPopup(ids, pos, fixed)
	{
		var innerContainer = document.createElement("DIV");
		for(var i=0, len=ids.length; i < len ; i++)
		{
			var node = ThreadMessages.getNode(ids[i], true);
			if (node != null)
			{
				innerContainer.appendChild(node);
			}
		}
		this.show(innerContainer, pos, fixed);
	};

function GearPopup(enchantElement) { this.init(enchantElement); }
GearPopup.prototype = new Popup();
	GearPopup.prototype.init = function GearPopup_init(enchantElement)
	{
		this.content = document.createElement("DIV");
		if (enchantElement)
		{
			enchantElement.dataset.gearEnchanted = "y";
			enchantElement.enchantedGear = this;
		}
		this.onClose = function()
		{
			if (enchantElement)
			{
				enchantElement.dataset.gearEnchanted = "";
				enchantElement.enchantedGear = null;
			}
		};
	};
	GearPopup.prototype.changePos = function GearPopup_changePos(pos)
	{
		this.pos = pos;
		this.adjust(pos);
	};
	GearPopup.prototype.changeOrigin = function GearPopup_changeOrigin(no)
	{
		this.to(no);
		this.origin = no;
	};
	GearPopup.prototype.showPopup = function GearPopup_showPopup(no, pos, fixed)
	{
		var n = this.getNode(no);
		this.content.appendChild(n);
		this.pos = pos;
		this.origin = no;
		this.show(this.content, pos, fixed);
		var c = this.container;
		c.dataset.gearEnchanted = "y";
		c.enchantedGear = this;
	};
	GearPopup.prototype.to = function GearPopup_to(no)
	{
		if (this.stepping) return;
		this.stepping = true;
		var n = this.getNode(no);
		if (n)
		{
			this.content.innerHTML = "";
			this.content.appendChild(n);
			this.adjust(this.pos);
		}
		this.stepping = false;
	};
		GearPopup.prototype.step = function GearPopup_step(cnt)
	{
		this.to(this.no + cnt);
	};
	GearPopup.prototype.getNode = function GearPopup_getNode(no)
	{
		if (no < 1) no = 1;
		if (no > ThreadInfo.Total) no = ThreadInfo.Total;
		MessageLoader.load(no, no);
		this.no = no;
		return ThreadMessages.getNode(no, true);
	};

/* ■検索・抽出 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var Finder = {
	
	init: function Finder_init()
	{
		this.form = document.createElement("DIV");
		this.form.id = "finder";
		this.form.innerHTML =
			'<form id="fform" onsubmit="Finder.express();return false;">' +
			'<input type="text" size="40" name="q">' +
			'<input type="submit" value="抽出">' +
			'<br>' +
			'<regend><input type="checkbox" name="r">正規表現</regend>' +
			'<regend><input type="checkbox" name="i">大小区別</regend>' +
			'<regend><input type="checkbox" name="p">pickupのみ</regend>' +
			'<span id="fformerr"></span>' +
			'</form>' ;
	},
	
	popupFinderForm: function Finder_popupFinderForm(pos, fixed)
	{
		var content = this.form;
		var p = new Popup();
		p.offsetX = 8; p.offsetY = 16;
		p.closeOnMouseLeave = false;
		p.show(this.form, pos, fixed);
		$("fform").q.value = document.getSelection()
		p.container.dataset.finder = "y";
		this.popup = p;
		this.enterExpressMode();
	},
	closeFinderPopup: function Finder_closeFinderPopup()
	{
		if (this.popup)
		{
			this.popup.close();
			this.popup = null;
			this.leaveExpressMode();
		}
	},
	showing: function Finder_showing()
	{
		return (this.popup != null);
	},
	enterExpressMode: function Finder_enterExpressMode()
	{
		this.pageY = window.scrollY;
		document.body.dataset.expressMode="y";
	},
	leaveExpressMode: function Finder_leaveExpressMode()
	{
		document.body.dataset.expressMode="n";
		window.scrollTo(0,this.pageY);
	},
	express: function Finder_express()
	{	//条件セットしてからコレを呼ぶと、条件に合致するものとしないものでarticleに印をつける
		var cond = $("fform").q.value;
		var reg  = $("fform").r.checked;
		var icase=!$("fform").i.checked;
		var pick = $("fform").p.checked;
		
		if (!reg) cond = this.escape(cond);
		var flag = icase ? "i" : "";
		var exp = null;
		try
		{
			exp = new RegExp(cond, flag);
		}
		catch(e)
		{
			$("fformerr").innerHTML = "<br>" + e;
			return;
		}
		ThreadMessages.foreach(function(node){
			node.dataset.express = (!pick || node.dataset.pickuped =="y") && exp.test(node.textContent) ? "y" : "n";
		}, false);
	},
	escape: function Finder_escape(str)
	{
		var escapechar = "\\{}()[]*-+?.,^$|";
		var ret = "";
		for(var i=0; i< str.length; i++)
		{
			for(var j=0; j<escapechar.length; j++)
			{
				if (escapechar[j] == str[i])
				{
					ret += "\\";
					break;
				}
			}
			ret += str[i];
		}
		return ret;
	},
};

/* ■Viewer■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var Viewer = {
	_entries: null,
	_orderd: null,
	init: function Viewer_init()
	{
		this.auto = false;
		//表示範囲だけが対象なので・・・
		this._entries = new Array();
		this._orderd  = new Array();
		var anchors = $("resContainer").getElementsByClassName("outLink");
		for(var i=0, j = anchors.length; i<j; i++)
		{
			var a = anchors[i];
			var op = OutlinkPlugins.getOutlinkPlugin(a);
			if (op && op.type == OUTLINK_IMAGE)
			{
				var href = a.href;
				if (!this._entries[href])
				{
					var entry = new ViewerEntry(href);
					if (Preference.ViewerPreloadWidth < 0) entry.prepare();
					this._entries[href] = entry;
					this._orderd.push(entry);
				}
				this._entries[href].addRelation(parseInt(Util.getDecendantNode(a, "ARTICLE").dataset.no));
			}
		}
	},
	enterViewerMode: function Viewer_enterViewerMode()
	{
		if (document.body.dataset.mediaview != "y")
		{
			var c = document.createElement("DIV");
			c.id = "ViewerContainer";
			var buttons = [ {name: "home", onclick: "Viewer.home();"},
				{name: "first", onclick: "Viewer.first();"},
				{name: "prev", onclick: "Viewer.prev();"},
				{name: "next", onclick: "Viewer.next();"},
				{name: "last", onclick: "Viewer.last();"},
				{name: "auto", onclick: "Viewer.toggleAuto();"},
				{name: "close", onclick: "Viewer.close();"} ];
			var bhtml = "";
			for(var i=0, j=buttons.length; i < j; i++)
			{
				bhtml += '<button name="{0}" onclick="{1} return false;">'.format(buttons[i].name, buttons[i].onclick);
			}
			c.innerHTML = '<form id="ViewerCtrl"><span id="viewerState"></span><div id="viewerCtrls">' + bhtml + '</div></form>';
			var cc = document.createElement("DIV");
			this.container = cc;
			c.appendChild(cc);
			document.body.appendChild(c);
			document.body.dataset.mediaview = "y";
			document.body.dataset.contentsOverlay = "y";
			EventHandlers.enter("viewer");
			this.cursorHideCheckTimer = setInterval(this.cursorHideCheck.bind(this), 1000);
			this.cursorShowHandler = this.cursorShow.bind(this);
			document.addEventListener("mousemove", this.cursorShowHandler, false);
			this.cursorHideCount = 0;
		}
	},
	leaveViewerMode: function Viewer_leaveViewerMode()
	{
		if (document.body.dataset.mediaview == "y")
		{
			document.body.removeChild($("ViewerContainer"));
			this.container = null;
			EventHandlers.leave("viewer");
			document.body.dataset.mediaview = "";
			document.body.dataset.contentsOverlay = "";
			clearInterval(this.cursorHideCheckTimer);
			document.removeEventListener("mousemove", this.cursorShowHandler, false);
		}
	},
	cursorHideCheck: function Viewer_cursorHideCheck()
	{
		this.cursorHideCount++;
		if (this.cursorHideCount == Preference.ViewerCursorHideAt)
		{
			this.container.dataset.cursor="hide";
		}
	},
	cursorShow: function Viewer_cursorShow()
	{
		this.cursorHideCount = 0;
		this.container.dataset.cursor="shown";
	},
	_clearContainer: function Viewer__clearContainer()
	{
		var nodes = $A(this.container.childNodes);
		for(var i=0, j=nodes.length; i<j; i++)
		{
			this.container.removeChild(nodes[i]);
		}
	},
	home: function Viewer_home()
	{
		this.endSlideshow();
		if(!this.homeCtrl)
		{
			var c = document.createElement("DIV");
			c.id = "viewerHomeCtrl";
			c.innerHTML = '<button name="play" onclick="Viewer.next();return false;"><button name="auto" onclick="Viewer.beginSlideshow();return false;">';
			this.homeCtrl = c;
		}
		var home = this.homeCtrl;
		home.dataset.images = this._orderd.length;
		if (home.parentNode) home.parentNode.removeChild(home);
		this._clearContainer();
		this.container.appendChild(home);
		this.index = -1;
		this.showStatus();
	},
	prev: function Viewer_prev()
	{
		var index = this.index -1;
		if (index < 0 ) index = this._orderd.length - 1;
		this.showImage(this.errorSkipToPrev(index));
	},
	next: function Viewer_next()
	{
		var index = this.index +1;
		if (index >= this._orderd.length) index = 0;
		this.showImage(this.errorSkipToNext(index));
	},
	last: function Viewer_last()
	{
		this.showImage(this.errorSkipToPrev(this._orderd.length - 1));
	},
	first: function Viewer_first()
	{
		this.showImage(this.errorSkipToNext(0));
	},
	toggleAuto: function Viewer_toggleAuto()
	{
		return this.auto ? this.endSlideshow() : this.beginSlideshow();
	},
	beginSlideshow: function Viewer_beginSlideshow()
	{
		if (!this.auto)
		{
			this.auto = true;
			this.slideshowTick = 0;
			if (this.index < 0) this.first();
			this.slideshowTimer = setInterval(this.slideshowUpdate.bind(this), 250);
		}
		$("viewerCtrls").dataset.auto = "y";
		return this.auto;
	},
	endSlideshow: function Viewer_endSlideshow()
	{
		if (this.auto)
		{
			this.auto = false;
			this.slideshowTick = 0;
			clearInterval(this.slideshowTimer);
		}
		$("viewerCtrls").dataset.auto = "";
		return this.auto;
	},
	slideshowUpdate: function Viewer_slideshowUpdate()
	{
		this.slideshowTick += 0.25;
		if (this.slideshowTick >= Preference.SlideshowInterval)
		{
			this.next();
			this.slideshowTick = 0;
		}
	},
	errorSkipToNext: function Viewer_errorSkipToNext(index)
	{
		for (var j = this._orderd.length; index < j; index++)
		{
			if (this._orderd[index].state != ViewerEntryState.Error)
			{
				return index;
			}
		}
		return index;
	},
	errorSkipToPrev: function Viewer_errorSkipToPrev(index)
	{
		for (; index >= 0; index--)
		{
			if (this._orderd[index].state != ViewerEntryState.Error)
			{
				return index;
			}
		}
		return index;
	},
	showImage: function Viewer_showImage(index)
	{
		if ((index < 0) || (index >= this._orderd.length))
		{
			this.home();
		}
		else
		{
			this._clearContainer();
			var e = this._orderd[index].getElement();
			e.style.maxHeight = window.innerHeight + "px";
			e.style.maxWidth  = window.innerWidth + "px";
			this.container.appendChild(e);
			this.index = index;
		}
		if (this.auto) this.slideshowTick = 0;	//スライドショー中に任意で飛ばしたらそこから計測
		this.showStatus();
	},
	getStatus: function Viewer_getStatus()
	{
		var total=0, loading=0, loaded=0, error=0;
		for(var i=0, j=this._orderd.length; i < j ; i++)
		{
			total++;
			var s = this._orderd[i].state;
			if (s == ViewerEntryState.Loading)
			{
				loading++;
			}
			else if (s == ViewerEntryState.Loaded)
			{
				loaded++;
			}
			else if (s == ViewerEntryState.Error)
			{
				error++;
			}
		}
		return {total: total, loading: loading, loaded: loaded, error: error, index: this.index};
	},
	showStatus: function Viewer_showStatus()
	{
		var c = $("viewerState");
		if (c)
		{
			var s = this.getStatus();
			if (this.index >= 0)
			{
				var o = this._orderd[s.index];
				c.innerHTML = '{1}/{0} {5}<BR><a class="resPointer">&gt;&gt;{6}</a>'.format(s.total, s.index+1, s.loading, s.loaded, s.error, o.href, o.relations+"");
			}
			else
			{
				c.innerHTML = "{0} Images.<br><br>".format(s.total);
			}
			var ctrl = $("ViewerCtrl");
			Util.notifyRefreshInternal(ctrl);
		}
	},
	show: function Viewer_show()
	{
		this.init();
		this.enterViewerMode();
		this.home();
	},
	close: function Viewer_close()
	{
		this.endSlideshow();
		this.leaveViewerMode();
	},
};
const ViewerEntryState = { PreLoad: 0, Loading: 1, Loaded: 2, Error: -1}

function ViewerEntry(href){ this.init(href); }
ViewerEntry.prototype = {
	init: function ViewerEntry_init(href)
	{
		this.href = href;
		this.state = ViewerEntryState.PreLoad;
		this.relations = new Array();
	},
	addRelation: function ViewerEntry_addRelation(no)
	{
		if (!this.relations.include(no))
		{
			this.relations.push(no);
			this.relations.sort(function(a,b){return a-b;});
		}
	},
	getElement: function ViewerEntry_getElement()
	{
		this.prepare();
		return this.element;
	},
	loaded: function ViewerEntry_loaded(obj)
	{
		if (obj.status == "OK")
		{
			this.state = ViewerEntryState.Loaded;
			this.element.src = this.href;
		}
		else
		{
			this.state = ViewerEntryState.Error;
			this.element.src = ThreadInfo.Skin + "style/error.png";
		}
	},
	prepare: function ViewerEntry_prepare()
	{
		if (this.state == ViewerEntryState.PreLoad)
		{
			//console.log("preload request " + this.href);
			this.element = document.createElement("IMG");
			this.element.src = ThreadInfo.Skin + "style/loading.gif";
			this.state = ViewerEntryState.Loading;
			ImageLoadManager.push(this.href, this.loaded.bind(this));
		}
	},
	release: function ViewerEntry_release()
	{
		//console.log("release " + this.href);
		this.element = null;
		this.state = ViewerEntryState.PreLoad;
	},
	typename: "ViewerEntry",
};

/* ■通知領域■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var Notice = {
	init: function Notice_init()
	{
		this.container = document.createElement("DIV");
		this.container.id = "noticeContainer";
		document.body.appendChild(this.container);
	},
	add: function Notice_add(msg)
	{
		if (!this.container) this.init();
		if (this.container.childNodes.length == Preference.NoticeLength)
		{
			this.container.removeChild(this.container.firstChild);
		}
		var e = document.createElement("P");
		e.innerHTML = msg;
		this.container.appendChild(e);
		Util.notifyRefreshInternal(this.container);
	},
};

/* ■ユーティリティ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
var Util = {
	//数字をﾊﾝｶｸにする
	toNarrowString: function Util_toNarrowString(src)
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
	
	isDecendantOf: function Util_isDecendantOf(e, id)
	{
		if (e.id == id) return e;
		if (e.parentNode  == null) return null;
		return this.isDecendantOf(e.parentNode, id);
	},
	getDecendantNode: function Util_getDecendantNode(e, tagName)
	{
		if (e.tagName == tagName) return e;
		if (e.parentNode  == null) return null;
		return this.getDecendantNode(e.parentNode, tagName);
	},
	getDecendantNodeByData: function  Util_getDecendantNodeByClass(e, x, v)
	{	//特定追加データの値を持つ親を帰す。
		if (e.dataset && (e.dataset[x] == v))return e;
		if (e.parentNode == null) return null;
		return this.getDecendantNodeByData(e.parentNode, x, v);
	},
	isFixedElement: function Util_isFixedElement(e)
	{
		try
		{
			var style = document.defaultView.getComputedStyle(e, null);
			if (style.position == "fixed") return true;
			if (e.parentNode == null) return false;
			return this.isFixedElement(e.parentNode);
		} catch(e) { return false; }
	},
	getElementPagePos: function Util_getElementPagePos(e)
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
	notifyRefreshInternal: function Util_notifyRefreshInternal(e)
	{
		var element = e;
		element.dataset.refreshState = "refresh";
		setTimeout(function(){element.dataset.refreshState = "";}, 15);
	}
};

var MessageUtil = {
	splitResNumbers: function MessageUtil_splitResNumbers(str)
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
	
	focus: function MessageUtil_focus(no)
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
	var dt1 = new Date();
	Thread.init();	//ここから↓の初期化のうちいくつかを叩くかも
	ThreadMessages.init();
	MessageMenu.init();
	BoardPane.init();
	Bookmark.init();
	Pickup.init();
	Tracker.init();
	Finder.init();
	ownerApp = $("wa").href.substr(0,6) == "chaika" ? "chaika" : "bbs2chReader";				//アプリ判定
	$("footer").innerHTML = "powerd by {0} with {1} {2}".format(ownerApp, skinName, skinVer);	//フッタ構築
	document.title = ThreadInfo.Title + " - {0}({1})".format(ownerApp, skinName);				//タイトル修正
	if (Preference.FocusNewResAfterLoad) Menu.JumpToNewMark();			//新着あればジャンプ
	//TODO::なければブックマークへジャンプとかするかも

	EventHandlers.init();

	Notice.add(ThreadInfo.Status);
	Notice.add("{0} messages.".format(ThreadInfo.Total));
	if (ThreadInfo.New) Notice.add("({0} new messages.)".format(ThreadInfo.New));

	var dt2 = new Date();
	Notice.add("{0} ms for initialize".format(dt2-dt1));
};

//簡易版string.format。置換しかできない。
// http://www.geekdaily.net/2007/06/21/cs-stringformat-for-javascript/
String.format = function String_format(p_txt){
	if ( arguments.length <= 1 ) {
		return p_txt;
	}
	for( var v_idx = 1, v_num = arguments.length; v_idx < v_num; v_idx++ )
	{
		p_txt = p_txt.replace(new RegExp("\\{" + (v_idx - 1) + "\\}", "gi"), arguments[v_idx]);
	}
	return p_txt;
};

String.prototype.format = function StringPrototype_format(){
Array.prototype.unshift.apply(arguments, [this]);
return String.format.apply(String, arguments);
};

