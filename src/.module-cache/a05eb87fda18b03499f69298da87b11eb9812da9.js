/** @jsx React.DOM */
(function(){
var SearchBar = React.createClass({displayName: 'SearchBar',
	handler: function(e){
		e.preventDefault()
		this.props.onClickHandler(this.refs['searchBar'].getDOMNode().value)
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
	render: function(){
		return (
			React.DOM.div(null, this.props.value)
		)
	}
})
var App = React.createClass({displayName: 'App',
	onClickHandler: function(value){
		this.setState({value: value})
	},
	getInitialState: function() {
		return {
			value: '' 
		}
	},
	render: function(){
		var $__0=  this.state,value=$__0.value
		return (
			React.DOM.div(null, 
				SearchBar({onClickHandler: this.onClickHandler, value: value}), 
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