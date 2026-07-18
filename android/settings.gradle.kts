pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories {
        // Aquí forzamos los mirrors de forma limpia
        maven { url = uri("http://mirrors.huaweicloud.com/repository/google") }
        maven { url = uri("http://mirrors.huaweicloud.com/repository/maven") }
        maven { url = uri("http://mirrors.huaweicloud.com/repository/flutter/") }
        google()
        mavenCentral()
    }
}

include(":app")