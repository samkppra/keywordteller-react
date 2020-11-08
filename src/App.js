import React from 'react';
import Amplify from 'aws-amplify';
import config from './aws-exports';
import { withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import './App.css';
import axios from 'axios';

const api = axios.create({
  baseURL:'https://r8y325hxrj.execute-api.ap-southeast-2.amazonaws.com/prod/streams/keywordteller/record'
})

Amplify.configure(config)

function App() {
  const [searchWord, setSearchWord] = React.useState('')
  
  const sendSearchword =async ()=> {
    let res =await api.put('/', {"Data": "'"+searchWord+"'", "PartitionKey":"1"})
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

