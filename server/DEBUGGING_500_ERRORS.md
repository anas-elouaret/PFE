# 🔧 Debugging 500 Errors - Complete Guide

## What is a 500 Error?

A **500 Internal Server Error** means the server encountered an unexpected error and couldn't process your request. The server is working, but something in your code/database failed.

```
✅ Server is running
❌ Request processing failed
❌ Response: 500 Internal Server Error
```

---

## Where to Find the Error Message

### Step 1: Check Browser Console (F12)
```
Press F12 → Console tab
Look for error messages and the failing URL
```

Example:
```
POST http://localhost:5000/api/orders 500 (Internal Server Error)
```

### Step 2: Check Network Tab
```
Press F12 → Network tab
Click on the failed request (usually red)
Look at Response tab
```

Shows error details like:
```json
{
  "success": false,
  "message": "Error placing order",
  "error": "Cast to ObjectId failed for value \"undefined\""
}
```

### Step 3: Check Server Console
```
Terminal where your server is running
Look for ❌ error logs
```

Example:
```
❌ Order creation error: ValidationError: items: Cast to ObjectId failed
```

---

## Common 500 Errors & Fixes

### Error 1: Data Format Mismatch (What You Just Had!)

**Problem:**
- Server expects: `{ name, price }`
- Client sends: `{ serviceName, finalPrice, selectedChoicesData }`
- Server crashes trying to access missing fields

**Solution:**
✅ Already fixed! The server now transforms both formats:
```javascript
const transformedItems = items.map((item) => ({
  name: item.name || item.serviceName,
  price: item.price || item.finalPrice,
  serviceId: item.serviceId,
  basePrice: item.basePrice,
  selectedOptions: item.selectedChoicesData || [],
}));
```

---

### Error 2: Database Connection Failed

**Symptom:**
```
MongoNetworkError: connect ECONNREFUSED
```

**Fixes:**
1. Check MongoDB is running
2. Verify `.env` has correct `MONGODB_URI`
3. Check internet connection (if using MongoDB Atlas)
4. Restart the server

---

### Error 3: Missing Required Fields

**Symptom:**
```
ValidationError: validation failed: total: required
```

**Fix:**
Check the request includes all required fields:
```javascript
// Required fields for order
{
  items: [],      // ← Required
  total: 100,     // ← Required
  createdAt: "timestamp" // Optional
}
```

---

### Error 4: Invalid Data Type

**Symptom:**
```
Cast to Number failed for value "599.99"
```

**Reasons:**
- Sending string instead of number: `"599.99"` instead of `599.99`
- Database schema expects Number, received String

**Fix:**
Ensure all numeric values are numbers, not strings:
```javascript
// ❌ Wrong
finalPrice: "749"

// ✅ Correct
finalPrice: 749
```

---

## Testing Checklist

### ✅ After the Fix, Test This:

1. **Open Services Page**
   ```
   http://localhost:5173/services
   ```

2. **Customize a Service**
   - Click "Customize" on any service
   - Select options
   - Click "Add to Cart"

3. **Check Network Tab**
   ```
   F12 → Network tab
   Look for POST to /api/orders
   Should see 201 (success), not 500
   ```

4. **Place Order**
   - Click "Place Order" button
   - Should see success message
   - Check server console for ✓ log

5. **Verify Server Logs**
   ```
   Look for: ✓ New Order Created
   Shows: orderId, items, total
   ```

---

## How to Debug 500 Errors

### Step 1: Identify the Endpoint
```
F12 → Network tab
Which request fails?
- POST /api/orders
- POST /api/auth/signup
- POST /api/auth/signin
etc.
```

### Step 2: Check Request Payload
```
Click the request
Headers tab: Shows URL & method
Request tab: Shows what was sent
Response tab: Shows what server returned
```

### Step 3: Check Server Logs
```
Terminal running server
Look for error message
Copy the error
```

### Step 4: Check Data Format
```
Does sent data match what server expects?
Are all required fields present?
Are data types correct? (string vs number)
```

### Step 5: Check Database
```
Is MongoDB running?
Is connection string correct?
Can server reach MongoDB?
```

---

## Common Mistakes

