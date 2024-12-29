/* eslint-disable react/prop-types */
import { Modal, Form, Input, Row, Col, Button, message } from 'antd'
import { updateTheatre, addTheatre } from '../../api/theatre'
import { useSelector } from 'react-redux'

const TheatreForm = ({ theater, onClose, getTheaters }) => {
    const { user } = useSelector(state => state.user)
    const onSubmit = async (values) => {
        if (theater) {
            const updatedValues = {
                ...values,
                theaterId: theater._id
            }
            const response = await updateTheatre(updatedValues)
            if (response.success) {
                getTheaters()
            } else {
                message.error(response.message)
            }
        } else {
            const response = await addTheatre({
                ...values,
                owner: user._id
            })
            if (response.success) {
                getTheaters()
            } else {
                message.error(response.message)
            }
        }
        onClose()
    }

    return (
        <Modal open={true} onCancel={onClose} footer={null} width={800} title={theater ? 'Edit Theater' : 'Add Theater'} centered>
            <Form layout='vertical' onFinish={onSubmit} initialValues={theater}>
                <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
                    <Col span={24}>
                        <Form.Item label='Theater Name' name='name'>
                            <Input placeholder='Enter the theater name' id='name' type='text' />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
                    <Col span={24}>
                        <Form.Item label='Theater Address' name='address'>
                            <Input placeholder='Enter the theater address' id='address' type='text' />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
                    <Col span={12}>
                        <Form.Item label='Email' name='email'>
                            <Input placeholder='Enter the theater email' id='email' type='email' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Phone Number' name='phone'>
                            <Input placeholder='Enter the theater phone number' id='phone' type='text' />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item style={{ textAlign: 'right' }} className='gap-2'>
                    <Button type='primary' htmlType='submit'>Submit</Button>
                    <Button type='default' onClick={onClose} className='ml-2'>Cancel</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default TheatreForm
