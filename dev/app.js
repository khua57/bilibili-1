/** @jsx React.DOM */ 
(function(){
var cx = React.addons.classSet
var SuggestList = React.createClass({
	handler: function(e){
		this.props.onClickHandler($(e.target).text())
		this.props.resetHandler($(e.target).text())
	},
	renderList: function(data){
		var ret = data.map(function(d){
			return (
				<li onClick={this.handler}>
					{d.value}
				</li>
			)
		},this)
		return ret
	},
	render: function(){
		return (
			<ul className="suggestList" style={{display: this.props.data.length ? 'block' : 'none'}}>
				{this.renderList(this.props.data)}
			</ul>
		)
	}
})
var SearchBar = React.createClass({
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
	SuggestListToggle: function(e){
		// this.refs.component
		if(e.target !== this.refs['searchBar'].getDOMNode()){
			this.setState({suggestList: []})
		}
	},
	componentDidMount: function(){
		$(document).on('click',this.SuggestListToggle)
	},
	componentWillUnmount: function(){
		$(document).off('click',this.SuggestListToggle)
	},
	resetHandler: function(value){
		this.refs['searchBar'].getDOMNode().value = value
		this.setState({
			suggestList: []
		})
	},
	render: function(){
		return (
		<div className="row collapse">
			<div className="small-1 columns">
	          <span className="prefix">搜索:</span>
	        </div>
			<div className="small-9 columns">
			<input type="text" placeholder="bilibili..." ref="searchBar" onInput={this.suggestHandler} onFocus={this.suggestHandler} />
			<SuggestList data={this.state.suggestList} onClickHandler={this.props.onClickHandler} resetHandler={this.resetHandler}/>
			</div>
			<div className="small-2 columns">
				<a href="javascript:;" className="button alert postfix" onClick={this.handler}>哔哩哔哩</a>
			</div>
		</div>
		)
	}
})
var Pagination = React.createClass({
	getDefaultProps: function(){
		return {
			curPage: 1
		}
	},
	render: function(){
		var {curPage,pageNum,onChangeHandler} = this.props
		var controllerName = cx({
			'arrow' : true,
			'unavailable': (curPage === 1) || (curPage === pageNum)
		})
		var pages = []
		// <li className="unavailable"><a href="">&hellip;</a></li>
		pages.push(<li className={controllerName}><a href="">&laquo;</a></li>)
		for(var i = 1,l = this.props.pageNum; i <= l; i++){
			pages.push(<li className={i === curPage ? 'current' : ''}><a href="javascript:;" data-page={i} onClick={onChangeHandler}>{i}</a></li>)
		}
		pages.push(<li className={controllerName}><a href="">&raquo;</a></li>)
		return (
			<div className="pagination-centered">
				<ul className="pagination">
					{pages}
				</ul>
			</div>
		)
	}
})
// vedio list
var Sp = React.createClass({
	renderList: function(data){
		if(!data || !data.list.length) return []
		var ret = []
		ret = data.list.map(function(d){
			return (
				<li>
					<a href="javascript:;" data-aid={d.aid} title={d.title} onClick={this.props.getCid}>
						<img src={d.cover}/>
						<p>{d.title}</p>
					</a>
				</li>
			)
		},this)
		ret.push(<li onClick={this.props.resetAvs}>收起全部</li>)
		return (
			<ul>
				{ret}
			</ul>
		)
	},
	render: function(){
		return (
			<div className="sp">
				<ul>
					{this.props.data}
				</ul>
				<div className="sp-avs" style={{display: this.props.avs ? 'block' : 'none'}}>
					{this.renderList(this.props.avs)}	
				</div>
			</div>
		)
	}
})
// vedio list
var Av = React.createClass({
	render: function(){
		return (
			<div className="av">
				<ul>
					{this.props.data}
				</ul>
			</div>
		)
	}
})
var Result = React.createClass({
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
				alert('API调用失败.VIDEO_NOT_SUP')
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
					sp.push(<li>
						<a className="th" href="javascript:;" data-spid={d.spid} onClick={this.getSpid}>
  							<img src={d.pic} />
						</a>
						<div className="des">
							<h6><i className="warning label">{d.typename}</i><a href={"http://www.bilibili.com" + d.arcurl} target="_blank">{d.title}</a></h6>
							<p>{d.description}</p>
							<p className="success" ref={"spid-" + d.spid}></p>	
						</div>
					</li>)
				}
			},this)
			return (
				<div>
					<p>共找到{total}个结果</p>
					<Sp data={sp} avs={this.state.avs} resetAvs={this.resetAvs} getCid={this.getCid}/>
					<Av data={av} />
					<Pagination pageNum={data.numPages} curPage={this.props.page} onChangeHandler={this.onChangeHandler}/>
				</div>
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
		var {data} = this.props
		if($.isPlainObject(data)){
			lists = this.renderList(data)
		}else{
			lists = data
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
		var {data,page,avs} = this.state
		return (
			<div>
				<SearchBar onClickHandler={this.onClickHandler} />
				<Result data={data} onChangeHandler={this.onChangeHandler} page={page} />
			</div>
		)
	}
})
React.render(
	<App />,
	$('.container')[0]

)
})()