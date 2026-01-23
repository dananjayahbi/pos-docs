# Tasks 49-52: Network, USB & Print Queue

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 03 - Receipt Generation  
> **Group:** C - Thermal Printer Integration  
> **Document:** 03 of 03  
> **Tasks Covered:** 49, 50, 51, 52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-43-48_QR-Layout-Renderer.md](02_Tasks-43-48_QR-Layout-Renderer.md)
- **→ Next Group:** [../Group-D_PDF-Email-Receipts/](../Group-D_PDF-Email-Receipts/)

---

## Document Overview

This document covers the final components of thermal printer integration: network printer support, USB printer support via WebUSB, print job queue management, and print retry logic for reliability.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 49 | Implement network printer support | Medium | 30 min |
| 50 | Implement USB printer support | High | 35 min |
| 51 | Add print job queue | Medium | 25 min |
| 52 | Add print retry logic | Medium | 20 min |

---

## Task 49: Implement Network Printer Support

### Overview
Implement network printer support for thermal printers connected via TCP/IP (Ethernet or WiFi). This allows printing to stationary network-connected thermal printers without direct USB connection.

### Dependencies
- Task 35: Create thermal printer service
- Task 48: Create ThermalPrintRenderer

### Instructions

1. **Create network printer file**
   - Create file at `frontend/lib/printing/network-printer.ts`
   - Set up TypeScript with proper exports
   - Import necessary networking libraries

2. **Define network printer class**
   - Create `NetworkPrinter` class
   - Store printer IP address and port
   - Maintain connection state
   - Handle socket communication

3. **Implement printer configuration**
   - Create `NetworkPrinterConfig` interface
   - Include IP address (required)
   - Include port (default: 9100 for RAW printing)
   - Include connection timeout
   - Include retry settings

4. **Implement connection establishment**
   - Create `connect()` method
   - Open TCP socket to printer
   - Set connection timeout (default: 5000ms)
   - Handle connection errors
   - Emit connection events

5. **Implement data sending**
   - Create `send(data: Uint8Array)` method
   - Send ESC/POS byte data over socket
   - Wait for transmission completion
   - Handle send errors
   - Track bytes sent

6. **Implement connection close**
   - Create `disconnect()` method
   - Close socket gracefully
   - Clean up resources
   - Emit disconnection events

7. **Implement print method**
   - Create `print(data: Uint8Array)` method
   - Connect if not connected
   - Send data to printer
   - Wait for completion
   - Disconnect after print (optional)
   - Return success/failure

8. **Add connection pooling**
   - Create `NetworkPrinterPool` class
   - Manage multiple printer connections
   - Keep connections alive
   - Reuse connections for efficiency
   - Handle connection limits

9. **Implement printer discovery**
   - Create `discoverNetworkPrinters()` method
   - Scan local network for printers
   - Use common printer ports (9100, 9101, 9102)
   - Return discovered printers
   - Optional: Use mDNS/Bonjour for discovery

10. **Add connection health monitoring**
    - Create `checkConnection()` method
    - Ping printer periodically
    - Detect disconnections
    - Auto-reconnect if needed
    - Emit health status events

11. **Implement error handling**
    - Handle network errors (timeout, refused)
    - Handle printer errors (out of paper, cover open)
    - Provide clear error messages
    - Log network communication errors

12. **Add print status checking**
    - Create `getStatus()` method
    - Query printer status (if supported)
    - Check paper, temperature, errors
    - Return status object

### Network Printer Architecture

```
┌────────────────────────────────────────┐
│  Frontend Application                  │
│  ┌──────────────────────────────────┐  │
│  │  NetworkPrinter Class            │  │
│  │  - connect()                     │  │
│  │  - send(data)                    │  │
│  │  - print(buffer)                 │  │
│  └──────────────────────────────────┘  │
└────────────────┬───────────────────────┘
                 │
                 │ TCP/IP Socket
                 │ (Port 9100)
                 │
┌────────────────▼───────────────────────┐
│  Network Thermal Printer               │
│  ┌──────────────────────────────────┐  │
│  │  Print Server                    │  │
│  │  (RAW TCP/IP Protocol)           │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │  ESC/POS Interpreter             │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │  Thermal Print Head              │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### Network Connection Flow

```
┌────────────────────────────────────────┐
│  1. Create Socket                      │
│     new WebSocket() or TCP client      │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  2. Connect to Printer                 │
│     IP: 192.168.1.100, Port: 9100      │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  3. Wait for Connection                │
│     Timeout: 5 seconds                 │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  4. Connection Established             │
│     Ready to send data                 │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  5. Send ESC/POS Data                  │
│     Binary data stream                 │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  6. Wait for Transmission Complete     │
│     All bytes sent                     │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  7. Close Connection (optional)        │
│     Or keep alive for next print       │
└────────────────────────────────────────┘
```

### Configuration Interface

```typescript
interface NetworkPrinterConfig {
  ip: string;                    // Printer IP address
  port: number;                  // Port (default: 9100)
  timeout: number;               // Connection timeout (ms)
  keepAlive: boolean;            // Keep connection open
  maxRetries: number;            // Connection retry attempts
  retryDelay: number;            // Delay between retries (ms)
}
```

### Common Network Printer Ports

| Port | Protocol | Usage |
|------|----------|-------|
| 9100 | RAW | Primary ESC/POS printing (most common) |
| 9101 | RAW | Secondary printer port |
| 9102 | RAW | Tertiary printer port |
| 515 | LPD | Line Printer Daemon (legacy) |
| 631 | IPP | Internet Printing Protocol |

### Network Printer Discovery

```
Discovery Process:
1. Scan local network IP range
   - Example: 192.168.1.1-254
