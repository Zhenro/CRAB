plugins {
    id("com.android.application")
    id("kotlin-android")
}

// ... AQUÍ VA TU BLOQUE DE ESCAPE AGRESIVO QUE MOSTRASTE EN LA IMAGEN ...
repositories.all {
    if (this is MavenArtifactRepository) {
        if (urlStr.contains("download.flutter.io") || urlStr.contains("storage.googleapis.com")) {
            url = uri("http://mirrors.huaweicloud.com/repository/flutter/")
        }
        if (url.scheme == "http") {
            isAllowInsecureProtocol = true
        }
    }
}

android {
    namespace = "com.example.mvp_control_activos_mobile"
    compileSdk = flutter.compileSdkVersion
    // ... resto de tu configuración ...
}

    defaultConfig {
        // TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
        applicationId = "com.example.mvp_control_activos_mobile"
        // You can update the following values to match your application needs.
        // For more information, see: https://flutter.dev/to/review-gradle-config.
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    buildTypes {
        release {
            // TODO: Add your own signing config for the release build.
            // Signing with the debug keys for now, so `flutter run --release` works.
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}

kotlin {
    compilerOptions {
        jvmTarget = org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17
    }
}

flutter {
    source = "../.."
}
dependencies {
    // Motor de Flutter local
    implementation(files("C:/flutter/bin/cache/artifacts/engine/android-arm64/flutter.jar"))
    
    // Librerías de AndroidX necesarias para que compile FlutterActivity
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-common:2.6.2")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.6.2")
}
// Fuerza la redirección del artefacto de Flutter directamente al espejo de Huawei en la configuración afectada
configurations.all {
    resolutionStrategy.eachDependency {
        if (requested.group == "io.flutter" && requested.name.contains("arm64_v8a_debug")) {
            // Modificamos la estrategia para que busque el binario usando la estructura del mirror de Huawei
            useTarget("io.flutter:${requested.name}:${requested.version}")
        }
    }
}

// Interceptor directo a nivel de repositorios locales del módulo por si acaso
repositories.all {
    if (this is MavenArtifactRepository) {
        val urlStr = url.toString()
        if (urlStr.contains("download.flutter.io") || urlStr.contains("storage.googleapis.com")) {
            url = uri("http://mirrors.huaweicloud.com/repository/flutter/")
        }
        if (url.scheme == "http") {
            isAllowInsecureProtocol = true
        }
    }
}