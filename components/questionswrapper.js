import Question from './question'
import {useAuth} from '../lib/auth'


const QuestionsWrapper = props => {
  const questions = props.questions
  const reversedQuestions = [...questions].reverse()
  let streamTimeStampDate = props.streamTimeStampDate

  const questionsList = reversedQuestions.map((question) => {
    let randomKey = Math.random()
    randomKey = randomKey.toString()
    return(
      <Question key={randomKey} question={question} apiValue={props.apiValue} streamTimeStampDate={streamTimeStampDate}/>
    )
  });

  return ( <>{questionsList}</> )

}




export default QuestionsWrapper;
