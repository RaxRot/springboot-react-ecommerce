package com.raxrot.back.services.impl;

import com.raxrot.back.dtos.AddressRequest;
import com.raxrot.back.dtos.AddressResponse;
import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.Address;
import com.raxrot.back.models.User;
import com.raxrot.back.repositories.AddressRepository;
import com.raxrot.back.services.UserAddressService;
import com.raxrot.back.utils.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class UserAddressServiceImpl implements UserAddressService {
    private final AddressRepository addressRepository;
    private final AuthUtil authUtil;

    @Override
    public AddressResponse addAddress(AddressRequest addressRequest) {
        User user = authUtil.loggedInUser();

        if (addressRepository.findByUser_Id(user.getId()).isPresent()) {
            throw new ApiException("Address already exists", HttpStatus.CONFLICT);
        }

        Address address = new Address();
        address.setStreet(addressRequest.getStreet());
        address.setCity(addressRequest.getCity());
        address.setZipCode(addressRequest.getZipCode());
        address.setCountry(addressRequest.getCountry());
        address.setUser(user);

        Address saved = addressRepository.save(address);

        return new AddressResponse(
                saved.getId(),
                saved.getStreet(),
                saved.getCity(),
                saved.getZipCode(),
                saved.getCountry(),
                user.getUserName(),
                user.getEmail()
        );
    }

    @Override
    public AddressResponse getMyAddress() {
        User user = authUtil.loggedInUser();

        Address address = addressRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ApiException("No address found", HttpStatus.NOT_FOUND));

        return new AddressResponse(
                address.getId(),
                address.getStreet(),
                address.getCity(),
                address.getZipCode(),
                address.getCountry(),
                user.getUserName(),
                user.getEmail()
        );
    }

    @Override
    public AddressResponse updateAddress(AddressRequest addressRequest) {
        User user = authUtil.loggedInUser();

        Address address = addressRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ApiException("No address found", HttpStatus.NOT_FOUND));

        address.setStreet(addressRequest.getStreet());
        address.setCity(addressRequest.getCity());
        address.setZipCode(addressRequest.getZipCode());
        address.setCountry(addressRequest.getCountry());

        Address saved = addressRepository.save(address);

        return new AddressResponse(
                saved.getId(),
                saved.getStreet(),
                saved.getCity(),
                saved.getZipCode(),
                saved.getCountry(),
                user.getUserName(),
                user.getEmail()
        );
    }
}