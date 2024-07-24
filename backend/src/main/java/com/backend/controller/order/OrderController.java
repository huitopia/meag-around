package com.backend.controller.order;

import com.backend.domain.order.OrderItem;
import com.backend.service.order.OrderService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Description;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class OrderController {
    private final OrderService orderService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/orders")
    @Description("주문 생성")
    public ResponseEntity addOrderItem(@RequestBody OrderItem orderItem) throws JsonProcessingException {
        orderService.addOrderItem(orderItem);
        // 스탬프 적립, 쿠폰 적립 로직 추가
        // 주문 완료 알림 추가
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/orders/list")
    @Description("주문 리스트 조회")
    public ResponseEntity getOrderItemList(Authentication authentication, String period, Integer stateId, Integer branchId) throws JsonProcessingException {
//        return ResponseEntity.ok(orderService.getOrderItemList(Integer.valueOf(authentication.getName()), stateId, branchId));
        return ResponseEntity.ok(orderService.getOrderItemList(1, period, stateId, branchId));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/orders/{id}")
    @Description("주문 상세 조회")
    public ResponseEntity getOrderItem(@PathVariable Integer id) throws JsonProcessingException {
        // TODO. 결제 정보 없어서 조회 안 됨
        return ResponseEntity.ok(orderService.getOrderItem(id));
    }

    // 주문 상태 변경 : 1.결제 완료 2. 제조 중 3. 제조 완료
    // id = order_id
    @PreAuthorize("hasAuthority('SCOPE_branch')")
    @PutMapping("/orders/{id}")
    @Description("주문 상태 변경")
    public ResponseEntity modifyOrderItemState(@RequestParam Integer stateId, @PathVariable Integer id) {
        orderService.modifyOrderItemState(id, stateId);
        return ResponseEntity.ok().build();
    }
}