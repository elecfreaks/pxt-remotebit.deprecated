#ifndef REMOTEBIT_SERVICE_H
#define REMOTEBIT_SERVICE_H

#include "MicroBitConfig.h"
#include "MicroBitThermometer.h"
#include "EventModel.h"
#include "pxt.h"

#define MICROBIT_ID_REMOTEBIT       2300
#define MICROBIT_REMOTEBIT_EVT_RX   60

#define REMOTEBIT_DATA_LENGTH       20

// UUIDs for our service and characteristics
extern const uint8_t RemoteBitServiceUUID[];
extern const uint8_t RemoteBitRxCharacteristicUUID[];
extern const uint8_t RemoteBitTxCharacteristicUUID[];


//================================================================
#if MICROBIT_CODAL
//================================================================

#include "MicroBitBLEManager.h"
#include "MicroBitBLEService.h"

class RemoteBitService : public MicroBitBLEService
{
public:
    /**
     * Constructor.
     * Create a representation of the RemoteBitService
     * @param _ble The instance of a BLE device that we're running on.
     */
    RemoteBitService(BLEDevice &_ble);

    /**
     * Writes data
     */
    void write(const uint8_t *data, uint8_t len);

    /**
     * Read data
     */
    uint8_t read(uint8_t *data);

private:
    // Bluetooth stack we're running on.
    BLEDevice &ble;

    // memory for buffers.
    uint8_t rxBuffer[REMOTEBIT_DATA_LENGTH];
    uint8_t txBuffer[REMOTEBIT_DATA_LENGTH];

    // received bytes
    uint8_t receivedBytes;

    // Index for each charactersitic in arrays of handles and UUIDs
    typedef enum mbbs_cIdx
    {
        mbbs_cIdxRX,
        mbbs_cIdxTX,
        mbbs_cIdxCOUNT
    } mbbs_cIdx;

    // UUIDs for our service and characteristics
    static const uint8_t service_base_uuid[16];
    static const uint8_t char_base_uuid[16];
    static const uint16_t serviceUUID;
    static const uint16_t charUUID[mbbs_cIdxCOUNT];

    // Data for each characteristic when they are held by Soft Device.
    MicroBitBLEChar chars[mbbs_cIdxCOUNT];

    /**
     * Callback. Invoked when any of our attributes are written via BLE.
     */
    void onDataWritten(const microbit_ble_evt_write_t *params);

public:
    int characteristicCount() { return mbbs_cIdxCOUNT; };
    MicroBitBLEChar *characteristicPtr(int idx) { return &chars[idx]; };
};

//================================================================
#else // MICROBIT_CODAL
//================================================================

#include "ble/BLE.h"

class RemoteBitService
{
public:
    /**
     * Constructor.
     * Create a representation of the RemoteBitService
     * @param _ble The instance of a BLE device that we're running on.
     */
    RemoteBitService(BLEDevice &_ble);

    /**
     * Writes data
     */
    void write(const uint8_t *data, uint8_t len);

    /**
     * Read data
     */
    uint8_t read(uint8_t *data);

private:
    // Bluetooth stack we're running on.
    BLEDevice &ble;

    // memory for buffers.
    uint8_t rxBuffer[REMOTEBIT_DATA_LENGTH];
    uint8_t txBuffer[REMOTEBIT_DATA_LENGTH];

    // received bytes
    uint8_t receivedBytes;

    // Handles to access each characteristic when they are held by Soft Device.
    GattAttribute::Handle_t rxCharacteristicHandle;
    GattAttribute::Handle_t txCharacteristicHandle;

    void onDataWritten(const GattWriteCallbackParams *params);
};

//================================================================
#endif // MICROBIT_CODAL
//================================================================

#endif
