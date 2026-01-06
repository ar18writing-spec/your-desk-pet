#!/usr/bin/env python3
import sys
import struct
import json

# Native messaging host stub that reads JSON messages from stdin and replies.
# For production, replace with an executable that starts the desktop app or forwards to a local socket.

def read_message():
    raw_length = sys.stdin.buffer.read(4)
    if len(raw_length) == 0:
        return None
    message_length = struct.unpack('<I', raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode('utf-8')
    return json.loads(message)

def send_message(message):
    encoded = json.dumps(message).encode('utf-8')
    sys.stdout.buffer.write(struct.pack('<I', len(encoded)))
    sys.stdout.buffer.write(encoded)
    sys.stdout.buffer.flush()

def main():
    while True:
        msg = read_message()
        if msg is None:
            break
        # simple echo / log
        print('Received native message:', msg, file=sys.stderr)
        send_message({'status': 'ok'})

if __name__ == '__main__':
    main()
