var http = require('http'),
	fs = require('fs'),
	url = require('url')

const PORT = 4321,
	  app = '/bilibili/'

var request = function(config,callback){
	return http.request(config,function(res){
		var chunk = ''
		res.setEncoding('utf-8')
		res.on('data',function(d){
			chunk += d
		}).on('end',function(){
			return callback && callback(null,chunk)
		}).on('error',function(err){
			return callback && callback(err,null)
		})
	}).end()
}
var api = {
	getCid: function(av,callback){
		// getCid
		// http://api.bilibili.cn/view?id=1836103&page=1&platform=bilihelper&appkey=95acd7f6cc3392f3
		var intf = '/view'
		return request(mergeQuery(intf,av),callback)	
	},
	getUrl: function(av,callback){
		var intf = '/playurl'
		return this.getCid(av,function(err,data){
			try {
				data = JSON.parse(data)
			}catch(e){
				return callback(e,null)
			}
			if(err){
				return callback(err,null)
			}else{
				return request(mergeQuery(intf,{
					cid: data.cid,
					otype: 'json',
					quality: 4,
					type: 'mp4'

				},{
					hostname: 'interface.bilibili.com'
				}),callback)
			}
		})
		// return request(mergeQuery(intf,av),callback)
		// getUrl
		// http://interface.bilibili.com/playurl?platform=bilihelper&otype=json&appkey=95acd7f6cc3392f3&cid=2827045&quality=4&type=mp4

	},
	getSp: function(query,callback){
		 // http://api.bilibili.cn/spview?spid=36
		 var intf = '/spview'
		 return request(mergeQuery(intf,query),callback)
	},
	search: function(query,callback){
		var intf = '/search'
		// keyword,page,pagesize,order
		// http://api.bilibili.cn/search
		return request(mergeQuery(intf,query),callback)	
	},
	getSuggest: function(query,callback){
		var intf = '/suggest'
		return request(mergeQuery(intf,query),callback)	
	}
}

var mergeQuery = (function(){
	var toString = function(data){
		var ret = []
		for(var i in data){
			if(data.hasOwnProperty(i)){
				ret.push(i + '=' + data[i])
			}
		}
		ret = ret.join('&')
		return ret
	}
	var token = '&platform=bilihelper&appkey=95acd7f6cc3392f3'
	return function(url,query,extra){
		var config = {
			hostname: 'api.bilibili.cn',
			method: 'get',
			headers: {
				'User-Agent': 'bilihelper (orz@loli.my)'
			}
		}
		if(extra){
			for(var i in extra){
				if(extra.hasOwnProperty(i)){
					config[i] = extra[i]
				}
			}
		}
		query = toString(query) + token
		config['path'] = url + (url.indexOf('?') !== -1 ? '&' : '?') + query
		return config
	}
})()
var render = function(req,res){
	return function(err,data,extra){
		res.writeHead((extra ? extra.code : 200),{
			'Access-Control-Allow-Origin': req.headers['origin'],
			'Access-Control-Allow-Credentials': true,
			'Content-Type': extra ? extra['Content-Type'] : 'application/json',
			'Content-Length': data.length
		})
		res.end(data)
	}
}
var server = http.createServer(function(req,res){
	var reqUrl = url.parse(req.url,true),
		method = req.method.toLowerCase(),
		pathName = reqUrl.pathname,
		query = reqUrl.query
	if(method === 'get'){
		pathName = pathName.replace(app,'')
		if(api[pathName]){
			return api[pathName](query,render(req,res))
		}else{
			return render(req,res)(null,'404 page',{
				code: 404,
				'Content-Type': 'text/html'
			})
		}
	}
}).listen(PORT)
