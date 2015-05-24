$(document).ready(function() {

$('#new-blogpost')
.submit(function(event) {
  event.preventDefault();
  $.ajax({
    url: '/api/blog/' + blogId + '/posts',
    type: 'post',
    data: $('#new-blogpost').serialize(),
    dataType: 'json',
    statusCode: {
      201: function() { window.location.reload(); },
      400: function() { alert('Missing title or text'); },
      403: function() { alert('No write permission'); },
      404: function() { alert('Blog does not exist'); },
      500: function() { alert('Server error'); }
    }
  });
});

$('#grant-permission')
.click(function() {
  var uname = $('#permission-username').val();
  $.ajax({
    url: '/api/blog/' + blogId + '/author/' + uname,
    type: 'put',
    statusCode: {
      200: function() { alert('Successfully granted permissions to ' + uname); },
      403: function() { alert('Can\'t alter default blog permissions'); },
      404: function() { alert('User does not exist'); }
    }
  });
});

$('#revoke-permission')
.click(function() {
  var uname = $('#permission-username').val();
  $.ajax({
    url: '/api/blog/' + blogId + '/author/' + uname,
    type: 'delete',
    statusCode: {
      200: function() { alert('Successfully revoked permissions from ' + uname); },
      403: function() { alert('Can\'t revoke default blog permissions'); },
      404: function() { alert('User does not exist'); }
    }
  });
});

}); // document ready
