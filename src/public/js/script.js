let firstTime = 0;

function redirectToAllCreate() {
     window.location = '/poll/create'
}

function redirectToHome() {
     window.location = '/'
}

function redirectToAllPolls() {
     window.location = '/poll'
}

async function vote(PollID, Option, Count) {
     if(getElement('id', `Voted: ${PollID}`, true).innerHTML.trim() !== '') {
         return window.alert('Only Vote once!')
     }

     let info = {
          pollID: parseInt(PollID),
          optionName: Option
     }

     const options = {
          method: "POST",
          headers: {
               "content-type": 'application/json'
          },
          body: JSON.stringify(info)
     }
     try {
     await fetch(`/vote/${PollID}/${Option}`, options);
     console.log('Sucess')
     } catch(err) {
          console.error(err)
     }
     let getInfo = [getElement('id', `pollInfo: ${PollID}`, true).innerHTML.split('Total Votes: ')[1]]
     console.log(getInfo)
     getInfo.push(parseInt(getInfo[0].split(' |')[0]))
     console.log(getInfo)
     getInfo[0] = getInfo[0].split(`${getInfo[1]} | Created At: `)[1]
     let totalVotes = getInfo[1]
     getElement('id', `pollInfo: ${PollID}`, true).innerHTML = `Total Votes: ${totalVotes += 1} | Created At: ${getInfo[0]}`
     let votesHTML = getElement('id', `Poll: ${Option}${Count}`, true);
     let confirm = getElement('id', `Voted: ${PollID}`, true)
     confirm.innerHTML = `You voted for ${Option}`
     console.log(votesHTML)
     let votes = parseInt(votesHTML.innerHTML.split(/\w{5}:\s{1}/gim)[1])
     console.log(votes)
     votesHTML.innerHTML = `Votes: ${votes += 1}`;
}

function createOption() {
     for(let i = 3; i < 6; i++) {
     let msg = 'Please fill out the options.'
     let check = getElement('id', `Option ${i}`, true)
     let textcheck;
     if(check){
     textcheck = getElement('id', `Option${i}`, true)
     }
     if(!getElement('id', `Option1`).value || !getElement('id', `Option2`).value) {
               window.alert(msg)
               break;
     } else {
     console.log(i)
     if(check.style['display'] !== 'none') {
          console.log('Cleared' + i)
     }
     else {
          check.style['display'] = 'inline'
          if(i === 5) {
               let btn = getElement('id', 'btnCreateOp', true);
               btn.style.display = 'none';
          }
          break;
     }
}
}
}

async function createPoll() {
     let title = getElement('id', 'Title', true).value
     let option1 = getElement('id', 'Option1', true).value
     let option2 = getElement('id', 'Option2', true).value
     let option3 = getElement('id', 'Option3', true).value
     let option4 = getElement('id', 'Option4', true).value
     let option5 = getElement('id', 'Option5', true).value
     let visability = getElement('id', 'visablitiy', true).checked;
     const newPoll = {
          type: 'poll'
     };
     if(title && title.length >= 5) {
          newPoll.title = title;
     } else {
          return window.alert('Title may not be grater than 5 letters.')
     }
     if(option1 && option1.length >= 1 && option2 && option2.length >= 1) {
          newPoll.option1 = option1;
          newPoll.option2 = option2;
     } else {
          return window.alert('First 2 options must not be left blank.')
     }
     if(option3 && option3.length >= 1) {
          newPoll.option3 = option3;
     } else {
          if(option4 && option4.length >= 1) {
               newPoll.option4 = option4
          } else {
               if(option5 && option5.length >= 1) {
                    newPoll.option5 = option5
               } else {
                    console.log('SENT', visability == 1, newPoll)
               }
          }
     }
     if(option4 && option4.length >= 1) {
          newPoll.option4 = option4
     } else {
          if(option5 && option5.length >= 1) {
               newPoll.option5 = option5
          } else {
               console.log('SENT', visability == 1, newPoll)
          }
     }
     if(option5 && option5.length >= 1) {
          newPoll.option5 = option5
     }
     newPoll.Public = visability == 1;
     console.log(newPoll)
     try {
          const options = {
               method: "POST",
               headers: {
                    "content-type": "application/json"
               },
               body: JSON.stringify(newPoll)
          }
          let fetched = await fetch('/poll/create', options)
          let data = await fetched.json()
          window.location = `/poll/${data['pollID']}`
          console.log('SUCCESS!')
     } catch(Err) {
          console.error(Err)
     }
}

function displayInfo() {
     let visability = getElement('id', 'visablitiy').checked;
     let info = getElement('id', 'publicInfo', true).style
     if(visability == 1) {
          info['display'] = 'inline';
     } else {
          info['display'] = 'none'
     }
}

let pollredirect = getElement('id', 'pollCode', true)

pollredirect.addEventListener("keyup", async (event) => {
     if (event.keyCode === 13) {
       event.preventDefault();
       let id = pollredirect.value;
       let fetched = await fetch('/poll/create', { method: "POST", headers: { "content-type": "application/json"}, body: JSON.stringify({ type: 'inforequest'})})
       let data = await fetched.json()
       console.log(data)
       if(id < data['currentPollID'] || id > 999) {
       window.location = `/poll/${id}`
       console.log(true)
  } else {
        window.alert('Invaild Poll')
  }
     }
});