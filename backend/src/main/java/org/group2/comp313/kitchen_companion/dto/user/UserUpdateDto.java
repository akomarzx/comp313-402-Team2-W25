package org.group2.comp313.kitchen_companion.dto.user;

import java.io.Serializable;
import java.util.List;

public class UserUpdateDto implements Serializable{

    private String firstName;
    private String lastName;
    private List<Long> groupCodes;

    public UserUpdateDto(String firstName, String lastName, List<Long> groupCodes) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.groupCodes = groupCodes;
    }

    public UserUpdateDto() {
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public List<Long> getGroupCodes() {
        return groupCodes;
    }

    public void setGroupCodes(List<Long> groupCodes) {
        this.groupCodes = groupCodes;
    }
}
