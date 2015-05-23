$(document).ready(function() {

$('#new-blog')
.submit(function(event) {
  event.preventDefault();
  $.ajax({
    url: '/api/blog',
    type: 'post',
    data: $('#new-blog').serialize(),
    dataType: 'json',
    statusCode: {
      201: function() { window.location.reload(true); },
      400: function() { alert('Missing name'); }
    }
  });
});

}); // document ready
