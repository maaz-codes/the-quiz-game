function StartScreen({ totalQuestions, dispatch }) {
    return (
        <div className="start">
            <h2>Welcome to React Quiz</h2>
            <h3>{totalQuestions} questions to test your React Mastery</h3>
            <button className="btn btn-ui"
                onClick={dispatch} >
                Let's start
            </button>
        </div>
    )
}

export default StartScreen
