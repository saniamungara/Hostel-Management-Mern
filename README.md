# 🏨 Hostel Management System - MERN Stack Project

A full-stack web application for hostel leave and outing management, developed using the **MERN** stack. The system features two portals — one for **students** to submit requests and another for **supervisors** to review, approve, or reject those requests. Designed for efficiency, clarity, and ease of use.

---

## 🔐 Portals Overview

### 👨‍🏫 Student Portal

* 📝 Submit **Leave Requests** and **Outing Requests**
* 📜 View **Leave History** and **Outing History** with approval status

### 👨‍🏫 Supervisor Portal

* ✅ View all pending **Leave** and **Outing Requests**
* ✔️ **Accept** or ❌ **Reject** requests
* 📋 View lists of **Approved Leaves** and **Approved Outings**

---

## 🧰 Tech Stack

* **MongoDB** – Database
* **Express.js** – Backend framework
* **React.js** – Frontend framework
* **Node.js** – Server environment

---

## 📂 Folder Structure

```
Hostel-Management-Mern/
├── client/      # React frontend
├── server/      # Express backend
├── scripts/     # Helper scripts (for DB updates)
└── query        # Additional data or notes
```

---

## 📹 Demo Video

> 🎥 [Watch the Demo Video](https://drive.google.com/file/d/1NNrXsWiNQ6hiKERNuTWkKpMYfVbkjE9i/view?usp=sharing)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/saniamungara/Hostel-Management-Mern.git
cd Hostel-Management-Mern
```

### 2. Install dependencies

#### Client

```bash
cd client
npm install
```

#### Server

```bash
cd ../server
npm install
```

### 3. Create `.env` file inside `server/`

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 4. Run the application

#### Terminal 1: Start server

```bash
cd server
npm start
```

#### Terminal 2: Start client

```bash
cd client
npm run dev
```

---

## 📌 Key Features

* 🧑‍💼 Role-based portals (Student & Supervisor)
* 🧾 Request forms for leave and outings
* 📬 Request approval and rejection system
* 🕓 View personal request history (student)
* 📊 View approved student requests (supervisor)
* ✨ Clean and intuitive interface

---

## 👥 Team Members

* **Sania Mungara**
* **Katta Sravya**
* **Katragadda Meghana**
* **Rabiya Basreen**

---

## 🌐 Connect

Feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/sania-mungara-062204254) for collaborations, questions, or feedback!
