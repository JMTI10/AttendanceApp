<p align="center">
  <img src="/assets/AttendanceApp.png" alt="AttendanceApp Logo" width="200"/>
</p>

<h1 align="center">📘 AttendanceApp</h1>

<p align="center">
  A mobile-first class attendance tracker built with React Native & Firebase.
</p>

---

## ✨ Features

- 📅 **Custom Date Range** – Select a start and end date for your classes.  
- 🔄 **Weekly Frequency** – Define how often classes occur per week.  
- 📝 **Attendance Marking** – Mark each class session as **Attended**, **Missed**, or **Canceled**.  
- 📊 **Automatic Statistics** – Calculates attendance percentage automatically.  
- 📂 **Multiple Tables** – Create, expand, and collapse tables for different courses.  
- 💾 **Persistent Storage** – Local data stored using **SQLite**.  
- ☁️ **Firebase Integration** – Authentication and cloud storage (optional sync).  
- 📱 **Cross-Platform** – Works on **iOS** and **Android** via Expo.  

---

## 🛠️ Tech Stack

- **Frontend**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)  
- **Backend**: [Firebase](https://firebase.google.com/) (Auth + Firestore)  
- **Local Storage**: [SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)  
- **Language**: JavaScript  

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS recommended)  
- [Expo CLI](https://docs.expo.dev/get-started/installation/)  
- Firebase project set up (for auth & cloud sync, optional)  

### Installation
```bash
# Clone the repo
git clone https://github.com/JMTI10/AttendanceApp.git
cd AttendanceApp

# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

Open the Expo Go app on your phone, scan the QR code, and start using AttendanceApp.

---

## 📖 Usage

1. Create a new attendance table.  
2. Set your course name, start date, end date, and weekly frequency.  
3. Expand the table to view generated class dates.  
4. Tap a date to mark it as **Attended**, **Missed**, or **Canceled**.  
5. Track your overall attendance percentage instantly.  

---

## 📂 Project Structure
```
AttendanceApp/
│── app/              # React Native screens & components
│── firebaseConfig.js # Firebase setup
│── package.json      # Dependencies
│── README.md         # Project documentation
```

---

## 📸 Screenshots
*(Add screenshots of the app here once available)*

---

## 🤝 Contributing
Contributions are welcome!  
1. Fork the repository  
2. Create a feature branch (`git checkout -b feature-name`)  
3. Commit changes (`git commit -m 'Add feature'`)  
4. Push to branch (`git push origin feature-name`)  
5. Open a Pull Request  

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).  
