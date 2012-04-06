
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
			if (ThreadURL.match(/([^\/]+)\/([^\/]+)\/$/)) {
				this._identifier = RegExp.$1 + "." + RegExp.$2;
			}
		}
	},
	
	getBookmark: function() {
		var item = this._storage.getItem(this._resolvePrefName("bm."));
		if(item == null) return "";
		return item.value;
	},
	
	setBookmark: function(aResNo) {
		var value = this.createArrayString(aResNo);
		this._storage.setItem(this._resolvePrefName("bm."), value);
		return value;
	},
	
	getPickups: function() {
		var item = this._storage.getItem(this._resolvePrefName("pk."));
		if(item == null) return new Array();
		return this.stringToArray(item.value);
		
	},
	
	setPickups: function(ResNumbers) {
		var value = this.createArrayString(ResNumbers);
		this._storage.setItem(this._resolvePrefName("pk."), value);
		return value;
	},
	
	getIgnores: function() {
		var item = this._storage.getItem(this._resolvePrefName("ig."));
		if(item == null) return new Array();
		return this.stringToArray(item.value);
	},
	
	setIgnores: function(ResNumbers) {
		var value = this.createArrayString(ResNumbers);
		this._storage.setItem(this._resolvePrefName("ig."), value);
		return value;
	},
	
	createArrayString: function(a) {
		if (a instanceof Array) {
			var flg=false;
			var res="";
			for (var i=0; i< a.length; i++) {
				if (!isNaN(parseInt(a[i]))) {
					if (flg) {
						res += ("," + a[i]);
					} else {
						res = a[i];
						flg=true;
					}
				}
			}
			return res;
		} else {
			return a;
		}
	},
	
	stringToArray: function(s) {
		//↓ときたまうまくいかない・・・なんでだろう
		//return eval("new Array(" + s + ")");
		var e = s.split(",");
		var r = new Array();
		for (var i=0;i<e.length;i++) {
			if (e[i].match(/(\d+)-(\d+)/)) {
				for (var j = parseInt(RegExp.$1) ; j <= parseInt(RegExp.$2) ; j++ ) {
					r.push(j);
				}
			} else if (!isNaN(parseInt(e[i]))) r.push(parseInt(e[i]));
		}
		return r;
		
		
	}

};
