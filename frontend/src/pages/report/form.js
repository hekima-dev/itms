import React from 'react'
import { Button } from '../../components/button'
import Card from '../../components/card'
import Form from '../../components/form'
import Graph from '../../components/graph'
import { Select, TextField } from '../../components/input'
import { can, formatText, getUserInfo, isAdmin } from '../../helpers'
import toast from '../../helpers/toast'



const ReportForm = React.memo((props) => {
    const { reducer: { state, dispatch }, api, handleInputChange } = props.application

    React.useEffect(() => {
        if (can('create_report')) {
            document.title = "ITMS | Create report"
            mount()
        }
        else
            props.history.push('/404')

        return () => {
            dispatch({ type: 'startDate', value: { startDate: '' } })
            dispatch({ type: 'branch', value: { branch: '' } })
            dispatch({ type: 'branches', value: { branches: [] } })
            dispatch({ type: 'temperature', value: { temperature: [] } })
        }
        // eslint-disable-next-line
    }, [])

    async function mount() {
        try {
            dispatch({ type: 'loading', value: { loading: true } })
            const response = await api.get(
                {
                    route: 'list-all',
                    parameters: `schema=branch&condition=${isAdmin ? {} : JSON.stringify({ employee: getUserInfo('_id') })}&sort=${JSON.stringify({ name: 1 })}`
                }
            )

            if (response.success)
                dispatch({ type: 'branches', value: { branches: response.message } })
            else
                toast(response.message)

            dispatch({ type: 'loading', value: { loading: false } })

        } catch (error) {
            if (error instanceof Error)
                toast(error.message)
            else
                console.error(error)
            dispatch({ type: 'loading', value: { loading: false } })
        }
    }

    function validateForm(event) {
        try {
            event.preventDefault()
            const errors = []

            if (state.startDate.trim() === '') {
                errors.push('')
                dispatch({ type: 'startDateError', value: { startDateError: 'Date is required' } })
            }

            if (state.branch.trim() === '') {
                errors.push('')
                dispatch({ type: 'branchError', value: { branchError: 'Branch is required' } })
            }

            if (errors.length === 0)
                generateReport()

        } catch (error) {
            if (error instanceof Error)
                toast(error.message)
            else
                console.error(error)
        }
    }

    async function generateReport() {
        try {

            dispatch({ type: 'loading', value: { loading: true } })

            const condition = JSON.stringify({
                branch: state.branch,
                createdAt: { $gte: new Date(state.startDate).setHours(0, 0, 0, 0), $lte: new Date(state.startDate).setHours(24, 24, 24, 24) }
            })

            const response = await api.get(
                {
                    route: 'list-all',
                    parameters: `schema=temperature&condition=${condition}&sort=${JSON.stringify({ createdAt: 1 })}`
                }
            )

            if (response.success)
                dispatch({ type: 'temperature', value: { temperature: response.message } })
            else {
                toast(response.message)
                dispatch({ type: 'temperature', value: { temperature: [] } })

            }

            dispatch({ type: 'loading', value: { loading: false } })

        } catch (error) {
            if (error instanceof Error)
                toast(error.message)
            else
                console.error(error)
            dispatch({ type: 'loading', value: { loading: false } })
        }
    }


    const renderBranches = React.useCallback(() => {
        try {
            return (
                state.branches.map((branch, index) => (
                    <option key={index} value={branch._id}>
                        {formatText(branch.name)}
                    </option>
                ))
            )
        } catch (error) {
            if (error instanceof Error)
                toast(error.message)
            else
                console.error(error)
        }
    }, [state.branches])

    return (
        <div className='row'>
            {
                state.temperature.length > 0
                    ? <div className='col s12 m10 l10 offset-m1 offset-l1 '>
                        <Card>
                            <Graph temperature={state.temperature} />
                        </Card>
                    </div>

                    : null
            }
            <div className='col s12 m10 l10 offset-m1 offset-l1'>
                <Card title="Create report">
                    <Form onSubmit={validateForm}>
                        <div className='row'>
                            <div className='col s12 m6 l6'>
                                <Select name="branch" value={state.value} error={state.branchError} onChange={handleInputChange} label="Branch" icon="account_tree" >
                                    <option value=""> Select branch</option>
                                    {renderBranches()}
                                </Select>
                            </div>
                            <div className='col s12 m6 l6'>
                                <TextField
                                    icon="event"
                                    name="startDate"
                                    value={state.startDate}
                                    error={state.startDateError}
                                    onChange={handleInputChange}
                                    type='date'
                                    max={new Date().toISOString().substring(0, 10)}
                                />
                            </div>
                        </div>
                        <div className='card-content center'>
                            <Button
                                title="Create report"
                                loading={state.loading}
                                disabled={state.disabled}
                                onClick={validateForm}
                            />
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    )
})

export default ReportForm