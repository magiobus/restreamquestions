import { Box, Button, Text, Flex, Input, InputRightElement, InputGroup} from "@chakra-ui/core";
import {useState, useEffect} from 'react';
import moment from 'moment'
import ms from 'ms'



const Question = props => {
  const [editText, setEditText]= useState(false)
  const [questionText, setQuestionText] = useState(props.question.text)
  const [isAnswering, setIsAnswering] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)

  const [answerTimeStamp, setAnswerTimeStamp] = useState(0) //when I pressed the answer button
  const [answeringDuration, setAnsweringDuration] = useState(0)

  let questionTimestamp = moment.unix(props.question.timestamp).format("MM/DD/YYYY h:mm:ss a"); //question received at
  let streamTimeStampDate = props.streamTimeStampDate //stream started at

  const onChangeText = event => {
    setQuestionText(event)
  }

  const toggleEdit = () => {
    setEditText(!editText)
  }

  const handleAnswerSubmit = () => {
    setIsAnswering(true)
    setAnswerTimeStamp(moment().format("MM/DD/YYYY h:mm:ss a"))//when I pressed the answer button

    let localCounter = 0
    setInterval(() => {
      localCounter += 1000
      setAnsweringDuration(localCounter)
    }, 1000);
  }

  const handleFinishSubmit = () => {
    setIsAnswering(false)
    let finishTimeStamp = moment().format("MM/DD/YYYY h:mm:ss a") //when I pressed the answer button
    console.log("You press the answer button at =>", answerTimeStamp)
    console.log("You finish answering at =>", finishTimeStamp)
    setIsAnswered(true)
    console.log("Answered in =>", answeringDuration)


    let streamStartTime = moment(streamTimeStampDate)
    let answerStartTime = moment(answerTimeStamp)
    let answerEndTime = moment(finishTimeStamp)


    let questionStartsAt = moment.duration(answerStartTime.diff(streamStartTime));
    let questionEndsAt = moment.duration(answerEndTime.diff(streamStartTime));

    let dataToPost = {
      "text": questionText,
      "questionStartsAt": questionStartsAt.as('milliseconds'),
      "questionEndsAt": questionEndsAt.as('milliseconds'),
      "answerTime": answeringDuration
    }

    console.log("data to post =>", dataToPost)


    //Take Data and send it to API
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
               <Text ml={2}>Answering: {ms(answeringDuration)}</Text>
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
