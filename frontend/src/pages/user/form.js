import React from 'react'
import { Button, FloatingButton } from '../../components/button'
import Card from '../../components/card'
import Form from '../../components/form'
import { Select, TextField } from '../../components/input'
import { can, formatText, getUserInfo, isAdmin } from '../../helpers'
import toast from '../../helpers/toast'

const UserForm = React.memo((props) => {
    const { reducer: { state, dispatch }, handleInputChange, api } = props.application

    const mount = async () => {
        try {
            dispatch({ type: 'loading', value: { loading: true } })
            const condition = JSON.stringify({})
            const sort = JSON.stringify({ name: 1 })
            const parameters = `schema=role&condition=${condition}&sort=${sort}`
            const response = await api.get({
                route: 'list-all',
                parameters
            })

            if (response.success)
                dispatch({ type: 'roles', value: { roles: response.message } })
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

    React.useEffect(() => {
        const path = (props.location.pathname === '/user/profile') || (props.location.pathname === '/')
        if (can('edit_user') || can('create_user') || path) {
            mount()
            if (props.location.state) {
                document.title = 'ITMS | Edit user'
                const { user } = props.location.state
                dispatch({ type: 'edit', value: { edit: true } })
                dispatch({ type: 'id', value: { id: user._id } })
                dispatch({ type: 'username', value: { username: formatText(user.username) } })
                dispatch({ type: 'phone', value: { phone: user.phone_number } })
                dispatch({ type: 'role', value: { role: user.role ? user.role._id : '' } })
            }
            else if (path) {
                document.title = 'ITMS | Edit profile'
                const  user  = getUserInfo()
                dispatch({ type: 'edit', value: { edit: true } })
                dispatch({ type: 'id', value: { id: user._id } })
                dispatch({ type: 'username', value: { username: formatText(user.username) } })
                dispatch({ type: 'phone', value: { phone: user.phone_number } })
                dispatch({ type: 'role', value: { role: user.role ? user.role._id : '' } })
            }
            else
                document.title = 'ITMS | Create user'
        }
        else
            props.history.push('/404')

        return () => {
            dispatch({ type: 'edit', value: { edit: false } })
            dispatch({ type: 'id', value: { id: '' } })
            dispatch({ type: 'username', value: { username: '' } })
            dispatch({ type: 'role', value: { role: '' } })
            dispatch({ type: 'password', value: { password: '' } })
            dispatch({ type: 'passwordConfirmation', value: { passwordConfirmation: '' } })
            dispatch({ type: 'phone', value: { phone: '' } })
            dispatch({ type: 'roles', value: { roles: [] } })
        }
        // eslint-disable-next-line
    }, [])

    const renderRoles = React.useCallback(() => {
        return (
            state.roles.map((role, index) => (
                <option key={index} value={role._id}>
                    {formatText(role.name)}
                </option>
            ))
        )
    }, [state.roles])

    async function validateUniqueFields(field) {
        try {
            if (state[field].trim() !== '' && state[`${field}Error`].trim() === '') {
                dispatch({ type: 'disabled', value: { disabled: true } })
                const options = {
                    route: 'validate',
                    parameters: `schema=user&validationType=${state.edit ? 'onUpdate' : 'onCreate'}&documentId=${state.id}&condition=${JSON.stringify(field === 'phone' ? { phone_number: state.phone } : { username: formatText(state.username, 'format') })
                        }`
                }
                const response = await api.get(options)

                if (response.success)
                    dispatch({ type: `${field}Error`, value: { [`${field}Error`]: `${field === 'phone' ? 'Phone number' : 'Username'} already exist` } })

                dispatch({ type: 'disabled', value: { disabled: false } })

            }
        } catch (error) {
            if (error instanceof Error)
                toast(error.message)
            else
                console.error(error)
        }
    }

    function validateForm(event) {
        try {
            event.preventDefault()
            const errors = []

            if (state.username.trim() === '') {
                errors.push('')
                dispatch({ type: 'usernameError', value: { usernameError: 'Username is required' } })
            }

            if (state.phone.trim() === '') {
                errors.push('')
                dispatch({ type: 'phoneError', value: { phoneError: 'Phone number is required' } })
            }
            else if (state.phone.length !== 10) {
                errors.push('')
                dispatch({ type: 'phoneError', value: { phoneError: 'Phone number must have 10 numbers' } })
            }

            if (!state.edit) {
                if (state.password === '') {
                    errors.push('')
                    dispatch({ type: 'passwordError', value: { passwordError: 'Password is required' } })
                }
                else if (state.password.length < 4) {
                    errors.push('')
                    dispatch({ type: 'passwordError', value: { passwordError: 'Password must have atleast 4 character' } })
                }

                if (state.password.length >= 4) {
                    if (state.passwordConfirmation === '') {
                        errors.push('')
                        dispatch({ type: 'passwordConfirmationError', value: { passwordConfirmationError: 'Password confirmation is required' } })
                    }
                    else if (state.password !== state.passwordConfirmation) {
                        errors.push('')
                        dispatch({ type: 'passwordConfirmationError', value: { passwordConfirmationError: 'Password doesn\'t match' } })
                    }
                }
            }

            if (!isAdmin && state.role.trim() === '') {
                errors.push('error')
                dispatch({ type: 'roleError', value: { roleError: 'Role is required' } })
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
                            schema: 'user',
                            condition: { _id: state.id },
                            newDocumentData: {
                                username: formatText(state.username, "format"),
                                phone_number: state.phone,
                                role: state.role.trim() === '' ? null : state.role,
                                updated_by: getUserInfo('_id')
                            }
                        }
                    }
                )
                : await api.post(
                    {
                        route: 'create-field-encryption',
                        body: {
                            schema: 'user',
                            password: state.password,
                            fieldToEncrypt: 'password',
                            username: formatText(state.username, "format"),
                            phone_number: state.phone,
                            role: state.role.trim() === '' ? null : state.role,
                            created_by: getUserInfo('_id')
                        }
                    }
                )
            if (response.success) {
                if (getUserInfo('_id') === state.id)
                    sessionStorage.setItem('user', JSON.stringify(response.message))
                props.history.push('/user/list')
                toast(state.edit ? 'User has been updated' : 'User has been created')
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

    return (
        <div className='row'>
            <div className='col s12 m10 l8 offset-l2 offset-m1'>
                <Card title={state.edit ? 'Edit user' : 'Create user'}>
                    <Form onSubmit={validateForm}>
                        <div className='card-content'>
                            <div className='row'>
                                <div className='col s12 m6 l6'>
                                    <TextField
                                        name="username"
                                        type="text"
                                        value={state.username}
                                        error={state.usernameError}
                                        onChange={handleInputChange}
                                        label="Username"
                                        onBlur={() => validateUniqueFields('username')}
                                        icon="person"
                                    />
                                </div>
                                <div className='col s12 m6 l6'>
                                    <TextField
                                        name="phone"
                                        type="number"
                                        value={state.phone}
                                        error={state.phoneError}
                                        onChange={handleInputChange}
                                        label="Phone number"
                                        onBlur={() => validateUniqueFields('phone')}
                                        icon="phone_iphone"
                                    />
                                </div>
                            </div>
                            {
                                !state.edit
                                    ?
                                    <div className='row'>
                                        <div className='col s12 m6 l6'>
                                            <TextField
                                                name="password"
                                                type="password"
                                                value={state.password}
                                                error={state.passwordError}
                                                onChange={handleInputChange}
                                                label="Password"
                                                icon="lock"
                                            />
                                        </div>
                                        <div className='col s12 m6 l6'>
                                            <TextField
                                                name="passwordConfirmation"
                                                type="password"
                                                value={state.passwordConfirmation}
                                                error={state.passwordConfirmationError}
                                                onChange={handleInputChange}
                                                label="Confirm password"
                                                icon="autorenew"
                                            />
                                        </div>
                                    </div>
                                    : null
                            }
                            {
                                isAdmin && (getUserInfo('_id') !== state.id)
                                    ?
                                    <div className='row'>
                                        <div className='col s12'>
                                            <Select icon="task" label="Role" value={state.role} name="role" onChange={handleInputChange} error={state.roleError} >
                                                <option value="">Select user role</option>
                                                {renderRoles()}
                                            </Select>
                                        </div>
                                    </div>
                                    : null
                            }
                        </div>
                        <div className='card-action center'>
                            <Button
                                title={state.edit ? 'update user' : 'create user'}
                                loading={state.loading}
                                disabled={state.disabled}
                                onClick={validateForm}
                            />
                        </div>
                    </Form>
                </Card>
            </div>
            {
                can('list_user')
                    ? <FloatingButton
                        icon="list_alt"
                        link="/user/list"
                        title="List users"
                    />
                    : null
            }
        </div>
    )
})

export default UserForm