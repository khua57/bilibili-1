/** @jsx React.DOM */
(function(){
var cx = React.addons.classSet
var SuggestList = React.createClass({displayName: 'SuggestList',
	handler: function(e){
		this.props.onClickHandler($(e.target).text())
		this.props.resetHandler($(e.target).text())
	},
	renderList: function(data){
		var ret = data.map(function(d){
			return (
				React.DOM.li({onClick: this.handler}, 
					d.value
				)
			)
		},this)
		return ret
	},
	render: function(){
		return (
			React.DOM.ul({className: "suggestList", style: {display: this.props.data.length ? 'block' : 'none'}}, 
				this.renderList(this.props.data)
			)
		)
	}
})
var SearchBar = React.createClass({displayName: 'SearchBar',
	handler: function(e){
		// var self = this
		e.preventDefault()
		this.props.onClickHandler(this.refs['searchBar'].getDOMNode().value)
	},
	getInitialState: function() {
		var self = this
		return {value: '',suggestList: []}
	},
	suggestHandler: function(e){
		var value = e.target.value
		clearTimeout(this.suggestTimer)
		this.suggestTimer = setTimeout(function(){
			$.ajax({
				url: 'http://127.0.0.1:4321/bilibili/getSuggest',
				data: {
					term: value
				},
				success: function(data){
					if(data.length){
						this.setState({suggestList: data})
					}else{
						this.setState({suggestList: []})
					}
				}.bind(this)
			})
		}.bind(this),500)
	},
	resetHandler: function(value){
		this.refs['searchBar'].getDOMNode().value = value
		this.setState({
			suggestList: []
		})
	},
	render: function(){
		return (
		React.DOM.div({className: "row collapse"}, 
			React.DOM.div({className: "small-1 columns"}, 
	          React.DOM.span({className: "prefix"}, "搜索:")
	        ), 
			React.DOM.div({className: "small-9 columns"}, 
			React.DOM.input({type: "text", placeholder: "bilibili...", ref: "searchBar", onInput: this.suggestHandler, onFocus: this.suggestHandler}), 
			SuggestList({data: this.state.suggestList, onClickHandler: this.props.onClickHandler, resetHandler: this.resetHandler})
			), 
			React.DOM.div({className: "small-2 columns"}, 
				React.DOM.a({href: "javascript:;", className: "button alert postfix", onClick: this.handler}, "哔哩哔哩")
			)
		)
		)
	}
})
var Pagination = React.createClass({displayName: 'Pagination',
	getDefaultProps: function(){
		return {
			curPage: 1
		}
	},
	render: function(){
		var $__0=  this.props,curPage=$__0.curPage,pageNum=$__0.pageNum,onChangeHandler=$__0.onChangeHandler
		var controllerName = cx({
			'arrow' : true,
			'unavailable': (curPage === 1) || (curPage === pageNum)
		})
		var pages = []
		// <li className="unavailable"><a href="">&hellip;</a></li>
		pages.push(React.DOM.li({className: controllerName}, React.DOM.a({href: ""}, "«")))
		for(var i = 1,l = this.props.pageNum; i <= l; i++){
			pages.push(React.DOM.li({className: i === curPage ? 'current' : ''}, React.DOM.a({href: "javascript:;", 'data-page': i, onClick: onChangeHandler}, i)))
		}
		pages.push(React.DOM.li({className: controllerName}, React.DOM.a({href: ""}, "»")))
		return (
			React.DOM.div({className: "pagination-centered"}, 
				React.DOM.ul({className: "pagination"}, 
					pages
				)
			)
		)
	}
})
// vedio list
var Sp = React.createClass({displayName: 'Sp',
	renderList: function(data){
		if(!data || !data.list.length) return []
		var ret = []
		ret = data.list.map(function(d){
			return (
				React.DOM.li(null, 
					React.DOM.a({href: "javascript:;", 'data-aid': d.aid, title: d.title, onClick: this.props.getCid}, 
						React.DOM.img({src: d.cover}), 
						React.DOM.p(null, d.title)
					)
				)
			)
		},this)
		ret.push(React.DOM.li({onClick: this.props.resetAvs}, "收起全部"))
		return (
			React.DOM.ul(null, 
				ret
			)
		)
	},
	render: function(){
		return (
			React.DOM.div({className: "sp"}, 
				React.DOM.ul(null, 
					this.props.data
				), 
				React.DOM.div({className: "sp-avs", style: {display: this.props.avs ? 'block' : 'none'}}, 
					this.renderList(this.props.avs)	
				)
			)
		)
	}
})
// vedio list
var Av = React.createClass({displayName: 'Av',
	render: function(){
		return (
			React.DOM.div({className: "av"}, 
				React.DOM.ul(null, 
					this.props.data
				)
			)
		)
	}
})
var Result = React.createClass({displayName: 'Result',
	onChangeHandler: function(value){
		this.setState({avs: null})
		this.props.onChangeHandler(value)
	},
	resetAvs: function(){
		this.setState({avs: null})
	},
	getCid: function(e){
		e.preventDefault()
		var aid = $(e.target).closest('a').data('aid')
		$.ajax({
			url: 'http://127.0.0.1:4321/bilibili/getUrl',
			method: 'get',
			data: {
				id: aid
			},
			success: function(data){
				alert(data.durl[0].url)
			},
			error: function(err){
				alert(err.err_message)
			}
		})
	},
	getSpid: function(e){
		e.preventDefault()
		var spid = $(e.target).closest('a').data('spid')
		$.ajax({
			url: 'http://127.0.0.1:4321/bilibili/getSp',
			method: 'get',
			data: {
				spid: spid
			},
			success: function(data){
				this.setState({avs: data})
			}.bind(this)
		})
	},
	getInitialState: function() {
		return {avs: null}
	},
	renderList: (function(){
		var buildList = function(data){
			var sp = [],av = [],
				total = data.total,result = data.result
			result.forEach(function(d){
				if(d.type === 'video'){
					av.push(React.DOM.li(null, 
						React.DOM.a({className: "th", href: "javascript:;", 'data-aid': d.aid, onClick: this.getCid}, 
  							React.DOM.img({src: d.pic})
						), 
						React.DOM.div({className: "des"}, 
							React.DOM.h6(null, React.DOM.i({className: "label secondary"}, d.typename), React.DOM.a({href: d.arcurl, target: "_blank"}, d.title)), 
							React.DOM.p(null, d.description), 
							React.DOM.p({className: "success", ref: "aid-" + d.aid})	
						)
					))
				}else if(d.type === 'special'){
					sp.push(React.DOM.li(null, 
						React.DOM.a({className: "th", href: "javascript:;", 'data-spid': d.spid, onClick: this.getSpid}, 
  							React.DOM.img({src: d.pic})
						), 
						React.DOM.div({className: "des"}, 
							React.DOM.h6(null, React.DOM.i({className: "warning label"}, d.typename), React.DOM.a({href: "http://www.bilibili.com" + d.arcurl, target: "_blank"}, d.title)), 
							React.DOM.p(null, d.description), 
							React.DOM.p({className: "success", ref: "spid-" + d.spid})	
						)
					))
				}
			},this)
			return (
				React.DOM.div(null, 
					React.DOM.p(null, "共找到", total, "个结果"), 
					Sp({data: sp, avs: this.state.avs, resetAvs: this.resetAvs, getCid: this.getCid}), 
					Av({data: av}), 
					Pagination({pageNum: data.numPages, curPage: this.props.page, onChangeHandler: this.onChangeHandler})
				)
			)
		}
		return function(data){
			var err = data.message,ret
			if(err){
				return err
			}else{
				return buildList.call(this,data)
			}
		}
	})(),
	render: function(){
		var $__0=  this.props,data=$__0.data
		if($.isPlainObject(data)){
			lists = this.renderList(data)
		}else{
			lists = data
		}
		return (
			React.DOM.div(null, 
				lists
			)
		)
	}
})
var App = React.createClass({displayName: 'App',
	onClickHandler: function(value){
		this.setState({
			value: value,
			data: 'fetching...'
		})
		$.ajax({
			url: 'http://127.0.0.1:4321/bilibili/search',
			method: 'get',
			data: {
				keyword: value,
				page: this.state.page
			},
			success: function(data){
				this.setState({data: data})
			}.bind(this)
		})
	},
	onChangeHandler: function(e){
		var curPage = $(e.target).data('page')
		if(curPage === this.state.page) return 
		// pagination
		this.setState({
			data: 'fetching...'
		})
		$.ajax({
			url: 'http://127.0.0.1:4321/bilibili/search',
			method: 'get',
			data: {
				keyword: this.state.value,
				page: curPage
			},
			success: function(data){
				this.setState({
					data: data,
					page: curPage
				})
			}.bind(this)
		})
	},
	getInitialState: function() {
		return {
			page: 1
		}
	},
	render: function(){
		var $__0=  this.state,data=$__0.data,page=$__0.page,avs=$__0.avs
		return (
			React.DOM.div(null, 
				SearchBar({onClickHandler: this.onClickHandler}), 
				Result({data: data, onChangeHandler: this.onChangeHandler, page: page})
			)
		)
	}
})
React.render(
	App(null),
	$('.container')[0]

)
})()