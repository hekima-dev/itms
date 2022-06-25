import React from 'react'
import Card from '../../components/card'
import Table from '../../components/table'
import { can, formatText, getUserInfo, isAdmin } from '../../helpers'
import toast from '../../helpers/toast'

const TemperatureList = React.memo((props) => {
    const { reducer: { state, dispatch }, api } = props.application

    React.useEffect(() => {
        if (can('list_temperature')) {
            document.title = 'ITMS | Temperature list'
            let condition = isAdmin ? {} : { employee: getUserInfo('_id') }

            if (props.location.state) {
                const { propsCondition } = props.location.state
                condition = { ...condition, ...propsCondition }
            }

            mount(condition)
        }
        
        return () => {
            dispatch({ type: 'temperature', value: { temperature: [] } })
        }
        // eslint-disable-next-line
    }, [])

    async function mount(condition) {
        try {

            dispatch({ type: 'loading', value: { loading: true } })
            const response = await api.get(
                {
                    route: 'list-all',
                    parameters: `schema=temperature&condition=${JSON.stringify(condition)}&sort=${JSON.stringify({ createdAt: -1 })}`
                }
            )

            if (response.success)
                dispatch({ type: 'temperature', value: { temperature: response.message } })
            else
                toast(response.message)

            dispatch({ type: 'loading', value: { loading: false } })

        } catch (error) {
            if (error instanceof Error)
                toast(error.message)
            else
                console.log(error)
            dispatch({ type: 'loading', value: { loading: false } })

        }
    }

    const renderTemperature = React.useCallback(() => {
        try {
            return (
                state.temperature.map((temp, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td className='center'>{formatText(temp.branch.name)}</td>
                        <td className={temp.value > 40 ? 'red-text center' : 'center indigo-text'}>{temp.value} &#8451;</td>
                        <td className='center'>{temp.date}</td>
                        <td className='center'>{temp.time}</td>
                    </tr>
                ))
            )
        } catch (error) {
            if (error instanceof Error)
                toast(error.message)
            else
                console.log(error)
        }
    }, [state.temperature])

    return (
        <div className='row'>
            <div className='col s12 l10 offset-l1'>
                <Card title="Temperature list">
                    <Table>
                        <thead>
                            <tr>
                                <th>no</th>
                                <th className='center'>branch</th>
                                <th className='center'>temperature</th>
                                <th className='center'>date</th>
                                <th className='center'>time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTemperature()}
                        </tbody>
                    </Table>
                </Card>
            </div>
        </div>
    )
})

export default TemperatureList