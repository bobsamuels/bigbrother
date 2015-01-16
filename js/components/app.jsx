var React = require('react/addons')
var Reflux = require('reflux');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var Accordion = require('react-bootstrap/Accordion');
var Panel = require('react-bootstrap/Panel');
var Alert = require('react-bootstrap/Alert');
var Grid = require('react-bootstrap/Grid');
var Row = require('react-bootstrap/Row');
var Col = require('react-bootstrap/Col');

var Actions = require('common/actions');

var d3Chart = require('common/d3Chart');
var TagsStore = require('common/tagsStore');
var DataStore = require('common/dataStore');
var TagsActions = Actions.TagsActions;
var DataActions = Actions.DataActions;
var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var RouteHandler = ReactRouter.RouteHandler;



var App = React.createClass({
    render: function(){
        var containerStyle = {
            margin:'5px'
        }

        return(
            <div>
                <div style={containerStyle}>
                    <RouteHandler/>
                </div>
            </div>
        );
    }
});

var MainPage = React.createClass({
    mixins:[Reflux.connect(TagsStore, "list"), Reflux.connect(DataStore, "data")],

    render: function() {
        return (
            <div>
                <TagInput></TagInput>
                <br/>
                <Accordion defaultActiveKey="data">
                    <Panel header="Current Tags Being Tracked" eventKey="viewtags">
                        <TagList list={this.state.list}></TagList>
                    </Panel>
                    <Panel header="The Data" eventKey="data">
                        <DataDisplay tags={this.state.list} data={this.state.data}></DataDisplay>
                    </Panel>
                </Accordion>
            </div>
        );
    }
});

var DetailsPage = React.createClass({
    mixins:[Reflux.connect(DataStore, "data"), ReactRouter.State],

    render: function() {
        var theData = function(tag, type, data){
            var dataArray = [];
            if(type === 'twitter'){
                dataArray = data.tweets;
            }
            else{
                dataArray = data.instagrams;
            }

            var selectedData = dataArray.filter(function(dat){
                return dat.tag.text == tag;
            });

            return {type:type, data:selectedData};
        }
        return (
            <div>
                <Link to="main">Go Back</Link>
                <h1>Details for {this.getParams().type} with a tag of {this.getParams().tag}</h1>
               <DetailsList data={theData(this.getParams().tag, this.getParams().type, this.state.data)}></DetailsList>
            </div>
        );
    }
});

var DetailsList = React.createClass({
    render: function(){
        var detailComponent;
        if(this.props.data.type === 'twitter'){
           detailComponent = <TwitterDetails tweetData={this.props.data.data}></TwitterDetails>
        }else{
            detailComponent =<InstagramDetails instagramData={this.props.data.data}></InstagramDetails>
        }

        return (
            <div>{detailComponent}</div>
        );
    }
});

var TwitterDetails = React.createClass({
    render:function(){
        var tweets = this.props.tweetData[0].items.tweets;
        return(<Grid>
            <Row className="show-grid">
            {tweets.map(function(status){
                return <TwitterStatus status={status}></TwitterStatus>
                })
            }
            </Row>
        </Grid>)
    }
});

var TwitterStatus = React.createClass({
    render:function(){
        var divStyle={
            minHeight:'370px'
        }
        return(<Col md={3} className="cell twitterStatusCell">
            <div style={divStyle}>
                <div className="row">
                    <div className="profileImg col-md-3"><img src={this.props.status.user.profile_image}/></div>
                    <div className="col-md-8"></div>
                </div>

                <blockquote>
                <p>{this.props.status.text}</p>
                <footer>{this.props.status.user.screen_name}</footer>
                </blockquote>
                <div className="tweetFooter">{this.props.status.created_at}</div>
            </div>
            </Col>
        )
    }
});


var InstagramDetails = React.createClass({
    render:function(){
        var posts = this.props.instagramData[0].items.instagrams;
        return(<Grid>
            <Row className="show-grid">
            {posts.map(function(post){
                return <InstagramPost post={post}></InstagramPost>
            })
                }
            </Row>
        </Grid>)
    }
});

