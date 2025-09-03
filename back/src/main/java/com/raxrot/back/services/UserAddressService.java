package com.raxrot.back.services;

import com.raxrot.back.dtos.AddressRequest;
import com.raxrot.back.dtos.AddressResponse;

public interface UserAddressService {
    AddressResponse addAddress(AddressRequest addressRequest);
    AddressResponse getMyAddress();
    AddressResponse updateAddress(AddressRequest addressRequest);
}
