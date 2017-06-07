
function btnNewComment () {
     var data = {};
     data.id = $("#newComment").attr('data-id')
  	 data.userName = "Jony";
	 data.text = "Post from http";

    $.post('/comment', {data})
    .done(window.location.reload())
};

function btnSeeComment () {
     var _id = $("#seeComment").attr('data-id')
     window.location.replace("/post?id=" + _id)
};