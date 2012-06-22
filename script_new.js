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


var Skin = PP3 = {
	skinName: "PhantomPain3",
	skinVer: "ver. \"closed alpha\"",
	init: function()
	{
		//loadPref
		this.Thread.init();		//ThreadInit
	},
	Configulator: {
	},
	BoardList: {
		init: function(){},
		prepareBoardNames: function(){},
		save: function(){},
		reloadBoardNameTxt: function(){},
		getBoardName: function(){},
		setBoardName: function(){},
	},
	
	Thread: {
		init: function Thread_init()
		{
			//identifier
			//boardName
			//prev/next thread
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
			gotoPrevChapter: function Navigator_gotoPrevChapter()
			{
			},
			gotoNextChapter: function Navigator_gotoNextChapter()
			{
			},
			gotoThreadList: function Navigator_gotoThreadList()
			{
			},
			gotoPrevThread: function Navigator_gotoPrevThread()
			{
			},
			gotoNextThread: function Navigator_gotoNextThread()
			{
			},
			checkNextThread: function Navigator_checkNextThread(nodes)
			{
			},
			setNextThread: function Navigator_setNextThread(href, ud, nodeNo)
			{
			},
			saveNextThreadInfo: function Navigator_saveNextThreadInfo()
			{
			},
			loadNextThreadInfo: function Navigator_loadNextThreadInfo()
			{
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
		},
		Dom: {
		},
	},
	EventHandler: {
	
	},
};

function MarkerService(){}
function BookmarkService(){}
function PickupServiece(){}
function TrackerService(){}
function TrackerEntry(){}
function URL(){}
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
function loadManager(){}
var TextLoadManager = new loadManager();
var ImageLoadManager = new loadManager();
function ImageThumbnail(url, sz){}
function ImageThumbnailOnClickOverlay(url, sz){this.thumbSize = sz; this.init(url);}
function ImageThumbnailOnClickOverlayFrame(url, sz){this.thumbSize = sz; this.init(url);}
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


window.addEventListener("load", function(){ PP3.init(); });
