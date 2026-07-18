plugins {
    id("com.android.application") version "8.2.1" apply false
    id("org.jetbrains.kotlin.android") version "1.9.22" apply false // Usa 1.9.22, es muy estable
}

subprojects {
    project.evaluationDependsOn(":app")
}