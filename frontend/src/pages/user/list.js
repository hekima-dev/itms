import React from 'react'
import { ActionButton, FloatingButton } from '../../components/button'
import Card from '../../components/card'
import Table from '../../components/table'
import { can, formatText } from '../../helpers'
import toast from '../../helpers/toast'

const UserList = React.memo((props) => {
    const { reducer: { state, dispatch }, api } = props.application

    React.useEffect(() => {
        if (can('list_user')) {
            document.title = 'ITMS | Users'
            mount()
        }
        else
            props.history.push('/404')

        return () => {
            dispatch({ type: 'users', value: { users: [] } })
        }
        // eslint-disble-next-line
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

    async function deleteUser(id) {
        try {
            const condition = JSON.stringify({ _id: id })
            const parameters = `schema=user&condition=${condition}`
            const response = await api.delete({
                route: 'delete',
                parameters
            })

            if (response.success) {
                toast('User has been deleted')
                dispatch({ type: 'users', value: { users: state.users.filter(user => user._id !== id) } })
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
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td className='center'>{formatText(user.username)}</td>
                        <td className='center'>{user.phone_number}</td>
                        <td className='center'>{user.role ? formatText(user.role.name) : 'N/A'}</td>
                        <td className='center'>{formatText(user.created_by.username)}</td>
                        <td className='center'>{user.updated_by ? formatText(user.updated_by.username) : 'N/A'}</td>
                        {
                            can('edit_user') || can('delete_user')
                                ?
                                <td className='center'>
                                    <div className='action-btn'>
                                        {
                                            can('edit_user')
                                                ? <ActionButton
                                                    icon="edit"
                                                    title="Edit user"
                                                    styles="blue white-text"
                                                    link={{
                                                        pathname: '/user/form',
                                                        state: { user }
                                                    }}
                                                />
                                                : null
                                        }
                                        {
                                            can('delete_user')
                                                ? <ActionButton
                                                    link="#"
                                                    icon="delete"
                                                    title="Delete user"
                                                    styles="red white-text"
                                                    onClick={() => deleteUser(user._id)}
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
    }, [state.users])

    return (
        <div className='row'>
            <div className='col s12'>
                <Card title="Users">
                    <Table>
                        <thead>
                            <tr>
                                <th>no</th>
                                <th className='center'>username</th>
                                <th className='center'>phone number</th>
                                <th className='center'>role</th>
                                <th className='center'>created by</th>
                                <th className='center'>updated by</th>
                                <th className='center'>action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderUsers()}
                        </tbody>
                    </Table>
                </Card>
            </div>
            {
                can('create_user')
                    ?
                    <FloatingButton
                        title="Create user"
                        link="/user/form"
                        icon="add_circle"
                    />
                    : null
            }
        </div>
    )
})

export default UserList