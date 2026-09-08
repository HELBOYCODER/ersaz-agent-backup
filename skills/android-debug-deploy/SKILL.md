---
name: android-debug-deploy
description: Systematic Android app debugging, Gradle build failure repair, logcat extraction, and deployment workflows.
metadata: { "requires": { "bins": ["adb", "git"] } }
---

# Android Debug & Deploy Workflow

راهنمای جامع تریاژ خطاها، دیباگ بیلد گریدل، ثبت لاگ زنده و دیپلوی اپ‌های اندروید.

## ۱. دیباگ خطاهای بیلد گریدل (Gradle Build Failure Triage)
هنگام شکست بیلد، لاگ دقیق را استخراج کنید:
```bash
./gradlew assembleDebug --stacktrace --info
./gradlew test --continue
./gradlew lint
```

### تریاژ خطاهای پرتکرار:
1. **عدم تطابق کامپایلر Compose با Kotlin**:
   - بررسی `kotlinCompilerExtensionVersion` در برابر نسخه `org.jetbrains.kotlin.android`.
2. **فشردگی فایل‌های دیتای حجیم توسط AAPT**:
   - افزودن `aaptOptions { noCompress += listOf("bin", "gz", "json") }` به `app/build.gradle.kts`.
3. **کمبود حافظه Heap در روتین دکودینگ/پارس**:
   - فعال‌سازی `android:largeHeap="true"` در `AndroidManifest.xml`.
4. **تداخل پکیج‌ها و نسخه NDK**:
   - تنظیم فیلترهای صریح معماری: `ndk.abiFilters.addAll(listOf("arm64-v8a", "armeabi-v7a", "x86_64"))`.

## ۲. رصد لاگ و تریاژ ران‌تایم (Logcat & Runtime Inspection)
اگر ADB متصل است:
```bash
adb logcat -d -v time *:E | tail -n 100
adb logcat -d -s AndroidRuntime:E CRASH:E
```
اگر Shizuku روی دستگاه فعال است:
```bash
android-shizuku-cli exec "logcat -d -t 150 -s AndroidRuntime:E"
```

## ۳. بازرسی مشخصات سخت‌افزار و پکیج‌ها
```bash
android-device info
android-device battery
adb shell pm list packages -3
adb shell dumpsys package <package_name> | grep -E "versionCode|versionName"
```

## ۴. نصب و دیپلوی مستقیم APK
```bash
adb install -r path/to/app-release.apk
# یا از طریق شل Shizuku:
android-shizuku-cli exec "pm install -r /sdcard/app-release.apk"
```

## ۵. چهارچوب ثبت حافظه هوشمند پروژه (Smart Memory Framework)
برای جلوگیری از تکرار اشتباهات در پروژه‌های محلی:
1. **Facts**: نسخه‌های AGP، Gradle، compileSdk، minSdk و لایبرری‌ها.
2. **Decisions**: معماری و دلایل انتخاب ابزار یا معماری خاص.
3. **Incidents**: باگ‌های رخداده + استک‌ترس دقیق + روش پچ پایدار.
4. **Tasks**: وضعیت تسک‌های باقی‌مانده و رودمپ پیاده‌سازی.
