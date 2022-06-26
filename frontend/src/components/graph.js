import React from 'react'
import Chart from 'react-apexcharts'

const Graph = React.memo((props) => {
    let hours = []
    let average = []

    React.useEffect(() => {
        getTemp()
        return () => {
            hours = []
        }
        // eslint-disable-next-line
    }, [props])

    function getTemp() {
        for (let index = 0; index < 24; index += 1) {
            let sum = 0
            let counter = 0
            for (let temperature of props.temperature) {
                if (new Date(temperature.createdAt).getHours() === index) {
                    sum = sum + temperature.value
                    counter += 1
                }
            }

            if (sum === 0)
                average.push(0)
            else
                average.push(Math.round(sum / counter))

            hours.push(index)
        }
    }

    const options = {
        chart: {
            id: "basic-bar"
        },
        xaxis: {
            name: 'Hours',
            categories: hours
        },
        colors: ['#263238']
    }

    const series = [
        {
            name: "Temperature average",
            data: average
        }
    ]

    return (
        <React.Fragment>
            <Chart
                options={options}
                series={series}
                type="bar"
                width="100%"
            />
        </React.Fragment>
    )
})

export default Graph