package com.raxrot.back.services;

import com.raxrot.back.dtos.ProductFullResponse;
import com.raxrot.back.dtos.ProductPageResponse;
import com.raxrot.back.dtos.ProductRequest;
import org.springframework.web.multipart.MultipartFile;

public interface ProductService {
    ProductFullResponse create(MultipartFile file, ProductRequest productRequest);
    ProductPageResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
    ProductPageResponse getAllProductsByCategoryId(Long id, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
    ProductPageResponse getAllProductsByName(String name, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
    ProductFullResponse getProductById(Long id);
    ProductFullResponse update(Long id,MultipartFile file, ProductRequest productRequest);
    void deleteProductById(Long id);
}
