
//pop up message box
let modal = UIkit.modal(".modalSelector");

$(document).ready(()=>{
//login error
    if(location.search.includes('error')){
        $("#loginError").css('display','block')
    } 

//time stemp
    $(".timeago").each(function (index, value) {
        $(value).text(timeSince($(value).data("time")))
       
    })

    function timeSince(timeStamp) {

        let now = new Date(),

        secondsPast = (now.getTime() - timeStamp) / 1000;

        if(secondsPast < 60){
          return  `Posted less than a min ago,`;
        }
        if(secondsPast < 3600){
          return "Posted " + parseInt(secondsPast/60) + 'm ago,';
        }
        if(secondsPast <= 86400){
          return "Posted " + parseInt(secondsPast/3600) + 'h ago,';
        }
        if(secondsPast > 86400){
            day = timeStamp.getDate();
            month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
            year = timeStamp.getFullYear() == now.getFullYear() ? "" :  " "+timeStamp.getFullYear();
            return "Posted on" + day + " " + month + year+",";
        }
    }
})

//see post comments
function seeComment (id) {
    window.location.replace(`/post/${id}`);
}

// new post
$("#btnNewPost").on("click", function(){   
    modal.show();

    $('#modalTitle').val('');
    $('#modalText').val('');

    clearMessageBox()
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
    let postId = "#"+id
    $(postId).css("display","none")
    $.post(`/post/${id}/delete`)
}

    //Comments

// new comment
function newComment(id){

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

    let title = $('#modalTitle').val();
    let text = $('#modalText').val();   
    let id = $("#btnSubmit").attr("data-id");
    let type = $("#btnSubmit").attr("data-type");

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
        let data ={};
        //edit post
        if(typeof id == "string" && type === "editPost"){

            data.id = id;
            data.title = title;
            data.text = text;   

            $.post(`/post/${id}/edit`, {data}, (post)=>{
                ////TODO:
                closeMessageBox()      
            }); 
         
        } 
        //new comment
        else if(typeof id == "string" && type === "newComment") {

            data.id = id;
            data.title = title;
            data.text = text;
        
            $.post(`/post/${id}/comment`, {data}, (comment)=>{
                comment != null ? appendComment(comment, id) : alert("Something went wrong")
                closeMessageBox() 
            })

            
        }
       //edit comment
        else if(typeof id == "string" && type === "editComment") {

            data.id = id;
            data.title = title;
            data.text = text;
        
            $.post(`/post/comment/${id}/edit`, {data}, (comment)=>{
                ///TODO:
                closeMessageBox()
            })          
       }
       //new post
        else {

            data.title = title;
            data.text = text 

            $.post('/post', {data},(post)=>{           
                post != null ? appendPost(post) : alert("Something went wrong")   
                closeMessageBox() 
            })     
        } 
    
    }
}

//paste time
$(document).ready(()=>{
    
    
})

//Cancel 
$("#cancelClick").on('click', closeMessageBox)

//close message box
function closeMessageBox() {
    $('#modalTitle').val('');
    $('#modalText').val('');
    modal.hide();
}

//append new post
function appendPost(post){

    $("#postsBox").prepend(
            `<div id="${post._id}" class="uk-flex uk-grid">
                <div class="uk-flex-order-first uk-container uk-container-center">
                    <div class="post-main-box">       
                        <article style="max-height: 22vh;" class="uk-comment uk-clearfix ">    
                            <div class="post-commenters uk-align-medium-right">
                                <div class="post-commenters-inner-box">
                                ${commentsBox(post)||''}
                            </div>
                             </div>
                                <div class="post-avatar-box">
                                     <img  class="uk-comment-avatar post-avatar" src="" alt="IMG">
                                </div>
                                ${ifEdited(post)||''}       
                            <header class="uk-comment-header  uk-flex uk-flex-column">                            
                                <h3 class="uk-comment-title">${post.userName}</h3>
                            
                                <p class="uk-comment-title">${post.title}</p>
                                <div  class="uk-comment-body post-text">${post.text}</div>
                            </header>
                        </article>
                        <div class="post-buttons">
                            <h6 style="font-size: 10px;margin:0 0 1vh 2vw;" class="uk-comment-meta">
                                <span class="timeago" data-time="(new Date(post.createdAt)).getTime()"></span> 
                                    ${post.comments?post.comments.length:'0'} Comments
                            </h6>                        
                            <button class="uk-button uk-button-primary uk-button-small" onclick="newComment('post._id')" >
                            Leave a comment</button>
                            <button class="uk-button uk-button-primary uk-button-small" onclick="seeComment('post._id')" >
                            See comments</button>        
                            ${createdByUser(post)}
                        </div> 
                    </div>
                </div>
            </div>`                            
    )

    function commentsBox(post) {
        if(post.comments){
            let result;
            post.comments.forEach((comment)=>{              
                result +=
                `<article onclick="seeComment('${post._id}')" class="uk-flex uk-flex-column uk-comment">
                    <header class="uk-comment-header">
                        <img class="uk-comment-avatar" src="" alt="IMG">
                        <h6 class="uk-comment-title">${comment.userName}</h6>
                        <div class="uk-comment-meta post-commenters-time uk-align-medium-right"> 
                            <span class="timeago" data-time="${(new Date(comment.createdAt)).getTime()}"></span> 
                        </div>
                        <p class="uk-comment-title ">${comment.title}</p>      
                    </header>
                    <div  class="post-commenters-text uk-comment-body">${comment.text}</div>
                </article>`  
            })
            return result
        }
    }
    function ifEdited(post) {
        return post.editedAt
        ? `<span style="float:right;padding:1vh;font-size:0.8em;opacity:0.8;">
            Post was edited on ${post.editedAt.toDateString()}
        </span>`
        :''
    }
    function createdByUser(post) {
            return `<button class="uk-button uk-button-primary uk-button-small" onclick="editPost('${post._id}')">
            Edit post</button>
            <button class="uk-button uk-button-primary uk-button-small" onclick="deletePost('${post._id}')" >
            Delete post</button>
            `
    }

}

//append new comment
function appendComment(comment, postId) {
    let html = `<article onclick="seeComment('${postId}')" class="uk-flex uk-flex-column uk-comment">
                    <header class="uk-comment-header">
                        <img class="uk-comment-avatar" src="" alt="IMG">
                        <h6 class="uk-comment-title">${comment.userName}</h6>
                        <div class="uk-comment-meta post-commenters-time uk-align-medium-right"> 
                            <span class="timeago" data-time="${(new Date(comment.createdAt)).getTime()}"></span> 
                        </div>
                        <p class="uk-comment-title ">${comment.title}</p>      
                    </header>
                    <div  class="post-commenters-text uk-comment-body">${comment.text}</div>
                </article>`;
    $(`#${postId}.post-commenters-inner-box`).append(html)
}