/** @jsx React.DOM */
(function(){
var cx = React.addons.classSet
var SearchBar = React.createClass({displayName: 'SearchBar',
	handler: function(e){
		// var self = this
		e.preventDefault()
		this.props.onClickHandler(this.refs['searchBar'].getDOMNode().value)
	},
	getDefaultProps: function(){
		return {
			page: 1
		}
	},
	render: function(){
		return (
		React.DOM.div({className: "row collapse"}, 
			React.DOM.div({className: "small-1 columns"}, 
	          React.DOM.span({className: "prefix"}, "搜索:")
	        ), 
			React.DOM.div({className: "small-9 columns"}, 
			React.DOM.input({type: "text", placeholder: "bilibili...", ref: "searchBar"})
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
		console.log(this.refs)
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
		var $__0=  this.props,value=$__0.value
		if($.isPlainObject(value)){
			lists = this.renderList(value)
		}else{
			lists = value
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
		var self = this
		this.setState({value: value})
		$.ajax({
			url: 'http://127.0.0.1:4321/bilibili/search',
			method: 'get',
			data: {
				keyword: this.refs['searchBar'].getDOMNode().value,
				page: self.props.page
			},
			success: function(data){
				self.props.onClickHandler(data)
			}
		})
		
	},
	onChangeHandler: function(e){
		// pagination
		this.setState({page: $(e.target).data('page')})
	},
	getInitialState: function() {
		return {}
	},
	render: function(){
		var $__0=  this.state,value=$__0.value,page=$__0.page
		return (
			React.DOM.div(null, 
				SearchBar({onClickHandler: this.onClickHandler, page: page}), 
				Result({value: value, onChangeHandler: this.onChangeHandler, page: page})
			)
		)
	}
})
React.render(
	App(null),
	$('.container')[0]

)
})()