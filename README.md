# 🎓 Limkokwing University Prospectus App

A React Native application for the **Limkokwing University of Creative Technology (LUCT) Lesotho** prospectus.

---

## 📱 Features

- **5 Faculties** with **5 courses each** (25 total programmes)
- Each course includes: image, name, description, entry requirements, career paths, and a course video
- **Star Rating System** (0–6 stars) with `+1 Rate` button and bounce animations
- **Career Guide Quiz** — 5 questions to recommend the best faculty
- **My Ratings Screen** — view and manage all rated courses
- Smooth screen transitions and animations throughout

---

## 🏫 Faculties Covered

| Icon | Faculty |
|------|---------|
| 🎨 | Faculty of Design Innovation |
| 📻 | Faculty of Communication, Media & Broadcasting |
| 🏛️ | Faculty of Architecture and the Built Environment |
| 💼 | Faculty of Business and Globalization |
| 💻 | Faculty of Information & Communication Technology |

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **Expo CLI**: `npm install -g expo-cli`
- **Expo Go** app on your Android/iOS device (or Android emulator / iOS Simulator)

### Steps

```bash
# 1. Navigate to the project folder
cd LimkokwingProspectusApp

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start

# 4. Scan the QR code with Expo Go (Android) 
#    or press 'i' for iOS simulator / 'a' for Android emulator
```

---

## 📂 Project Structure

```
LimkokwingProspectusApp/
├── App.js                          # Entry point
├── app.json                        # Expo config
├── package.json                    # Dependencies
├── babel.config.js
└── src/
    ├── context/
    │   └── RatingsContext.js       # Global ratings state
    ├── data/
    │   └── faculties.js            # All faculties, courses & quiz data
    ├── navigation/
    │   └── AppNavigator.js         # Tab + Stack navigation
    ├── screens/
    │   ├── HomeScreen.js           # Landing page
    │   ├── FacultiesScreen.js      # Faculty list with search
    │   ├── FacultyDetailScreen.js  # Faculty detail + course list
    │   ├── CourseDetailScreen.js   # Full course detail + rating
    │   ├── QuizScreen.js           # Career guide quiz
    │   └── RatingsScreen.js        # All rated courses
    ├── components/
    │   ├── CourseCard.js           # Reusable course card
    │   ├── FacultyCard.js          # Reusable faculty card
    │   └── RatingStars.js          # Animated star rating
    └── theme/
        └── colors.js               # App colors & shadows
```

---

## ⭐ Rating System

- Each course starts at **0 stars**
- Users can tap individual stars OR press the **"Rate +1"** button
- Rating **cannot exceed 6**
- All ratings are stored in global state (React Context)
- View all ratings in the **"My Ratings"** tab sorted by highest

---

## 📸 Submission Checklist

- [ ] Screen recording of the running app
- [ ] Push to GitHub: `git init && git add . && git commit -m "Initial commit" && git remote add origin <your-repo> && git push`
- [ ] Submit APK: `npx expo build:android` (or use EAS Build: `eas build -p android`)

---

## 🛠 Build APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK for Android
eas build -p android --profile preview
```

---

## 📞 Contact

**Limkokwing University of Creative Technology**  
Moshoeshoe Road, Maseru, Lesotho  
📞 +266 2231 5767 | Toll Free: 80022066 / 80022088  
🌐 [www.limkokwing.ac.ls](https://www.limkokwing.ac.ls)
