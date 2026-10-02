@echo off
setlocal

set DIR=%~dp0
set WPR_JAR=%DIR%.mvn\wrapper\maven-wrapper.jar
set WPR_JAVA=%DIR%.mvn\wrapper\MavenWrapperDownloader.java

if not exist "%WPR_JAR%" (
    echo Downloading Maven Wrapper JAR...
    java "%WPR_JAVA%"
)

if exist "%WPR_JAR%" (
    java -Dmaven.multiModuleProjectDirectory="%DIR%\" -cp "%WPR_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
) else (
    echo Error: Could not download or locate maven-wrapper.jar
    exit /b 1
)

endlocal
