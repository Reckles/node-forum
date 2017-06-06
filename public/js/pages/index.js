

function btnNewComment () {
     var _id = $("#seeComment").attr('data-id')
     window.location.replace("/about?id=" + _id)
};

function btnSeeComment () {
     var _id = $("#seeComment").attr('data-id')
     window.location.replace("/post?id=" + _id)
};