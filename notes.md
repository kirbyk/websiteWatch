## Direct Interactions

New User

- Login
- Define a time limit
- Optionally, add entries to blacklist
- Insert a new config document

Returning User

- Add or remove from blacklist

## Indirect Interactions

Page opens

- Check if it's on the blacklist
- if blacklisted:
  - Check if time is available
  - Start a timer

Page closes
- if blacklisted:
  - Stop timer
  - Submit usage to Stitch

Things to figure out

- How do we know when a page opens/closes?
  - likely a chrome event system
- How to time things?