2. For each IP, try common ports:
   - 9100, 9101, 9102
3. Attempt connection with timeout
   - Short timeout: 1-2 seconds
4. If successful, query printer info
   - Send status query command
   - Parse response for model/vendor
5. Build list of discovered printers
   - IP, port, model, status

mDNS/Bonjour Discovery:
- Service type: _pdl-datastream._tcp
- Service type: _printer._tcp
- Query local domain
- Parse service records
- Extract IP and port
```

### Network API Usage Examples

```
Create Network Printer:
  const config: NetworkPrinterConfig = {
    ip: '192.168.1.100',
    port: 9100,
    timeout: 5000,
    keepAlive: true
  }
  const printer = new NetworkPrinter(config)

Connect and Print:
  await printer.connect()
  await printer.send(receiptBuffer)
  await printer.disconnect()

Quick Print (auto-connect/disconnect):
  await printer.print(receiptBuffer)

Check Status:
  const status = await printer.getStatus()
  if (status.online && !status.paperOut) {
    await printer.print(buffer)
  }

Discover Printers:
  const printers = await discoverNetworkPrinters()
  // [{ ip: '192.168.1.100', port: 9100, model: 'EPSON TM-T20' }]

Connection Pooling:
  const pool = new NetworkPrinterPool()
  pool.addPrinter('printer1', config1)
  pool.addPrinter('printer2', config2)
  await pool.print('printer1', buffer)
```

### Error Handling

```typescript
try {
  await printer.connect()
  await printer.send(buffer)
} catch (error) {
  if (error.code === 'ETIMEDOUT') {
    // Connection timeout
    console.error('Printer not responding')
  } else if (error.code === 'ECONNREFUSED') {
    // Connection refused
    console.error('Printer not accepting connections')
  } else if (error.code === 'ENETUNREACH') {
    // Network unreachable
    console.error('Cannot reach printer network')
  } else {
    // Other error
    console.error('Print error:', error.message)
  }
}
```

### Status Response Structure

```typescript
interface PrinterStatus {
  online: boolean;
  paperOut: boolean;
  coverOpen: boolean;
  error: boolean;
  temperature: 'normal' | 'high' | 'unknown';
  errorMessage?: string;
}
```

### Expected Outcome
```
frontend/lib/printing/
└── network-printer.ts
    ├── NetworkPrinter class
    │   ├── connect()
    │   ├── disconnect()
    │   ├── send(data)
    │   ├── print(data)
    │   ├── checkConnection()
    │   └── getStatus()
    ├── NetworkPrinterPool class
    ├── NetworkPrinterConfig interface
    ├── discoverNetworkPrinters()
    └── PrinterStatus interface
```

### Verification Checklist
- [ ] Network printer file created
- [ ] NetworkPrinter class defined
- [ ] Configuration interface defined
- [ ] Connection establishment works
- [ ] Data sending works (ESC/POS bytes)
- [ ] Connection close works
- [ ] Print method works (auto-connect/disconnect)
- [ ] Connection pooling works
- [ ] Printer discovery works
- [ ] Connection health monitoring works
- [ ] Error handling comprehensive
- [ ] Status checking works
- [ ] WebSocket or TCP client integrated

---

## Task 50: Implement USB Printer Support

### Overview
Implement USB printer support using the WebUSB API to allow direct printing to USB-connected thermal printers from the browser. This enables POS terminals to print without server-side printer management.

### Dependencies
- Task 35: Create thermal printer service
- Task 48: Create ThermalPrintRenderer

### Instructions

1. **Create USB printer file**
   - Create file at `frontend/lib/printing/usb-printer.ts`
   - Set up TypeScript with proper exports
   - Import WebUSB API types

2. **Define USB printer class**
   - Create `USBPrinter` class
   - Store USB device reference
   - Maintain connection state
   - Handle USB communication

3. **Implement printer configuration**
   - Create `USBPrinterConfig` interface
   - Include vendor ID filters
   - Include interface settings
   - Include endpoint configuration

4. **Implement device selection**
   - Create `requestDevice()` method
   - Show browser USB device picker
   - Filter by vendor IDs (EPSON, BIXOLON, Star, etc.)
   - Return selected device
   - Handle user cancellation

5. **Implement device connection**
   - Create `connect(device: USBDevice)` method
   - Open USB device
   - Select configuration
   - Claim interface
   - Handle connection errors

6. **Implement data sending**
   - Create `send(data: Uint8Array)` method
   - Transfer data via OUT endpoint
   - Use bulk transfer method
   - Wait for transfer completion
   - Handle transfer errors

7. **Implement connection close**
   - Create `disconnect()` method
   - Release interface
   - Close USB device
   - Clean up resources

8. **Implement print method**
   - Create `print(data: Uint8Array)` method
   - Connect if not connected
   - Send data to printer
   - Wait for completion
   - Return success/failure

9. **Add device persistence**
   - Store selected device in local storage
   - Auto-reconnect to last used device
   - Handle device disconnection events
   - Re-request device if not found

10. **Implement printer vendor detection**
    - Create vendor ID constants
    - EPSON: 0x04b8
    - BIXOLON: 0x0416
    - Star Micronics: 0x0519
    - Citizen: 0x1D90
    - Auto-configure based on vendor

11. **Add USB event handling**
    - Listen for device connect events
    - Listen for device disconnect events
    - Emit custom events for app
    - Update UI connection status

12. **Implement error handling**
    - Handle device not found errors
    - Handle permission errors
    - Handle transfer errors
    - Provide clear error messages
    - Guide user to fix common issues

### WebUSB Architecture

```
┌────────────────────────────────────────┐
│  Browser (Chrome/Edge)                 │
│  ┌──────────────────────────────────┐  │
│  │  WebUSB API                      │  │
│  │  - navigator.usb                 │  │
│  │  - requestDevice()               │  │
│  │  - open(), claim()               │  │
│  │  - transferOut()                 │  │
│  └──────────────────────────────────┘  │
└────────────────┬───────────────────────┘
                 │
                 │ USB Protocol
                 │
