/** @jsx React.DOM */
(function(){
var SearchBar = React.createClass({displayName: 'SearchBar',
	render: function(){
		return (
		React.DOM.div({class: "row collapse"}, 
			React.DOM.div({class: "small-1 columns"}, 
	          React.DOM.span({class: "prefix"}, "搜索:")
	        ), 
			React.DOM.div({class: "small-9 columns"}, 
			React.DOM.input({type: "text", placeholder: "bilibili..."})
			), 
			React.DOM.div({class: "small-2 columns"}, 
				React.DOM.a({href: "javascript:;", class: "button postfix"}, "哔哩哔哩")
			)
		)
		)
	}
})
React.render(
	SearchBar(null),
	document.body

)
})()