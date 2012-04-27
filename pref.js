
//どっちかをコメントアウトして使う
var _strage_domain_ = "127.0.0.1";					//0.4.5以前はこっちをコメントアウト
//var _strage_domain_ = "localhost.localdomain";	//0.4.5以降はこっちをコメントアウト


var SkinPref = {

	_skinName: "PhantomPain",
	_storage: globalStorage[_strage_domain_],
	
	_resolvePrefName: function(aPrefName){
		return this._skinName + "_" + aPrefName;
	},
	
	getStr: function(aPrefName, aDefaultValue){
		var item = this._storage.getItem(this._resolvePrefName(aPrefName));
		if(item == null) return aDefaultValue || "";
		return item.value;
	},
	setStr: function(aPrefName, aValue){
		var value = String(aValue);
		this._storage.setItem(this._resolvePrefName(aPrefName), value);
		return value;
	},

	getInt: function(aPrefName, aDefaultValue){
		var item = this._storage.getItem(this._resolvePrefName(aPrefName));
		if(item == null) return aDefaultValue || 0;
		return parseInt(item.value);
	},
	setInt: function(aPrefName, aValue){
		var value = parseInt(aValue);
		this._storage.setItem(this._resolvePrefName(aPrefName), value);
		return value;
	},
		
	getBool: function(aPrefName, aDefaultValue){
		var item = this._storage.getItem(this._resolvePrefName(aPrefName));
		if(item == null) return aDefaultValue || false;
		return (item.value == "true");
	},
	setBool: function(aPrefName, aValue){
		var value = (aValue) ? "true" : "false";
		this._storage.setItem(this._resolvePrefName(aPrefName), value);
		return value;
	}

};



var CommonPref = {

	_identifier: new String("UNKNOWN"),
	
	_storage: globalStorage[_strage_domain_],
	
	_resolvePrefName: function(aPrefName){
		return "bbs2chSkin.common." + aPrefName + this._identifier;
	},
	
	setIdentifier: function(aThreadURL) {
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
	//objName = ブックマーク：bm, ピックアップ：pk, Ignores: ig
	writeThreadObject: function(objName, jsonStr)
	{
		var pn = "bbs2chSkin.common." + objName + "." + this._identifier;
		this._storage.setItem(pn, jsonStr);
	},
	readThreadObject: function(objName ,isArray)
	{
		var pn = "bbs2chSkin.common." + objName + "." + this._identifier;
		if (isArray)
		{	//Array: これ、過去の互換性のためだけにある。
			return eval("[" + this._storage.getItem(pn) + "]");
		}
		else
		{
			return eval(this._storage.getItem(pn)+"");
		}
	},
	writeGlobalObject: function(objName, jsonStr)
	{
		var pn = "bbs2chSkin.common." + objName;
		this._storage.setItem(pn, jsonStr);
	},
	readGlobalObject: function(objName)
	{
		var pn = "bbs2chSkin.common." + objName;
		return eval(this._storage.getItem(pn)+"");
	},
};
