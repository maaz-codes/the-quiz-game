import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";

const initialState = {
  questions: [],

  //loading, error, ready, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
}

function reducer(state, action) {
  switch(action.type) {
    
    case "recievedData":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    
    case "dataFailed":
      return {
        ...state,
        status: "error",
      }
    
    case "start":
      return {
        ...state,
        status: "active",
      }

    case "newAnswer":
      const question = state.questions.at(state.index);
      console.log(question);
      return {
        ...state,
        answer: action.payload,
        points: question.correctOption === action.payload
          ? state.points + question.points 
          : state.points,
      }

    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      }

    case "finished":
      return {
        ...state,
        status: "finished"
      }
    
    default: throw new Error("unknown action");
  }
}

function App() {
  const [{ questions, status, index, answer, points }, dispatch] = useReducer(reducer, initialState);

  const totalQuestions = questions.length;
  const maxPoints = questions.reduce((prev, cur) => (
    prev + cur.points
  ), 0);

  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch("http://localhost:8000/questions");
        const data = await res.json();
        dispatch({type: "recievedData", payload: data});
      } catch(err) {
          dispatch({type: "dataFailed"});
      }
    }

    getData();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen 
            totalQuestions={totalQuestions} 
            dispatch={() => dispatch({type: "start"})} />
        )}
        {status === "active" && <>
          <Progress 
            index={index} 
            totalQuestions={totalQuestions} 
            points={points} maxPoints={maxPoints} 
            answer={answer}/>
          <Question 
            question={questions[index]} 
            dispatch={dispatch} 
            answer={answer} />
          <NextButton 
            dispatch={dispatch} 
            answer={answer}
            index={index}
            totalQuestions={totalQuestions} />
        </>}
        {status === "finished" && (
          <FinishedScreen points={points} maxPoints={maxPoints} />
        )}
      </Main>
    </div>
  );
}

export default App;
