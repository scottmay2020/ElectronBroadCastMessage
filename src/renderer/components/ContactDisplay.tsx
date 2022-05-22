import React from 'react';
import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import SendMessage from './SendMessage';

const regex = new RegExp(/^[^:]+:/gi);

const ContactDisplay = ({
  chats,
  contacts,
  handleSendMessage,
  selectedContacts,
  setSelectedContacts,
  isSentSuccessfully,
  isSending,
}) => {
  const contactsWithChat = contacts.map((contact) => {
    const { id } = contact;
    const chat = chats.find((c) => c.replace(regex, '') === id);
    return {
      ...contact,
      chat,
    };
  });
  const onChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setSelectedContacts([...selectedContacts, e.target.value]);
    } else {
      setSelectedContacts([
        ...selectedContacts.filter((value) => value !== e.target.value),
      ]);
    }
  };
  return (
    <>
      {isSentSuccessfully && (
        <div>
          <h1>Sent Message Successfully!</h1>
        </div>
      )}
      {isSending && (
        <div>
          <h1>SENDING...</h1>
        </div>
      )}
      {!!(selectedContacts && selectedContacts.length) && !isSending && (
        <SendMessage
          selectedContacts={contactsWithChat.filter(({ id }) =>
            selectedContacts.includes(id)
          )}
          handleSendMessage={handleSendMessage}
        />
      )}
      {!isSending && (!!(contactsWithChat || []).length) && (
        <div>Please select user(s) to broadcast message</div>
      )}
      {contactsWithChat.map((contact) => {
        if (!(contact && contact.chat)) return null;
        return (
          <div key={contact && contact.id}>
            <Checkbox
              checked={selectedContacts.includes(contact && contact.id)}
              onChange={onChange}
              value={contact && contact.id}
            >
              {contact && contact.name}
            </Checkbox>
          </div>
        );
      })}
    </>
  );
};

export default ContactDisplay;
