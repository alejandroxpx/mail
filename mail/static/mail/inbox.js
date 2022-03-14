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
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  // GET request mailbox and add each email to page
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails =>{
    console.log(emails)
    emails.forEach(element => {
        add_email(element)
    });
  });
  
  function add_email(email){
    const element = document.createElement('div');
    element.className = 'email'
    element.innerHTML = "From: "+email.sender +
    "<br>" +"To: "+email.recipients+
    "<br>"+"Subject: "+email.subject +"<br> Body:"
    +"<p>"+email.body+"</p>"+ "TimeStamp: "+ email.timestamp +
    "<br>"+ " id: " + email.id
    +"<br>"+ email.read;
    document.querySelector('#emails-view').append(element);
    document.querySelector('#emails-view').onclick = view_email(email.id);
    if(email.read == true){
      document.querySelector('.email').style.backgroundColor = "grey";
    }
    else if(email.read == false){
      document.querySelector('.email').style.backgroundColor = "white";
    }
  }

  function view_email(email_id){
    
  }



}


