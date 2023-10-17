function FinishedScreen({ points, maxPoints }) {
    const percentage = (points/maxPoints) * 100;
    return (
        <p className="result">
            You scored <strong>{points}</strong> out of {maxPoints} ({Math.round(percentage)}%) 
        </p>
    )
}

export default FinishedScreen
