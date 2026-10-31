export function submitEvent(event_type: string, payload: string) {
  fetch('/backend/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ event_type, payload, timestamp: Date.now() }),
    keepalive: true,
  })
}
