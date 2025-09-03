package com.raxrot.back.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductMainPageResponse{
    private Long id;
    private String name;
    private String imageUrl;
    private BigDecimal price;
    private String categoryName;
}
