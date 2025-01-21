package org.group2.comp313.kitchen_companion.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.group2.comp313.kitchen_companion.service.StaticCodeService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/code")
@SecurityRequirement(name = "Keycloak")
@Tag(name = "Static Code", description = "Static Codes API")
public class StaticCodeController extends BaseController{

    private final StaticCodeService staticCodeService;

    public StaticCodeController(StaticCodeService staticCodeService) {
        this.staticCodeService = staticCodeService;
    }

//    @GetMapping
//    public ResponseEntity<List<CodeBook>> getAllStaticValues() {
//        List<CodeBook> valueList = this.staticCodeService.getAllStaticCode();
//        return new ResponseEntity<>(valueList, HttpStatus.OK);
//    }
//
}
