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
        recipients: document.querySelector('#compose-recipients').value(),
        subject: document.querySelector('#compose-subject').value(),
        body: document.querySelector('#compose-body').value()
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
function display(emails){
  alert(emails[0].id)
  top_of_page = 0
  bottom_of_page = 5
  // Whe DOM loads, render the first 20 emails
  document.addEventListener('DOMContentLoaded', load);
  for (let i = 0; i <5;i++){ 
    load(emails[i].id)
  }

  function load(count){
    fetch(`/emails/${count}`)
    .then(response => response.json())
    .then(email =>{
      console.log(email);
      const element = document.createElement('div');
      element.className = 'email'
      element.innerHTML = "From: "+email.sender +"<br>" + "Subject: "+email.subject +"<br> Body: "+email.body+
      "<br>"+ "TimeStamp: "+ email.timestamp + " id:" + email.id;
      document.querySelector('#emails-view').append(element);
    });
  }
}
function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Show mailbox content
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    console.log(emails)
    //Display the emails
    display(emails)
  });
}
