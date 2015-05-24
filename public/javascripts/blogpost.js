var getPost = function() {
  $.ajax({
    url: '/api/post/' + postId,
    type: 'get',
    success: function(data) {
      $('#post-title').text(data.title)
      .append(' <a href=\'/blog/' + blogId + '\' ' + '>In blog: ' + blogName + '</a>');
      $('#post-text').text(data.text);
      $('#post-likes').text('Number of likes: ' + data.likes);
    }
  });
}

var getComments = function() {
  $.ajax({
    url: '/api/post/' + postId + '/comments/all',
    type: 'get',
    success: function(comments) {
      $('#post-comments').empty();
      if (comments.length === 0)
        return $('#post-comments').append('There are no comments yet');
      comments.forEach(function(comment) {
        $('#post-comments')
        .prepend('<li>' + comment.author + ': ' + comment.text + '</li>');
      });
    }
  });
}

var getLikes = function() {
  $.ajax({
    url: '/api/post/' + postId + '/likes/count',
    type: 'get',
    success: function(result) {
      $('#post-likes').text('Number of likes: ' + result.likes);
    }
  });
}

$(document).ready(function() {

getPost();
getComments();

// Polling comments
function pollComments() {
  setTimeout(function() {
    if ($('#polling-checkbox').prop('checked'))
      getComments();
    pollComments();
  }, 10000);
}
pollComments();

}); // document ready
