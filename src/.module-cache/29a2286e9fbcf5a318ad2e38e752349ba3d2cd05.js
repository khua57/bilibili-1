/** @jsx React.DOM */
(function(){
var SearchBar = React.createClass({displayName: 'SearchBar',
	handler: function(e){
		var self = this
		e.preventDefault()
		$.ajax({
			url: 'http://127.0.0.1:4321/bilibili/search',
			method: 'get',
			data: {
				keyword: this.refs['searchBar'].getDOMNode().value
			},
			success: function(data){
				self.props.onClickHandler(data)
			}
		})
		
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
var Result = React.createClass({displayName: 'Result',
	getDefaultProps: function(){
		return {
			value: '垃圾'
		}
	},
	renderList: function(data){
		var err = data.error
		if(ret){

		}
	},
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
		this.setState({value: value})
	},
	getInitialState: function() {
		return {}
	},
	render: function(){
		var $__0=  this.state,value=$__0.value
		return (
			React.DOM.div(null, 
				SearchBar({onClickHandler: this.onClickHandler}), 
				Result({value: value})
			)
		)
	}
})
React.render(
	App(null),
	$('.container')[0]

)
})()