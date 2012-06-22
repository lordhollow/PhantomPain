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

function PP3ResetPreference()
{	//ブックマークレットとして javascript:PP3ResetPreference(); を登録しておくと、リセットすることができます。
	console.log("設定をクリアしました");
}

Function.prototype.bind = function prototype_bind()
{
	var __method = this, args = $A(arguments), object = args.shift();
	return function()
	{
		return __method.apply(object, args.concat($A(arguments)));
	}
}

var $A = Array.from = function prototype_arrayFrom(iterable) 
{
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

Array.prototype.include = function prototype_include(val)
{
	for(var i=0;i<this.length;i++){
		if (this[i]==val) return true;
	}
	return false;
}

function clone(obj)
{
	var f = function(){};
	f.prototype = obj;
	return new f;
}

var $=function prototype_getElementById(id){return document.getElementById(id);}

String.format = function String_format(p_txt)
{
	if ( arguments.length <= 1 ) {
		return p_txt;
	}
	for( var v_idx = 1, v_num = arguments.length; v_idx < v_num; v_idx++ )
	{
		p_txt = p_txt.replace(new RegExp("\\{" + (v_idx - 1) + "\\}", "gi"), arguments[v_idx]);
	}
	return p_txt;
};

String.prototype.format = function StringPrototype_format()
{
	Array.prototype.unshift.apply(arguments, [this]);
	return String.format.apply(String, arguments);
};

function EVAL(str, def)
{	//例外が発生しないeval
	try
	{
		return eval(str);
	}
	catch(e)
	{
		console.log(str);
		console.log(e);
	}
	return def;
}

var Skin = PP3 = {
	skinName: "PhantomPain3",
	skinVer: "ver. \"closed alpha\"",
	init: function()
	{
		//loadPref
		this.BoardList.init();
		this.Thread.init();		//ThreadInit
	},
	Configulator: {
	},
	CommonPref: {
		_identifier: new String("UNKNOWN"),
		_storage: localStorage,
	
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
	},
	
	BoardList: {
		init: function BoardList_init()
		{
			this.prepareBoardNames();
		},
		prepareBoardNames: function BoardList_prepareBoardNames()
		{	
			var sys = EVAL("[" + (Skin.CommonPref.readGlobalObject("BoardNames") || "") + "]", [])[0];
			var usr = EVAL("[" + (Skin.CommonPref.readGlobalObject("UserBoardNames") || "{}") + "]", [{}])[0]; 
			if (!sys) sys = this.reloadBoardNameTxt();
			this.boardNameListSys = sys;
			this.boardNameListUsr = usr;
		},
		save: function BoardList_save(list, prefName)
		{
			var json = "{";
			for(var key in list)
			{
				json += '"{0}": "{1}",'.format(key, list[key]);
			}
			json += "}";
			Skin.CommonPref.writeGlobalObject(prefName, json);
		},
		reloadBoardNameTxt: function BoardList_reloadBoardNameTxt()
		{
			var boardnameTxt = TextLoadManager.syncGet(ThreadInfo.Skin + "boardname.txt");
			var sys =  EVAL("[" + (boardnameTxt|| "") + "]", [])[0] || {};
			this.save(sys, "BoardNames");
			return sys;
		},
		getBoardName: function BoardList_getBoardName(boardId)
		{
			if (this.boardNameListUsr && this.boardNameListUsr[boardId])
			{
				return  this.boardNameListUsr[boardId];
			}
			else if (this.boardNameListSys && this.boardNameListSys[boardId])
			{
				return  this.boardNameListSys[boardId];
			}
			return "その他の掲示板";
		},
		setBoardName: function BoardList_setBoardName(id, name)
		{
			if (!id) id = Thread.boardId;	//俺だよ、俺俺
			if (!name || name == "")
			{	//定義を消す
				if (this.boardNameListUsr && this.boardNameListUsr[id])
				{
					delete this.boardNameListUsr[id];
				}
			}
			else
			{
				if (!this.boardNameListUsr) this.boardNameListUsr = {};
				this.boardNameListUsr[id] = name;
				this.save(this.boardNameListUsr, "UserBoardNames");
			}
			if (id == Thread.boardId)
			{	//TODO::イベントを投げて板名変化を通知し、反映するように変更
				//特に、２箇所以上に影響が及ぶ場合はそのときに必ず実施。
				Thread.boardName = this.getBoardName(Thread.boardId);
				var e = $("threadName");
				if (e) e.dataset.boardName = Thread.boardName;
			}
		},
	},
	
	Thread: {
		init: function Thread_init()
		{
			//identifier設定
			var url = new URL(this.Info.Url);
			this.boardId  = url.boardId;
			this.threadId = url.threadId;
			
			//スレッドのIDを共通設定に使わせる(これより前にスレッド個別設定を使用してはならない)
			Skin.CommonPref._identifier = url.threadId;

			//板名
			this.boardName = Skin.BoardList.getBoardName(this.boardId);

			//スレタイ表示部のdeta-boardに登録（なぜスレタイかといわれれば見た目に関することなので、設定で変えられるほうがいいかも）
			var e = $("threadName");
			if (e)
			{
				 e.dataset.board = this.boardId;
				 e.dataset.boardName = this.boardName;
			}

			//次スレ前スレ
			this.Navigator.init();

			//メッセージの分析
			this.Message.init();			//message
		},
		openWriteDialog: function Thread_openWriteDialog(to)
		{
		},
		reload: function Thread_reload(range)
		{
		},
		checkNewMessage: function Thread_checkNewMessage()
		{
		},
		Message: {
			init: function Message_init()
			{
				var nodes = $A($("resContainer"));
				this.onLoad(nodes);
				this.onDeploy(nodes);
			},
			prepare: function Message_prepare(from, to)
			{
			},
			deploy: function Message_deploy(from, to)
			{
			},
			getNode: function Message_getNode(no, clone)
			{
			},
			getManipulator: function Message_getManipulator(NodeOrNo)
			{	//旧NodeUtil相当のオブジェクトを返すよ
			},
			getDeployMode: function Message_getDeployMode(no)
			{	//bmしか使ってないので廃止する
			},
			foreach: function Message_foreach(func, includeNotDeployed, includePopup)
			{
			},
			apply: function Message_foreach(func, filter, includeNotDeployed, includePopup)
			{
			},
			isReady: function Message_isReady(no)
			{
			},
			isDeployed: function Message_isDeployed(no)
			{
			},
			onLoad: function Message_onLoad(nodes)
			{
			},
			onDeploy: function Message_onDeploy(nodes)
			{
			},
			_processMessage: function Message__processMessage(node)
			{
			},
			_extendAnchor: function Message__extendAnchor(node)
			{
			},
			_replaceStr: function Message__replaceStr(node)
			{
			},
			Structure: {
				analyze: function MessageStructure_analyze(nodes)
				{
				},
				getReplyIdsByNo: function MessageStructure_getReplyIdsByNo(node)
				{	//指定したレス番号にレスしているレスのレス番号のリストを取得
				},
				getNodeIdsById: function MessageStructure_getNodeIdsById(id)
				{	//IDを指定してその人物が発言したレス番号のリストを取得
				},
			},
		},
		Navigator: {
			init: function Navigator_init()
			{
				//次スレ/前スレ情報
				this.nextThread = this.loadNextThreadInfo();
				this.prevThread = this.searchPrevThread();
			},
			getNavigation: function Navigation_getNavigation()
			{
				if (!this._navi)
				{
					navi = document.createElement("NAV");
					navi.id = "navigation";
					var html = "";
					
					//Chapter
					html += '<h1>CHAPTER</h1><ul>';
					var w = Preference.ChapterWidth;
					var m = Skin.Thread.Info.Total;
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
			isNavigationElement: function Navigator_isNavigationElement(e)
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
			invokeNavigation: function Navigator_invokeNavigation(e)
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
			goto: function Navigator_goto(range)
			{
				window.location.href = Skin.Thread.Info.Server + Skin.Thread.Info.Url + range;
			},
			gotoPrevChapter: function Navigator_gotoPrevChapter(w)
			{
				if (!w) w = Preference.ChapterWidth;
				var max = Skin.Thread.Message.deployedMin - 1;
				var min = max - w - 1;
				if (min < 0) min = 1;
				if (max < min) max = min;
				this.goto(min + "-" + max);
			},
			gotoNextChapter: function Navigator_gotoNextChapter(w)
			{
				if (!w) w = Preference.ChapterWidth;
				var min = Skin.Thread.Message.deployedMax +1;
				var max = min + w - 1;
				if (min < 0) min = 1;
				if (max < min) max = min;
				this.goto(min + "-" + max);
			},
			gotoThreadList: function Navigator_gotoThreadList()
			{
				window.location.href = "bbs2ch:board:" + Skin.Thread.Info.Board;
			},
			gotoPrevThread: function Navigator_gotoPrevThread(w)
			{
				if (!w) w = Preference.ChapterWidth;
				if (this.prevThread.url)
				{
					window.location.href = Skin.Thread.Info.Server + this.prevThread.url + "l" + w;
				}
			},
			gotoNextThread: function Navigator_gotoNextThread(w)
			{
				if (!w) w = Preference.ChapterWidth;
				if (this.nextThread.url)
				{
					window.location.href = Skin.Thread.Info.Server + this.nextThread.url + "l" + w;
				}
			},
			checkNextThread: function Navigator_checkNextThread(anchor, node)
			{
				if (this.nextThread.userDecided) return;			//ユーザーが決めた次スレがあるとき、何もしない
				if (!Preference.EnableNextThreadSearch) return;		//機能無効
				if (!anchor)return;
				if (!node) node = DOMUtil.getDecendantNode(anchor, "ARTICLE");
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
			setNextThread: function Navigator_setNextThread(href, ud, nodeNo)
			{	//ud: ユーザーが決めたか？ trueのとき、勝手に上書きされない状態で出てくる。
				var url = new URL(href);
				ud = ud ? true : false;	//真偽値の正規化
				var nextThread = { url: href, id: url.threadId, userDecided: ud, linkedNode: nodeNo};
				this.nextThread = nextThread;
				this.saveNextThreadInfo(nextThread);	//TODO::ここで毎回呼ぶと負荷が掛かる場合があるかも？次回以降大丈夫だろうけど。
				document.body.dataset.nextThread = nextThread.url || "";
			},
			saveNextThreadInfo: function Navigator_saveNextThreadInfo(nextThread)
			{
				var saveStr = '{url: "{0}", id: "{1}", userDecided: {2}, linkedNode: {3} }'
				              .format(nextThread.url, nextThread.id, nextThread.userDecided, nextThread.linkedNode);
				Skin.CommonPref.writeThreadObject("nextThread", saveStr);
			},
			loadNextThreadInfo: function NavigatorloadNextThreadInfo(objStr)
			{
				objStr = objStr ? objStr : Skin.CommonPref.readThreadObject("nextThread");
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
			searchPrevThread: function Navigator_searchPrevThread()
			{
				var This = this;
				var ret = {url: null};
				Skin.CommonPref.foreach("nextThread", function(key, dat)
				{
					var info = This.loadNextThreadInfo(dat);
					if (info.id == Skin.Thread.threadId)
					{	//URL => 今のアドレスの数字のところをkeyの末尾の数字で置き換えたもの
						if (key.match(/(\d+)$/))
						{
							var num = RegExp.$1;
							var url = Skin.Thread.Info.Url.replace(/\/(\d+)\/$/, function(a,$1){	return "/" + num + "/"; });
							ret = {url: url};
						}
					}
				});
				document.body.dataset.prevThread = ret.url || "";	//これがここでええのんかな？
				return ret;
			},
		},
	},
	Services: {
		Marker: {
			service: new Array(),
			push: function MarkerServices__push(service)
			{
			},
			nodeLoaded: function MarkerServices_nodeLoaded(node)
			{
			},
			onStorageChanged: function MarkerServices_onStorageChanged(ev)
			{
			},
		},
		OutLink: {
			getOutlinkPlugin: function OutlinkServices_getOutlinkPlugin(node)
			{
			},
		},
	},
	Menu: {
	},
	ResMenu: {
	},
	BoardPane:{
		//別のとこかも
	},
	Finder: {
	},
	Viewer: {
	},
	Notice: {
	},
	Util: {
		Popup: {
		},
		String: {
			toNarrowString: function StringUtil_toNarrowString(src)
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
			timestamp: function StringUtil_timestamp(d)
			{
				if (!d) d = new Date();
				var h=d.getHours();
				var m=d.getMinutes();
				var s=d.getSeconds();
				if(m<10)m="0"+m;
				if(s<10)s="0"+s;
				return h+":"+m+":"+s;
			},
			splitResNumbers: function StringUtil_splitResNumbers(str)
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
		},
		Dom: {
			isDecendantOf: function DOMUtil_isDecendantOf(e, id)
			{
				if (e.id == id) return e;
				if (e.parentNode  == null) return null;
				return this.isDecendantOf(e.parentNode, id);
			},
			getDecendantNode: function DOMUtil_getDecendantNode(e, tagName)
			{
				if (e.tagName == tagName) return e;
				if (e.parentNode  == null) return null;
				return this.getDecendantNode(e.parentNode, tagName);
			},
			getDecendantNodeByData: function  DOMUtil_getDecendantNodeByClass(e, x, v)
			{	//特定追加データの値を持つ親を帰す。
				if (e.dataset && (e.dataset[x] == v))return e;
				if (e.parentNode == null) return null;
				return this.getDecendantNodeByData(e.parentNode, x, v);
			},
			isFixedElement: function DOMUtil_isFixedElement(e)
			{
				try
				{
					var style = document.defaultView.getComputedStyle(e, null);
					if (style.position == "fixed") return true;
					if (e.parentNode == null) return false;
					return this.isFixedElement(e.parentNode);
				} catch(e) { return false; }
			},
			getElementPagePos: function DOMUtil_getElementPagePos(e)
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
			notifyRefreshInternal: function DOMUtil_notifyRefreshInternal(e)
			{
				var element = e;
				element.dataset.refreshState = "refresh";
				setTimeout(function(){element.dataset.refreshState = "";}, 15);
			},
		},
	},
	EventHandler: {
	
	},
};


/* ■URL分析 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
function URL(url){ this.init(url); }
URL.prototype = {
	init: function URL_init(url)
	{
//		try
		{
			this.url = url;
			//bbs2chreader/chaika スレッド表示URL
			this.isReaderUrl = (this.startWith(Skin.Thread.Info.Server));
			if(this.isReaderUrl) url = url.substr(Skin.Thread.Info.Server.length);
			//bbs2chreader/chaika スキン
			this.isReaderSkinUrl = (this.startWith(Skin.Thread.Info.Skin));
			//bbs2chreader/chaika 板一覧
			var readerBoardScheme = "bbs2ch:board:";
			this.isReaderBoardUrl = (this.startWith(readerBoardScheme));
			if(this.isReaderBoardUrl) url = url.substr(readerBoardScheme.length);
			readerBoardScheme = "chaika://board/";
			this.isReaderBoardUrl = (this.startWith(readerBoardScheme));
			if(this.isReaderBoardUrl) url = url.substr(readerBoardScheme.length);
			
			//ドメインとパスの切り分け
			if (url.match(/([a-z]+):\/\/([^\/]+)(.*)/i))
			{
				this.scheme = RegExp.$1;
				this.domain = RegExp.$2;
				this.path   = RegExp.$3;
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
				if (url.match(/^(.+\/read.cgi\/([^\/]+)\/([^\/]+))(\/(.+))?/))
				{
					this.threadUrl = RegExp.$1 + "/";
					this.boardName = RegExp.$2;
					this.threadNo  = RegExp.$3;
					if (RegExp.$5)
					{
						this.range = RegExp.$5;
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
		}
//		catch(e)
//		{
//			this.invalidUrl = true;
//		}
		
		//console.log(this);
	},
	startWith: function URL_startWith(x)
	{
		return this.url.substr(0, x.length) == x;
	},
};

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
var TextLoadManager = new loadManager();
	TextLoadManager.syncGet = function TextLoadManager_syncGet(url, enableCache)
	{
		var req = new XMLHttpRequest();
		req.open('GET', url, false);	//sync
		if (!enableCache) req.setRequestHeader("If-Modified-Since", "Wed, 15 Nov 1995 00:00:00 GMT");	//キャッシュから読まない
		try
		{
			req.send(null);	
			if ((req.readyState==4)&&(req.status>=200)&&(req.status<300))
			{
				return req.responseText;
			}
		}
		catch(e){}
		return null;
	}
	TextLoadManager.request = function TextLoadManager_request(obj)
	{
		var req = new XMLHttpRequest();
		req.onreadystatechange = this._loadCheck.bind(this, req, obj);
		req.open('GET', obj.href , true);
		if (!obj.enableCache) req.setRequestHeader("If-Modified-Since", "Wed, 15 Nov 1995 00:00:00 GMT");
		req.send(null);
	}
	TextLoadManager._loadCheck = function TextLoadManager__loadCheck(req, obj)
	{
		if (req.readyState==4)
		{
			obj.responseText = req.responseText;
			obj.status = req.status;
			this.response(obj, ((req.status >= 200) && (req.status<300)) ? "OK" : "NG");
		}
	}
	
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
	thumbSize: 200,		//最大サイズ
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


function MarkerService(){}
function BookmarkService(){}
function PickupServiece(){}
function TrackerService(){}
function TrackerEntry(){}
function OutlinkPlugin(type){}
	OutlinkPlugin.prototype.posivility = function OutlinkPlugin_posivility(href){}
	OutlinkPlugin.prototype.getPreviewy = function OutlinkPlugin_getPreviewy(href, onload, isPopup){}
	OutlinkPlugin.prototype.showPreview = function OutlinkPlugin_showPreview(){}
	OutlinkPlugin.prototype.popupPreview = function OutlinkPlugin_popupPreview(){}
var OutlinkPluginForImage = new OutlinkPlugin();
	OutlinkPluginForImage.posivility = function OutlinkPluginForImage_posivility(href){}
	OutlinkPluginForImage.getPreview = function OutlinkPluginForImage_getPreview(href, onload, isPopup){}
var OutlinkPluginForMovie = new OutlinkPlugin();
var OutlinkPluginForNicoNico = new OutlinkPlugin();
var OutlinkPluginForThread = new OutlinkPlugin();
var OutlinkPluginForDefault = new OutlinkPlugin();
function Popup(){}
function ResPopup(anchor){ this.init(anchor); }
function GearPopup(enchantElement) { this.init(enchantElement); }
function PopupDragDrop(popupContainer, aEvent){ this.init(popupContainer, aEvent);}
function ViewerEntry(href){ this.init(href); }
function ResManipulator(){}
ResManipulator.prototype = {
	resTo: function NodeUtil_resTo(){},
	toggleRefferPopup: function NodeUtil_toggleRefferPopup( t){},
	toggleIdPopup: function NodeUtil_toggleIdPopup( t){},
	expressReffer: function NodeUtil_expressReffer(){},
	closeRefTree: function NodeUtil_closeRefTree(){},
	toggleRefTree: function NodeUtil_toggleRefTree(){},
	openRefTree: function NodeUtil_openRefTree(){},
	toggleBookmark: function NodeUtil_toggleBookmark(){},
	setBookmark: function NodeUtil_setBookmark(){},
	resetBookmark: function NodeUtil_resetBookmark(){},
	togglePickup: function NodeUtil_togglePickup(){},
	setPickup: function NodeUtil_setPickup(){},
	resetPickup: function NodeUtil_resetPickup(){},
	previewLinks: function NodeUtil_previewLinks(){},
	toggleTracking: function NodeUtil_toggleTracking(){},
	beginTracking: function NodeUtil_beginTracking(){},
	endTracking: function NodeUtil_endTracking(){},
	focus: function NodeUtil_focus(no){},
	closeIfPopup: function NodeUtil_closeIfPopup(){},
};

//どこにおくか決めかねているもの
//AutoLoad.start, end, toggle
//MessageLoader_loadByAnchorStr(アンカー文字列からのThread.Message.prepare)

//ショートカット
var Preference = Skin.Preference = clone(_Preference);
var PopupUtil = Skin.Util.Popup;
var StringUtil = Skin.Util.String;
var DOMUtil = Skin.Util.Dom;

window.addEventListener("load", function(){ PP3.init(); });
