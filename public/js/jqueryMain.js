
function newPost (id) {
    if(!id) {
        id = ''
    }
    $('body').append(`
    <div class="new-message-box">
    <form action="">
        <h5>Post title :</h5>
        <input type="text" name="title">
        <h5>Content :</h5>
        <textarea cols="40" rows="10" name="text"></textarea>
        <br><br>
        <a href="" onclick="sendPost('${id}')">Post </a>|
        <a href="/"> Back</a>
    </form>
    </div>
    `);
}

function sendPost(id) {
    var title = $('input[name="title"]').val();
    var text = $('textarea[name="text"').val();

    //Some client side validetion
    if(title === '' || title === undefined){
        alert('Title is missing')
     }
    else if(text === '' || text === undefined){
        alert('Comment body missing')
     } 
    else {
       var data ={};
       //Determens if Post or Comment
       if(id != ""){
          data.id = id;
          data.userName = 'Eli';
          data.title = title;
          data.text = text;
       
         $.post('/comment', {data})
       } else{
           data.id = '5937993a0142152b144099c5';
           data.userName = 'Yosi';
           data.title = title;
           data.text = text;

           $.post('/newPost', {data})
       }                
     }
}


function seeComment (id) {
     window.location.replace("/post?id=" + id)
};


// })
// async function SendNewComment(comment) {
//     await $.post('/comment', comment)
// }
