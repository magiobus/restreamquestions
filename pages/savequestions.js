import Layout from '../components/layout'
import React, { useEffect, useState} from 'react'
import Router, { useRouter } from 'next/router'
import { Box, Button, Text, Flex, Input, InputRightElement, InputGroup, TabPanel} from "@chakra-ui/core";
import moment from 'moment'

import QuestionsWrapper from '../components/questionswrapper'

import {useAuth} from '../lib/auth'


const SaveQuestions = props => {
  const [error, setError] = useState(false)
  const [connected, setConnected] = useState(false)
  const [editApi, setEditApi] = useState(true)
  const {isAuthenticated, token, questions, setQuestions, logout, apiValue, setApiValue, streamTimeStampDate, setStreamTimeStampDate} = useAuth()


  //Connection to WEBSOCKET
  useEffect(()=> {
    chatWebSocket()
  }, [token])


  const chatWebSocket = () => {
    if(token && token.accessToken){
      const accessToken = token.accessToken
        // OAuth `bearer` token
      const chatConnection = new WebSocket(`wss://chat.api.restream.io/ws?accessToken=${accessToken}`);
      const streamConnection = new WebSocket(`wss://streaming.api.restream.io/ws?accessToken=${accessToken}`);

      streamConnection.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if(data.action === 'updateIncoming'){
          setStreamTimeStampDate(moment.unix(data.createdAt).format("MM/DD/YYYY h:mm:ss a"))
          console.log("UPDATE INCOMING! =>", data)
        } else if (data.action === 'updateStatuses') {
          console.log("UPDATE STATUSES! =>", data)
        }
      };


      chatConnection.onmessage = (message) => {
          const data = JSON.parse(message.data);
          if(data.action === 'connection_info'){
            setConnected(true)
            console.log("CONNECTION INFO =>", data)
          } else if (data.action === 'reply_created') {
            console.log("NEW QUESTION ADDED =>", data)
            setQuestions(questions => [...questions, {"text": data.payload.text, "timestamp": data.timestamp, "source": data.payload.connectionIdentifiers[0]}])
          }
      };

      chatConnection.onerror = (error) => { setError(true) }; //TODO: Refresh Token here
    }
  }

  const onChangeApi = event => { setApiValue(event) }
  const toggleChangeApi = () => { setEditApi(!editApi)}

  //Saves in local storage every time questions is modified
  useEffect(() => {
    localStorage.setItem('questions', questions)
  }, [questions])


  return (
    <Layout>
          {error && <p>Error connecting to chat</p>}


      {(isAuthenticated && connected) ? (
        <>
        <Text mb={5} p={2} color="pink">Connected to Restream Chat.<b> Started at: {streamTimeStampDate}</b></Text>
        {editApi && (
          <InputGroup mb={2}  size="md">
           <Input
             pr="4.5rem"
             type="text"
             placeholder="YOUR API URL HERE..."
             value={apiValue}
             onChange={(event) => {onChangeApi(event.target.value)}}
           />
           <InputRightElement width="4.5rem">
             <Button h="1.75rem" size="sm" onClick={toggleChangeApi}>
               Done
             </Button>
           </InputRightElement>
         </InputGroup>
        )}

        {!editApi && (
          <Text mb={2} onClick={toggleChangeApi} >API URL: {apiValue}</Text>
        )}
        <Flex align="center" bg="gray.50"  border="1px" borderRadius={8} borderColor="gray.200" direction="row" >
          <Box flex="1" textAlign="left" px={5} py={2} overflow-Y="scroll" >
              {questions.length>0 ? (
                <QuestionsWrapper questions={questions} apiValue={apiValue}/>
              ): (
                <Text mb={5} p={2} color="pink">There's no questions yet</Text>
              )}
          </Box>
        </Flex>
        </>
      ):(
        <>
          <p>Sorry, you can't touch this.</p>
          <p>Please sign in</p>
        </>
      )}

    </Layout>
  )
}

export default SaveQuestions;
