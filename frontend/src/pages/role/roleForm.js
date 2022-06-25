import React from 'react'
import { Button, FloatingButton } from '../../components/button'
import Card from '../../components/card'
import Form from '../../components/form'
import { TextField } from '../../components/input'
import permissions from '../../config/permissions'
import { can, formatText, getUserInfo } from '../../helpers'
import toast from '../../helpers/toast'

const RoleForm = React.memo((props) => {
    const { reducer: { state, dispatch }, handleInputChange, api } = props.application

    React.useEffect(() => {

        if (can('create_role') || can('edit_role')) {
            if (props.location.state) {
                document.title = 'ITMS | Edit role'
                const { role } = props.location.state
                dispatch({ type: 'roleName', value: { roleName: formatText(role.name) } })
                dispatch({ type: 'permissions', value: { permissions: role.permissions } })
                dispatch({ type: 'edit', value: { edit: true } })
                dispatch({ type: 'id', value: { id: role._id } })
            }
            else
                document.title = 'ITMS | Create role'

        }
        else
            props.history.push('/404')

        return () => {
            dispatch({ type: 'roleName', value: { roleName: '' } })
            dispatch({ type: 'id', value: { id: '' } })
            dispatch({ type: 'permissions', value: { permissions: [] } })
            dispatch({ type: 'edit', value: { edit: false } })
        }
        // eslint-disable-next-line
    }, [])

    async function validateRole() {
        try {
            if ((state.roleName.trim() !== '') && (state.roleNameError.trim() === '')) {

                dispatch({ type: 'disabled', value: { disabled: true } })
                const condition = JSON.stringify({ name: formatText(state.roleName, 'format') })
                const parameters = `schema=role&condition=${condition}&validationType=${state.edit ? 'onUpdate' : 'onCreate'
                    }&documentId=${state.id}`
                const options = { route: 'validate', parameters }
                const response = await api.get(options)

                if (response.success)
                    dispatch({ type: 'roleNameError', value: { roleNameError: 'Role name already exist' } })
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

    function handleCheckboxChange(event) {
        try {
            const { value } = event.target

            if (state.permissions.indexOf(value) >= 0) {
                const newPermissions = state.permissions.filter(permission => permission !== value)
                dispatch({ type: 'permissions', value: { permissions: newPermissions } })
            }
            else
                dispatch({ type: 'permissions', value: { permissions: [...state.permissions, value] } })

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

            if (state.roleName.trim() === '') {
                errors.push('')
                dispatch({ type: 'roleNameError', value: { roleNameError: 'Role name is required' } })
            }

            if (state.permissions.length === 0) {
                errors.push('')
                toast('Please check atleast one permission')
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
                            schema: 'role',
                            condition: { _id: state.id },
                            newDocumentData: {
                                name: formatText(state.roleName, 'format'),
                                permissions: state.permissions,
                                updated_by: getUserInfo('_id')
                            }
                        }
                    }
                )
                : await api.post(
                    {
                        route: 'create',
                        body: {
                            schema: 'role',
                            name: formatText(state.roleName, 'format'),
                            permissions: state.permissions,
                            created_by: getUserInfo('_id')
                        }
                    }
                )

            if (response.success) {
                props.history.push('/roles')
                toast(state.edit ? 'Role has been updated' : 'Role has been created')
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
                <Card title={state.edit ? 'Edit role' : 'Create role'}>
                    <Form onSubmit={validateForm}>
                        <div className='card-content'>
                            <div className='row'>
                                <div className='col s12'>
                                    <TextField
                                        type="text"
                                        name="roleName"
                                        value={state.roleName}
                                        onChange={handleInputChange}
                                        error={state.roleNameError}
                                        label="Role name"
                                        icon="task"
                                        onBlur={validateRole}
                                    />
                                </div>
                                <div className='row'>
                                    {
                                        permissions.map((permission, index) => {
                                            return (
                                                <div className='col s12 m4 l4' key={index}>
                                                    <Card title={permission.name}>
                                                        {
                                                            permission.permissions.map((perm, i) => {
                                                                return (
                                                                    <p key={i}>
                                                                        <label>
                                                                            <input
                                                                                name={formatText(`${perm}_${permission.name}`, 'format')}
                                                                                type="checkbox"
                                                                                value={formatText(`${perm}_${permission.name}`, 'format')}
                                                                                checked={
                                                                                    state.permissions.indexOf(formatText(`${perm}_${permission.name}`, 'format')) >= 0
                                                                                }
                                                                                onChange={handleCheckboxChange}
                                                                                className="filled-in"
                                                                            />
                                                                            <span className='permission'>
                                                                                {perm}&nbsp;{permission.name}
                                                                            </span>
                                                                        </label>
                                                                    </p>
                                                                )
                                                            })
                                                        }
                                                    </Card>
                                                </div>
                                            )
                                        })
                                    }
                                    <div className='col s12'>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='card-action center'>
                            <Button
                                title={state.edit ? 'update role' : 'create role'}
                                disabled={state.disabled}
                                loading={state.loading}
                                onClick={validateForm}
                            />
                        </div>
                    </Form>
                </Card>
            </div>
            {
                can('list_role')
                    ? <FloatingButton
                        icon="list_alt"
                        link="roles"
                        title="List roles"
                    />
                    : null
            }
        </div>
    )
})

export default RoleForm