### ❌ Mistake 1: Sending Wrong Data Format
```javascript
// Server expects
{ items: [{ name, price }], total }

// Client sends
{ items: [{ serviceName, finalPrice }], total }

// ❌ Results in 500
```

**Fix:** Match format or transform on server ✅

---

### ❌ Mistake 2: Missing Required Fields
```javascript
// Client sends (missing total)
{ items: [...] }

// ❌ Server can't calculate without total
```

**Fix:** Include all required fields ✅

---

### ❌ Mistake 3: Wrong Data Types
```javascript
// Client sends
{ items: [...], total: "100" }

// Server expects number but gets string
// ❌ Results in 500
```

**Fix:** Use correct data types ✅

---

### ❌ Mistake 4: Database Not Running
```
// MongoDB connection fails
// ❌ Server can't save order
```

**Fix:** Start MongoDB ✅

---

## Detailed Error Messages (Now Enabled)

When a 500 error occurs, you'll now see:

**In browser console:**
```json
{
  "success": false,
  "message": "Error placing order",
  "error": "ValidationError: items: Cast to ObjectId failed for value \"undefined\"",
  "details": "[Full stack trace in development mode]"
}
```

**In server console:**
```
❌ Order creation error: ValidationError...
Error details: {
  message: "...",
  stack: "...",
  requestBody: { items: [...], total: ... }
}
```

This helps identify exactly what went wrong!

---

## Prevention Checklist

- [ ] Check data format matches server expectations
- [ ] Validate all required fields are present
- [ ] Ensure numeric values are numbers (not strings)
- [ ] Verify MongoDB connection before testing
- [ ] Test with browser Network tab open
- [ ] Check server console logs
- [ ] Use proper error handling in code
- [ ] Add console.log to trace data flow
- [ ] Test on fresh browser session (clear cache)

---

## Quick Fixes for Your System

### If Still Getting 500 Error:

1. **Restart Server**
   ```bash
   # Stop server (Ctrl+C in terminal)
   # Run: npm start
   ```

2. **Clear Browser Cache**
   ```
   F12 → Settings → Clear site data
   ```

3. **Check .env File**
   ```
   SERVER/.env should have:
   MONGODB_URI=your_connection_string
   JWT_SECRET=your_secret
   CLIENT_URL=http://localhost:5173
   ```

4. **Verify MongoDB Running**
   ```
   If local: mongod should be running
   If Atlas: Check connection string and IP whitelist
   ```

5. **Check Server is Running**
   ```bash
   # Should see: Server running on port 5000
   # Should see: Connected to MongoDB
   ```

---

## Testing the Fix

### Test Endpoint Directly (Advanced)

Use VS Code REST Client or Postman:

```http
POST http://localhost:5000/api/orders
Content-Type: application/json

{
  "items": [
    {
      "serviceName": "UGC Content Creation",
      "basePrice": 599,
      "finalPrice": 749,
      "serviceId": "ugc-creation",
      "category": "content",
      "selectedChoicesData": [
        {
          "id": "express",
          "label": "Express (2-3 days)",
          "price": 150,
          "optionId": "delivery-speed",
          "type": "radio"
        }
      ]
    }
  ],
  "total": 749,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "orderId": "507f1f77bcf86cd799439011",
  "total": 749,
  "itemCount": 1
}
```

---

## Going Forward

### For Every 500 Error:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Find the failing request
4. Look at Response tab for error message
5. Check server console for detailed logs
6. Fix based on error message
7. Test again

### Good Practices:

✅ Always have Network tab open during testing  
✅ Check server console alongside browser console  
✅ Test with real data from your app  
✅ Validate data before sending  
✅ Use try-catch blocks in critical code  
✅ Log errors with full context  
✅ Keep error messages descriptive  

---

## Summary

**Your 500 error was fixed by:**
1. ✅ Updating order routes to handle new cart format
2. ✅ Updating Order model to store new fields
3. ✅ Improving error logging for debugging

**Next time you see a 500 error:**
1. Check Network tab for endpoint
2. Check Response tab for error message
3. Check server console
4. Compare sent vs expected data
5. Fix data format or server code

---

**Need more help?** Check the server logs - they now show detailed error information! 🔍

