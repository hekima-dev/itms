import React from 'react'
import Card from '../../components/card'
import Graph from '../../components/graph'
import Panel from '../../components/panel'
import { can, getUserInfo, isAdmin } from '../../helpers'
import toast from '../../helpers/toast'

const Dashboard = React.memo((props) => {
    const { reducer: { state, dispatch }, api } = props.application

    React.useEffect(() => {
        if (can('view_dashboard')) {
            document.title = "ITMS | Dashboard"
            mount()
        }
        else
            props.history.push('/404')

        return () => {
            dispatch({ type: 'users', value: { users: [] } })
            dispatch({ type: 'branches', value: { branches: [] } })
            dispatch({ type: 'roles', value: { roles: [] } })
            dispatch({ type: 'temperature', value: { temperature: [] } })
        }
        // eslint-disable-next-line
    }, [])

    async function mount() {
        try {
            const tempCondition = { createdAt: { $gte: new Date().setHours(0, 0, 0, 0), $lte: new Date().setHours(24, 24, 24, 24) } }
            dispatch({ type: 'loading', value: { loading: true } })
            const queries = JSON.stringify([
                { schema: 'user', condition: { role: { $ne: null } }, sort: { createdAt: -1 } },
                { schema: 'role', condition: {}, sort: { createdAt: -1 } },
                { schema: 'temperature', condition: isAdmin ?  { ...tempCondition} : {...tempCondition, employee: getUserInfo('_id')}, sort: { createdAt: -1 } },
                { schema: 'branch', condition: {}, sort: { createdAt: -1 } }
            ])

            const response = await api.get(
                {
                    route: 'bulk-list-all',
                    parameters: `queries=${queries}`
                }
            )

            if (response.success) {
                const { passedQueries: { users, roles, branches, temperatures } } = response.message
                dispatch({ type: 'users', value: { users } })
                dispatch({ type: 'roles', value: { roles } })
                dispatch({ type: 'branches', value: { branches } })
                dispatch({ type: 'temperature', value: { temperature: temperatures } })
            }

            dispatch({ type: 'loading', value: { loading: false } })
        } catch (error) {
            if (error instanceof Error)
                toast(error.message)
            else
                console.error(error)
        }
    }

    return (
        <div className='row'>
            <div className='col s12'>
                <div className='row'>
                    <div className='col s12 m4 l3'>
                        <Panel icon="task" link="/role/list" title="roles" value={state.roles.length} />
                    </div>
                    <div className='col s12 m4 l3'>
                        <Panel icon="groups" link="/user/list" title="Users" value={state.users.length} />
                    </div>
                    <div className='col s12 m4 l3'>
                        <Panel icon="account_tree" link="/branch/list" title="branches" value={state.branches.length} />
                    </div>
                    <div className='col s12 m4 l3'>
                        <Panel icon="thermostat" link="/temperature/list" title="temperature" value={state.temperature.length} />
                    </div>
                </div>
                <div className='row'>
                    <div className='col s12 m10 l10 offset-l1 offset-m1'>
                        <Card title="Temperature Analysis">
                            <Graph temperature={state.temperature} />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default Dashboard