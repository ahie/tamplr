var like = function() {
  $.ajax({
    url: '/api/user/' + username + '/likes/' + postId,
    type: 'put',
    success: function() {
      getLikeBtn();
      getLikes();
    }
  });
}

var unlike = function() {
  $.ajax({
    url: '/api/user/' + username + '/likes/' + postId,
    type: 'delete',
    success: function() {
      getLikeBtn();
      getLikes();
    }
  });
}

var getLikeBtn = function() {
  $.ajax({
    url: '/api/user/' + username + '/likes/' + postId,
    type: 'get',
    success: function(res) {
      if(res.hasLiked === true)
        $('#like-button').text('Unlike');
      else
        $('#like-button').text('Like');
    }
  });
}

$(document).ready(function() {

$('#post-comment')
.submit(function(event) {
  event.preventDefault();
  $.ajax({
    url: '/api/post/' + postId + '/comments',
    method: 'post',
    data: $('#post-comment').serialize(),
    dataType: 'json',
    statusCode: {
      201: function() { getComments(); },
      400: function() { alert('No text entered'); },
      404: function() { alert('Blogpost does not exist'); }
    }
  });
});

getLikeBtn();

$('#like-button').click(function() {
  if ($('#like-button').text() === 'Like')
    like();
  else if ($('#like-button').text() === 'Unlike')
    unlike();
});

}); // document ready