┌────────────────▼───────────────────────┐
│  USB Thermal Printer                   │
│  ┌──────────────────────────────────┐  │
│  │  USB Interface                   │  │
│  │  (Bulk OUT endpoint)             │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │  ESC/POS Interpreter             │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │  Thermal Print Head              │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### USB Connection Flow

```
┌────────────────────────────────────────┐
│  1. Check WebUSB Support               │
│     if (navigator.usb)                 │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  2. Request Device                     │
│     navigator.usb.requestDevice()      │
│     Show device picker dialog          │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  3. User Selects Printer               │
│     Select from list of USB devices    │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  4. Open Device                        │
│     device.open()                      │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  5. Select Configuration               │
│     device.selectConfiguration(1)      │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  6. Claim Interface                    │
│     device.claimInterface(0)           │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  7. Ready to Send Data                 │
│     device.transferOut(endpoint, data) │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  8. Release Interface (cleanup)        │
│     device.releaseInterface(0)         │
└────────────────────────────────────────┘
```

### Configuration Interface

```typescript
interface USBPrinterConfig {
  filters: USBDeviceFilter[];    // Vendor ID filters
  configuration: number;         // USB configuration (usually 1)
  interface: number;             // Interface to claim (usually 0)
  endpoint: number;              // OUT endpoint (usually 1)
  maxPacketSize: number;         // Max transfer size
  timeout: number;               // Transfer timeout (ms)
}

interface USBDeviceFilter {
  vendorId: number;              // Vendor ID (hex)
  productId?: number;            // Product ID (optional)
  classCode?: number;            // Device class (optional)
}
```

### Vendor ID Constants

```typescript
const USB_VENDOR_IDS = {
  EPSON: 0x04b8,
  BIXOLON: 0x0416,
  STAR_MICRONICS: 0x0519,
  CITIZEN: 0x1D90,
  ZEBRA: 0x0A5F,
  TSC: 0x1203
}

const PRINTER_FILTERS: USBDeviceFilter[] = [
  { vendorId: USB_VENDOR_IDS.EPSON },
  { vendorId: USB_VENDOR_IDS.BIXOLON },
  { vendorId: USB_VENDOR_IDS.STAR_MICRONICS },
  { vendorId: USB_VENDOR_IDS.CITIZEN }
]
```

### WebUSB API Usage

```
Request Device:
┌────────────────────────────────────────┐
│  Button Click: "Select Printer"       │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  navigator.usb.requestDevice({         │
│    filters: [                          │
│      { vendorId: 0x04b8 },  // EPSON   │
│      { vendorId: 0x0416 }   // BIXOLON │
│    ]                                   │
│  })                                    │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Browser Shows Device Picker:          │
│  ┌──────────────────────────────────┐  │
│  │  Select USB Device               │  │
│  │  ○ EPSON TM-T20III (USB001)     │  │
│  │  ○ BIXOLON SRP-350 (USB002)     │  │
│  │  [Cancel]  [Connect]             │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### USB API Usage Examples

```
Check WebUSB Support:
  if (!navigator.usb) {
    console.error('WebUSB not supported')
    return
  }

Request and Connect:
  const printer = new USBPrinter()
  try {
    const device = await printer.requestDevice()
    await printer.connect(device)
    await printer.send(receiptBuffer)
  } catch (error) {
    console.error('USB print error:', error)
  }

Print with Auto-Request:
  const printer = new USBPrinter()
  await printer.print(receiptBuffer)
  // Automatically requests device if not connected

Get Paired Devices:
  const devices = await navigator.usb.getDevices()
  // Returns previously authorized devices

Listen for Connection Events:
  navigator.usb.addEventListener('connect', (event) => {
    console.log('Printer connected:', event.device)
  })
  
  navigator.usb.addEventListener('disconnect', (event) => {
    console.log('Printer disconnected:', event.device)
  })

Device Persistence:
  // Store device serial for reconnection
  localStorage.setItem('printerSerial', device.serialNumber)
  
  // Reconnect to stored device
  const devices = await navigator.usb.getDevices()
  const savedSerial = localStorage.getItem('printerSerial')
  const device = devices.find(d => d.serialNumber === savedSerial)
  if (device) {
    await printer.connect(device)
  }
