import { useState } from 'react'
import api from '../api/axiosInstance'

function Calendar() {

    const [calendar,setCalendar] = useState();

    const [startTime,setStartTime] = useState("");
    
    const [endTime,setEndTime] = useState("");

    const onCalendarButton = async () => {
        const res = await api.get("/calendar",{
            params: {
                timeMin: startTime,
                timeMax: endTime
            }
        })
        console.log("캘린더 : " , res.data)
        setCalendar(res.data)
    }

    return (
        <div>
            <div>
                <div>시작 시간</div>
                <input onChange={(event) => setStartTime(event.target.value)} value={startTime} type='datetime-local' />
                
                <div>끝나는 시간</div>
                <input onChange={(event) => setEndTime(event.target.value)} value={endTime} type='datetime-local' />
            
                <button onClick={onCalendarButton}>가져오기</button>
            </div>
        </div>
    )  
}

export default Calendar
