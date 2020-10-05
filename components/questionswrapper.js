import Question from './question'


const QuestionsWrapper = props => {
  const questions = props.questions
  const reversedQuestions = [...questions].reverse()

  const questionsList = reversedQuestions.map((question) => {
    let randomKey = Math.random()
    randomKey = randomKey.toString()
    return(
      <Question key={randomKey} question={question} apiValue={props.apiValue}/>
    )
  });

  return ( <>{questionsList}</> )

}




export default QuestionsWrapper;