```

### Error Handling

```typescript
try {
  await printer.requestDevice()
} catch (error) {
  if (error.name === 'NotFoundError') {
    // User cancelled device selection
    console.log('No device selected')
  } else if (error.name === 'SecurityError') {
    // WebUSB not allowed (HTTPS required)
    console.error('WebUSB requires HTTPS')
  } else if (error.name === 'NotSupportedError') {
    // Browser doesn't support WebUSB
    console.error('WebUSB not supported')
  } else {
    // Other error
    console.error('Device error:', error)
  }
}
```

### Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✓ Full | Version 61+ |
| Edge | ✓ Full | Version 79+ (Chromium) |
| Opera | ✓ Full | Version 48+ |
| Firefox | ✗ None | Not supported |
| Safari | ✗ None | Not supported |

### HTTPS Requirement

```
WebUSB Security Requirements:
┌────────────────────────────────────────┐
│  HTTPS Context Required                │
│  https://example.com ✓                 │
│  http://example.com ✗                  │
│  http://localhost ✓ (exception)        │
│  http://127.0.0.1 ✓ (exception)        │
└────────────────────────────────────────┘
```

### Transfer Data Flow

```
Data Transfer:
┌────────────────────────────────────────┐
│  1. Prepare Data Buffer                │
│     const buffer = new Uint8Array(...)  │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  2. Split into Chunks (if needed)      │
│     Max chunk: 64KB (typical)          │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  3. Transfer Each Chunk                │
│     device.transferOut(endpoint, chunk)│
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  4. Wait for Transfer Complete         │
│     result.status === 'ok'             │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  5. Verify Bytes Transferred           │
│     result.bytesWritten === chunk.length│
└────────────────────────────────────────┘
```

### Expected Outcome
```
frontend/lib/printing/
└── usb-printer.ts
    ├── USBPrinter class
    │   ├── requestDevice()
    │   ├── connect(device)
    │   ├── disconnect()
    │   ├── send(data)
    │   ├── print(data)
    │   └── Event handlers
    ├── USBPrinterConfig interface
    ├── USB_VENDOR_IDS constants
    └── PRINTER_FILTERS array
```

### Verification Checklist
- [ ] USB printer file created
- [ ] USBPrinter class defined
- [ ] Configuration interface defined
- [ ] Device selection works (requestDevice)
- [ ] Device connection works (open, claim)
- [ ] Data sending works (transferOut)
- [ ] Connection close works (release)
- [ ] Print method works
- [ ] Device persistence implemented
- [ ] Vendor detection works
- [ ] USB event handling works
- [ ] Error handling comprehensive
- [ ] WebUSB support detection works
- [ ] HTTPS requirement documented

---

## Task 51: Add Print Job Queue

### Overview
Implement a print job queue system to manage multiple print requests, prevent concurrent printing conflicts, and ensure reliable print order execution. The queue handles job prioritization and status tracking.

### Dependencies
- Task 49: Implement network printer support
- Task 50: Implement USB printer support

### Instructions

1. **Create print queue file**
   - Create file at `frontend/lib/printing/print-queue.ts`
   - Set up TypeScript with proper exports
   - Import printer classes

2. **Define print job interface**
   - Create `PrintJob` interface
   - Include job ID (UUID)
   - Include print data (Uint8Array)
   - Include printer reference
   - Include job metadata (timestamp, priority, user)
   - Include status (queued, printing, completed, failed)

3. **Define print queue class**
   - Create `PrintQueue` class
   - Maintain job queue (array)
   - Track current job being printed
   - Manage queue state

4. **Implement job queueing**
   - Create `addJob(job: PrintJob)` method
   - Add job to queue with unique ID
   - Sort by priority if specified
   - Emit job added event
   - Return job ID

5. **Implement queue processing**
   - Create `processQueue()` method
   - Check if queue is processing
   - Get next job from queue
   - Execute print job
   - Handle completion and errors
   - Process next job

6. **Implement job status tracking**
   - Create job status enum: QUEUED, PRINTING, COMPLETED, FAILED, CANCELLED
   - Update job status throughout lifecycle
   - Provide `getJobStatus(jobId)` method
   - Emit status change events

7. **Implement job prioritization**
   - Create priority levels: LOW, NORMAL, HIGH, URGENT
   - Sort queue by priority
   - Process high priority jobs first
   - Allow priority override for specific jobs

8. **Implement job cancellation**
   - Create `cancelJob(jobId)` method
   - Remove job from queue if not printing
   - Cancel current print if possible
   - Update job status to CANCELLED
   - Emit cancellation event

9. **Add queue management methods**
   - `getQueueLength()` - Get number of queued jobs
   - `getQueuedJobs()` - Get all queued jobs
   - `clearQueue()` - Remove all queued jobs
   - `pauseQueue()` - Pause processing
   - `resumeQueue()` - Resume processing

10. **Implement job history**
    - Store completed/failed jobs
    - Create `getJobHistory()` method
    - Limit history size (e.g., last 100 jobs)
    - Provide filtering by status/date

11. **Add queue statistics**
    - Track total jobs processed
    - Track success rate
    - Track average processing time
    - Provide `getQueueStats()` method

12. **Implement queue persistence**
    - Save queue state to local storage
    - Restore queue on page reload
    - Handle offline scenarios
    - Re-queue failed jobs on restart

### Print Job Structure

```typescript
interface PrintJob {
  id: string;                        // UUID
  data: Uint8Array;                  // ESC/POS bytes
  printer: PrinterReference;         // Printer to use
  status: JobStatus;                 // Current status
  priority: JobPriority;             // Job priority
  createdAt: Date;                   // Creation timestamp
  startedAt?: Date;                  // Processing start
  completedAt?: Date;                // Completion timestamp
  attempts: number;                  // Retry count
  maxAttempts: number;               // Max retries
  error?: string;                    // Error message
  metadata: JobMetadata;             // Additional info
}

enum JobStatus {
  QUEUED = 'queued',
  PRINTING = 'printing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

enum JobPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  URGENT = 3
}

interface JobMetadata {
  receiptNumber?: string;
  customerName?: string;
  totalAmount?: number;
  userId?: string;
  terminalId?: string;
}

