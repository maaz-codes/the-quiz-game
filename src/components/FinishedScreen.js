function FinishedScreen({ points, maxPoints, highScore }) {
    const percentage = (points/maxPoints) * 100;
    return (
        <>
            <p className="result">
                You scored <strong>{points}</strong> out of {maxPoints} ({Math.round(percentage)}%) 
            </p>
            <p className="highscore">(Highest Score is : {highScore})</p>
        </>
    )
}

export default FinishedScreen
