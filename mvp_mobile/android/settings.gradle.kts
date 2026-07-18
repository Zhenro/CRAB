pluginManagement {
    val flutterSdkPath = "C:/flutter" // Confirma que esta es tu ruta correcta de Flutter
    includeBuild("$flutterSdkPath/packages/flutter_tools/gradle")
    
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

plugins {
    id("dev.flutter.flutter-gradle-plugin") version "1.0.0" apply false
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories {
        google()
        mavenCentral()
        maven { url = uri("http://mirrors.huaweicloud.com/repository/google") }
        maven { url = uri("http://mirrors.huaweicloud.com/repository/maven") }
        maven { url = uri("http://mirrors.huaweicloud.com/repository/flutter/") }
    }
}

include(":app")