interface PrinterReference {
  type: 'network' | 'usb';
  id: string;                        // IP or device ID
  config?: any;                      // Printer config
}
```

### Queue Processing Flow

```
┌────────────────────────────────────────┐
│  Job Added to Queue                    │
│  status = QUEUED                       │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Queue Not Processing?                 │
│  Start Processing                      │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Sort Queue by Priority                │
│  URGENT > HIGH > NORMAL > LOW          │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Get Next Job from Queue               │
│  (highest priority first)              │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Update Job Status                     │
│  status = PRINTING                     │
│  startedAt = now                       │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Send to Printer                       │
│  printer.print(job.data)               │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Print Success?                        │
│  ├─Yes─▶ status = COMPLETED            │
│  └─No──▶ status = FAILED               │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Update Completion Time                │
│  completedAt = now                     │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Move to History                       │
│  Remove from active queue              │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  More Jobs in Queue?                   │
│  ├─Yes─▶ Process Next Job              │
│  └─No──▶ Queue Idle                    │
└────────────────────────────────────────┘
```

### Queue State Management

```
Queue States:
┌────────────────────────────────────────┐
│  IDLE                                  │
│  - No jobs processing                  │
│  - Queue may be empty or have jobs    │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  PROCESSING                            │
│  - Currently printing a job            │
│  - Other jobs waiting                  │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  PAUSED                                │
│  - Processing suspended                │
│  - Jobs remain in queue                │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  ERROR                                 │
│  - Printer error occurred              │
│  - Awaiting resolution                 │
└────────────────────────────────────────┘
```

### Priority Handling

```
Queue with Mixed Priorities:
┌───────────────────────────────────────────┐
│  Queue (unsorted):                        │
│  1. Job A - NORMAL - Receipt #001        │
│  2. Job B - HIGH - Manager Print         │
│  3. Job C - NORMAL - Receipt #002        │
│  4. Job D - URGENT - Till Balance        │
│  5. Job E - LOW - Report                 │
└───────────────────────────────────────────┘
              ↓ Sort by Priority
┌───────────────────────────────────────────┐
│  Queue (sorted):                          │
│  1. Job D - URGENT - Till Balance        │ ← Next
│  2. Job B - HIGH - Manager Print         │
│  3. Job A - NORMAL - Receipt #001        │
│  4. Job C - NORMAL - Receipt #002        │
│  5. Job E - LOW - Report                 │
└───────────────────────────────────────────┘
```

### Queue API Usage Examples

```
Initialize Queue:
  const queue = new PrintQueue()

Add Job to Queue:
  const job: PrintJob = {
    id: uuidv4(),
    data: receiptBuffer,
    printer: { type: 'network', id: '192.168.1.100' },
    status: JobStatus.QUEUED,
    priority: JobPriority.NORMAL,
    createdAt: new Date(),
    attempts: 0,
    maxAttempts: 3,
    metadata: {
      receiptNumber: 'REC-001',
      totalAmount: 10000
    }
  }
  const jobId = await queue.addJob(job)

Check Job Status:
  const status = queue.getJobStatus(jobId)
  console.log(status) // 'queued', 'printing', 'completed'

Cancel Job:
  await queue.cancelJob(jobId)

Pause/Resume Queue:
  queue.pauseQueue()
  queue.resumeQueue()

Get Queue Info:
  const length = queue.getQueueLength()
  const jobs = queue.getQueuedJobs()
  const stats = queue.getQueueStats()

Clear Queue:
  queue.clearQueue()  // Remove all pending jobs

Event Listeners:
  queue.on('jobAdded', (job) => {
    console.log('Job added:', job.id)
  })
  
  queue.on('jobStarted', (job) => {
    console.log('Job started:', job.id)
  })
  
  queue.on('jobCompleted', (job) => {
    console.log('Job completed:', job.id)
  })
  
  queue.on('jobFailed', (job, error) => {
    console.error('Job failed:', job.id, error)
  })
```

### Queue Statistics

```typescript
interface QueueStats {
  totalProcessed: number;        // Total jobs processed
  completed: number;             // Successfully completed
  failed: number;                // Failed jobs
  cancelled: number;             // Cancelled jobs
  successRate: number;           // Percentage (0-100)
  averageProcessingTime: number; // Milliseconds
  currentQueueLength: number;    // Jobs waiting
}
```

### Expected Outcome
```
frontend/lib/printing/
└── print-queue.ts
    ├── PrintQueue class
    │   ├── addJob(job)
    │   ├── processQueue()
    │   ├── cancelJob(jobId)
    │   ├── getJobStatus(jobId)
    │   ├── getQueueLength()
    │   ├── getQueuedJobs()
    │   ├── clearQueue()
    │   ├── pauseQueue()
    │   ├── resumeQueue()
    │   ├── getJobHistory()
    │   └── getQueueStats()
    ├── PrintJob interface
    ├── JobStatus enum
    ├── JobPriority enum
    └── QueueStats interface
