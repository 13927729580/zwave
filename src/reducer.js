import CommandClass from './CommandClass'
import {SET_VALUE, INIT_DEVICES, ADD_NODE, REMOVE_NODE, CANCEL_CMD} from './actions'
import zwave from './zwave'

const valueReducers = {
    Alarm (state, {class_id, label, value}, device) {
        if (class_id === CommandClass.Alarm && label === 'Alarm Level') return {
            ...state,
            [device.id]: {value: !!value}
        }
        return state
    }
}

export default function reducer (state, action) {
    switch (action.type) {
    case SET_VALUE:
        const device = state.devices.find(d => d.id === String(action.value.node_id))
        if (device)
            return valueReducers[device.type](state, action.value, device)
        break
    case INIT_DEVICES:
        return {...state, devices: action.devices}
    case ADD_NODE:
        zwave.addNode(true)
        return {...state, inclusion: true, exclusion: false}
    case REMOVE_NODE:
        zwave.removeNode()
        return {...state, inclusion: false, exclusion: true}
    case CANCEL_CMD:
        zwave.cancelControllerCommand()
        return {...state, inclusion: false, exclusion: false}
    }
    return state
}