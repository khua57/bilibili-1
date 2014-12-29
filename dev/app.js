/** @jsx React.DOM */
(function(){
var SearchBar = React.createClass({
	handler: function(e){
		var self = this
		e.preventDefault()
		this.props.onClickHandler('fetching...')
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
		<div className="row collapse">
			<div className="small-1 columns">
	          <span className="prefix">搜索:</span>
	        </div>
			<div className="small-9 columns">
			<input type="text" placeholder="bilibili..." ref="searchBar"/>
			</div>
			<div className="small-2 columns">
				<a href="javascript:;" className="button postfix" onClick={this.handler}>哔哩哔哩</a>
			</div>
		</div>
		)
	}
})
var Result = React.createClass({
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
			var sp = [],av = []
			data.forEach(function(d){
				if(d.type === 'video'){
					av.push(<li>
						<a className="th" href="javascript:;" data-aid={d.aid} onClick={this.getCid}>
  							<img src={d.pic} />
						</a>
						<div className="des">
							<h6><i className="label secondary">{d.typename}</i><a href={d.arcurl} target="_blank">{d.title}</a></h6>
							<p>{d.description}</p>
							<p className="success" ref={"aid-" + d.aid}></p>	
						</div>
					</li>)
				}else if(d.type === 'special'){

				}
			},this)
			return (
				<div>
					<ul className="sp">
						{sp}
					</ul>
					<ul className="av">
						{av}
					</ul>
				</div>
			)
		}
		return function(data){
			var err = data.message,ret
			if(err){
				return err
			}else{
				return buildList.call(this,data.result)
			}
		}
	})(),
	render: function(){
		var {value} = this.props
		if($.isPlainObject(value)){
			lists = this.renderList(value)
		}else{
			lists = value
		}
		return (
			<div>
				{lists}
			</div>
		)
	}
})
var App = React.createClass({
	onClickHandler: function(value){
		this.setState({value: value})
	},
	getInitialState: function() {
		return {}
	},
	render: function(){
		var {value} = this.state
		return (
			<div>
				<SearchBar onClickHandler={this.onClickHandler}/>
				<Result value={value}/>
			</div>
		)
	}
})
React.render(
	<App />,
	$('.container')[0]

)
})()