```

### Verification Checklist
- [ ] Print queue file created
- [ ] PrintJob interface defined
- [ ] PrintQueue class created
- [ ] Job queueing works
- [ ] Queue processing works
- [ ] Job status tracking works
- [ ] Job prioritization works
- [ ] Job cancellation works
- [ ] Queue management methods work
- [ ] Job history tracking works
- [ ] Queue statistics work
- [ ] Queue persistence works
- [ ] Event emission works
- [ ] Concurrent job prevention works

---

## Task 52: Add Print Retry Logic

### Overview
Implement robust retry logic for failed print jobs to handle temporary printer issues, network glitches, and transient errors. The retry system uses exponential backoff and configurable retry limits.

### Dependencies
- Task 51: Add print job queue

### Instructions

1. **Extend print job with retry fields**
   - Add `attempts` field (current retry count)
   - Add `maxAttempts` field (retry limit)
   - Add `lastAttemptAt` field (timestamp)
   - Add `nextRetryAt` field (scheduled retry time)
   - Add `backoffDelay` field (current delay)

2. **Define retry configuration**
   - Create `RetryConfig` interface
   - Include max attempts (default: 3)
   - Include initial delay (default: 1000ms)
   - Include max delay (default: 30000ms)
   - Include backoff multiplier (default: 2)

3. **Implement retry decision logic**
   - Create `shouldRetry(job: PrintJob)` method
   - Check if attempts < maxAttempts
   - Check error type (retryable vs non-retryable)
   - Check retry eligibility
   - Return boolean

4. **Implement exponential backoff**
   - Create `calculateBackoff(attempt: number)` method
   - Formula: `initialDelay * (multiplier ^ attempt)`
   - Apply jitter (randomization)
   - Cap at max delay
   - Return delay in milliseconds

5. **Implement retry scheduling**
   - Create `scheduleRetry(job: PrintJob)` method
   - Calculate next retry time
   - Update job retry fields
   - Move job back to queue
   - Emit retry scheduled event

6. **Implement retry execution**
   - Modify queue processing to handle retries
   - Check if retry time has arrived
   - Increment attempt counter
   - Execute print with retry logic
   - Update retry timestamps

7. **Add error classification**
   - Create `classifyError(error)` method
   - Retryable errors: network timeout, printer busy, paper jam
   - Non-retryable errors: invalid data, printer not found, permission denied
   - Return error classification

8. **Implement retry notification**
   - Create `notifyRetry(job: PrintJob)` method
   - Show user notification about retry
   - Include attempt number
   - Include next retry time
   - Allow user to cancel retry

9. **Add manual retry trigger**
   - Create `retryJob(jobId: string)` method
   - Allow manual retry of failed job
   - Reset attempt counter if needed
   - Re-queue job immediately

10. **Implement retry limits**
    - Stop retrying after max attempts
    - Mark job as permanently failed
    - Notify user of permanent failure
    - Move to failed jobs history

11. **Add retry statistics**
    - Track total retries
    - Track retry success rate
    - Track average retries per job
    - Include in queue statistics

12. **Implement retry circuit breaker**
    - Create `CircuitBreaker` class
    - Open circuit after consecutive failures
    - Prevent retries when circuit open
    - Automatically reset after cooldown period
    - Emit circuit state change events

### Retry Configuration

```typescript
interface RetryConfig {
  maxAttempts: number;           // Max retry attempts (3-5)
  initialDelay: number;          // First retry delay (ms)
  maxDelay: number;              // Max backoff delay (ms)
  backoffMultiplier: number;     // Exponential multiplier (2)
  jitterFactor: number;          // Randomization (0-0.3)
  enableCircuitBreaker: boolean; // Use circuit breaker
  circuitBreakerThreshold: number; // Failures before open (5)
  circuitBreakerTimeout: number; // Reset timeout (ms)
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000,           // 1 second
  maxDelay: 30000,              // 30 seconds
  backoffMultiplier: 2,
  jitterFactor: 0.2,
  enableCircuitBreaker: true,
  circuitBreakerThreshold: 5,
  circuitBreakerTimeout: 60000  // 1 minute
}
```

### Exponential Backoff Calculation

```
Backoff Formula:
  delay = initialDelay * (multiplier ^ attempt)
  delay = Math.min(delay, maxDelay)
  delay = delay + random(-jitter, +jitter)

Example (initialDelay=1000, multiplier=2):
  Attempt 1: 1000ms * (2^1) = 2000ms  → ~2s
  Attempt 2: 1000ms * (2^2) = 4000ms  → ~4s
  Attempt 3: 1000ms * (2^3) = 8000ms  → ~8s
  Attempt 4: 1000ms * (2^4) = 16000ms → ~16s
  Attempt 5: 1000ms * (2^5) = 32000ms → 30s (capped)

With Jitter (20%):
  Attempt 1: 2000ms ± 400ms → 1600-2400ms
  Attempt 2: 4000ms ± 800ms → 3200-4800ms
  Attempt 3: 8000ms ± 1600ms → 6400-9600ms
```

### Retry Flow Diagram

```
┌────────────────────────────────────────┐
│  Print Job Failed                      │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Classify Error                        │
│  Retryable? Non-retryable?             │
└────────────────────────────────────────┘
              ↓
         ┌────┴────┐
         │         │
    Retryable   Non-Retryable
         │         │
         │         └─▶ Mark Failed, Notify User
         │
         ▼
┌────────────────────────────────────────┐
│  Check Retry Attempts                  │
│  attempts < maxAttempts?               │
└────────────────────────────────────────┘
              ↓
         ┌────┴────┐
         │         │
      Yes        No
         │         │
         │         └─▶ Max Attempts Reached
         │             Mark Permanently Failed
         │             Notify User
         ▼
┌────────────────────────────────────────┐
│  Calculate Backoff Delay               │
│  delay = initialDelay * (2 ^ attempts) │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Schedule Retry                        │
│  nextRetryAt = now + delay             │
│  attempts++                            │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Wait for Retry Time                   │
│  (delay with exponential backoff)      │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Retry Print Job                       │
│  printer.print(job.data)               │
└────────────────────────────────────────┘
              ↓
         ┌────┴────┐
         │         │
    Success    Failed
         │         │
         │         └─▶ Repeat Flow
         │
         ▼
