import React from 'react';
import { Button, Input } from 'antd';

const { TextArea } = Input;

const SendMessage = ({
  selectedContacts,
  handleSendMessage,
 }) => {
  const [message, setMessage] = React.useState<string>();
  const handleSubmit = () => {
    return handleSendMessage({
      message,
      users: [...(selectedContacts || []).map(({ id }) => id)],
    });
  };
  return (
    <>
      <TextArea
        value={message}
        onChange={({ target: { value } }) => setMessage(value)}
        placeholder="Enter Broadcast Message"
        style={{ width: '250px' }}
        autoSize={{
          minRows: 2,
          maxRows: 6
        }}
      />
      <br />
      <Button
        onClick={() => handleSubmit()}
        >
        Send Message to {(selectedContacts || []).length} User
        {((selectedContacts && selectedContacts) || []).length > 1 ? 's' : ''}
      </Button>
      <br />
    </>
  );
};

export default SendMessage;
