/** @jsx React.DOM */
(function(){
var SearchBar = React.createClass({displayName: 'SearchBar',
	render: function(){
		return (
		React.DOM.div({className: "row collapse"}, 
			React.DOM.div({className: "small-1 columns"}, 
	          React.DOM.span({className: "prefix"}, "搜索:")
	        ), 
			React.DOM.div({className: "small-9 columns"}, 
			React.DOM.input({type: "text", placeholder: "bilibili..."})
			), 
			React.DOM.div({className: "small-2 columns"}, 
				React.DOM.a({href: "javascript:;", className: "button postfix"}, "哔哩哔哩")
			)
		)
		)
	}
})
React.render(
	SearchBar(null),
	$('.container')[0]

)
})()