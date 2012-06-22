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
			if (!to) to = "";
			var url = Preference.PostScheme + Skin.Thread.Info.Url + to
			window.location.href = url;
		},
		checkNewMessage: function Thread_checkNewMessage()
		{
		},
		Message: {
			domobj: new Array(),	//DOMオブジェクト。indexはレス番号
			outLinks: new Array(),	
			deployedMin: 0,
			deployedMax: 0,
			init: function Message_init()
			{
				var nodes = $A($("resContainer").children);
				this.onLoad(nodes);
				this.onDeploy(nodes);
			},
			prepare: function Message_prepare(from, to)
			{	//minにはidsまたはアンカーの文字列を指定可能。
				//alert([min, max]);
				if (min instanceof Array)
				{
					var b = true;
					for(var i=0; i<min.length; i++)
					{
						b &= this.prepare(min[i],min[i]);
					}
					return b;
				}
				else if ((min+"").substr(1) == ">")
				{
					var str = min+"";
					str=str.replace(/>/g,"");
					var e=str.split(",");
					var r=new Array();
					for(var i=0;i<e.length;i++)
					{
						if(e[i].match(/(\d+)(-(\d+))?/))
						{
							var smin = parseInt(RegExp.$1);
							var smax = parseInt(RegExp.$3);
							if (!smax) smax = smin;
							this.load(smin, smax);
						}
					}
				}
				var tmin = parseInt(min);
				if (!tmin)return false;
				var tmax = max;
				if (tmax > Skin.Thread.Info.Total) tmax = Skin.Thread.Info.Total;	//絶対取れないところはとりに行かない。
				for(; tmin <= tmax; tmin++)
				{	//tmin位置が読み込み済みならtminを+1
					if (!this.isReady(tmin))	break;
				}
				for(; tmax >= tmin; tmax--)
				{	//tmax位置が読み込み済みならtmaxを-1
					if (!this.isReady(tmax))	break;	
				}
				if ((tmin <= tmax) && (tmin != 0))
				{	//min-maxの範囲に少なくとも１個は取得すべきレスあり
					var loardUrlStr = Skin.Thread.Info.Server + Skin.Thread.Info.Url + tmin + "-" + tmax;
					var html = TextLoadManager.syncGet(loardUrlStr) || "";
					if (html.match(/<!--BODY.START-->([\s\S]+)<!--BODY.END-->/))
					{
						var nc = document.createElement("DIV");
						nc.innerHTML = RegExp.$1;
						this.onLoad($A(nc.getElementsByTagName("ARTICLE")));
						return true;
					}
					else
					{
						return false;
					}
				}
				return true;
			},
			deploy: function Message_deploy(from, to)
			{
				var nodes = new Array();
				for(var i = from; i< to; i++)
				{
					nodes.push(this.domobj[i]);
					this._deployNode(this.domobj[i]);
				}
				this.onDeployed(nodes);
			},
			_deployNode: function Message_deployNode(node)
			{
				if (!node)return;	//ほぎゃ！
				if (node.tagName != "ARTICLE") return;	//ほぎゃ！
				if (this.isDeployed(node.dataset.no)) return;
				if (node.parentNode)
				{	//既存の親を除外。loadから来た仮のdivだと思われる。
					node.parentNode.removeChild(node);
				}
				var rc = $("resContainer");
				var nn =  parseInt(node.dataset.no);
				var nextSibling = this._findDeployedNextSibling(nn);
				if (nextSibling)
				{
					rc.insertBefore(node, nextSibling);
				}
				else
				{
					rc.appendChild(node);
				}
			},
			_findDeployedNextSibling: function Message__findDeployedNextSibing(no)
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
			getNode: function Message_getNode(no, clone)
			{
				if (this.domobj[no] != null)
				{
					var obj = this.domobj[no];
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
			getManipulator: function Message_getManipulator(NodeOrNo)
			{	//旧NodeUtil相当のオブジェクトを返すよ
				return new ResManipulator(NodeOrNo);
			},
			getDeployMode: function Message_getDeployMode(no)
			{	//bmしか使ってないので廃止する
			},
			foreach: function Message_foreach(func, includeNotDeployed, includePopup)
			{
				if (includeNotDeployed)
				{	//all loaded
					nodes = includePopup ? $A(document.body.getElementsByTagName("ARTICLE")) : this.domobj;
				}
				else
				{	//only deployed
					nodes = $A($("resContainer").children);
					if (includePopup)
					{
						var pn = $A($("popupContainer").getElementsByTagName("ARTICLE"));
						for(var i=0; i<pn.length; i++)
						{
							nodes.push(pn[i]);
						}
					}
				}
				for (var i=0, j=nodes.length; i<j; i++)
				{
					if (nodes[i]) func(nodes[i]);
				}
			},
			apply: function Message_foreach(func, filter, includeNotDeployed, includePopup)
			{
				this.foreach(function message_apply_func(node){
					if (filter(node)) func(node);
				}, includeNotDeployed, includePopup);
			},
			isReady: function Message_isReady(no)
			{
				return (this.domobj[no]);
			},
			isDeployed: function Message_isDeployed(no)
			{
				if ( this.domobj[no])
					if (this.domobj[no].parentNode)
						if (this.domobj[no].parentNode.id == "resContainer")
							return true;
				return false;
			},
			onLoad: function Message_onLoad(nodes)
			{
				for(var i=0; i<nodes.length; i++)
				{
					var node = nodes[i];
					if ((node.tagName == "ARTICLE") && (!this.isReady(node.dataset.no)))
					{	//処理前のレスである場合…（本当は他スレじゃないか確認が要るのかも？）
						var no = parseInt(node.dataset.no);
						var msgNode = node.childNodes[1];
						this._extendAnchor(msgNode);
						this._replaceStr(msgNode);
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
					}
				}
				//構造解析
				this.Structure.analyze(nodes);
				//マーカー登録
				//★MarkerServices.nodeLoaded(nodes);
			},
			onDeploy: function Message_onDeploy(nodes)
			{
				for(var i=0; i<nodes.length; i++)
				{
					var node = nodes[i];
					var n = parseInt(node.dataset.no);
					if ((this.deployedMin == 0) || (n < this.deployedMin)) this.deployedMin = n;
					if ((n==2) && (this.isDeployed(2))) this.deployedMin = 1;
					if (this.deployedMax < n) this.deployedMax = n;
					if (Preference.AutoPreviewOutLinks)
					{
						this.getManipulator(node).previewLinks();
					}
				}
			},
			_extendAnchor: function Message__extendAnchor(node)
			{
				var as=node.getElementsByTagName("A");
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
						Skin.Thread.Navigator.checkNextThread(a);
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
				var res=node.innerHTML;
				if(this._dblSizeAnchorRegExp.test(res)){
					res=res.replace(this._dblSizeAnchorRegExp,function (a,$1,$2){
						$2=StringUtil.toNarrowString($2);
						return "<a href='#"+$2+"' class='resPointer'>&gt;&gt;"+$2+"</a>";});
					node.innerHTML=res;
				}
			},
			_dblSizeAnchorRegExp: new RegExp("(＞＞|＞|&gt;&gt;|&gt;)([0-9０-９,\-]+)","g"),
			_replaceStr: function Message__replaceStr(node)
			{
			},
			Structure: {
				nodesById: new Array(),		//いわゆるID
				nodesReplyFrom: new Array(),	//いわゆる逆参照情報
				analyze: function MessageStructure_analyze(nodes)
				{
					if (this._scriptedStyle == null)
					{
						this._scriptedStyle = $("scriptedStyle");
					}
					var html = "";
					for(var i=0; i<nodes.length; i++)
					{
						html += this._analyze(nodes[i]);
					}
					this._scriptedStyle.innerHTML += html;
				},
				getReplyIdsByNo: function MessageStructure_getReplyIdsByNo(no)
				{	//指定したレス番号にレスしているレスのレス番号のリストを取得
					return this.nodesReplyFrom[no];
				},
				getNodeIdsById: function MessageStructure_getNodeIdsById(id)
				{	//IDを指定してその人物が発言したレス番号のリストを取得
					return this.nodesById[id];
				},
				_analyze: function MessageStructure__analyze(node)
				{
					var obj = node.dataset;
					var html ="";
					//IDによる構造
					if (obj.aid.length > 5)		//"????"回避
					{
						if (!this.nodesById[obj.aid]) this.nodesById[obj.aid] = new Array();
						this.nodesById[obj.aid].push(obj.no);
						if (this.nodesById[obj.aid].length == 2)
						{	//IDの強調表示。複数あるものだけIDCOLORとIDBACKGROUNDCOLORが有効。そして太字。
							html += "article[data-aid=\"{0}\"] > h2 > .id { color: {1}; background-color: {2}; font-weight: bold; }"
							       .format(obj.aid, obj.idcolor, obj.idbackcolor);
						}
					}
					
					//Replyによる構造
					var replyTo = this._getReplyTo(node);
					for(var i=0, j=replyTo.length; i < j; i++)
					{
						var t = replyTo[i];
						if(!this.nodesReplyFrom[t])
						{
							this.nodesReplyFrom[t] = new Array();
							//逆参照ありの強調表示。とりあえず逆参照がないときはメニューが表示されない（わかりにくいので強調は必要）
							this._scriptedStyle.innerHTML += 
							html += ("article[data-no=\"{0}\"] > .menu > ul > .resto { display:table-cell; }\n"
							       + "article[data-no=\"{0}\"] > h2 > .no { font-weight: bold; }\n")
							       .format(t);
						}
						this.nodesReplyFrom[t].push(obj.no);
					}
					return html;
				},
				_getReplyTo: function MessageStructure__getReplyTo(node)
				{
					var anchors = node.getElementsByClassName("resPointer");
					var replyTo = new Array();
					for (var i=0, j=anchors.length; i<j; i++)
					{
						var target = anchors[i].textContent;
						var ids = StringUtil.splitResNumbers(target);
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
			DOMUtil.notifyRefreshInternal(this.container);
		},
	},
	Util: {
		Popup: {
			toggle: function PopupUtil_toggle(target, content, closeOnMouseLeave, toTopBeforeHide, category)
			{
				if (target.__popup)
				{
					var p = target.__popup;
					if (!toTopBeforeHide || (p.isTopLevelPopup(category)))
					{	//トップレベルに一度出さないか、トップレベルのときクローズ
						p.close();
					}
					else
					{	//トップレベルに一度出す
						p.toTop();
					}
				}
				else
				{
					var p = new Popup();
					p.closeOnMouseLeave = closeOnMouseLeave;
					p._init(target);
					p.onClose = this._onCloseHandler.bind(target);
					target.__popup = p;
					p.show(content);
				}
			},
			toggleResPopup: function PopupUtil_toggleResPopup(target, ids, closeOnMouseLeave, caption)
			{
				if (target.__popup)
				{
					target.__popup.close();
				}
				else if (ids)
				{
					ids = ($A(ids)).sort(function(a,b){return a-b;});
					MessageLoader.load(ids);
					var p = new ResPopup();
					p.closeOnMouseLeave = closeOnMouseLeave;
					p.onClose = this._onCloseHandler.bind(target);
					target.__popup = p;
					p.popup(ids, target, caption);
				}
			},
			_onCloseHandler: function PopupUtil__onCloseHandler()
			{
				this.__popup = null;
			},
			isPopup: function PopupUtil_isPopup(e)
			{
				return this.getPopup(e) != null;
			},
			getPopup: function PopupUtil_getPopup(e)
			{
				while (e)
				{
					if (e.popup) return e.popup;
					e = e.parentNode;
				}
				return null;
			},
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

/* ■ポップアップ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
function Popup() { }
Popup.prototype = {
	closeOnMouseLeave: true,
	dontLimitSize: false,
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
		this.fixed = DOMUtil.isFixedElement(e);	//適用先オブジェクトは固定されたもの？
		
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
		var p = DOMUtil.getElementPagePos(e);
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
		if (this.parentPopup) this.parentPopup.unregistorChild(this);
	},
	//サイズ制限
	limitSize: function Popup_limitSize(pos)
	{
		if (this.dontLimitSize) return;
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
	float: function Popup_float()
	{
		if (!this.floating)
		{
			this.closeOnMouseLeave = false;
			this.floatingRect = DOMUtil.getElementPagePos(this.container.firstChild);
			this.floatingRect.pageX -= Preference.PopupLeft;
			this.floatingRect.pageY -= 4;
			this.container.dataset.floatingPopup = "y";
			this.container.style.left = this.floatingRect.pageX + "px";
			this.container.style.top  = this.floatingRect.pageY + "px";
			this.container.firstChild.style.marginLeft = "0px";
			if (this.parentPopup) this.parentPopup.unregistorChild(this);
			this.floating = true;
		}
		this.toTop();
	},
	offsetFloat: function Popup_float(dx, dy)
	{
		if (!this.floating) return;
		this.floatingRect.pageX += dx;
		this.floatingRect.pageY += dy;
		this.container.style.left = this.floatingRect.pageX + "px";
		this.container.style.top  = this.floatingRect.pageY + "px";
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
		popup.parentPopup = this;
	},
	unregistorChild: function Popup_unregistorChild(popup)
	{
		if (popup && (popup.parentPopup == this))
		{
			this.childPopups = this.childPopups.filter(function(x){ return x != popup; });
			popup.parentPopup = null;
		}
	},
	isTopLevelPopup: function Popup_isTopLevelPopup(cls)
	{
		var container = $("popupContainer");
		var topLevelPopup = "";
		for(var i=0; i<container.children.length; i++)
		{
			var popup = container.children[i];
			if (popup.firstChild && (!cls || (popup.firstChild.className == cls)))
			{	//本当はかぶってるかどうかで判定したほうが良い？
				topLevelPopup = popup;
			}
		}
		return topLevelPopup == this.container;
	},
	toTop: function Popup_toTop()
	{	//一回抜いてまた入れるだけ
		$("popupContainer").removeChild(this.container);
		$("popupContainer").appendChild(this.container);
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
	
	ResPopup.prototype.popup =  function ResPopup_popup(obj, e, caption)
	{
		var ids;
		if (!e) e = obj;
		this._init(e);
		if (obj.tagName)
		{	//要素。アンカーだと信じる
			ids = StringUtil.splitResNumbers(obj.textContent);
			Skin.Thread.Message.prepare(obj.textContent);
			this.container.dataset.popupCaption = (caption||"") + obj.textContent;
		}
		else if (obj.length)
		{	//配列・・・だといいなぁ
			ids = obj;
			//prepareいらんのか？
			this.container.dataset.popupCaption = caption;
		}
		else
		{	//その他・・・適当に
			ids = [obj];
			//prepareいらんのか？
			this.container.dataset.popupCaption = caption;
		}
		
		var innerContainer = document.createElement("DIV");
		for(var i=0, len=ids.length; i < len ; i++)
		{
			var node = Skin.Thread.Message.getNode(ids[i], true);
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
		c.dataset.popupCaption = "GEAR>>" + n.dataset.no;
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
			this.container.dataset.popupCaption = "GEAR>>" + n.dataset.no;
			this.content.appendChild(n);
			if (!this.floating) this.adjust();
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
		Skin.Thread.Message.prepare(no, no);
		this.no = no;
		return Skin.Thread.Message.getNode(no, true);
	};


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
var Notice = Skin.Notice;
var PopupUtil = Skin.Util.Popup;
var StringUtil = Skin.Util.String;
var DOMUtil = Skin.Util.Dom;

window.addEventListener("load", function pp3initializer(){ PP3.init(); });