┌────────────────────────────────────────┐
│  Mark Completed                        │
│  Notify Success                        │
└────────────────────────────────────────┘
```

### Error Classification

```typescript
enum ErrorType {
  RETRYABLE,
  NON_RETRYABLE,
  UNKNOWN
}

interface ErrorClassification {
  type: ErrorType;
  reason: string;
  shouldRetry: boolean;
}

function classifyError(error: Error): ErrorClassification {
  // Network errors - Retryable
  if (error.message.includes('timeout')) {
    return { type: ErrorType.RETRYABLE, reason: 'Network timeout', shouldRetry: true }
  }
  if (error.message.includes('network')) {
    return { type: ErrorType.RETRYABLE, reason: 'Network error', shouldRetry: true }
  }
  
  // Printer busy - Retryable
  if (error.message.includes('busy')) {
    return { type: ErrorType.RETRYABLE, reason: 'Printer busy', shouldRetry: true }
  }
  
  // Paper/Hardware issues - Retryable (once fixed)
  if (error.message.includes('paper')) {
    return { type: ErrorType.RETRYABLE, reason: 'Paper out', shouldRetry: true }
  }
  if (error.message.includes('cover')) {
    return { type: ErrorType.RETRYABLE, reason: 'Cover open', shouldRetry: true }
  }
  
  // Permission/Config errors - Non-retryable
  if (error.message.includes('permission')) {
    return { type: ErrorType.NON_RETRYABLE, reason: 'Permission denied', shouldRetry: false }
  }
  if (error.message.includes('not found')) {
    return { type: ErrorType.NON_RETRYABLE, reason: 'Printer not found', shouldRetry: false }
  }
  
  // Unknown - Retry once
  return { type: ErrorType.UNKNOWN, reason: 'Unknown error', shouldRetry: true }
}
```

### Circuit Breaker Pattern

```
Circuit Breaker States:
┌────────────────────────────────────────┐
│  CLOSED (Normal Operation)             │
│  - Allow all print attempts            │
│  - Track failures                      │
└────────────────────────────────────────┘
              ↓ (failures >= threshold)
┌────────────────────────────────────────┐
│  OPEN (Circuit Tripped)                │
│  - Reject all print attempts           │
│  - Fail fast without trying            │
│  - Wait for timeout                    │
└────────────────────────────────────────┘
              ↓ (timeout elapsed)
┌────────────────────────────────────────┐
│  HALF_OPEN (Testing)                   │
│  - Allow limited attempts              │
│  - Test if issue resolved              │
└────────────────────────────────────────┘
         ┌────┴────┐
         │         │
    Success    Failure
         │         │
         ▼         ▼
      CLOSED     OPEN
```

### Retry API Usage Examples

```
Configure Retry:
  const retryConfig: RetryConfig = {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    jitterFactor: 0.2
  }
  queue.setRetryConfig(retryConfig)

Add Job with Retry:
  const job: PrintJob = {
    ...jobData,
    attempts: 0,
    maxAttempts: 3,
    backoffDelay: 1000
  }
  queue.addJob(job)

Manual Retry:
  await queue.retryJob(jobId)

Check Retry Status:
  const job = queue.getJob(jobId)
  console.log(`Attempts: ${job.attempts}/${job.maxAttempts}`)
  console.log(`Next retry: ${job.nextRetryAt}`)

Retry Events:
  queue.on('retryScheduled', (job, delay) => {
    console.log(`Retry scheduled in ${delay}ms`)
  })
  
  queue.on('retryAttempt', (job, attempt) => {
    console.log(`Retry attempt ${attempt}`)
  })
  
  queue.on('retrySuccess', (job, attempts) => {
    console.log(`Success after ${attempts} attempts`)
  })
  
  queue.on('retryExhausted', (job) => {
    console.error('Max retries reached, permanent failure')
  })

Circuit Breaker:
  const breaker = new CircuitBreaker(config)
  
  breaker.on('open', () => {
    console.warn('Circuit breaker opened - failing fast')
  })
  
  breaker.on('halfOpen', () => {
    console.log('Circuit breaker half-open - testing')
  })
  
  breaker.on('closed', () => {
    console.log('Circuit breaker closed - normal operation')
  })
```

### Retry Notification UI

```
User Notification Examples:

Retry Scheduled:
┌────────────────────────────────────────┐
│  ⚠️ Print Failed                        │
│  Receipt #REC-001 failed to print.     │
│  Retrying in 2 seconds...              │
│  Attempt 1 of 3                        │
│  [Cancel Retry]                        │
└────────────────────────────────────────┘

Retry Success:
┌────────────────────────────────────────┐
│  ✓ Print Successful                    │
│  Receipt #REC-001 printed after 2      │
│  retry attempts.                       │
│  [OK]                                  │
└────────────────────────────────────────┘

Permanent Failure:
┌────────────────────────────────────────┐
│  ❌ Print Failed                        │
│  Receipt #REC-001 failed after 3       │
│  attempts. Please check printer.       │
│  [Retry Now] [Cancel] [View Details]   │
└────────────────────────────────────────┘
```

### Expected Outcome
```
frontend/lib/printing/
└── print-queue.ts (extended)
    ├── RetryConfig interface
    ├── shouldRetry(job)
    ├── calculateBackoff(attempt)
    ├── scheduleRetry(job)
    ├── retryJob(jobId)
    ├── classifyError(error)
    ├── notifyRetry(job)
    ├── CircuitBreaker class
    │   ├── State management
    │   ├── Failure tracking
    │   └── Auto-reset logic
    └── Retry event emission
