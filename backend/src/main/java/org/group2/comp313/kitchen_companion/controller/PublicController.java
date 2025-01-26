package org.group2.comp313.kitchen_companion.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.group2.comp313.kitchen_companion.service.AWSS3Service;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/public")
@Tag(name = "Public API", description = "All Public APIs available")
public class PublicController extends BaseController {


}
