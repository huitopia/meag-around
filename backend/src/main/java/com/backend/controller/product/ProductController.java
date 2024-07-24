package com.backend.controller.product;

import com.backend.domain.product.Product;
import com.backend.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Description;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;


    @PostMapping("/add")
    @Description("상품 업로드")
    // TODO : admin
    public void createProduct(
            Product product,
            @RequestParam(value = "files[]", required = false) MultipartFile[] files)
            throws Exception {
        // TODO : validate method 생성
        service.insertProduct(product, files);
    }

    @GetMapping("/list")
    @Description("카테고리별 상품 리스트")
    // TODO : admin
    public ResponseEntity getProductListByCategory(
            @RequestParam(value = "main", required = false) String mainCategory,
            @RequestParam(value = "sub", required = false) String subCategory) {
        List<Map<String, Object>> result = service.selectProductListByCategory(mainCategory, subCategory);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("{id}")
    @Description("상품 디테일 조회")
    public ResponseEntity getProductDetail(@PathVariable Integer id) throws IOException {
        Map<String, Object> result = service.selectProductDetailById(id);
        return ResponseEntity.ok().body(result);
    }
}