import { Box, Button, Text, Flex, Input, InputRightElement, InputGroup, Tag, TagLabel, TagIcon, CircularProgress, Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton, useDisclosure} from "@chakra-ui/core";
import {useState, useEffect} from 'react';
import moment from 'moment'
import ms from 'ms'


const Question = ({question, questions, setQuestions, streamStartTimeStamp,sentApi}) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); 
  const [answerInModal, setAnswerInModal] = useState(null);
  const [answeringDuration, setAnsweringDuration] = useState(0) //counter
  const [toggleEditQuestion, setToggleEditQuestion] = useState(false)
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
    matchedQuestion.text = questionText
    setAnswerInModal(matchedQuestion) 

    //starts counting
    let localCounter = 0
    setAnsweringDuration(0)
    setInterval(() => {
      localCounter += 1000
      setAnsweringDuration(localCounter)
    }, 1000);

    //open modal 
    onOpen(true)
  }

  const handleFinishAnswer = () => {
    let answeredQuestion = {...answerInModal}
    answeredQuestion.answerEnds = moment().format("MM/DD/YYYY h:mm:ss a")

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

    //TODO: SEND TO API HERE!
    console.log("DATA TO API URL=>", sentApi, data)

    //UPDATE QUESTIONS ON CONTEXT
    let _questions = [...questions]
    let newQuestion = _questions.find(_question => {
      return _question.id === answeredQuestion.id
    })

    newQuestion.answered = true
    setQuestions(_questions)
    onClose(true)    
  }

  const handleDeleteQuestion = questionId => {
    let newQuestions = [...questions].filter(question => { return question.id !== questionId })
    setQuestions(newQuestions)
  }

  return ( 
    <>
    <Flex width={["100%"]} >
       <Box px={2} pb={2} my={2} mx={0} bg="white" border="1px" borderRadius={8} borderColor="gray.300" width="100%" boxShadow="lg">
         <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
            <>
              <Flex direction="column" align="flex-start">
                {toggleEditQuestion ? (
                  <InputGroup size="md">
                  <Input pr="4.5rem" type="text" value={questionText} onChange={e => {setQuestionText(e.target.value)}}/>
                  <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={() => {setToggleEditQuestion(false)}}>Done</Button>
                  </InputRightElement>
                  </InputGroup>
                ): (
                  <Text px={2} py={1} onClick={() => {setToggleEditQuestion(true)}}>{questionText}</Text>
                )}
                <Text px={2} py={1} my={2} as="sub">Received at: {questionTimestamp}</Text>
              </Flex>
            </>
         </Box>

         <Flex direction="row" align="flex-end">
           <Box mt={0}>
             {question.answered ? (
               <Tag variantColor="cyan">
                  <TagLabel>Answered</TagLabel>
                  <TagIcon icon="check" size="12px" />
                </Tag>
             ): (
               <>
               <Button ml={2} mt={1} variantColor="pink" size="sm"  onClick={() => {handleAnswerSubmit(question.id)}}>
                {answerInModal ? ( <CircularProgress isIndeterminate size="24px" color="teal" /> ) : ( 'Answer' )}
                </Button>
                <Button ml={2} mt={1} variantColor="pink" size="sm"  onClick={() => {handleDeleteQuestion(question.id)}}>
                 Delete
                </Button>
               </>
             )}
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
            <Button variantColor="cyan" mr={3} onClick={() => {handleFinishAnswer()}}>
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