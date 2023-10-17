import { useEffect } from "react"

function Timer({ dispatch, secondsRemaining }) {
    useEffect(function() {
        setInterval(() => {
            dispatch({type: 'timer'})
           console.log(secondsRemaining); 
        }, 1000);
    }, []);

    return (
        <div className="timer">
            05:10
        </div>
    )
}

export default Timer
