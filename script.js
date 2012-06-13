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
	PopupLeft: 24,				//ポップアップコンテンツ左端～吹き出し右端までの最短距離
	PopupRightMargin: 16,		//ポップアップコンテンツ右端～画面端までの距離
	PopupDestructChain: true,	//ポップアップを連鎖的に破壊するか？
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
	AutoPreviewOutlinks: false,	//Outlinkを自動展開
	ChapterWidth: 100,			//Naviのチャプター幅
	EnableNextThreadSearch: true,	//次スレ検索有効？
	NextThreadSearchBeginsAt: 900,	//次スレ検索開始レス番号
	NoticeLength: 10,			//表示するお知らせの数
	//レスをダブルクリックしたらどうなる？
	//              0=素        1=shift,      2=ctr  3=shift+ctrl,4=alt ,5=shift+alt, 6=ctrl+alt,7=ctrl+alt+shift
	OnResDblClick: ["pickup", "closepopup", "bookmark", "track", "resto", "preview", "preview", "tree"],
	//中身は none(これがデフォルト), bookmark, res, resto, pickup, tree, track, preview, closepopup, setbookmark
 
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

function PP3ResetPreference()
{	//ブックマークレットとして javascript:PP3ResetPreference(); を登録しておくと、リセットすることができます。
	console.log("設定をクリアしました");
}

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
	readThreadObject: function CommonPref_readThreadObject(objName)
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
	foreach: function CommonPref_foreach(objName, proc)
	{
		var ex = new RegExp("^bbs2chSkin\.common\." + objName + "\.");
		for(var key in this._storage)
		{
			if (ex.test(key))
			{
				proc(key, this._storage.getItem(key));
			}
		}
	},
};

/* ■コンフィギュレータ（設定フォーム）■■■■■■■■■■■■■■■ */
var Configulator = {
	toggle: function Configulator_toggle(t)
	{
		if (!t) return;
		if (!t.tagName) t = $(t);
		if (!t) return;
		if (!this.level1)
		{	//初期化
			var cont = document.createElement("DIV");
			cont.id = "prefMenu";
			var html = "";	//TODO::外部ファイルから読み込み
			cont.innerHTML = html;
			this.level1 = cont;
		}
		if (t.__popup)
		{
			t.__popup.close();
		}
		else
		{
			var p = new Popup();
			p.closeOnMouseLeave = false;
			p._init(t);
			p.show(this.level1.cloneNode(true));
			p.onClose = function(){ t.__popup = null; }
			t.__popup = p;
		}
	}
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
		NodeUtil.resTo(this._menu.dataset.binding);
	},
	PopupRef: function MessageMenu_PopupRef(event)
	{
		var node = this._menu.parentNode;
		if (node.dataset.popupRefShowing != "y")
		{
			node.dataset.popupRefShowing = "y";
			var pp = new ResPopup(null);
			pp.onClose = function(){ node.dataset.popupRefShowing = ""; node.refPopup = null; }
			pp.popup(MessageStructure.nodesReplyFrom[this._menu.dataset.binding], "RMenu.Ref");
			node.refPopup = pp;	//ややこしくなるからdomにobjを持たせたくないけどなぁ・・・
		}
		else
		{
			if (node.refPopup) node.refPopup.close();
		}
	},
	ExtractRef: function MessageMenu_ExtractRef(event)
	{
		NodeUtil.expressReffer(this._menu.dataset.binding);
	},
	CreateRefTree: function MessageMenu_CreateRefTree(event)
	{	//参照ツリーを構築する
		NodeUtil.openRefTree(this._menu.parentNode);
	},
	
	DeleteRefTree: function MessageMenu_DeleteRefTree(event)
	{	//既存のツリーを削除
		NodeUtil.closeRefTree(this._menu.parentNode);
	},
	
	SetBookmark: function MessageMenu_SetBookmark(event)
	{
		NodeUtil.setBookmark(this._menu.dataset.binding);
	},
	ResetBookmark: function MessageMenu_ResetBookmark(event)
	{
		NodeUtil.resetBookmark(this._menu.dataset.binding);
	},
	SetPickup: function MessageMenu_SetPickup(event)
	{
		NodeUtil.setPickup(this._menu.dataset.binding);
	},
	ResetPickup: function MessageMenu_ResetPickup(event)
	{
		NodeUtil.resetPickup(this._menu.dataset.binding);
	},
	ToggleHiding: function MessageMenu_ToggleHiding(event)
	{
	},
	ExtractImages: function MessageMenu_ExtractImages(event)
	{
		NodeUtil.previewLinks(this._menu.parentNode);
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
			pp.showPopup(parseInt(this._menu.dataset.binding), Util.getElementPagePos(e), false);
		}
	},
	BeginTracking: function MessageMenu_BeginTracking(event)
	{	//トラッキングの開始。指定レスのIDと同じレスを全部強調表示する。
		//IDとtripで個人特定し、連鎖的に強調表示。
		NodeUtil.beginTracking(this._menu.dataset.binding);
	},
	EndTracking: function MessageMenu_EndTracking(event)
	{	//トラッキングの終了
		NodeUtil.endTracking(this._menu.dataset.binding);
	},
	PopupTracked: function MessageMenu_PopupTracked(event)
	{
		if (this.popTrack)return;	//すでに表示されている
		var tracking = Tracker.getTracker(this._menu.dataset.binding);
		if (tracking)
		{
			var ids = tracking.getTrackingNumbers();
			var pp = new ResPopup(null);
			pp.popup(ids, "RMenu.TrPop");
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
			MessageLoader.load(1, Preference.TemplateLength);
			var tids = [];
			for(var i=1; i<=Preference.TemplateLength; i++) tids.push(i);
			pp.popup(tids, e);
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
				pp.showPopup(1, Util.getElementPagePos(e), true);
			}
		}
	},
	
	JumpToNewMark: function Menu_JumpToNewMark()
	{
		var nn = ThreadInfo.Fetched + 1;
		NodeUtil.focus(nn);
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
		var e = $("Menu.Pickup");
		if (e.__popup)
		{
			e.__popup.close();
		}
		else
		{
			var p = new ResPopup(null);
			p.closeOnMouseLeave = false;
			MessageLoader.load(Pickup.pickups);
			p.popup(Pickup.pickups, "Menu.Pickup");
			p.onClose = function(){ e.__popup = null; }
			e.__popup = p;
		}
	},
	ExpressPickups: function Menu_ExpressPickups()
	{
		Finder.enterExpressMode();
		$("fform").q.value = "";
		$("fform").p.checked = true;
		Finder.express();
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
			Thread.deploy(Preference.MoreWidth);
			NodeUtil.focus(focusTo);
		}
	},
	MoreBack: function Menu_MoreBack()
	{
		var focusTo = ThreadMessages.deployedMin-1;
		Thread.deploy(-Preference.MoreWidth);
		NodeUtil.focus(focusTo);
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
			Finder.leaveExpressMode();
		}
		else
		{
			Finder.enterExpressMode();
		}
	},
	ShowViewer: function Menu_ShowViewer()
	{
		Viewer.show();
	},
	ToggleNavigationPopup: function Menu_ToggleNavigationPopup()
	{
		var e = $("Menu_Navi");
		if (e.__popup)
		{
			e.__popup.close();
		}
		else
		{
			var p = new Popup();
			p.closeOnMouseLeave = false;
			p._init(e);
			p.show(Thread.getNavigation());
			p.onClose = function(){ e.__popup = null; }
			e.__popup = p;
		}
	},
};

