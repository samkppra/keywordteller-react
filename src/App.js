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

  const [topics, setTopics] = React.useState('')
  const [result, setResult] = React.useState([])
  
  // const [state, setState] = useState(initialState);
  // Returns a stateful value, and a function to update it.
  const [youtubeUrl, setYoutubeUrl] = React.useState('')  
 
  const sendSearchword = async () => {
    
    // TODO topics: handle multiple lines and comma and separate each phrase by |
    const payload = {
      Data: {
        "Keyword": topics,
        "CustomerId": id,
        "Email": email
      },
      "PartitionKey": "1"
    }    

    const res= await api.put('/', payload)
    .then(
      componentDidMount()
    )
  console.log(res)
  console.log(topics)
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
          <p>Your YouTube channel URL</p>
          <input value={youtubeUrl} placeholder="Example youtube.com/c/YouTubeCreators" onChange={(e) => setYoutubeUrl(e.target.value)} style={{ width: "300px" }}></input>
          <p>Field of specialisation</p>
          <textarea value={topics} placeholder="Example &#13;Ice cream recipe&#13;Homemade ice creams" onChange={(e) => setTopics(e.target.value)} rows={5} cols={50}></textarea>
          <br></br>
          <button style={{width: "150px", background:"lightgreen"}}>Submit</button>
        </form>

        <ul>{result.map(i => <li>{JSON.stringify(i)}</li>)}</ul>


        <AmplifySignOut width={5}></AmplifySignOut>

      </header>
    </div>
  );
}

export default  withAuthenticator(App);

