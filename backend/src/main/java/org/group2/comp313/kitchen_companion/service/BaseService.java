package org.group2.comp313.kitchen_companion.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * BaseService provides a foundational class for other service classes to extend.
 * It includes a pre-configured logger for logging purposes, which can be
 * utilized by any subclass. BaseService serves as a shared utility component
 * for services by offering common functionality such as logging, reducing
 * redundant code and promoting consistency across service classes.
 *
 * This class is typically used as the parent class for application service
 * layers such as StepService, AWSS3Service, StepGroupService, CsvImportService,
 * and ChatGptClientService. These subclasses inherit the logging capability
 * and may extend BaseService to include additional shared functionalities.
 *
 * Subclasses of BaseService are expected to perform application-specific
 * service logic, acting as intermediaries between controllers and repositories
 * or external APIs.
 */
public class BaseService {
    protected Logger log = LoggerFactory.getLogger(this.getClass());

}
