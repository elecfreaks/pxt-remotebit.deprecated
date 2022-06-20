/**
 * Send component enum.
 */
enum SendComponent {
    //% block="Speed"
    Speed = 100,
    //% block="Distance"
    Distance,
}

/**
 * Received component enum.
 */
enum ReceivedComponent {
    //% block="Button"
    Button = 100,
    //% block="Joystick"
    Joystick,
}

/**
 * Component ID.
 */
enum ComponentID {
    ID0 = 0,
    ID1,
    ID2,
    ID3,
    ID4,
    ID5,
    ID6,
    ID7,
    ID8,
    ID9,
    ID10,
    ID11,
    ID12,
    ID13,
    ID14,
    ID15,
}

const MICROBIT_ID_REMOTEBIT = 2300;
const MICROBIT_REMOTEBIT_EVT_RX = 60;

/**
 * Supports for remote:bit service.
 */
//% weight=50 icon="\uf10b" color=#36C2F9
namespace remotebit {
    const onReceivedValuesHandlers: { [key: string]: (values: number[]) => void } = { }
    const onReceivedBufferHandlers: { [key: string]: (buffer: Buffer) => void } = {}

    /**
     * Starts remote:bit.
     */
    //% blockId=remotebit_start block="remotebit start"
    //% weight=90 blockGap=8
    export function start(): void {
        startService();

        // on received buffer
        control.onEvent(MICROBIT_ID_REMOTEBIT, MICROBIT_REMOTEBIT_EVT_RX, () => {
            const buffer = readBuffer();
            if (buffer.length >= 2) {
                const component: ReceivedComponent = buffer[0];
                const id: number = buffer[1];
                const onReceivedValues = onReceivedValuesHandlers[getHandlerId(component, id)];
                const onReceivedBuffer = onReceivedBufferHandlers[getHandlerId(component, id)];
                if (onReceivedValues) {
                    const values: number[] = [];
                    for (let i = 2; i < buffer.length; i += 2) {
                        let highOctet = 0;
                        if (i + 1 < buffer.length) {
                            highOctet = buffer[i + 1];
                        }
                        const value = (highOctet << 8) | buffer[i];
                        values.push(value);
                    }
                    onReceivedValues(values);
                }
                if (onReceivedBuffer) {
                    onReceivedBuffer(buffer.slice(2, buffer.length - 2));
                }
            }
        });
    }

    /**
     * Returns true if the remote:bit is connected.
     */
    //% blockId=remotebit_isconnected block="remotebit is connected"
    //% weight=10 blockGap=8 shim=remotebit::isConnected
    export function isConnected(): boolean {
        return false;
    }

    /**
     * Sends value(s) to remote:bit component. Each value occupies 2 bytes, which is 0 to 65535.
     */
    //% blockId=remotebit_sendvalues
    //% block="remotebit|send %component %id |values %values"
    //% id.fieldEditor="gridpicker" id.fieldOptions.columns=4
    //% id.fieldOptions.tooltips="false" id.fieldOptions.width="250"
    //% weight=70 blockGap=8
    export function sendValues(component: SendComponent, id: ComponentID, values: number[]): void {
        const bytes: number[] = [];
        values.forEach(value => {
            bytes.push(value & 0xff);
            bytes.push((value >> 8) & 0xff);
        });
        bytes.unshift(id);
        bytes.unshift(component);
        const buffer = Buffer.fromArray(bytes);
        writeBuffer(buffer);
    }

    /**
     * Sends buffer(from an array) to remote:bit component.
     */
    //% blockId=remotebit_sendbufferfromarray
    //% block="remotebit|send %component %id |buffer from %bytes"
    //% id.fieldEditor="gridpicker" id.fieldOptions.columns=4
    //% id.fieldOptions.tooltips="false" id.fieldOptions.width="250"
    //% weight=90 advanced=true blockGap=8
    export function sendBufferFromArray(component: SendComponent, id: ComponentID, bytes: number[]): void {
        bytes.unshift(id);
        bytes.unshift(component);
        const buffer = Buffer.fromArray(bytes);
        writeBuffer(buffer);
    }

    /**
     * On remote:bit received values from a component.
     */
    //% blockId=remotebit_onreceivedvalues
    //% block="on remotebit|received %component %id"
    //% id.fieldEditor="gridpicker" id.fieldOptions.columns=4
    //% id.fieldOptions.tooltips="false" id.fieldOptions.width="250"
    //% weight=60 draggableParameters
    export function onReceivedValues(component: ReceivedComponent, id: ComponentID, cb: (values: number[]) => void) {
        onReceivedValuesHandlers[getHandlerId(component, id)] = cb;
    }

    /**
     * On remote:bit received buffer from a component.
     */
    //% blockId=remotebit_onreceivedbuffer
    //% block="on remotebit|received %component %id"
    //% id.fieldEditor="gridpicker" id.fieldOptions.columns=4
    //% id.fieldOptions.tooltips="false" id.fieldOptions.width="250"
    //% weight=80 advanced=true draggableParameters
    export function onReceivedBuffer(component: ReceivedComponent, id: ComponentID, cb: (buffer: Buffer) => void) {
        onReceivedBufferHandlers[getHandlerId(component, id)] = cb;
    }

    /**
     * Sets the bluetooth transmit power between 0 (minimal) and 7 (maximum).
     * @param power power level between 0 (minimal) and 7 (maximum), eg: 7.
     */
    //% weight=5 advanced=true
    //% blockId=remotebit_settransmitpower block="remotebit|set transmit power %power"
    //% power.min=0 power.max=7 shim=remotebit::setTransmitPower
    //% blockGap=8
    export function setTransmitPower(power: number) {
        return;
    }

    /**
     * Starts the remote:bit service.
     */
    //% shim=remotebit::startService
    function startService(): void {
        return;
    }

    /**
     * Remote:bit write buffer.
     */
    //% shim=remotebit::writeBuffer
    function writeBuffer(buffer: Buffer): void {
        return;
    }

    /**
     * Remote:bit read buffer.
     */
    //% shim=remotebit::readBuffer
    function readBuffer(): Buffer {
        return Buffer.create(0);
    }

    /**
     * Gets handler id from component and id.
     */
    function getHandlerId(component: ReceivedComponent, id: ComponentID) {
        return `on_${component}_${id}_received`;
    }
}
