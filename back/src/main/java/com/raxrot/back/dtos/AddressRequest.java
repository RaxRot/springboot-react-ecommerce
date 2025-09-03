package com.raxrot.back.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequest {
    @NotBlank(message = "Street must not be blank")
    private String street;
    @NotBlank(message = "City must not be blank")
    private String city;
    @NotBlank(message = "Zip code must not be blank")
    private String zipCode;
    @NotBlank(message = "Country must not be blank")
    private String country;
}
