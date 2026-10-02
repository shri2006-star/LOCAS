package org.apache.maven.wrapper;

import java.io.*;
import java.net.*;
import java.nio.channels.*;

public class MavenWrapperDownloader {
    private static final String DEFAULT_MAVEN_USER_HOME = System.getProperty("user.home") + "/.m2";
    private static final String MAVEN_WRAPPER_PROPERTIES_PATH = ".mvn/wrapper/maven-wrapper.properties";
    private static final String MAVEN_WRAPPER_JAR_PATH = ".mvn/wrapper/maven-wrapper.jar";
    private static final String PROPERTY_WRAPPER_URL = "wrapperUrl";

    public static void main(String[] args) {
        System.out.println("- Downloader started");
        File baseDir = new File(".").getAbsoluteFile();

        File mavenWrapperPropertyFile = new File(baseDir, MAVEN_WRAPPER_PROPERTIES_PATH);
        String url = "https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar";

        if (mavenWrapperPropertyFile.exists()) {
            try (InputStream in = new FileInputStream(mavenWrapperPropertyFile)) {
                java.util.Properties props = new java.util.Properties();
                props.load(in);
                if (props.getProperty(PROPERTY_WRAPPER_URL) != null) {
                    url = props.getProperty(PROPERTY_WRAPPER_URL);
                }
            } catch (IOException e) {
                System.out.println("- Error loading properties file");
            }
        }

        File wrapperJarFile = new File(baseDir, MAVEN_WRAPPER_JAR_PATH);
        if (!wrapperJarFile.exists()) {
            downloadFile(url, wrapperJarFile);
        }
    }

    private static void downloadFile(String urlString, File destination) {
        System.out.println("- Downloading from " + urlString);
        try {
            destination.getParentFile().mkdirs();
            URL website = new URL(urlString);
            ReadableByteChannel rbc = Channels.newChannel(website.openStream());
            FileOutputStream fos = new FileOutputStream(destination);
            fos.getChannel().transferFrom(rbc, 0, Long.MAX_VALUE);
            fos.close();
            rbc.close();
            System.out.println("- Download completed");
        } catch (Exception e) {
            System.out.println("- Error downloading wrapper: " + e.getMessage());
        }
    }
}
