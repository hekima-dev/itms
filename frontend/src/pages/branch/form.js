import React from 'react'
import { Button, FloatingButton } from '../../components/button'
import Card from '../../components/card'
import Form from '../../components/form'
import { Select, TextField } from '../../components/input'
import { can, formatText, getUserInfo } from '../../helpers'
import toast from '../../helpers/toast'

const BranchForm = React.memo((props) => {
    const { reducer: { state, dispatch }, handleInputChange, api } = props.application

    React.useEffect(() => {
        if (can('create_branch') || can('edit_branch')) {
            mount()
            if (props.location.state) {
                document.title = 'ITMS | Edit branch'
                const { branch } = props.location.state

                dispatch({ type: 'edit', value: { edit: true } })
                dispatch({ type: 'id', value: { id: branch._id } })
                dispatch({ type: 'branchName', value: { branchName: formatText(branch.name )} })
                dispatch({ type: 'branchId', value: { branchId: branch.identification } })
                dispatch({ type: 'user', value: { user: branch.employee._id } })
            }
            else
                document.title = 'ITMS | Create branch'
        }
        else
            props.history.push('/404')

        return () => {
            dispatch({ type: 'edit', value: { edit: false } })
            dispatch({ type: 'id', value: { id: '' } })
            dispatch({ type: 'branchName', value: { branchName: '' } })
            dispatch({ type: 'branchId', value: { branchId: 0 } })
            dispatch({ type: 'user', value: { user: '' } })
        }
        // eslint-disable-next-line
    }, [])

    async function mount() {
        try {

            dispatch({ type: 'loading', value: { loading: true } })

            const response = await api.get(
                {
                    route: 'list-all',
                    parameters: `schema=user&condition=${JSON.stringify({ role: { $ne: null } })}&sort=${JSON.stringify({ username: 1 })}`
                }
            )

            if (response.success)
                dispatch({ type: 'users', value: { users: response.message } })
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

    async function validateUniqueFields(field) {
        try {
            if (state[field] && state[`${field}Error`].trim() === '') {
                dispatch({ type: 'disabled', value: { disabled: true } })
                const options = {
                    route: 'validate',
                    parameters: `schema=branch&validationType=${state.edit ? 'onUpdate' : 'onCreate'}&documentId=${state.id}&condition=${JSON.stringify(field === 'branchId' ? { identification: state.branchId } : { name: formatText(state.branchName, 'format') })
                        }`
                }
                const response = await api.get(options)

                if (response.success)
                    dispatch({ type: `${field}Error`, value: { [`${field}Error`]: `${field === 'branchId' ? 'Branch identification number' : 'Branch name'} already exist` } })

                dispatch({ type: 'disabled', value: { disabled: false } })

            }
        } catch (error) {
            if (error instanceof Error)
                toast(error.message)
            else
                console.error(error)
            dispatch({ type: 'disabled', value: { disabled: false } })
        }
    }

    function validateForm(event) {
        try {
            event.preventDefault()

            const errors = []

            if (state.branchName.trim() === '') {
                errors.push('')
                dispatch({ type: 'branchNameError', value: { branchNameError: 'Branch name is required' } })
            }

            if (state.user.trim() === '') {
                errors.push('')
                dispatch({ type: 'userError', value: { userError: 'Branch employee is required' } })
            }

            if (Number(state.branchId) <= 0) {
                errors.push('')
                dispatch({ type: 'branchIdError', value: { branchIdError: 'Branch identification number is required' } })
            }

            if (errors.length === 0)
                submitForm()

        } catch (error) {
            if (error instanceof Error)
                toast(error.message)
            else
                console.error(error)
        }
    }

    async function submitForm() {
        try {
            const response = state.edit
                ? await api.put(
                    {
                        route: 'update',
                        body: {
                            schema: 'branch',
                            condition: { _id: state.id },
                            newDocumentData: {
                                name: formatText(state.branchName, 'format'),
                                identification: state.branchId,
                                employee: state.user,
                                updated_by: getUserInfo('_id')
                            }
                        }
                    }
                )
                : await api.post(
                    {
                        route: 'create',
                        body: {
                            schema: 'branch',
                            name: formatText(state.branchName, 'format'),
                            identification: state.branchId,
                            employee: state.user,
                            created_by: getUserInfo('_id')
                        }
                    }
                )

            if (response.success) {
                toast(state.edit ? 'Branch has been updated' : 'Branch has been created')
                props.history.push('/branch/list')
            }
            else
                toast(response.message)

        } catch (error) {
            if (error instanceof Error)
                toast(error.message)
            else
                console.error(error)
        }
    }

    const renderUsers = React.useCallback(() => {
        try {
            return (
                state.users.map((user, index) => (
                    <option key={index} value={user._id}>
                        {formatText(user.username)}
                    </option>
                ))
            )
        } catch (error) {
            if (error instanceof Error)
                toast(error.message)
            else
                console.error(error)
        }
    }, [state.users])

    return (
        <div className='row'>
            <div className='col s12 m10 l8 offset-m1 offset-l2'>
                <Card title={state.edit ? 'Edit branch' : 'Update branch'}>
                    <div className='card-content'>
                        <Form onSubmit={validateForm}>
                            <div className='row'>
                                <div className='col s12 m6 l6'>
                                    <TextField
                                        type="text"
                                        name="branchName"
                                        value={state.branchName}
                                        error={state.branchNameError}
                                        onChange={handleInputChange}
                                        label="Branch name"
                                        onBlur={() => validateUniqueFields('branchName')}
                                        icon="description"
                                    />
                                </div>
                                <div className='col s12 m6 l6'>
                                    <TextField
                                        type="number"
                                        name="branchId"
                                        value={state.branchId}
                                        error={state.branchIdError}
                                        onChange={handleInputChange}
                                        label="Branch Identification number"
                                        onBlur={() => validateUniqueFields('branchId')}
                                        icon="pin"
                                    />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col s12'>
                                    <Select
                                        name="user"
                                        value={state.user}
                                        onChange={handleInputChange}
                                        error={state.userError}
                                        label="Employee"
                                        icon="person"
                                    >
                                        <option value="">Select employee</option>
                                        {renderUsers()}
                                    </Select>
                                </div>
                            </div>
                            <div className='card-content center'>
                                <Button
                                    title={state.edit ? 'Update branch' : 'Create branch'}
                                    loading={state.loading}
                                    disabled={state.disabled}
                                    onClick={validateForm}
                                />
                            </div>
                        </Form>
                    </div>
                </Card>
            </div>
            {
                can('list_branch')
                    ? <FloatingButton
                        title="List branches"
                        icon="list_alt"
                        link="/branch/list"
                    />
                    : null
            }
        </div>
    )
})

export default BranchForm