```

### Verification Checklist
- [ ] Print job extended with retry fields
- [ ] Retry configuration defined
- [ ] Retry decision logic works
- [ ] Exponential backoff calculation works
- [ ] Retry scheduling works
- [ ] Retry execution integrated
- [ ] Error classification works
- [ ] Retry notification implemented
- [ ] Manual retry trigger works
- [ ] Retry limits enforced
- [ ] Retry statistics tracked
- [ ] Circuit breaker implemented
- [ ] Retry events emitted
- [ ] User notifications shown

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 49 | Implement network printer support | TCP/IP network printing |
| 50 | Implement USB printer support | WebUSB printing |
| 51 | Add print job queue | Job queue with prioritization |
| 52 | Add print retry logic | Retry with exponential backoff |

### Key Components Created
```
frontend/lib/printing/
├── network-printer.ts
│   ├── NetworkPrinter class
│   ├── NetworkPrinterPool
│   └── Printer discovery
├── usb-printer.ts
│   ├── USBPrinter class
│   ├── Device selection
│   └── WebUSB integration
└── print-queue.ts
    ├── PrintQueue class
    ├── Job prioritization
    ├── Retry logic
    └── CircuitBreaker class
```

### Printing Capabilities Summary

| Feature | Network | USB | Queue | Retry |
|---------|---------|-----|-------|-------|
| Connection | TCP/IP | WebUSB | N/A | N/A |
| Auto-reconnect | ✓ | ✓ | N/A | N/A |
| Job queuing | N/A | N/A | ✓ | ✓ |
| Prioritization | N/A | N/A | ✓ | N/A |
| Status checking | ✓ | Limited | ✓ | N/A |
| Error handling | ✓ | ✓ | ✓ | ✓ |
| Retry logic | N/A | N/A | N/A | ✓ |
| Persistence | N/A | ✓ | ✓ | N/A |

### Complete Thermal Printing System

```
┌─────────────────────────────────────────────────┐
│  Application Layer                              │
│  ├─ Receipt Generation                          │
│  ├─ ThermalPrintRenderer                        │
│  └─ Print Request                               │
└───────────────────┬─────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Print Queue Layer                              │
│  ├─ Job Queue Management                        │
│  ├─ Priority Handling                           │
│  ├─ Retry Logic with Backoff                    │
│  └─ Circuit Breaker                             │
└───────────────────┬─────────────────────────────┘
                    ↓
         ┌──────────┴──────────┐
         │                     │
┌────────▼─────────┐  ┌───────▼──────────┐
│  Network Printer │  │  USB Printer     │
│  ├─ TCP/IP       │  │  ├─ WebUSB API   │
│  ├─ Port 9100    │  │  ├─ Device Mgmt  │
│  └─ Discovery    │  │  └─ Persistence  │
└────────┬─────────┘  └───────┬──────────┘
         │                     │
         └──────────┬──────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  ESC/POS Command Layer                          │
│  ├─ ThermalPrinterService                       │
│  ├─ Command Generation                          │
│  ├─ Text Formatting                             │
│  ├─ Graphics (Logo, QR, Barcode)               │
│  └─ Layout Formatting (80mm/58mm)              │
└───────────────────┬─────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Physical Printer                               │
│  ├─ Thermal Print Head                          │
│  ├─ Paper Feed Mechanism                        │
│  ├─ Paper Cutter                                │
│  └─ Cash Drawer Trigger                         │
└─────────────────────────────────────────────────┘
```

### Group C Completion

All 18 tasks in Group C are now documented:
1. **Thermal Printer Service** (Task 35) - Base service with buffer management
2. **ESC/POS Commands** (Task 36) - Complete command constants
3. **Text Formatting** (Tasks 37-39) - Bold, underline, size, alignment, spacing
4. **Paper Control** (Task 40) - Full and partial cutting
5. **Graphics** (Tasks 41-43) - Logo, barcode, QR code printing
6. **Layout Formatters** (Tasks 44-45) - 80mm and 58mm formatters
7. **Separators & Drawer** (Tasks 46-47) - Visual separators, cash drawer
8. **Print Renderer** (Task 48) - Complete receipt rendering
9. **Network Support** (Task 49) - TCP/IP network printing
10. **USB Support** (Task 50) - WebUSB direct printing
11. **Print Queue** (Task 51) - Job queue and prioritization
12. **Retry Logic** (Task 52) - Exponential backoff and circuit breaker

### Next Steps
1. Proceed to [../Group-D_PDF-Email-Receipts/](../Group-D_PDF-Email-Receipts/) for PDF generation and email delivery
2. Implement PDF receipt generation
3. Add email receipt functionality
4. Create receipt archiving

---

## Notes for AI Agents

1. **Execution Order:** Tasks 49-50 can be done in parallel; Task 51 should follow; Task 52 extends Task 51
2. **Network Printing:** Test with actual network printers for compatibility
3. **WebUSB:** Requires HTTPS context (except localhost)
4. **Browser Support:** WebUSB only in Chromium-based browsers
5. **Queue Persistence:** Important for offline scenarios
6. **Retry Logic:** Balance between reliability and user experience
7. **Circuit Breaker:** Prevents system overload during persistent failures
8. **Error Classification:** Distinguish retryable from permanent errors
9. **User Notifications:** Keep users informed of retry status
10. **Testing:** Test with various network conditions and printer models
