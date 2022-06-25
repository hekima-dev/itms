import React from 'react'
import { Button } from '../../components/button'
import Card from '../../components/card'
import Form from '../../components/form'
import { TextField } from '../../components/input'
import { getUserInfo } from '../../helpers'
import toast from '../../helpers/toast'

const UserForm = React.memo((props) => {
    const { reducer: { state, dispatch }, handleInputChange, api } = props.application

    React.useEffect(() => {
        document.title = 'ITMS | Change password'

        return () => {
            dispatch({ type: 'password', value: { password: '' } })
            dispatch({ type: 'oldPassword', value: { oldPassword: '' } })
            dispatch({ type: 'passwordConfirmation', value: { passwordConfirmation: '' } })
        }
        // eslint-disable-next-line
    }, [])

    async function validateOldPassword() {
        try {
            if (state.oldPassword !== '' && state.oldPasswordError.trim() === '' && state.oldPassword.length >= 4) {
                dispatch({ type: 'disabled', value: { disabled: true } })
                const options = {
                    route: 'validate-field-encryption',
                    parameters: `schema=user&documentId=${getUserInfo('_id')}&fieldWithEncryption=password&valueToCompareWithEncryption=${state.oldPassword}`
                }
                const response = await api.get(options)

                if (!response.success)
                    dispatch({ type: `oldPasswordError`, value: { oldPasswordError: response.message } })

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

            if (state.oldPassword === '') {
                errors.push('')
                dispatch({ type: 'oldPasswordError', value: { oldPasswordError: 'Old password is required' } })
            }

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
            const response =
            await api.put(
                {
                    route: 'change-field-encryption',
                    body: {
                        schema: 'user',
                        newValueToEncrypt: state.password,
                        fieldWithEncryption: 'password',
                        documentId: getUserInfo('_id')
                    }
                }
            )
            if (response.success) {
                toast('Password has been changed')
                dispatch({ type: 'password', value: { password: '' } })
                dispatch({ type: 'oldPassword', value: { oldPassword: '' } })
                dispatch({ type: 'passwordConfirmation', value: { passwordConfirmation: '' } })
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
                <Card title='Change password'>
                    <Form onSubmit={validateForm}>
                        <div className='card-content'>
                            <div className='row'>
                                <div className='col s12'>
                                    <TextField
                                        name="oldPassword"
                                        type="password"
                                        value={state.oldPassword}
                                        error={state.oldPasswordError}
                                        onChange={handleInputChange}
                                        label="Old password"
                                        icon="password"
                                        onBlur={validateOldPassword}
                                    />
                                </div>
                            </div>
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
                        </div>
                        <div className='card-action center'>
                            <Button
                                title="Change password"
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

export default UserForm