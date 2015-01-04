/** @jsx React.DOM */
(function(){
var cx = React.addons.classSet
var SuggestList = React.createClass({displayName: 'SuggestList',
	getSuggest: function(value){
		if(this.state.lock) return
		this.state.lock = true
		$.ajax({
			url: 'http://127.0.0.1:4321/bilibili/getSuggest',
			data: {
				term: value
			},
			success: function(data){
				this.setState({
					lists: this.renderList(data)
				})
				this.state.lock = false
			}.bind(this)
			,error: function(){
				this.state.lock = false
			}.bind(this)
		})
	},
	handler: function(e){
		this.props.onClickHandler($(e.target).text())
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
	getInitialState: function() {
		return {
			lock: false,
			lists: [],
			show: true
		}
	},
	render: function(){
		var show = this.state.show
		if(!this.props.value){
			this.state.lists = []
			this.setState({show: false})
		}else{
			this.getSuggest(this.props.value)
		}
		return (
			React.DOM.ul({className: "suggestList", style: {display: this.state.show ? 'block' : 'none'}}, 
				this.state.lists
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
		return {value: ''}
	},
	suggest: function(e){
		this.setState({
			suggestList: e.target.value
		})
		// React.render(
		// 	<div>{e.target.value}</div>,
		// 	document.body
		// )
	},
	render: function(){
		return (
		React.DOM.div({className: "row collapse"}, 
			React.DOM.div({className: "small-1 columns"}, 
	          React.DOM.span({className: "prefix"}, "搜索:")
	        ), 
			React.DOM.div({className: "small-9 columns"}, 
			React.DOM.input({type: "text", placeholder: "bilibili...", ref: "searchBar", onInput: this.suggest}), 
			SuggestList({value: this.state.suggestList, onClickHandler: this.props.onClickHandler})
			), 
			React.DOM.div({className: "small-2 columns"}, 
				React.DOM.a({href: "javascript:;", className: "button postfix", onClick: this.handler}, "哔哩哔哩")
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
	getCid: function(e){
		e.preventDefault()
		var aid = $(e.target).closest('a').data('aid'),
			refNode = this.refs['aid-' + aid].getDOMNode()
		$.ajax({
			url: 'http://127.0.0.1:4321/bilibili/getUrl',
			method: 'get',
			data: {
				id: aid
			},
			success: function(data){
				refNode.innerText = data.durl[0].url	
			}
		})
	},
	getDefaultProps: function(){
		return {
			value: ''
		}
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

				}
			},this)
			return (
				React.DOM.div(null, 
					React.DOM.p(null, "共找到", total, "个结果"), 
					React.DOM.div(null, 
						
						React.DOM.ul({className: "sp"}, 
							sp
						)
					), 
					Av({data: av}), 
					Pagination({pageNum: data.numPages, curPage: this.props.page, onChangeHandler: this.props.onChangeHandler})
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
		var $__0=  this.state,data=$__0.data,page=$__0.page
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