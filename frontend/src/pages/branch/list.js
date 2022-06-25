import React from 'react'
import { ActionButton, FloatingButton } from '../../components/button'
import Card from '../../components/card'
import Table from '../../components/table'
import { can, formatText, getUserInfo, isAdmin } from '../../helpers'
import toast from '../../helpers/toast'

const BranchList = React.memo((props) => {
    const { reducer: { state, dispatch }, api } = props.application

    React.useEffect(() => {
        if (can('list_branch')) {
            document.title = 'ITMS | Branches'
            mount()
        }
        else
            props.history.push('/404')

        return () => {
            dispatch({ type: 'branches', value: { branches: []}})
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
        }
    }

    async function deleteBranch(id) {
        try {
            const condition = JSON.stringify({ _id: id })
            const parameters = `schema=branch&condition=${condition}`
            const response = await api.delete({
                route: 'delete',
                parameters
            })

            if (response.success) {
                toast('Branch has been deleted')
                dispatch({ type: 'branches', value: { branches: state.branches.filter(branch => branch._id !== id) } })
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

    const renderBranches = React.useCallback(() => {
        try {
            return (
                state.branches.map((branch, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td className='center'>{formatText(branch.name)}</td>
                        <td className='center'>{branch.identification}</td>
                        <td className='center'>{formatText(branch.employee?.username)}</td>
                        <td className='center'>{formatText(branch.created_by?.username)}</td>
                        <td className='center'>{branch.updated_by ? formatText(branch.updated_by.username) : 'N/A'}</td>
                        <td className='center'>
                            <div className='action-btn'>
                                <ActionButton icon="edit" styles="blue white-text" link={{
                                    pathname: '/branch/form',
                                    state: { branch }
                                }}
                                    title="Edit branch"
                                />
                                <ActionButton icon="delete" styles="red white-text"
                                    onClick={() => deleteBranch(branch._id)}
                                    title="Delete branch"
                                    link="#"
                                />
                            </div>
                        </td>
                    </tr>
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
            <div className='col s12'>
                <Card title="Branches">
                    <Table>
                        <thead>
                            <tr>
                                <th>no</th>
                                <th className='center'>name</th>
                                <th className='center'>identification</th>
                                <th className='center'>employee</th>
                                <th className='center'>created by</th>
                                <th className='center'>updated by</th>
                                <th className='center'>action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderBranches()}
                        </tbody>
                    </Table>
                </Card>
            </div>
            {
                can('create_branch')
                    ? <FloatingButton
                        title="Create branch"
                        link="/branch/form"
                        icon="add_circle"
                    />
                    : null
            }
        </div>
    )
})

export default BranchList