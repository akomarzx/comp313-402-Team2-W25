package org.group2.comp313.kitchen_companion.utility;

import jakarta.validation.groups.Default;

/**
 * Defines validation groups used for grouping validation rules in different contexts.
 *
 * Validation groups are marker interfaces used in Bean Validation to apply specific
 * validation constraints conditionally, based on the group being validated.
 *
 * The `ValidationGroups` interface contains two nested marker interfaces, `Create` and `Update`,
 * which extend the `javax.validation.groups.Default` group. These groups can be used to differentiate
 * validation rules for create and update operations respectively.
 */
public interface ValidationGroups {
    /**
     * Marker interface for validation groups used in the context of create operations.
     *
     * This interface is a part of the Bean Validation framework and extends the
     * javax.validation.groups.Default group, enabling different constraint definitions
     * for create-related operations.
     *
     * Utilize this group to enforce specific validation rules only when entities are
     * being created.
     */
    interface Create extends Default {

    }

    /**
     * Marker interface for validation groups used in the context of update operations.
     *
     * This interface is part of the Bean Validation framework and extends the
     * javax.validation.groups.Default group, enabling specific validation rules
     * for update-related operations.
     *
     * Use this group to apply constraints that are relevant only when updating entities,
     * ensuring validation rules are appropriately scoped for update scenarios.
     */
    interface Update extends Default {

    }
}
