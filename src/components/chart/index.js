import {useEffect,useState,useCallback} from 'react'
import {LineChart,Line,XAxis,YAxis,Tooltip,CartesianGrid, ResponsiveContainer,Brush} from 'recharts'
import html2canvas from 'html2canvas'
import {InfinitySpin} from 'react-loader-spinner'
import './index.css'

const Chart=({timeFrame})=>{
    const [chartData,setChartData]=useState([])
    const [loading,setLoading]=useState(true)
    const [filteredData,setFilterData]=useState([])
    const [clickedData,setClicked]=useState(null)
    console.log(chartData)

    

    const getWeekNum=date=>{
        date=new Date(date);
        date.setHours(0,0,0)
        date.setDate(date.getDate()+4-(date.getDay()||7))
        const yearStart=new Date(date.getFullYear(),0,1)
        const weekNum=Math.ceil((((date-yearStart)/86400000)+1)/7)
        return weekNum
    }

    const settingDataByWeek=useCallback(data=>{
        const weeklyData=[];
        let week={};
        data.forEach(e => {
           const date=new Date(e.timestamp);
           const weekOfYear=getWeekNum(date);
           //console.log(weekOfYear)
           if(!week[weekOfYear]){
            week[weekOfYear]={timestamp:date.getTime(),value:0,count:0}
           }
           week[weekOfYear].value+=e.value
           week[weekOfYear].count++
        });
        Object.keys(week).forEach(weekOfYear=>{
            const averageVal=week[weekOfYear].value/week[weekOfYear].count
            //console.log(averageVal)
            weeklyData.push({timestamp:new Date(week[weekOfYear].timestamp).toISOString(),value:averageVal})
        })

        return weeklyData
    },[])

    const settingDataByMonth=useCallback(data=>{
        const monthlyData=[]
        let month={}
        data.forEach(e=>{
            const date=new Date(e.timestamp)
            const monthOfYear=date.getFullYear()*100+date.getMonth()+1;
            //console.log(monthOfYear)
            if(!month[monthOfYear]){
                month[monthOfYear]={timestamp:date.getTime(),value:0,count:0}
            }
            month[monthOfYear].value+=e.value;
            month[monthOfYear].count++
        })
        Object.keys(month).forEach(monthOfYear=>{
            const averageVal=month[monthOfYear].value/month[monthOfYear].count;
            //console.log(averageVal)
            monthlyData.push({timestamp:new Date(month[monthOfYear].timestamp).toISOString(),value:averageVal})
        })
        return monthlyData
    },[])
    const filterDataByTime=useCallback((data,timeFrame)=>{
        switch(timeFrame){
            case 'daily':
                setFilterData(data)
                break;
            case 'weekly':
                const weeklyData=settingDataByWeek(data)
                setFilterData(weeklyData)
                break;
            case 'monthly':
                const monthlyData=settingDataByMonth(data);
                setFilterData(monthlyData)
                break;
            default:
                setFilterData(data);
                break
        }
    },[settingDataByMonth,settingDataByWeek])

    useEffect(()=>{
        const fetchData=async()=>{
            const response=await fetch('/data/chartData.json')
            if(response.ok){
                const jsonData=await response.json()
                setChartData(jsonData)
                filterDataByTime(jsonData,timeFrame)
                //console.log(jsonData)
                setLoading(false)
            }else{
                console.log('response Error')
            }
        }
        fetchData()
    },[timeFrame,filterDataByTime])

    

    const imageConverting=()=>{
        html2canvas(document.querySelector('#my-chart')).then(canvas=>{
            const imgType=canvas.toDataURL('image/png')
            const anchorEl=document.createElement('a')
            anchorEl.download='chart.png'
            anchorEl.href=imgType;
            anchorEl.click()
        })
    }

    const onClickChangeData=(data,ind)=>{
        setClicked(data[ind])
    }

    return (
        <div className='chart-container' id='my-chart'>

            <h1 className='chart-heading'>chart {timeFrame}</h1>
            {loading?<InfinitySpin
                        visible={true}
                        width="200"
                        color="#4fa94d"
                        ariaLabel="infinity-spin-loading"/>
                :
                <ResponsiveContainer>
                    <LineChart data={filteredData} onClick={(data,ind)=>onClickChangeData(data,ind)} className='line-chart'>
                        <CartesianGrid strokeDasharray='3 3'/>
                        <XAxis dataKey='timestamp'/>
                        <YAxis/>
                        <Tooltip contentStyle={{backgroundColor:'#f0f0f0',border:'1px solid #ccc'}}/>
                        <Line type='monotone' dataKey='value' stroke='#000000'/>
                        <Brush dataKey='timestamp' height={30} stroke='#85dfc0'/>
                    </LineChart>
            </ResponsiveContainer>}
            
            <button className='btn' onClick={imageConverting} type='button'>
                convert Chart
            </button>
            {clickedData&&(
                <div className='clicked-data'>
                    <h1 className='details'>Data Details</h1>
                    <p>Time: {clickedData.timestamp}</p>
                    <p>Value: {clickedData.value}</p>
                </div>
            )}
        </div>
    )
}
export default Chart