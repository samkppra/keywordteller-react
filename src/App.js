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

const getApi = axios.create({
  baseURL:'https://2cdaff1xc7.execute-api.ap-southeast-2.amazonaws.com/prod'
})
let id = null
let email = null

Amplify.configure(config)

function App() {
  
  
  Auth.currentUserInfo().then(info => {
    id = info.id
    if(info.attributes) {email = info.attributes.email}
  });

  const [searchWord, setSearchWord] = React.useState('')
  const [result, setResult] = React.useState([])
  
 
  const sendSearchword = async () => {
    const res= await api.put('/', {"Data": JSON.stringify({"Keyword" : searchWord , "CustomerId" : id, "Email" :email}), "PartitionKey":JSON.stringify("1")})
    .then(
      componentDidMount()
    )
  console.log(res)
  console.log(searchWord)
  }

  const componentDidMount = async () => {
    let suggestions =await getApi.get('/id/'+id)
    console.log(suggestions)
    const renderedGoods = suggestions.data.Items.map(item => {
       return item.Data
    })
    console.log(renderedGoods)
    setResult(renderedGoods)
  }
  

  const handleSubmit = e=> {
    e.preventDefault()
    sendSearchword()
  }
   
  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <input value={searchWord} placeholder="search" onChange={(e) => setSearchWord(e.target.value)}></input>
          <button>Search</button>
        </form>
         
        
       <ul>{result.map(i => <li>{JSON.stringify(i)}</li>)}</ul>
        
        <AmplifySignOut></AmplifySignOut>
      </header>
    </div>
  );
}

export default  withAuthenticator(App);

