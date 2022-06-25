import React from 'react'
import { Button } from '../../components/button'
import Card from '../../components/card'
import Form from '../../components/form'
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
            dispatch({ type: 'endDate', value: { endDate: '' } })
            dispatch({ type: 'branches', value: { branches: [] } })
            dispatch({ type: 'branch', value: { branch: '' } })
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

            console.log(response)

            if (response.success)
                dispatch({ type: 'branches', value: { branches: response.message } })
            else
                toast(response.messge)

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
                dispatch({ type: 'startDateError', value: { startDateError: 'Start date and time is required' } })
            }

            if (state.branch.trim() === '') {
                errors.push('')
                dispatch({ type: 'branchError', value: { branchError: 'Branch is required' } })
            }

            if (state.endDate.trim() === '') {
                errors.push('')
                dispatch({ type: 'endDateError', value: { endDateError: 'End date and time is required' } })
            }
            else if (new Date(state.endDate) < new Date(state.startDate)) {
                errors.push('')
                dispatch({ type: 'endDateError', value: { endDateError: 'End date is less than start date' } })
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
                createdAt: { $gte: new Date(state.startDate), $lte: new Date(state.endDate) }
            })

            const response = await api.get(
                {
                    route: 'list-all',
                    parameters: `schema=temperature&condition=${condition}&sort=${JSON.stringify({ createdAt: 1 })}`
                }
            )

            if (response.success)
                console.log(response.message)
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
            <div className='col s12 m10 l8 offset-m1 offset-l2'>
                <Card title="Create report">
                    <Form onSubmit={validateForm}>
                        <div className='row'>
                            <div className='col s12'>
                                <Select name="branch" value={state.value} error={state.branchError} onChange={handleInputChange} label="Branch" icon="account_tree" >
                                    <option value=""> Select branch</option>
                                    {renderBranches()}
                                </Select>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col s12 m6 l6'>
                                <TextField
                                    icon="arrow_backward"
                                    name="startDate"
                                    value={state.startDate}
                                    error={state.startDateError}
                                    onChange={handleInputChange}
                                    type='datetime-local'
                                />
                            </div>
                            <div className='col s12 m6 l6'>
                                <TextField
                                    icon="arrow_forward"
                                    name="endDate"
                                    value={state.endDate}
                                    error={state.endDateError}
                                    onChange={handleInputChange}
                                    type='datetime-local'
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