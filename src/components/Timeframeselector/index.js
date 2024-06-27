import './index.css'

const TimeframeSelector=props=>{
    const {selectOption}=props
    const onChangeValue=event=>{
        selectOption(event.target.value)
    }

    return (
        <div className='time-frame-container'>
            <label htmlFor="select">Time Frames:</label>
            <select id='select' onChange={onChangeValue} className='options-container'>
                <option value='daily'>Daily</option>
                <option value='weekly'>Weekly</option>
                <option value='monthly'>Monthly</option>
            </select>
        </div>
    )
}
export default TimeframeSelector