document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});
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
}

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
   
}
function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  // document.querySelector('#view-email').style.display = 'none';
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
  
  function add_email_to_mailbox(email){
    // create a button for each email
    const element = document.createElement('button');
    element.className = "email"
    element.id = email.id
    element.innerHTML = 
    "From: " + email.sender +
    "<br> To: " + email.recipients+
    "<br> Subject: " + email.subject +
    "<hr>" + "<p>" + email.body + "</p>";// + "TimeStamp: " + email.timestamp +
    // "<br> id: " + email.id +
    // "<br> Read: " + email.read;
    // Add emails to #emails-view div
    document.querySelector('#emails-view').append(element);
    // if a button is clicked, show that email and hide all other email
    element.onclick = function() {
      view_selected_email(element.id)
      // alert(`${mailbox}`)
    }
    
  }

  function view_selected_email(email_id)
  {
    fetch(`/emails/${email_id}`)
      .then(response => response.json())
      .then(email =>
      {
        const element = document.createElement('div');
        element.id = 'view-email'
        console.log(email)

        if (mailbox == 'inbox'){
          element.innerHTML =
          "<h3> Inbox</h3><br>"+
          "From: "+email.sender +
          "<br>" +"To: "+email.recipients+
          "<br>"+"Subject: "+email.subject +"<hr><br>"+
          "<p>"+email.body+"</p>"+
          "<button class='btn btn-sm btn-outline-primary' id = 'archive' type = 'button'>Archive</button>";
        }
        if(mailbox == 'sent'){
          element.innerHTML = 
          "<h3> Sent </h3><br>" +
          "From: "+email.sender +
          "<br>" +"To: "+email.recipients+
          "<br>"+"Subject: "+email.subject +"<hr><br>"+
          "<p>"+email.body+"</p>";
        }
        if(mailbox == 'archive'){
          element.innerHTML =
          "<h3> Archive </h3><br>" +
          "From: "+email.sender +
          "<br>" +"To: "+email.recipients+
          "<br>"+"Subject: "+email.subject +"<hr><br>"+
          "<p>"+email.body+"</p>"+
          "<button class='btn btn-sm btn-outline-primary' id = 'unarchive' type = 'button'>Unarchive</button>";
        }
        document.querySelector('.container').append(element);
        document.querySelector('#emails-view').style.display = 'none';
        document.querySelector('#compose-view').style.display = 'none';
        document.querySelector('#view-email').style.display = 'block';
        // Mark email as read
        email_marked_as_read(email_id)
        // Archive when archive button is clicked
        document.querySelector
      });
  }// End view_selected_mail()

  function email_marked_as_read(email_id){
    fetch(`/emails/${email_id}`,{
      method: 'PUT',
      body: JSON.stringify({
        read: true
      })
    })
  }// End email_marked_as_read()

  function archive_email(email_id){
    alert(`archived`)
    fetch(`/emails/${email_id}`,{
      method: 'PUT',
      body: JSON.stringify({
        archived: true
      })
    })
  }// End archive_email()
}// End load_mailbox()


