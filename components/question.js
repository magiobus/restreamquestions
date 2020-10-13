import { Box, Button, Text, Flex, Input, InputRightElement, InputGroup, Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton, useDisclosure} from "@chakra-ui/core";
import {useState, useEffect} from 'react';
import moment from 'moment'
import ms from 'ms'


const Question = ({question, questions, setQuestions, streamStartTimeStamp}) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); 
  const [answerInModal, setAnswerInModal] = useState(null);
  const [answeringDuration, setAnsweringDuration] = useState(0) //counter

  const [editText, setEditText]= useState(false)
  const [questionText, setQuestionText] = useState(question.text)


  let questionTimestamp = moment.unix(question.timestamp).format("MM/DD/YYYY h:mm:ss a");

  // HANDLERS HANDLERS
  const handleAnswerSubmit = (questionId) => {

    let _questions = [...questions]

    //Get Clicked question and move it to setAnswerInModal with timestamps
    let matchedQuestion = _questions.find(_question => { return _question.id === questionId })
    matchedQuestion.receivedAt =  questionTimestamp
    matchedQuestion.answerStarts = moment().format("MM/DD/YYYY h:mm:ss a")
    matchedQuestion.streamStartedAt = streamStartTimeStamp
    setAnswerInModal(matchedQuestion) 

    //starts counting
    let localCounter = 0
    setAnsweringDuration(0)
    setInterval(() => {
      localCounter += 1000
      setAnsweringDuration(localCounter)
    }, 1000);

    console.log("matchedQuestion =>", matchedQuestion)

    //open modal 
    onOpen(true)

    // //Quit clicked question from questions context
    // let newQuestions = questions.filter(question => { return question.id !== questionId })
    // setQuestions(newQuestions)
  }

  const handleFinishAnswer = () => {
    console.log("handleFinishAnswer!!!")
    let answeredQuestion = {...answerInModal}
    answeredQuestion.answerEnds = moment().format("MM/DD/YYYY h:mm:ss a")
    console.log(" =>", answeredQuestion)

    let streamStartTime = moment(answeredQuestion.streamStartedAt)
    let answerStartTime = moment(answeredQuestion.answerStarts)
    let answerEndTime = moment(answeredQuestion.answerEnds)

    let questionStartsAt = moment.duration(answerStartTime.diff(streamStartTime));
    let questionEndsAt = moment.duration(answerEndTime.diff(streamStartTime));

    //DATA TO SEND TO API 
    let data = {
      text: answeredQuestion.text, 
      startsAt: questionStartsAt.as('milliseconds'), 
      endsAt: questionEndsAt.as('milliseconds'),
      duration: answeringDuration
    }

    console.log("DATA TO API =>", data)

    //SEND TO API HERE!
    //UPDATE QUESTIONS ON CONTEXT
    onClose(true)    
  }

  return ( 
    <>
    <Flex width={["100%"]} >
       <Box px={2} pb={2} my={2} mx={0} bg="white" border="1px" borderRadius={8} borderColor="gray.300" width="100%" boxShadow="lg">
         <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
            <>
              <Flex direction="column" align="flex-start">
                <Text px={2} py={1}>{question.text}</Text>
                <Text px={2} py={1} my={2} as="sub">Received at: {questionTimestamp}</Text>
              </Flex>
            </>
         </Box>


         <Flex direction="row" align="flex-end">
           <Box mt={0}>
             <Button ml={2} mt={1} variantColor="pink" size="sm" onClick={() => {handleAnswerSubmit(question.id)}}>
              Answer
             </Button>
           </Box>
         </Flex>
       </Box>
     </Flex>


    {answerInModal && (
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody pb={6}>
             <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
              <Flex direction="column" align="flex-start">
                <Text px={0} py={1} as="i">Answering: {answerInModal.text}</Text>
                <Text px={0} py={1} as="i">Started At: {answerInModal.answerStarts}</Text>
                <Text>Elapsed Time: {ms(answeringDuration)}</Text>
              </Flex>
            </Box> 
          </ModalBody>
          <ModalFooter>
            <Button variantColor="blue" mr={3} onClick={() => {handleFinishAnswer()}}>
              Finish
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )}
     </>
   )
}
 
export default Question;