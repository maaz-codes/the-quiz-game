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
import RestartButton from "./RestartButton";
import Timer from "./Timer";
import Footer from "./Footer";
import { quizData } from "../questions";

const initialState = {
  questions: [],

  //loading, error, ready, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
}

const SECS_PER_QUESTIONS = 30;

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
        secondsRemaining: state.questions.length * SECS_PER_QUESTIONS,
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
        status: "finished",
        highScore: state.points >= state.highScore ? state.points : state.highScore,
      }

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        highScore: state.highScore,
        status: 'ready',
      }

    case "timer":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      }
    
    default: throw new Error("unknown action");
  }
}

function App() {
  const [{ questions, status, index, answer, points, highScore, secondsRemaining }, dispatch] = useReducer(reducer, initialState);

  const totalQuestions = questions.length;
  const maxPoints = questions.reduce((prev, cur) => (
    prev + cur.points
  ), 0);

  useEffect(() => {
    // async function getQuestions() {
    //   try {
    //     const res = await fetch("http://localhost:8000/questions");
    //     const data = await res.json();
    //     dispatch({type: "recievedData", payload: data});
    //   } catch (error) {
    //     dispatch({type: "dataFailed"});
    //   }
    // }

    function getData() {
      try {
        const data = quizData.questions;
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
          <Footer>
            <NextButton 
              dispatch={dispatch} 
              answer={answer}
              index={index}
              totalQuestions={totalQuestions} />
            <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
          </Footer>
        </>}
        {status === "finished" && (
          <>
            <FinishedScreen points={points} maxPoints={maxPoints} highScore={highScore} />
            <RestartButton dispatch={dispatch} />
          </>

        )}
      </Main>
    </div>
  );
}

export default App;
