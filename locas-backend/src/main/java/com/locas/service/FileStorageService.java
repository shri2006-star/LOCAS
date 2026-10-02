package com.locas.service;

import com.locas.entity.DocumentEntity;
import com.locas.entity.LoanApplication;
import com.locas.exception.ResourceNotFoundException;
import com.locas.exception.ValidationException;
import com.locas.repository.DocumentRepository;
import com.locas.repository.LoanApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    private final DocumentRepository documentRepository;
    private final LoanApplicationRepository applicationRepository;

    public DocumentEntity storeFile(Long applicationId, String documentType, MultipartFile file) {
        LoanApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (file.isEmpty()) {
            throw new ValidationException("Cannot store empty file.");
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("application/pdf") && !contentType.startsWith("image/"))) {
            throw new ValidationException("Only PDF, JPEG, PNG formats are permitted.");
        }

        try {
            Path root = Paths.get(uploadDir);
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path targetPath = root.resolve(fileName);
            Files.copy(file.getInputStream(), targetPath);

            DocumentEntity doc = DocumentEntity.builder()
                    .application(application)
                    .documentType(documentType)
                    .fileName(file.getOriginalFilename())
                    .filePath(targetPath.toString())
                    .contentType(contentType)
                    .fileSize(file.getSize())
                    .build();

            return documentRepository.save(doc);

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }

    public List<DocumentEntity> getDocumentsForApplication(Long applicationId) {
        return documentRepository.findByApplicationId(applicationId);
    }
}
