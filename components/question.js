import { Box, Button, Text, Flex, Input, InputRightElement, InputGroup} from "@chakra-ui/core";
import {useState, useEffect} from 'react';
import moment from 'moment'


const Question = props => {
  const [editText, setEditText]= useState(false)
  const [questionText, setQuestionText] = useState(props.question.text)
  let questionTimestamp = moment.unix(props.question.timestamp).format("MM/DD/YYYY h:mm:ss a");

  console.log("questionTimestamp =>", questionTimestamp)
  const onChangeText = event => {
    setQuestionText(event)
  }

  const toggleEdit = () => {
    setEditText(!editText)
  }

  const handleAnswerSubmit = (event) => {
    event.preventDefault
    alert(`TODO: \n text: ${questionText} \n questionTimestamp ${questionTimestamp}, \n endtime, duration and url of video and post it to ${props.apiValue}`)
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
             <Button ml={2} mt={1} variantColor="pink" size="sm" onClick={(event) => {handleAnswerSubmit(event)}}>Answer</Button>
           </Box>
         </Flex>
       </Box>
     </Flex>
  )
}

export default Question;
