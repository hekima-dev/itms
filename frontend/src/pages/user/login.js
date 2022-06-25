/* require modules */
import React from 'react'
import { Button } from '../../components/button'
import Card from '../../components/card'
import Form from '../../components/form'
import { TextField } from '../../components/input'
import toast from '../../helpers/toast'

/* create a function component */
const Login = React.memo((props) => {

    /* destructure  required functions */
    const { reducer: { state, dispatch }, handleInputChange, api, createOrRemoveSession } = props.application

    /* component mounting and unmounting */
    React.useEffect(() => {
        document.title = 'ITMS | Login'

        return () => {
            dispatch({ type: 'account', value: { account: '' } })
            dispatch({ type: 'password', value: { password: '' } })
        }
        // eslint-disable-next-line
    }, [])

    /* form validation */
    function validateForm(event) {
        try {

            /* prevent form default submit */
            event.preventDefault()

            /* errors store */
            const errors = []

            if (state.account.trim() === '') {
                errors.push('')
                dispatch({ type: 'accountError', value: { accountError: 'Username or phone number is required' } })
            }

            if (state.password === '') {
                errors.push('')
                dispatch({ type: 'passwordError', value: { passwordError: 'Password required' } })
            }
            else if (state.password.length < 4) {
                errors.push('')
                dispatch({ type: 'passwordError', value: { passwordError: 'Password must have atleast 4 characters' } })
            }

            /* verify there's no errors and submit form */
            if (errors.length === 0)
                submitForm()

        } catch (error) {
            if (error instanceof Error)
                toast(error.message)
            else
                console.error(error)
        }
    }

    /* asynchronous function to submit form */
    async function submitForm() {
        try {
            const options = {
                route: 'authenticate',
                body: {
                    schema: 'user',
                    fieldWithEncryption: 'password',
                    condition: { $or: [{ username: state.account.replace(/ /g, '_') }, { phone_number: state.account }] },
                    valueToCompareWithEncryption: state.password
                }
            }

            let response = await api.post(options)

            if (response.success)
                createOrRemoveSession('create', { key: 'user', value: response.message })
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
        <div className='container'>
            <div className='row'>
                <div className='col s12 m10 l8 offset-l2 offset-m1'>
                    <Card title="Login">
                        <Form onSubmit={validateForm}>
                            <div className='card-content'>
                                <div className='row'>
                                    <div className='col s12'>
                                        <TextField
                                            name="account"
                                            type="text"
                                            value={state.account}
                                            error={state.accountError}
                                            onChange={handleInputChange}
                                            icon="account_circle"
                                            label="Account"
                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col s12'>
                                        <TextField
                                            name="password"
                                            type="password"
                                            value={state.password}
                                            error={state.passwordError}
                                            onChange={handleInputChange}
                                            icon="lock"
                                            label="Password"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='card-action center'>
                                <Button
                                    type="submit"
                                    title="login"
                                    loading={state.loading}
                                    disabled={state.disabled}
                                    onClick={validateForm}
                                />
                            </div>
                        </Form>
                    </Card>
                </div>
            </div>
        </div>
    )
})

/* export memorized Login component */
export default Login