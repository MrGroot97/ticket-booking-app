import { Tabs } from 'antd'
import TheaterTable from './TheaterTable'

const index = () => {

    const tabItems = [
        {
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
