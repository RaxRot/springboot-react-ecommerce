package com.raxrot.back.repositories;

import com.raxrot.back.models.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    Optional<Address> findByUser_Id(Long userId);
}