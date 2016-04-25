/*
 *
 * Nicholas P Smith
 * April 25, 2016
 * Facebook React.js tutorial
 *
 */

 class Comment extends React.Component {
   rawMarkup() {
     var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
     return { __html: rawMarkup };
   }
   render() {
     return (
       <div className="comment">
         <h2 className="commentAuthor">
           {this.props.author}
         </h2>
         <span dangerouslySetInnerHTML={this.rawMarkup()} />
       </div>
     )
   }
 }

 class CommentList extends React.Component {
   render() {
     var commentNodes =this.props.data.map(function(comment) {
       return (
         <Comment author={comment.author} key={comment.id}>
           {comment.text}
         </Comment>
       )
     })
     return (
       <div className="commentList">
         {commentNodes}
       </div>
     )
   }
 }

 class CommentForm extends React.Component {

   constructor(props) {
     super(props);

     this.state = { author: '', text: '' };
   }

   handleAuthorChange(e) {
     this.setState({author: e.target.value});
   }

   handleTextChange(e) {
     this.setState({text: e.target.value});
   }

   handleSubmit(e) {
     e.preventDefault();
     var author = this.state.author.trim();
     var text = this.state.text.trim();
     if (!text || !author) {
       return;
     }
     this.props.onCommentSubmit({ author: author, text: text});
     this.setState({author: '', text: ''});
   }

   render() {
     return (
       <form className="commentForm" onSubmit={this.handleSubmit.bind(this)}>
         <input
           type="text"
           placeholder="Your name"
           value={this.state.author}
           onChange={this.handleAuthorChange.bind(this)}
           />
         <input
           type="text"
           placeholder="Say something..."
           value={this.state.text}
           onChange={this.handleTextChange.bind(this)}
           />
         <input type="submit" value="Post" />
       </form>
     )
   }
 }


class CommentBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  loadCommentsFromServer() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data:data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  handleCommentSubmit(comment) {
    var comments = this.state.data;
    commend.id = Date.now();
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  componentDidMount() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer.bind(this), this.props.pollInterval)
  }

  render() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit.bind(this)} />
      </div>
    )
  }
}

ReactDOM.render(<CommentBox url="/api/comments" pollInterval={2000} />, document.getElementById('content'));
