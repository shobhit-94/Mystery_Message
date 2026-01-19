# AI-Enabled Anonymous Feedback Platform

An AI-powered anonymous feedback web application that allows users to receive honest feedback while keeping the sender’s identity completely private. The platform includes secure authentication, email verification, user-controlled feedback settings, and AI-assisted message generation.

---

## 🚀 Features

### 🔐 Authentication & Security

* User registration and login
* Email verification using a **6-digit OTP** sent to the user’s email
* Secure session handling
* Verified users only can access the dashboard

### 🧑‍💼 User Dashboard

* Toggle to **enable or disable anonymous feedback**
* Generate and copy a **public feedback URL**
* View anonymous feedback messages securely

### 🌐 Anonymous Feedback System

* Public profile page accessible via a unique URL
* Anyone can submit feedback without logging in
* Sender identity always remains anonymous

### 🤖 AI-Powered Suggestions

* Integrated **Gemini AI** to generate feedback/message suggestions
* Helps users craft meaningful feedback easily
* AI-generated suggestions can be sent directly to the user

---

## 🛠️ Tech Stack

**Frontend & Full-Stack Framework:**

* Next.js
* React.js

**Backend & Database:**

* MongoDB

**AI Integration:**

* Gemini (AI message suggestion)

**Other Tools & Concepts:**

* Email services (OTP verification)
* REST APIs
* Secure authentication flows

---

## 📂 Project Structure (Overview)

```
/app
  ├── auth
  ├── dashboard
  ├── feedback
/lib
  ├── db
  ├── auth
/models
/api
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file and add:

```env
MONGODB_URI=your_mongodb_connection_string
EMAIL_SERVICE_API_KEY=your_email_service_key
GEMINI_API_KEY=your_gemini_api_key
NEXTAUTH_SECRET=your_secret_key
```

### 4️⃣ Run the Application

```bash
npm run dev
```

---

## 📌 Usage Flow

1. Register and verify email using OTP
2. Access user dashboard
3. Enable anonymous feedback
4. Share public feedback link
5. Receive anonymous messages or AI-generated suggestions

---

## 🎯 Project Outcome

This project delivers a secure, privacy-focused anonymous feedback platform enhanced with AI assistance, encouraging honest communication while protecting user identity.

---

## 📜 License

This project is for educational and portfolio purposes.
