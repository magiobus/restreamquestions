import { Box, Button, Text, Flex, Input, InputRightElement, InputGroup} from "@chakra-ui/core";
import {useState, useEffect} from 'react';
import moment from 'moment'



const Question = props => {
  const [editText, setEditText]= useState(false)
  const [questionText, setQuestionText] = useState(props.question.text)
  const [isAnswering, setIsAnswering] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  let questionTimestamp = moment.unix(props.question.timestamp).format("MM/DD/YYYY h:mm:ss a");

  const onChangeText = event => {
    setQuestionText(event)
  }

  const toggleEdit = () => {
    setEditText(!editText)
  }

  const handleAnswerSubmit = () => {
    setIsAnswering(true)
    let streamTimeStampDate = props.streamTimeStampDate //stream started at
    let answerTimeStamp = moment().format("MM/DD/YYYY h:mm:ss a") //when I pressed the answer button

    console.log("stream started at =>" ,streamTimeStampDate)
    console.log("Message received at =>", questionTimestamp)
    console.log("You press the answer button at =>", answerTimeStamp)
    console.log("Current Answering time.... =>" )
    // alert(`TODO: \n text: ${questionText} \n questionTimestamp ${questionTimestamp}, \n endtime, duration and url of video and post it to ${props.apiValue}`)
  }

  const handleFinishSubmit = () => {
    setIsAnswering(false)
    let finishTimeStamp = moment().format("MM/DD/YYYY h:mm:ss a") //when I pressed the answer button
    console.log("Finished!!! AT =>", finishTimeStamp)
    //Take Data and send it to API
    setIsAnswered(true)
  }

  useEffect(() => {
  }, [editText])

  return (
    <Flex width="full" >
       <Box px={2} pb={2} my={2}  border="1px" borderRadius={8} borderColor="gray.200" width="100%" boxShadow="lg">
         <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">

         {editText && (
           <InputGroup size="md">
            <Input
              pr="4.5rem"
              type="text"
              placeholder="Enter password"
              value={questionText}
              onChange={(event) => {onChangeText(event.target.value)}}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={toggleEdit}>
                Done
              </Button>
            </InputRightElement>
          </InputGroup>
         )}

          {!editText && (
            <>
            <Text width="80%" p={2}  onClick={toggleEdit}>{questionText}</Text>
            <Text pl={2}>Received at: {questionTimestamp}</Text>
            </>
          )}

         </Box>
         <Flex direction="row" align="flex-end">
           <Box mt={0}>
           {isAnswering  && (
             <>
               <Text ml={2}>Answering...</Text>
               <Button ml={2} mt={1} variantColor="pink" size="sm" onClick={(event) => {handleFinishSubmit(event)}}>
               Finish
               </Button>
             </>
           )}

           {(!isAnswering && !isAnswered) && (
             <Button ml={2} mt={1} variantColor="pink" size="sm" onClick={(event) => {handleAnswerSubmit(event)}}>
              Answer
             </Button>
           )}

           {isAnswered && ( <Text ml={2}>Answered :) </Text> )}

           </Box>
         </Flex>
       </Box>
     </Flex>
  )
}

export default Question;
