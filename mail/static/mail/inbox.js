// Load buttons and initial content
document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});// Load DOMContent

// Send mail once form is submitted
function send_mail(){
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
    })
  })
  .then(response => response.json())
  .then(result => {
  });
  // Load sent mailbox
  load_mailbox('sent')
}// End send_mail()

// Form to fill out to send email
function compose_email() {
    
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#view-email').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  
  // Send mail once form is submitted
  document.querySelector('form').onsubmit = function() {
  send_mail()
  return false;
  };
   
}// End compose_email()

// Form to fill out to send email
function compose_email_reply(recipients,subject,body,timestamp) {
    
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#view-email').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = recipients;
  document.querySelector('#compose-subject').value = `Re: ${subject}`;
  document.querySelector('#compose-body').value = `On ${timestamp} ${recipients} wrote: ${body} `;
  clear_content("view-email")
  // Send mail once form is submitted
  document.querySelector('form').onsubmit = function() {
  send_mail()
  return false;
  };
   
}// End compose_email()

// Clear the contents of a div
function clear_content(elementClass){
  var i;
  var x = document.getElementsByClassName(elementClass);
  for(i=0;i<x.length;i++){
      x[i].style.display = "none";
  }
}// End clear_content()

// Load all emails from specific mailbox
function load_mailbox(mailbox) {
  // Create a div when selecting an email
  let element = document.createElement('div');
  element.id = 'view-email'
  element.className = 'view-email'
  element.read = false
  document.querySelector('.container').append(element);
  //Close out any other divs by clearing the out
  clear_content(element.className)

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#view-email').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  // GET request mailbox and add each email to page
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails =>{
    // console.log("elementy",emails)
    emails.forEach(element => {
        // add all the emails onto single page
        add_email_to_mailbox(element,mailbox)
    });
  });
}// End load_mailbox()

// insert email content onto screen
function add_email_to_mailbox(email,mailbox){
  // create a button for each email
  const element = document.createElement('div');
  element.id = "email"
  element.className = "email-content"
  element.innerHTML = 
  "From: " + email.sender +
  "<br> To: " + email.recipients+
  "<br> Subject: " + email.subject +"<br>"+
  "<hr>" + "<p>" + email.body + "</p>";

  if(email.read == true){
    element.style.backgroundColor = "#D3D3D3"
  }
  else if (email.read == false){
    element.style.backgroundColor = "white"
  }
  document.querySelector('#emails-view').append(element);

  // if a button is clicked, show that email and hide all other email
  element.onclick = function() {
    view_selected_email(email.id,mailbox)
  }
}// End add_email_to_mailbox

// When email clicked on, hide other div's and show email that was clicked
function view_selected_email(email_id,mailbox){
    fetch(`/emails/${email_id}`)
      .then(response => response.json())
      .then(email =>
      {
        console.log(email)
        const element = document.createElement('div');
        element.id = 'view-email'
        element.className = 'view-email'

          // Show the mailbox and hide other views
        document.querySelector('#emails-view').style.display = 'none';
        document.querySelector('#compose-view').style.display = 'none';
        document.querySelector('#view-email').style.display = 'block';
        if(email.read == true){
          element.style.backgroundColor = "#D3D3D3"
        }
        else if (email.read == false){
          element.style.backgroundColor = "white"
        }
        if (mailbox == 'inbox'){
          element.innerHTML =
          "<h3> Viewing Selected Email</h3><br>"+
          "From: "+email.sender +
          "<br>" +"To: "+email.recipients+
          "<br>"+"Subject: "+email.subject +"<hr><br>"+
          "<p>"+email.body+"</p>"+
          "<button id = 'reply' type = 'button'>Reply</button>"+
          "<button id = 'archive' type = 'button' style='float: right'>Archive</button><br>";
          element.style.border = "1px solid black";
          element.style.padding= "5px 10px";
          // Mark email as read  
          email_marked_as_read(email_id)
          // Adding the clicked email onto the DOMContent
          document.querySelector('.container').append(element);
          document.querySelector('button#archive').onclick = ()=>{
            archive_email(email.id);
            load_mailbox('inbox')
          }
          //Load compose form when user clicks on reply
          document.querySelector('button#reply').onclick = () =>{
            compose_email_reply(email.recipients,email.subject,email.body,email.timestamp)
          }

        }
        else if(mailbox == 'sent'){
          element.innerHTML = 
          "<h3> Sent </h3><br>" +
          "From: "+email.sender +
          "<br>" +"To: "+email.recipients+
          "<br>"+"Subject: "+email.subject +"<hr><br>"+
          "read:"+email.read +"<br>"+
          "<p>"+email.body+"</p>" +
          "<button id = 'reply' type = 'button'>Reply</button>";
          element.style.border = "1px solid black";
          element.style.padding= "5px 10px";
          clear_content("view-email")
        }
        else if(mailbox == 'archive'){
          element.innerHTML =
          "<h3> Archive </h3><br>" +
          "From: "+email.sender +
          "<br>" +"To: "+email.recipients+
          "<br>"+"Subject: "+email.subject +"<hr><br>"+
          "<p>"+email.body+"</p>"+
          "read:"+email.read+"<br>"+
          "<button id = 'unarchive' type = 'button'>Unarchive</button>";
          element.style.border = "1px solid black";
          element.style.padding= "5px 10px";
          // Adding the clicked email onto the DOMContent
          document.querySelector('.container').append(element);
          // Unarchive when archive button is clicked
          document.querySelector('button#unarchive').onclick = () =>{
            unarchive_email(email.id);
          load_mailbox('inbox')
          }
        }

        document.querySelector('#emails-view').style.display = 'none';
        document.querySelector('#compose-view').style.display = 'none';
        document.querySelector('#view-email').style.display = 'block';

        // Adding the clicked email onto the DOMContent
        document.querySelector('.container').append(element);
      });
}// End view_selected_mail()

// mark email as read when clicked
function email_marked_as_read(email_id){
    fetch(`/emails/${email_id}`,{
      method: 'PUT',
      body: JSON.stringify({
        read: true
      })
    })
}// End email_marked_as_read()
  
// archive email when cilcked on archive button
function archive_email(email_id){
    fetch(`/emails/${email_id}`,{
      method: 'PUT',
      body: JSON.stringify({
        archived: true
      })
    })
}// End archive_email()

// unarchive email when cilcked on archive button
function unarchive_email(email_id){
    fetch(`/emails/${email_id}`,{
      method: 'PUT',
      body: JSON.stringify({
        archived: false
      })
    })
}// End unarchive_email()