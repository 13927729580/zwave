import zwave from './zwave'
import store from './store'
import bus, {EventEmitter} from '@theatersoft/bus'
import {log} from './log'
import {initDevices} from './actions'

export class ZWave {
    start ({name, config: {port, devices}}) {
        Object.assign(this, {name, port})
        return bus.registerObject(name, this)
            .then(() => {
                store.dispatch(initDevices(devices))
                store.on('change', state =>
                    bus.signal(`/${this.name}.change`, state))
                zwave.connect(this.port)
            })
    }

    stop () {
        return bus.unregisterObject(this.name)
            .then(() => zwave.disconnect(this.port))
    }

    send (cmd) {
        return codec.sendCommand(cmd)
    }

    dispatch (action) {
        return this.send(command(action))
            .then(() =>
                store.dispatch(action))
    }

    getState () {
        return store.getState()
    }
}