var InstagramPost = React.createClass({
    render:function(){
        var divStyle={
            minHeight:'400px',
            maxHeight:'550px'
        }
        var captionStyle={
            wordBreak: "break-all",
            wordWrap: "break-word"}
        var footerStyle={marginTop:"5px", float:"right"};

        var profileImg = {marginLeft:"5px"};

        return(<Col md={5} className="cell instagramCell">
            <div style={divStyle}>
                <a href={this.props.post.link} target="_blank"><img src={this.props.post.photo.url}/></a>
                <blockquote>
                    <p style={captionStyle}>{this.props.post.caption}</p>
                    <footer style={footerStyle}>
                        {this.props.post.user.username}
                        <img style={profileImg} src={this.props.post.user.profile_image} width="50px" height="50px"/>
                    </footer>
                </blockquote>
                <div className="tweetFooter">{new Date(parseInt(this.props.post.created_at + "000")).toLocaleDateString()}</div>
            </div>
        </Col>
        )
    }
});


var TagInput = React.createClass({
    handleNewTag: function(evnt){
        var tag = evnt.target.value;
        if(evnt.which === 13 && tag){
            TagsActions.addTag(tag);
            evnt.target.value = '';
        }
    },
    render: function(){
        var txtStyle = {
            width:'350px'
        }
        return(<div>
            <input type="text" style={txtStyle} className="form-control" placeholder="Add new tag" onKeyUp={this.handleNewTag}/>
        </div>
        );
    }
});

var TagList = React.createClass({
    render: function(){
        return(<div>
            <strong>Total Tags: {this.props.list.length}</strong>
            <Grid>
                <Row className="show-grid">
                {
                    this.props.list.map(function(tag, indx){
                        return <TagItem tag={tag} key={tag.key}></TagItem>
                    })
                }
                </Row>
            </Grid>
        </div>
        );
    }
});

var TagItem = React.createClass({
    removeTag : function(){
        var tag = this.props.tag;
        TagsActions.deleteTag(tag.key);
    },
    render: function(){
        var iconStyle = {
            marginTop:'2px',
            marginBottom: '2px',
            position:'absolute',
            right:'20px',
            cursor:'pointer'
        }

        return(
            <Col md={4} className="cell">
                {this.props.tag.text}
                <span onClick={this.removeTag}><i className='glyphicon glyphicon-trash' style={iconStyle}></i></span>
            </Col>
        )
    }
})

var DataDisplay = React.createClass({
    getData: function(){
        DataActions.getData(this.props.tags);
    },
    render: function(){
        var iconStyle = {
            marginTop:'2px',
            marginBottom: '2px',
            marginLeft:'5px'
        };

        function randomCoordinates(){
            var random = {x: (Math.random()) * 400,
                y: (Math.random()) * 100};
            return random;
        }

        var containerStyle={marginTop:'10px'};

        function getD3Data(data){
            var d3Data = [];
            var tweetColor = 1;
            var instagramColor = 2;

            data.tweets.forEach(function(tweet){
                var coord = randomCoordinates();
                d3Data.push({type:'twitter', name:tweet.tag.text, size:tweet.size, x:coord.x, y:coord.y, c:tweetColor});
            });

            data.instagrams.forEach(function(gram){
                var coord = randomCoordinates();
                d3Data.push({type:'instagram', name:gram.tag.text, size:gram.size, x:coord.x, y:coord.y, c:instagramColor});
            });

            return d3Data;
        }

        return(<div>
            <div className="btn btn-primary btn-sm" onClick={this.getData}>Get Data <i className='glyphicon glyphicon-eye-open' style={iconStyle}></i></div>
            <div className="dataContainer" style={containerStyle}>
                <Chart data={getD3Data(this.props.data)} domain={this.props.data.d3Domain}></Chart>
            </div>
        </div>
        );
    }
});

var Chart = React.createClass({
    propTypes: {
        data: React.PropTypes.array,
        domain: React.PropTypes.object
    },

    componentDidMount: function() {
        var el = this.getDOMNode();
        d3Chart.create(el, {
            width: '100%',
            height: '500px'
        }, this.getChartState());
    },

    componentDidUpdate: function() {
        var el = this.getDOMNode();
        d3Chart.update(el, this.getChartState(), true);
    },

    getChartState: function() {
        return {
            data: this.props.data,
            domain: this.props.domain
        };
    },

    componentWillUnmount: function() {
        var el = this.getDOMNode();
        d3Chart.destroy(el);
    },

    render: function() {
        return (
            <div className="Chart"></div>
        );
    }
});
var routes = (
<Route name="app" path="/" handler={App}>
<Route name="main" handler={MainPage}/>
<Route name="details" path="/details/:type/:tag" handler={DetailsPage}/>
<DefaultRoute handler={MainPage}/>
</Route>
);

ReactRouter.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('appContainer'));
});
