package com.backend.domain.order;

import lombok.Data;

import java.util.List;

@Data
public class Payment {
    private Integer id;
    private Integer orderItemId;
    private Integer totalPrice;
    private String provider;
    private List<Boolean> option;
    private String merchantUid;
}