import React from 'react'
import Chart from 'react-apexcharts'
import toast from '../helpers/toast'

const Graph = React.memo((props) => {
    const renderGraph = React.useCallback(() => {
        try {
            const minutes = []
            const categories = []
            const temperatures = props.temperature
            const currentMinute = new Date().getMinutes()
            const currentHour = new Date().getHours()

            for (let minute = 1; minute <= currentMinute; minute += 1) {
                let temp = 0
                for (let temperature of temperatures) {
                    const temperatureHour = new Date(temperature.createdAt).getHours()
                    const temperatureMinute = new Date(temperature.createdAt).getMinutes()
                    if ((temperatureHour === currentHour) && (temperatureMinute === minute)) {
                        temp = temperature.value
                    }
                }
                categories.push(temp)
                minutes.push(minute)
            }

            const options = {
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: "smooth"
                },
                xaxis: {
                    categories:  minutes,
                    title: {
                        text: `Minutes`,
                        style: {
                            color: '#242424',
                        }
                    }
                },
                yaxis: [
                    {
                        axisTicks: {
                            show: true
                        },
                        axisBorder: {
                            show: true,
                            color: '#e0e0e0'
                        },
                        labels: {
                            style: {
                                colors: '#0d47a1'
                            }
                        },
                        title: {
                            text: `Temperature`,
                            style: {
                                color: '#0d47a1',
                            }
                        }
                    },
                ],
                colors: ['#0d47a1']
            }

            const series = [
                {
                    name: "Temperature",
                    data: categories
                }
            ]

            return (
                <Chart
                    options={options}
                    series={series}
                    type="line"
                    width="100%"
                />
            )
        } catch (error) {
            if (error instanceof Error)
                toast(error.message)
            else
                console.error(error)
        }
    }, [props])

    return renderGraph()
})

export default Graph