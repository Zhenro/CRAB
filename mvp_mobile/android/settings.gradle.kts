pluginManagement {
    val flutterSdkPath = "C:/flutter"
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
        maven { 
            url = uri("http://mirrors.huaweicloud.com/repository/google/") 
            isAllowInsecureProtocol = true 
        }
        maven { 
            url = uri("http://mirrors.huaweicloud.com/repository/maven/") 
            isAllowInsecureProtocol = true 
        }
        maven { 
            url = uri("http://mirrors.huaweicloud.com/repository/flutter/") 
            isAllowInsecureProtocol = true 
        }
    }
}

include(":app")