var Thread = {
	init: function Thread_init()
	{
		//identifier設定
		var url = new URL(ThreadInfo.Url);
		this.boardId  = url.boardId;
		this.threadId = url.threadId;

		//スレタイ表示部のdeta-boardに登録（なぜスレタイかといわれれば見た目に関することなので、設定で変えられるほうがいいかも）
		var e = $("threadName");
		if (e) e.dataset.board = this.boardId;
		
		//次スレ/前スレ情報
		this.nextThread = this.loadNextThreadInfo();
		this.prevThread = this.searchPrevThread();
	},
	openWriteDialog: function Thread_openWriteDialog(to)
	{
		if (!to) to = "";
		var url = Preference.PostScheme + ThreadInfo.Url + to
		window.location.href = url;
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
					//TODO::既存の新着マーク除去
					ThreadInfo.Total = obj.total;
					ThreadInfo.New = obj.new;
					ThreadInfo.Fetched = obj.total - obj.new;
					ThreadInfo.Status = obj.status;
					this.deployTo(ThreadInfo.Total);
					NodeUtil.focus(obj.Total - obj.new + 1)
				}
				Notice.add("{1} 新着{0}".format(obj.new ? obj.new + "件" : "なし", Util.timestamp()));
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
		if (!width)
		{
			this.deployAll();
		}
		else
		{
			this.deployTo(width < 0 ? ThreadMessages.deployedMin + width : ThreadMessages.deployedMax + width);
		}
	},
	deployAll: function Thread_deployAll()
	{	//かけている全てを設置する。
		this.deployTo(1);
		this.deployTo(ThreadInfo.Total);
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
		//console.log("deployTo: {0}->{1}".format(min,max));
		MessageLoader.load(min, max);
		ThreadMessages.deploy(min, max);
	},
	loadFocus: function Thread_loadFocus(_no)
	{
		var no = parseInt(_no);
		if ((no>=1) && (no<=ThreadInfo.Total))
		{
			this.deployTo(no);
			NodeUtil.focus(no);
		}
		else
		{
			Notice.add("cannot jump to {0}".format(no));
		}
	},
	getNavigation: function Thread_getNavigation()
	{
		if (!this._navi)
		{
			navi = document.createElement("NAV");
			navi.id = "navigation";
			var html = "";
			
			//Chapter
			html += '<h1>CHAPTER</h1><ul>';
			var w = Preference.ChapterWidth;
			var m = ThreadInfo.Total;
			for (var i=0; i< (m/w); i++)
			{
				html+= '<li><a class="navchapter">{0}-{1}</a></li>'.format(i*w+1, (i+1)*w);
			}
			html += '<li><a class="navprevchapter">prev.</a></li>';
			html += '<li><a class="navnextchapter">next.</a></li>';
			html += '</ul>';
			
			//BacklogWidth
			html += '<h1>BACKLOG</h1><ul>';
			var backlogWidths = ["l10", "l50", "l100", "l250", "l500", "l750", "*ALL*" ];
			for (var i=0; i<backlogWidths.length; i++)
			{
				html+= '<li><a class="navbacklog">{0}</a></li>'.format(backlogWidths[i]);
			}
			//その他
			html += '<h1>etc.</h1><ul>';
			html += '<li><form onsubmit="Thread.loadFocus(jumpto.value);return false;">JumpTo:<input type="text" size="4" name="jumpto"></form></li>';
			html += '<li><a class="navboardlist">スレ一覧</a></li>';
			html += '<li><a class="navprevthread">前スレ</a></li>';
			html += '<li><a class="navnextthread">次スレ</a></li>';
			html += '</ul>';

			navi.innerHTML = html;
			this._navi = navi;
		}
		return this._navi.cloneNode(true);
	},
	isNavigationElement: function Thread_isNavigationElement(e)
	{
		switch(e.className)
		{
			case "navchapter":
			case "navprevchapter":
			case "navnextchapter":
			case "navbacklog":
			case "navboardlist":
			case "navprevthread":
			case "navnextthread":
				return true;
			default:
				return false;
		}
	},
	invokeNavigation: function Thread_invokeNavigation(e)
	{	//altkeyの状態とか取り込んで、別ウィンドウ表示とか実装すべきか？
		var c = e.textContent;
		switch(e.className)
		{
			case "navchapter":
			case "navbacklog":
				this.reload(c == "*ALL*" ? "" : c);
				break;
			case "navprevchapter":
				this.reloadToPrevChapter();
				break;
			case "navnextchapter":
				this.reloadToNextChapter();
				break;
			case "navboardlist":
				this.transitToThreadList();
				break;
			case "navprevthread":
				this.transitToPrevThread();
				break;
			case "navnextthread":
				this.transitToNextThread();
				break;
			default:
				return;
		}
	},
	reload: function Thread_reload(range)
	{
		window.location.href = ThreadInfo.Server + ThreadInfo.Url + range;
	},
	reloadToPrevChapter: function Thread_reloadToPrevChapter(w)
	{
		if (!w) w = Preference.ChapterWidth;
		var max = ThreadMessages.deployedMin - 1;
		var min = max - w - 1;
		if (min < 0) min = 1;
		if (max < min) max = min;
		this.reload(min + "-" + max);
	},
	reloadToNextChapter: function Thread_reloadToNextChapter(w)
	{
		if (!w) w = Preference.ChapterWidth;
		var min = ThreadMessages.deployedMax +1;
		var max = min + w - 1;
		if (min < 0) min = 1;
		if (max < min) max = min;
		this.reload(min + "-" + max);
	},
	transitToThreadList: function Thread_transitToThreadList()
	{	//スレ一覧
		window.location.href = "bbs2ch:board:" + ThreadInfo.Board;
	},
	transitToPrevThread: function Thread_transitToPrevThread()
	{	//前スレ表示
		if (this.prevThread.url)
		{
			window.location.href = ThreadInfo.Server + this.prevThread.url + "l" + Preference.ChapterWidth;
		}
	},
	transitToNextThread: function Thread_transitToNextThread()
	{	//次スレ表示
		if (this.nextThread.url)
		{
			window.location.href = ThreadInfo.Server + this.nextThread.url + "l" + Preference.ChapterWidth;
		}
	},
	textNextThread: function Thread_textNextThread(anchor, node)
	{	//次スレURLか確認・・・
		if (this.nextThread.userDecided) return;			//ユーザーが決めた次スレがあるとき、何もしない
		if (!Preference.EnableNextThreadSearch) return;		//機能無効
		if (!anchor)return;
		if (!node) node = Util.getDecendantNode(anchor, "ARTICLE");
		var nodeNo = parseInt(node.dataset.no);
		var url = new URL(anchor.href);
		if (url.maybeThread
		 && (url.boardId == this.boardId)					//同じ板
		 && (nodeNo >= this.nextThread.linkedNode) 			//前に決めた番号より後のレス
		 && (nodeNo >= Preference.NextThreadSearchBeginsAt))	//次スレアドレスチェック番号以降のレス
		{
			this.setNextThread(anchor.href, false, nodeNo);
		}
	},
	setNextThread: function Thread_setNextThread(href, ud, nodeNo)
	{	//ud: ユーザーが決めたか？ trueのとき、勝手に上書きされない状態で出てくる。
		var url = new URL(href);
		ud = ud ? true : false;	//真偽値の正規化
		var nextThread = { url: href, id: url.threadId, userDecided: ud, linkedNode: nodeNo};
		this.nextThread = nextThread;
		this.saveNextThreadInfo(nextThread);	//TODO::ここで毎回呼ぶと負荷が掛かる場合があるかも？次回以降大丈夫だろうけど。
		document.body.dataset.nextThread = nextThread.url || "";
	},
	saveNextThreadInfo: function Thread_saveNextThreadInfo(nextThread)
	{
		var saveStr = '{url: "{0}", id: "{1}", userDecided: {2}, linkedNode: {3} }'
		              .format(nextThread.url, nextThread.id, nextThread.userDecided, nextThread.linkedNode);
		CommonPref.writeThreadObject("nextThread", saveStr);
	},
	loadNextThreadInfo: function Thread_loadNextThreadInfo(objStr)
	{
		objStr = objStr ? objStr : CommonPref.readThreadObject("nextThread");
		try
		{
			if (objStr)
			{
				var n;
				eval("n="+objStr);
				return n;
			}
		}catch(e){}
		return {url: null, id: null, userDecided: false, linkedNode: 0};	//デフォルト
	},
	searchPrevThread: function Thread_searchPrevThread()
	{
		var This = this;
		var ret = {url: null};
		CommonPref.foreach("nextThread", function(key, dat)
		{
			var info = This.loadNextThreadInfo(dat);
			if (info.id == This.threadId)
			{	//URL => 今のアドレスの数字のところをkeyの末尾の数字で置き換えたもの
				if (key.match(/(\d+)$/))
				{
					var num = RegExp.$1;
					var url = ThreadInfo.Url.replace(/\/(\d+)\/$/, function(a,b,c){	return "/" + num + "/"; });
					ret = {url: url};
				}
			}
		});
		document.body.dataset.prevThread = ret.url || "";	//これがここでええのんかな？
		return ret;
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
		this.updateDeployedInfo();
		//自動展開
		if (Preference.AutoPreviewOutlinks)
		{	
			Menu.PreviewOutlinks();
		}
	},
	updateDeployedInfo: function ThreadMessages_updateDeployedInfo(e)
	{
		if(!e) e = $("resContainer");
		var min = parseInt(e.firstElementChild.dataset.no);
		if ((e.children.length != 1) && (min == 1))
		{
			var second = parseInt(e.children[1].dataset.no);
			min = (second == 2) ? 1 : second;
		}
		this.deployedMin = min;
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
		if ((this.deployedMin == 2) && this.isDeployed(1)) this.deployedMin = 1;
		if (nn > this.deployedMax) this.deployedMax = nn;
		if (Preference.AutoPreviewOutlinks)
		{
			OutlinkPlugins.preview(node);
		}
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
				Thread.textNextThread(a);
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
	apply: function ThreadMessages_apply(func, filter, includePopup)
	{
		var nodes = includePopup ? $A(document.body.getElementsByTagName("ARTICLE")) : this.domobj;
		for (var i=0, j=nodes.length; i<j; i++)
		{
			if (nodes[i] && filter(nodes[i])) func(nodes[i]);
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
		NodeUtil.focus(this.no)
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
		this.maybeThread = url.match(/\/read.cgi\//) ? true : false;
		
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
		
		//スレッドなら
		if (this.maybeThread)
		{
			//板とスレッドと表示範囲の指定を取得
			if (url.match(/\/read.cgi\/([^\/]+)\/([^\/]+)(\/(.+))?/))
			{
				this.boardName = RegExp.$1;
				this.threadNo  = RegExp.$2;
				if (RegExp.$4)
				{
					this.range = RegExp.$4;
				}
				else
				{
					this.range = "";
				}
			}
			//identifier
			switch (this.type)
			{
				case "2CH":
					this.boardId = "";
					break;
				case "MACHI":
					this.boardId = "machi.";
					break;
				default:
					this.boardId = this.domain + ".";
					break;
			}
			this.boardId  =(this.boardId + this.boardName).toLowerCase();
			this.threadId = this.boardId + "." + this.threadNo;
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
			var tid = setTimeout(this.popup.bind(this, plugin, anchor), Preference.ResPopupDelay);
			anchor.addEventListener("mouseout", 
				function(){
					clearTimeout(tid);
					anchor.removeEventListener("mouseout", arguments.callee, false);
				},false);
		}
	},
	popup: function OutlinkPlugins_popup(plugin, anchor)
	{
		if (anchor.dataset.previewShowing!="y")
		{
			var p = new Popup();
			p._init(anchor);
			var c = plugin.getPreview(anchor.href, p.adjust.bind(p));
			if (c)
			{
				anchor.dataset.previewShowing = "y";
				var innerCont = document.createElement("DIV");
				innerCont.appendChild(c);
				p.show(innerCont);
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
	closeOnMouseLeave: true,
	
	_init: function Popup_init(e)
	{	//eはなにからポップアップさせようとしているか。要素または要素のIDを指定する。
		if (!e.tagName) e = $(e);
		if (!e)
		{
			console.log("PopupInitializedError");
			console.log(e);
			e = document.body;	//なんもないならとりあえずエラーにならないようにBodyにつけとく
		}
		this.arranged = e;	//適用先オブジェクト
		this.fixed = Util.isFixedElement(e);	//適用先オブジェクトは固定されたもの？
		
		//親の探索
		while (e)
		{
			if (e.popup)
			{	//ポップアップからのポップアップ→子として登録
				e.popup.registorChild(this);
				break;
			}
			e = e.parentNode;
		}
		
		//自分を作成
		var c = document.createElement("DIV");
		c.addEventListener("mouseleave", this.checkClose.bind(this), false);
		c.className = "popup";
		c.dataset.popupEnchanted = "y";
		c.dataset.fixedPopup = this.fixed ? "y" : "";
		c.popup = this;
		this.container = c;
	},
	
	show: function Popup_show(content)
	{
		var pos = this.getPopupPos();
		this.container.appendChild(content);
		$("popupContainer").appendChild(this.container);
		this.limitSize(pos);
		this.adjust(pos);
	},
	checkClose: function Popup_checkClose(aEvent)
	{
		if (!this.closeOnMouseLeave) return;
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
		if(pos.x<=p.pageX||
		   pos.y<=p.pageY||
		   pos.x>=p.pageX+p.width||
		   pos.y>=p.pageY+p.height)this.close();
	},
	close: function Popup_close()
	{
		if (this.closed) return;
		this.closed = true;
		if (this.container && this.container.parentNode) this.container.parentNode.removeChild(this.container);
		if (this.onClose) this.onClose(this);
		if (Preference.PopupDestructChain && this.childPopups)
		{
			for(var i=0, j=this.childPopups.length; i < j; i++)
			{
				this.childPopups[i].close();
			}
		}
	},
	//サイズ制限
	limitSize: function Popup_limitSize(pos)
	{
		var e = this.container.firstChild;
		//幅・・・画面幅の80%
		//高さ・・・アンカー位置の下側で画面下端まで(40は吹き出しのヒゲの分と若干の余裕）：最低保障３割
		var maxWidth = window.innerWidth *0.8;
		var poy = (this.fixed) ? 0 : window.pageYOffset;	//固定の時はスクロール位置を気にしない
		var maxHeight = window.innerHeight - (pos.pageY - poy) - 40;
		if (maxHeight < window.innerHeight*0.3) maxHeight = window.innerHeight*0.3;
		e.style.maxWidth = maxWidth + "px";
		e.style.maxHeight = maxHeight + "px";
	},
	//画面内に押し込む(サイズ制限されているので必ず入るはず)。下にしか出ないし、縦にはスクロールできるので横だけ押し込む。
	adjust: function Popup_adjust(pos)
	{
		if (!pos) pos = this.getPopupPos();
		this.container.style.left = "-10000px";	//調整前に一度外に追い出さないと折り返した幅になってる
		var px = pos.pageX, py = pos.pageY;
		var x = px + this.container.firstChild.offsetWidth - document.body.offsetWidth;
		this.container.style.left = px + "px";
		this.container.style.top  = py + "px";
		x = (x < 0) ?  -Preference.PopupLeft : -(x + Preference. PopupRightMargin);	//吹き出し位置調整
		this.container.firstChild.style.marginLeft = x + "px";
	},
	getPopupPos: function Popup_getPopupPos()
	{
		//位置計算(アレンジされているようその下辺中央を指すように)
		var pos = Util.getElementPagePos(this.arranged);
		pos.pageX += pos.width /2;
		pos.pageY += pos.height;
		return pos;
	},
	getPopupObj: function Popup_getPopupObj(element)
	{	//elementの親につけられたpopupを探す
		if (element)
		{
			if (element.popup)	return element.popup;
			if (element.parentNode) return this.getPopupObj(element.parentNode);
		}
		return null;
	},
	registorChild: function Popup_registorChild(popup)
	{
		if (!this.childPopups) this.childPopups = new Array();
		this.childPopups.push(popup);
	},
};

function ResPopup(anchor){ this.init(anchor); }
ResPopup.prototype = new Popup();

	ResPopup.prototype.init = function ResPopup_init(anchor)
	{
		//Delayを仕掛ける
		if (anchor != null)
		{//.textContent
			var tid = setTimeout(this.popup.bind(this, anchor), Preference.ResPopupDelay);
			anchor.addEventListener("mouseout", 
				function(){
					clearTimeout(tid);
					anchor.removeEventListener("mouseout", arguments.callee, false);
				},false);
		}
	};
	
	ResPopup.prototype.popup =  function ResPopup_popup(obj, e)
	{
		var ids;
		if (!e) e = obj;
		if (obj.tagName)
		{	//要素。アンカーだと信じる
			ids = MessageUtil.splitResNumbers(obj.textContent);
			MessageLoader.loadByAnchorStr(obj.textContent);
		}
		else if (obj.length)
		{	//配列・・・だといいなぁ
			ids = obj;
		}
		else
		{	//その他・・・適当に
			ids = [obj];
		}
		
		this._init(e);
		var innerContainer = document.createElement("DIV");
		for(var i=0, len=ids.length; i < len ; i++)
		{
			var node = ThreadMessages.getNode(ids[i], true);
			if (node != null)
			{
				innerContainer.appendChild(node);
			}
		}
		this.show(innerContainer);
	};

function GearPopup(enchantElement) { this.init(enchantElement); }
GearPopup.prototype = new Popup();
	GearPopup.prototype.init = function GearPopup_init(enchantElement)
	{
		this._init(enchantElement);
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
	GearPopup.prototype.changePos = function GearPopup_changePos(e)
	{	//名前良くない
		this.arranged = e;
		this.adjust();
	};
	GearPopup.prototype.changeOrigin = function GearPopup_changeOrigin(no)
	{
		this.to(no);
		this.origin = no;
	};
	GearPopup.prototype.showPopup = function GearPopup_showPopup(no)
	{
		var n = this.getNode(no);
		this.content.appendChild(n);
		this.origin = no;
		this.show(this.content);
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
			this.adjust();
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
	showing: function Finder_showing()
	{
		return (this.popup != null);
	},
	enterExpressMode: function Finder_enterExpressMode()
	{
		if (document.body.dataset.expressMode != "y")
		{
			var content = this.form;
			var p = new Popup();
			p.closeOnMouseLeave = false;
			p._init("Menu.Finder");
			p.show(this.form);
			$("fform").q.value = document.getSelection()
			p.container.dataset.finder = "y";
			this.popup = p;

			this.pageY = window.scrollY;
			document.body.dataset.expressMode="y";
		}
	},
	leaveExpressMode: function Finder_leaveExpressMode()
	{
		document.body.dataset.expressMode="n";
		window.scrollTo(0,this.pageY);
		if (this.popup)
		{
			this.popup.close();
			this.popup = null;
		}
	},
	express: function Finder_express()
	{	//条件セットしてからコレを呼ぶと、条件に合致するものとしないものでarticleに印をつける
		var cond = $("fform").q.value;
		var reg  = $("fform").r.checked;
		var icase=!$("fform").i.checked;
		var pick = $("fform").p.checked;
		
		if (cond.match(/\[resto:(\d+)\]/))
		{
			this.expressReffer(parseInt(RegExp.$1));
			return;
		}
		if (cond == "[tracked]")
		{
			this.expressTracked();
			return;
		}
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
	expressReffer: function Finder_expressReffer(no)
	{
		var t = MessageStructure.nodesReplyFrom[no];
		t = t ? t.clone() : [];
		t.push(no);
		ThreadMessages.foreach(function(node){
			node.dataset.express = t.include(node.dataset.no) ? "y" : "n";
		}, false);
	},
	expressTracked: function Finder_expressTracked()
	{
		ThreadMessages.foreach(function(node){
			node.dataset.express = Tracker.getMarkerClass(node) != "" ? "y" : "n";
		},false);
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
		rect = e.getBoundingClientRect();
		rect.pageX = Math.round(rect.left);
		rect.pageY = Math.round(rect.top);
		rect.fixed = this.isFixedElement(e);
		if (!rect.fixed)
		{
			rect.pageX += window.scrollX;
			rect.pageY += window.scrollY;
		}
		return {pageX: rect.pageX, pageY: rect.pageY,
		        width: Math.round(rect.right - rect.left), height: Math.round(rect.bottom - rect.top),
		        fixed: rect.fixed};
	},
	notifyRefreshInternal: function Util_notifyRefreshInternal(e)
	{
		var element = e;
		element.dataset.refreshState = "refresh";
		setTimeout(function(){element.dataset.refreshState = "";}, 15);
	},
	timestamp: function Util_timestamp(d)
	{
		if (!d) d = new Date();
		var h=d.getHours();
		var m=d.getMinutes();
		var s=d.getSeconds();
		if(m<10)m="0"+m;
		if(s<10)s="0"+s;
		return h+":"+m+":"+s;
	},
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
}

//ノードに対する処理を行なう。
var NodeUtil = {
	resTo: function NodeUtil_resTo(nodeOrNo)
	{
		if (!nodeOrNo) return;
		var no = nodeOrNo.dataset ? nodeOrNo.dataset.no : nodeOrNo;
		Thread.openWriteDialog(no);
	},
	toggleRefferPopup: function NodeUtil_toggleRefferPopup(node, t)
	{
		if (!node)return;
		if (node.tagName != "ARTICLE")return;
		if (node.__refPopup)
		{
			node.__refPopup.close();
		}
		else
		{
			var ids = MessageStructure.nodesReplyFrom[node.dataset.no];
			if (ids)
			{
				ids = ($A(ids)).sort(function(a,b){return a-b;});
				if (!t) t = node.children[1].children[0];
				var pp = new ResPopup(null);
				node.__refPopup = pp;
				pp.onClose = function(){ node.__refPopup = null; };
				pp.popup(ids, t);
			}
		}
	},
	toggleIdPopup: function NodeUtil_toggleIdPopup(node, t)
	{
		if (!node)return;
		if (node.tagName != "ARTICLE")return;
		if (node.__idpopup)
		{
			node.__idpopup.close();
		}
		else
		{
			var ids = MessageStructure.nodesById[t.textContent];
			if (ids)
			{
				ids = ($A(ids)).sort(function(a,b){return a-b;});
				if (!t) t = node.children[1].children[2];
				var pp = new ResPopup(null);
				node.__idpopup = pp;
				pp.onClose = function(){ node.__idpopup = null; } ;
				pp.popup(ids, t);
			}
		}
	},
	expressReffer: function NodeUtil_expressReffer(nodeOrNo)
	{
		var no = nodeOrNo.dataset ? nodeOrNo.dataset.no : nodeOrNo;
		Finder.enterExpressMode();
		$("fform").q.value = "[resto:{0}]".format(no);
		Finder.express();
	},
	closeRefTree: function NodeUtil_closeRefTree(node)
	{
		if (!node)return;
		if (node.tagName != "ARTICLE")return;
		var nodes = $A(node.childNodes).filter(function(x){ return x.tagName == "ARTICLE"; });
		for(var i=0,j=nodes.length; i<j; i++)
		{
			node.removeChild(nodes[i]);
		}
		node.dataset.treed = "";
	},
	toggleRefTree: function NodeUtil_toggleRefTree(node)
	{
		if (!node)return;
		if (node.tagName != "ARTICLE")return;
		if (node.dataset.treed == "y")
		{
			this.closeRefTree(node);
		}
		else
		{
			this.openRefTree(node);
		}
	},
	openRefTree: function NodeUtil_openRefTree(node)
	{
		if (!node)return;
		if (node.tagName != "ARTICLE")return;
		this.closeRefTree(node);	//一度閉じる
		var current = parseInt(node.dataset.no);
		node.dataset.treed = "y";
		this._openRefTreeEx(current, node);
	},
	_openRefTreeEx: function NodeUtil__openRefTreeEx(from, c)
	{
		if(MessageStructure.nodesReplyFrom[from])
		{
			var rf = MessageStructure.nodesReplyFrom[from];
			for(var i=0, j = rf.length; i < j; i++)
			{
				var node = ThreadMessages.getNode(rf[i], true);	//ARTICLE
				if (rf[i] > from)
				{	//基点より前のレスは再帰的に開かない（無限ループ対策）
					this._openRefTreeEx(rf[i], node);
				}
				else
				{
					node.dataset.backward = "y";
				}
				node.dataset.treed = "y";
				c.appendChild(node);
			}
		}
	},
	toggleBookmark: function NodeUtil_toggleBookmark(nodeOrNo)
	{
		if (!nodeOrNo) return;
		var no = nodeOrNo.dataset ? nodeOrNo.dataset.no : nodeOrNo;
		no = parseInt(no);
		if (Bookmark.no == no)
		{
			Bookmark.del(no);
		}
		else
		{
			Bookmark.add(no);
		}
	},
	setBookmark: function NodeUtil_setBookmark(nodeOrNo)
	{
		if (!nodeOrNo) return;
		var no = nodeOrNo.dataset ? nodeOrNo.dataset.no : nodeOrNo;
		no = parseInt(no);
		Bookmark.add(no);
	},
	resetBookmark: function NodeUtil_resetBookmark(nodeOrNo)
	{
		if (!nodeOrNo) return;
		var no = nodeOrNo.dataset ? nodeOrNo.dataset.no : nodeOrNo;
		no = parseInt(no);
		Bookmark.del(no);
	},
	togglePickup: function NodeUtil_togglePickup(nodeOrNo)
	{
		if (!nodeOrNo) return;
		var no = nodeOrNo.dataset ? nodeOrNo.dataset.no : nodeOrNo;
		no = parseInt(no);
		if (Pickup.pickups.include(no))
		{
			Pickup.del(no);
		}
		else
		{
			Pickup.add(no);
		}
	},
	setPickup: function NodeUtil_setPickup(nodeOrNo)
	{
		if (!nodeOrNo) return;
		var no = nodeOrNo.dataset ? nodeOrNo.dataset.no : nodeOrNo;
		no = parseInt(no);
		Pickup.add(no);
	},
	resetPickup: function NodeUtil_resetPickup(nodeOrNo)
	{
		if (!nodeOrNo) return;
		var no = nodeOrNo.dataset ? nodeOrNo.dataset.no : nodeOrNo;
		Pickup.del(no);
	},
	previewLinks: function NodeUtil_previewLinks(node)
	{
		if (!node) return;
		if (node.tagName != "ARTICLE")return;
		OutlinkPlugins.preview(node);
	},
	toggleTracking: function NodeUtil_toggleTracking(nodeOrNo)
	{
		if (!nodeOrNo) return;
		var no = nodeOrNo.dataset ? nodeOrNo.dataset.no : nodeOrNo;
	},
	beginTracking: function NodeUtil_beginTracking(nodeOrNo)
	{
		if (!nodeOrNo) return;
		var no = nodeOrNo.dataset ? nodeOrNo.dataset.no : nodeOrNo;
		Tracker.add(no);
	},
	endTracking: function NodeUtil_endTracking(nodeOrNo)
	{
		if (!nodeOrNo) return;
		var no = nodeOrNo.dataset ? nodeOrNo.dataset.no : nodeOrNo;
		Tracker.del(no);
	},
	
	focus: function NodeUtil_focus(no)
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
	closeIfPopup: function NodeUtil_closeIfPopup(node)
	{
		while(node)
		{
			if (node.popup)
			{
				node.popup.close();
			}
			node = node.parentNode;
		}
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
		document.addEventListener("dblclick",  this.mouseDblClick.bind(this), false);
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
		//Input上にあるときはなにもしないのが吉だろ
		if (e.target.tagName == "INPUT") return
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
				Thread.openWriteDialog();
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
				NodeUtil.focus(id);
			}
			cancel = true;
		}
		else if(t.className == "no")
		{
			NodeUtil.toggleRefferPopup(Util.getDecendantNode(t, "ARTICLE"), t);
		}
		else if(t.className == "id")
		{	//IDポップアップ
			NodeUtil.toggleIdPopup(Util.getDecendantNode(t, "ARTICLE") , t);
		}
		else if (t.id == "footer")
		{
			if (Notice.container) Util.notifyRefreshInternal(Notice.container);
		}
		else if (Thread.isNavigationElement(t))
		{
			Thread.invokeNavigation(t);
		}
		if(cancel){
			aEvent.preventDefault();
			aEvent.stopPropagation();
		}
	},
	mouseDblClick: function EventHandlers_mouseDblClick(e)
	{
		if (e.target.tagName == "ARTICLE")
		{
			var flg = 0;
			if (e.shiftKey) flg += 1;
			if (e.ctrlKey) flg += 2;
			if (e.altKey) flg += 4;
			var method = Preference.OnResDblClick[flg];
			var handler= this.dblClickMethod[method];
			if (handler) handler(e.target)
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
					e.target.enchantedGear.changePos(e.target);
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
				NodeUtil.focus(focusTo);
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
				NodeUtil.focus(focusTo);
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
		var q   = aEvent.sourceEvent.type;	//クエリ
		var filter = [
			function(node){return node.children[0].children[3].textContent.indexOf(q)>=0;},	//.nm
			function(node){return node.children[0].children[5].textContent.indexOf(q)>=0;},	//.ml
			function(node){return node.dataset.aid.indexOf(q)>=0;},	//data-aid
			function(node){return node.children[1].textContent.indexOf(q)>=0;},	//.ct
		];
		ThreadMessages.apply(function(node){
			node.dataset.ng = "y";
		}, filter[aEvent.detail], true);
	},
};

/* ■ダブルクリックハンドラ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
EventHandlers.dblClickMethod = {
	//必ずしもbind必要でないものもあるが全部bindしといたほうが安全だろう
	bookmark:    NodeUtil.toggleBookmark.bind(NodeUtil),
	resto:       NodeUtil.resTo.bind(NodeUtil),
	pickup:      NodeUtil.togglePickup.bind(NodeUtil),
	tree:        NodeUtil.toggleRefTree.bind(NodeUtil),
	track:       NodeUtil.toggleTracking.bind(NodeUtil),
	preview:     NodeUtil.previewLinks.bind(NodeUtil),
	closepopup:  NodeUtil.closeIfPopup.bind(NodeUtil),
	setbookmark: NodeUtil.setBookmark.bind(NodeUtil),
	res:         Thread.openWriteDialog.bind(Thread, null),
};




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

