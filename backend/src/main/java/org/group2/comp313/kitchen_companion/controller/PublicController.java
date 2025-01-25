package org.group2.comp313.kitchen_companion.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.group2.comp313.kitchen_companion.service.AWSS3Service;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/public")
@Tag(name = "Public API", description = "All Public APIs available")
public class PublicController extends BaseController {

    private final AWSS3Service awss3Service;
    public PublicController(AWSS3Service awss3Service) {
        this.awss3Service = awss3Service;
    }

    @PostMapping(path = "/upload", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public String uploadFile(@RequestParam("file") MultipartFile file) {
        return awss3Service.uploadFile(file.getOriginalFilename(), file);
    }

}
