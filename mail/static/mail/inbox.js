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
      // Print result
      console.log(result);
  });
  // Load sent mailbox
  load_mailbox('sent')
}// End send_mail()

// form to fill our to send email
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

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

// Load all emails from specific mailbox
function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  // GET request mailbox and add each email to page
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails =>{
    // console.log("elementy",emails)
    emails.forEach(element => {
        // add all the emails onto single page
        add_email_to_mailbox(element)
    });
  });

  // insert email content onto screen
  function add_email_to_mailbox(email){
    // create a button for each email
    const element = document.createElement('button');
    element.className = "email"
    element.id = email.id
    element.innerHTML = 
    "From: " + email.sender +
    "<br> To: " + email.recipients+
    "<br> Subject: " + email.subject +"<br>"+
    "read: "+email.read+"<br>"+
    "<hr>" + "<p>" + email.body + "</p>";// + "TimeStamp: " + email.timestamp +
 
    document.querySelector('#emails-view').append(element);
    // if a button is clicked, show that email and hide all other email
    element.onclick = function() {
      view_selected_email(element.id)
      // alert(`${mailbox}`)
    }
    
  }// End add_email_to_mailbox

  // When email clicked on, hide other div's and show email that was clicked
  function view_selected_email(email_id)
  {
    fetch(`/emails/${email_id}`)
      .then(response => response.json())
      .then(email =>
      {
        const element = document.createElement('div');
        element.id = 'view-email'
        // console.log(email)
        if(email.read == true){
          element.style.backgroundColor = "#D3D3D3"
        }
        else if (email.read == false){
          element.style.backgroundColor = "white"
        }
        if (mailbox == 'inbox'){
          element.innerHTML =
          // "<h3> Inbox</h3><br>"+
          "From: "+email.sender +
          "<br>" +"To: "+email.recipients+
          "<br>"+"Subject: "+email.subject +"<hr><br>"+
          "<p>"+email.body+"</p>"+
          "read:"+email.read+"<br>"+
          "<button class='btn btn-sm btn-outline-primary' id = 'archive' type = 'button'>Archive</button>";
          element.style.border = "1px solid black";
          element.style.padding= "5px 10px";
          // Archive when archive button is clicked
          document.querySelector("button#archive.btn.btn-sm.btn-outline-primary").onclick=function(){
            archive_email(email.id)
        }
        }
        else if(mailbox == 'sent'){
          element.innerHTML = 
          "<h3> Sent </h3><br>" +
          "From: "+email.sender +
          "<br>" +"To: "+email.recipients+
          "<br>"+"Subject: "+email.subject +"<hr><br>"+
          "read:"+email.read +"<br>"+
          "<p>"+email.body+"</p>";
          element.style.border = "1px solid black";
          element.style.padding= "5px 10px";
        }
        else if(mailbox == 'archive'){
          element.innerHTML =
          "<h3> Archive </h3><br>" +
          "From: "+email.sender +
          "<br>" +"To: "+email.recipients+
          "<br>"+"Subject: "+email.subject +"<hr><br>"+
          "<p>"+email.body+"</p>"+
          "read:"+email.read+"<br>"+
          "<button class='btn btn-sm btn-outline-primary' id = 'unarchive' type = 'button'>Unarchive</button>";
          element.style.border = "1px solid black";
          element.style.padding= "5px 10px";
          // Archive when archive button is clicked
          
        }
        document.querySelector('.container').append(element);
        document.querySelector('#emails-view').style.display = 'none';
        document.querySelector('#compose-view').style.display = 'none';
        document.querySelector('#view-email').style.display = 'block';
        // Mark email as read
        email_marked_as_read(email_id)
      });
  }// End view_selected_mail()

  // mark email as read when clicked
  function email_marked_as_read(email_id){
    // alert(`Email read with id ${email_id} has been read.`)
    fetch(`/emails/${email_id}`,{
      method: 'PUT',
      body: JSON.stringify({
        read: true
      })
    })
  }// End email_marked_as_read()
  
  // archive email when cilcked on archive button
  function archive_email(email_id){
    alert(`archived`)
    fetch(`/emails/${email_id}`,{
      method: 'PUT',
      body: JSON.stringify({
        archived: true
      })
    })
  }// End archive_email()

  // unarchive email when cilcked on archive button
  function unarchive_email(email_id){
    alert(`unarchived`)
    fetch(`/emails/${email_id}`,{
      method: 'PUT',
      body: JSON.stringify({
        archived: false
      })
    })
  }// End unarchive_email()
}// End load_mailbox()


