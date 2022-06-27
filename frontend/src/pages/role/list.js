import React from 'react'
import { ActionButton, FloatingButton } from '../../components/button'
import Card from '../../components/card'
import Table from '../../components/table'
import { can, formatText } from '../../helpers'
import toast from '../../helpers/toast'

const Roles = React.memo((props) => {

    const { reducer: { state, dispatch }, api } = props.application

    React.useEffect(() => {
        if (can('list_role')) {
            document.title = 'ITMS | Roles'
            mount()
        }
        else
            props.history.push('/404')

        return () => {
            dispatch({ type: 'roles', value: { roles: [] } })
        }
        // eslint-disable-next-line
    }, [])

    async function mount() {
        try {
            dispatch({ type: 'loading', value: { loading: true } })
            const condition = JSON.stringify({})
            const sort = JSON.stringify({ name: 1 })
            const parameters = `schema=role&condition=${condition}&sort=${sort}`
            const response = await api.get({
                route: 'list-all',
                parameters,
            })

            if (response.success)
                dispatch({ type: 'roles', value: { roles: response.message } })
            else
                toast(response.message)

            dispatch({ type: 'loading', value: { loading: false } })

        } catch (error) {
            if (error instanceof Error)
                console.log(error.message)
            else
                console.error(error)
            dispatch({ type: 'loading', value: { loading: false } })
        }
    }

    const renderRoles = React.useCallback(() => {
        try {
            return (
                state.roles.map((role, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td className='center'>
                            {formatText(role.name)}
                        </td>
                        <td className='center'>
                            {
                                role.permissions.length === 15
                                    ? 'All'
                                    : `${role.permissions.length} of 15`
                            }
                        </td>
                        <td className='center'>
                            {
                                role.created_by
                                    ? formatText(role.created_by.username)
                                    : 'N/A'
                            }
                        </td>
                        <td className='center'>
                            {
                                role.updated
                                    ? formatText(role.created_by.username)
                                    : 'N/A'
                            }
                        </td>
                        {
                            can('edit_role') || can('delete_role')
                                ?
                                <td className='center'>
                                    <div className='action-btn'>
                                        {
                                            can('edit_role')
                                                ? <ActionButton icon="edit" styles="blue white-text" link={{
                                                    pathname: '/role/form',
                                                    state: { role }
                                                }}
                                                    title="Edit role"
                                                />
                                                : null
                                        }
                                        {
                                            can('delete_role')
                                                ? <ActionButton icon="delete" styles="red white-text"
                                                    onClick={() => deleteRole(role._id)}
                                                    title="Delete role"
                                                    link="#"
                                                />
                                                : null
                                        }
                                    </div>
                                </td>
                                : null
                        }
                    </tr>
                ))
            )
        } catch (error) {
            if (error instanceof Error)
                toast(error.message)
            else
                console.error(error)
        }
        // eslint-disable-next-line
    }, [state.roles])

    async function deleteRole(id) {
        try {
            const condition = JSON.stringify({ _id: id })
            const parameters = `schema=role&condition=${condition}`
            const response = await api.delete({
                route: 'delete',
                parameters
            })

            if (response.success) {
                toast('Role has been deleted')
                dispatch({ type: 'roles', value: { roles: state.roles.filter(role => role._id !== id) } })
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
            <div className='col s12 m12 l10 offset-l1'>
                <Card title="Roles">
                    <Table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th className='center'>Name</th>
                                <th className='center'>Permissions</th>
                                <th className='center'>Created By</th>
                                <th className='center'>Updated By</th>
                                {
                                    can('edit_role') || can('delete_role')
                                        ? < th className='center'>Action</th>
                                        : null
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {renderRoles()}
                        </tbody>
                    </Table>
                </Card>
            </div>
            {
                can('create_role')
                    ? <FloatingButton icon="add_circle" link="/role/form" title="Create role" />
                    : null
            }

        </div>
    )
})

export default Roles