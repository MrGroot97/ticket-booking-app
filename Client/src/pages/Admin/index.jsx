import { Tabs } from 'antd'
import Movielist from './Movielist'
import TheaterTable from './TheaterTable'

// Admin can do all crud operations on movies
const index = () => {
    const tabItems = [
        {
            key: 'movies',
            label: 'Movies',
            children: <Movielist />
        },{
            key: 'theaters',
            label: 'Theaters',
            children: <TheaterTable />
        }
    ]
    return (
        <div>
            <Tabs items={tabItems} />
        </div>
    )
}

export default index
