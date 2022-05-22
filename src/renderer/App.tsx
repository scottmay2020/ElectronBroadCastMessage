import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import { Button, Input } from 'antd';
import axios from 'axios';
import ContactDisplay from './components/ContactDisplay';

const API_URL = 'https://flask-broadcast-message.herokuapp.com/api/';

const { Password } = Input;

interface SkypeChat {
  id: string;
  name: string;
}

interface SkypeData {
  chats: Array<SkypeChat>;
  contacts: Array<string>;
}

interface Skype {
  data: SkypeData;
  isLoaded: boolean;
}

interface ILogin {
  userName: string | undefined;
  password: string | undefined;
}

interface IContact {
  id: string;
  name: string;
}

const SkypeLogin = ({ handleSubmit }) => {
  const [userName, setUserName] = React.useState<string>(
    'smay10@protonmail.com'
  );
  const [password, setPassword] = React.useState<string>('Clyde0328!');
  console.log('Here');
  return (
    <>
      <Input
        value={userName}
        placeholder="Please enter Skype username"
        onChange={({ target: { value } }) => setUserName(value)}
      />
      <br />
      <Password
        value={password}
        placeholder="Please enter Skype password"
        onChange={({ target: { value } }) => setPassword(value)}
      />
      <br />
      <Button onClick={() => handleSubmit({ userName, password })}>
        Submit
      </Button>
    </>
  );
};

const BroadCast = () => {
  const [skypeData, setSkypeData] = React.useState<Skype>();
  const [isLoading, setIsLoading] = React.useState<boolean>();
  const [isError, setIsError] = React.useState<boolean>();
  const [isSentSuccessfully, setIsSentSuccessfully] = React.useState<boolean>();
  const [isSending, setIsSending] = React.useState<boolean>();
  const [login, setLogin] = React.useState<ILogin>();
  const [selectedContacts, setSelectedContacts] = React.useState<Array<string>>(
    []
  );
  const handleSendMessage = async ({ users, message }) => {
    try {
      setIsSending(true);
      setIsError(false);
      const form = new FormData();
      form.append('userName', login.userName);
      form.append('password', login.password);
      form.append('message', message);
      form.append('users[]', users);
      const { data } = await axios.post(`${API_URL}send`, form);
      setIsSending(false);
      if (data === 'ok') {
        setIsSentSuccessfully(true);
        setSelectedContacts([]);
        setTimeout(() => {
          setIsSentSuccessfully(false);
        }, 3000);
      }
    } catch (err) {
      setIsSending(false);
      setIsError(true);
      return false;
    }
  };
  const handleSubmit = async (values: ILogin) => {
    setIsError(false);
    setIsLoading(true);
    try {
      const form = new FormData();
      form.append('userName', values.userName);
      form.append('password', values.password);
      const { data } = await axios.post(API_URL, form);
      setSkypeData({
        data,
        isLoaded: true,
      });
      setIsLoading(false);
      setLogin({ userName: 'smay10@protonmail.com', password: 'Clyde0328!' });
    } catch (err) {
      console.log(err, 'ERROR');
      setIsError(true);
      setIsLoading(false);
      return false;
    }
  };
  console.log(isLoading, 'SLUs');

  return (
    <div>
      {isError && (
        <div>
          <h2>There was an error!</h2>
        </div>
      )}
      {!(skypeData && skypeData.isLoaded) && !isLoading && (
        <SkypeLogin handleSubmit={handleSubmit} />
      )}
      {isLoading && (
        <div>
          <h1>LOADING...</h1>
        </div>
      )}
      {!!(skypeData && skypeData.isLoaded) && (
        <ContactDisplay
          contacts={skypeData && skypeData.data.contacts}
          chats={skypeData && skypeData.data.chats}
          handleSendMessage={handleSendMessage}
          selectedContacts={selectedContacts}
          setSelectedContacts={setSelectedContacts}
          isSentSuccessfully={isSentSuccessfully}
          isSending={isSending}
        />
      )}
    </div>
  );
};
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BroadCast />} />
      </Routes>
    </Router>
  );
}
