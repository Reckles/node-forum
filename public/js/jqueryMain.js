
//pop up message box
var modal = UIkit.modal(".modalSelector");

$(document).ready(()=>{
    if(location.search.includes('error')){
        $("#loginError").css('display','block')
    }
    $("#copyrightYear").text(new Date().getFullYear());  
})
//see post comments
function seeComment (id) {
    window.location.replace(`/post/${id}`);
}

        //Posts & comments

// new post
$("#btnNewPost").on("click", function(){   
    modal.show();
    
    $('#modalTitle').val('');
    $('#modalText').val('');

})

// edit post
function editPost(id) {
    modal.show();

    $.get(`/post/${id}/edit`, (post=>{
        $('#modalTitle').val(post.title) ;
        $('#modalText').val(post.text);     
    }));    

    $("#btnSubmit").attr({
        "data-type": "editPost",
        "data-id": id
    });
}

//delete Post
function deletePost(id) {
     $.post(`/post/${id}/delete`)
     location.reload();
}
    //Comments

// new comment
function newComment(id){
    var modal = UIkit.modal(".modalSelector");

    modal.show();

    $("#btnSubmit").attr({
        "data-type": "newComment",
        "data-id": id
    });
}

// edit comment
function editComment(id) {
    modal.show();

    $.get(`/post/comment/${id}/edit`, (comment=>{
        $('#modalTitle').val(comment.title) ;
        $('#modalText').val(comment.text);     
    }));

    $("#btnSubmit").attr({
        "data-type": "editComment",
        "data-id": id
    });
}

//delete comment
function deleteComment(id) {
     $.post(`/post/comment/${id}/delete`)
     location.reload();
}

//Send
function sendPost() {
    event.preventDefault();
    var title = $('#modalTitle').val();
    var text = $('#modalText').val();   
    var id = $("#btnSubmit").attr("data-id");
    var type = $("#btnSubmit").attr("data-type");

    $("#btnSubmit").removeAttr("data-id")
    $("#btnSubmit").removeAttr("data-type")

    //Some client side validetion
    if(title === '' || title === undefined){
        alert('Title is missing')
     }
    else if(text === '' || text === undefined){
        alert('Comment body missing')
     } 
    else {
        //if valid
       var data ={};
       //edit post
       if(typeof id == "string" && type === "editPost"){
         data.id = id;
         data.title = title;
         data.text = text;

         $.post(`/post/${id}/edit`, {data});       
       } 
       //new comment
       else if(typeof id == "string" && type === "newComment") {
         data.id = id;
         data.title = title;
         data.text = text;
     
         $.post(`/post/${id}/comment`, {data})
       }
       //edit comment
        else if(typeof id == "string" && type === "editComment") {
         data.id = id;
         data.title = title;
         data.text = text;
     
         $.post(`/post/comment/${id}/edit`, {data})
       }
       //new post
       else {
         data.title = title;
         data.text = text 

         $.post('/post', {data})
       } 
       location.reload();               
     }
}

// Time ago
// $(document).ready(()=>{
//     $("time.timeago").each(function (index, value) {
//         timeSince(value)
//     })
// })

// function timeSince(timeStamp) {

//     var now = new Date(),

//     secondsPast = (now.getTime() - timeStamp) / 1000;

//     if(secondsPast < 60){
//       return  `less than a min ago`;
//     }
//     if(secondsPast < 3600){
//       return parseInt(secondsPast/60) + 'm';
//     }
//     if(secondsPast <= 86400){
//       return parseInt(secondsPast/3600) + 'h';
//     }
//     if(secondsPast > 86400){
//         day = timeStamp.getDate();
//         month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
//         year = timeStamp.getFullYear() == now.getFullYear() ? "" :  " "+timeStamp.getFullYear();
//         return day + " " + month + year;
//     }
//   }


//Cancel 
$("#cancelClick").on('click', function(){
    modal.hide();
})
