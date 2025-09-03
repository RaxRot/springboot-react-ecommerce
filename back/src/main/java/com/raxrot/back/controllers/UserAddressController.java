package com.raxrot.back.controllers;

import com.raxrot.back.dtos.AddressRequest;
import com.raxrot.back.dtos.AddressResponse;
import com.raxrot.back.services.UserAddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/address")
@RequiredArgsConstructor
public class UserAddressController {
    private final UserAddressService userAddressService;

    @PostMapping
    public ResponseEntity<AddressResponse> addAddress(@Valid @RequestBody AddressRequest address) {
        AddressResponse addressResponse = userAddressService.addAddress(address);
        return new ResponseEntity<>(addressResponse, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<AddressResponse> getAddress() {
        AddressResponse addressResponse=userAddressService.getMyAddress();
        return ResponseEntity.ok(addressResponse);
    }

    @PutMapping
    public ResponseEntity<AddressResponse> updateAddress(@Valid @RequestBody AddressRequest address) {
        AddressResponse addressResponse = userAddressService.updateAddress(address);
        return ResponseEntity.ok(addressResponse);
    }
}
