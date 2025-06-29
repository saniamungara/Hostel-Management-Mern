# Manual MongoDB Commands to Check and Update caretakerId in Outing Requests

## 1. Connect to MongoDB shell or Compass

```bash
mongo
use employee
```

## 2. Check outing requests and their caretakerId values

```js
db.outingstudents.find({}, { idNumber: 1, caretakerId: 1 }).pretty()
```

Look for outing requests missing `caretakerId` or having incorrect values.

## 3. Update outing requests missing or incorrect caretakerId

Replace `ACTUAL_CARETAKER_ID` with the correct caretakerId value.

```js
db.outingstudents.updateMany(
  { $or: [ { caretakerId: { $exists: false } }, { caretakerId: { $ne: "ACTUAL_CARETAKER_ID" } } ] },
  { $set: { caretakerId: "ACTUAL_CARETAKER_ID" } }
)
```

## 4. Verify the update

```js
db.outingstudents.find({ caretakerId: "ACTUAL_CARETAKER_ID" }).count()
```

This will show the number of outing requests with the correct caretakerId.

---

If you need help running these commands or want me to assist with further debugging or testing, please let me know.
