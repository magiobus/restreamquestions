import Layout from "../components/layout";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Text, Link, Flex, Box} from "@chakra-ui/core";
import { useAuth } from "../lib/auth";
import { v4 as uuidv4 } from 'uuid';
import Question from '../components/question'

const SaveQuestions = (props) => {
  const { isAuthenticated, token, logout } = useAuth();
  const [streamStartTimeStamp, SetstreamStartTimeStamp] = useState(null);
  const [chatConnected, setChatConnected] = useState(false);
  const [questions, setQuestions] = useState([])

  //Connection to WEBSOCKET
  useEffect(() => {
    streamWebSocket();
    chatWebSocket();
  }, [token]);

  const streamWebSocket = () => {
    if (token && token.accessToken) {
      const accessToken = token.accessToken;
      const streamConnection = new WebSocket(`wss://streaming.api.restream.io/ws?accessToken=${accessToken}`);

      streamConnection.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.action === "updateIncoming") { SetstreamStartTimeStamp(moment.unix(data.createdAt).format("MM/DD/YYYY h:mm:ss a")) }
      };
    }
  };

  const chatWebSocket = () => {
    if (token && token.accessToken) {
      const accessToken = token.accessToken;
      const chatConnection = new WebSocket(`wss://chat.api.restream.io/ws?accessToken=${accessToken}`);
  
      chatConnection.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.action === "connection_info") { 
          setChatConnected(true )
        } else if(data.action === "event"){
          console.log("QUESTION ADDED =>", data);
          setQuestions((questions) => [
            ...questions,
            {
              id: uuidv4(),
              text: data.payload.eventPayload.text,
              timestamp: data.timestamp,
              source: data.payload.eventIdentifier,
              author: data.payload.eventPayload.author,
            },
          ]);
        } else if (data.action === "reply_created"){
          console.log("NEW QUESTION ADDED ME =>", data);
           setQuestions((questions) => [
            ...questions, {
              id: uuidv4(),
              text: data.payload.text,
              timestamp: data.timestamp,
              source: data.payload.connectionIdentifiers[0],
              author: { displayName: "Me" }
            }
          ])
        }
      };

      chatConnection.onerror = (error) => {
        setChatConnected(false)
      }; //TODO: Refresh Token here
    }
  };

  return (
    <Layout>
      {/* if is logged in but stream is not started */}
      {(isAuthenticated && streamStartTimeStamp === null || !chatConnected) && (
          <>
            <Box mt={5}>
              <Text><b>Welcome, you are logged in! </b></Text>
              <Text>Please start your stream on <Link href="https://restream.io/channel" isExternal> Restream.io </Link> </Text> 
            </Box>
          </>
      )}

      {/* if is logged in and stream is  started */}
      {(isAuthenticated && streamStartTimeStamp !== null && chatConnected) && (
        <>
        <Text my={5}><b>Stream started at: {streamStartTimeStamp} </b></Text>
          <Flex width="100%" align="center" direction="row" justify="center">
            <Flex width={["90%", "90%", "60%", "50%"]} align="center"  borderWidth="1px" p={5} direction="column" bg="gray.50" borderColor="gray.00">
            {questions.map(question => (
              <Question key={question.id} question={question} questions={questions} setQuestions={setQuestions} streamStartTimeStamp={streamStartTimeStamp}/>
            ))}
            </Flex>
          </Flex>

        </>

      )}

      {!isAuthenticated && <Text>You need to login </Text>}
    </Layout>
  );
};

export default SaveQuestions;
