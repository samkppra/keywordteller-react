import React from 'react';
import Amplify from 'aws-amplify';
import config from './aws-exports';
import { withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import './App.css';
import axios from 'axios';
import { Auth } from 'aws-amplify';

const api = axios.create({
  baseURL:'https://r8y325hxrj.execute-api.ap-southeast-2.amazonaws.com/prod/streams/keywordteller/record'
})

Amplify.configure(config)

function App() {
  let id = null
  let email = null

  Auth.currentUserInfo().then(info => {
    id = info.id
    if(info.attributes) {email = info.attributes.email}
  });
  const [searchWord, setSearchWord] = React.useState('')
  
  const sendSearchword =async ()=> {
    console.log(id)
    let res =await api.put('/', {"Data": {"searchword" : searchWord , "id" : id, "email" :email}, "PartitionKey":"1"})
    console.log(res)
  }
  
  const handleSubmit = e=> {
    e.preventDefault()
    console.log(searchWord)
    sendSearchword()
  }
  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <input value={searchWord} placeholder="search" onChange={(e) => setSearchWord(e.target.value)}></input>
          <button>Search</button>
        </form>
        <AmplifySignOut></AmplifySignOut>
      </header>
    </div>
  );
}

export default  withAuthenticator(App);

