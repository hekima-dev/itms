import React from 'react'
import { FloatingButton } from '../../components/button'
import Card from '../../components/card'
import Table from '../../components/table'

const Roles = React.memo((props) => {
    return (
        <div className='row'>
            <div className='col s12 m10 l8 offset-l2 offset-m1'>
                <Card title="Roles">
                    <Table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th className='center'>Name</th>
                                <th className='center'>Created By</th>
                                <th className='center'>Updated By</th>
                                <th className='center'>Action</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </Table>
                </Card>
            </div>
            <FloatingButton icon="add_circle" link="/role-form" title="Create role" />
        </div>
    )
})

export default Roles