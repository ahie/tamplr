var setNumComments = function(post) {
  $.ajax({
    url: '/api/post/' + post.id + '/comments/count',
    type: 'get',
    success: function(res) {
      $('#comments-' + post.id).text('Comments: ' + res.comments);
    }
  });
}

var setNumLikes = function(post) {
  $.ajax({
    url: '/api/post/' + post.id + '/likes/count',
    type: 'get',
    success: function(res) {
      $('#likes-' + post.id).text('Likes: ' + res.likes);
    }
  });
}

var getPosts = function() {

  $.ajax({
    url: '/api/blog/' + blogId + '/posts',
    type: 'get',
    success: function(blogposts) {

      blogposts.forEach(function(blogpost) {
        if (blogpost.text.length > 200)
          blogpost.text = blogpost.text.slice(0,200) + '...';
        $('#blogposts')
        .append(
        '<li>' +
          '<a href=\'/blogpost/' + blogpost.id + '\'>' +
          '<h3>' + blogpost.title + '</h3></a>' +
          '<pre>' + blogpost.text + '</pre>' +
          '<div id=\'likes-' + blogpost.id + '\'></div>' +
          '<div id=\'comments-' + blogpost.id + '\'></div>' +
        '</li>');
        setNumLikes(blogpost);
        setNumComments(blogpost);
      });

    }
  });

}

$(document).ready(function() {

getPosts();

});
