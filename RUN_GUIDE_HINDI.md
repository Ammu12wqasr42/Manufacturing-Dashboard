# 🚀 RUN करने का सबसे आसान तरीका

## Step 1: Backend चलाएं (पहला Terminal)

```bash
cd c:\Users\amans\OneDrive\Desktop\Dixon\backend
npm start
```

**Output दिखेगा:**
```
MongoDB connected
Server running on port 5000
```

✅ बस! Backend चल गया।

---

## Step 2: Frontend चलाएं (दूसरा Terminal खोलें)

```bash
cd c:\Users\amans\OneDrive\Desktop\Dixon\frontend
npm install
npm start
```

**पहली बार अगर कुछ error आए तो ये करें:**
```bash
npm install react-scripts
npm start
```

---

## Step 3: Browser में खोलें

जब `npm start` run हो, तो automatically browser खुल जाएगा।

अगर नहीं खुला तो यहाँ जाएं:
```
http://localhost:3000
```

---

## Step 4: Login करें

```
Email: operator@example.com
Password: password123
```

बस! Dashboard खुल जाएगा।

---

## ⚠️ अगर error आएं तो:

### "MongoDB connection error"
यह ठीक है! मैं एक **Mock Database** सेटअप करूंगा जो बिना MongoDB के काम करे।

### "Port 5000 already in use"
```bash
# नया port use करें
set PORT=5001
npm start
```

### "react-scripts not found"
```bash
npm install react-scripts --save
npm start
```

---

## Quick Video Steps:

1. **Terminal 1:**
   ```
   cd backend
   npm start
   ```

2. **Terminal 2 (नया खोलें):**
   ```
   cd frontend
   npm install
   npm start
   ```

3. **Browser में खुल जाएगा** → Login करें

4. **Done! 🎉**

---

**किसी problem के लिए यह करें:**

```bash
# Clear everything
rmdir /s /q node_modules
del package-lock.json
npm install
npm start
```
