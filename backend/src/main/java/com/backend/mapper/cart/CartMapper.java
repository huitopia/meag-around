package com.backend.mapper.cart;

import com.backend.domain.cart.Cart;
import com.backend.domain.cart.CartProduct;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CartMapper {

    @Options(useGeneratedKeys = true, keyProperty = "id")
    @Insert("""
    INSERT INTO cart
    (customer_id, branch_id, total_price)
    VALUES (#{customerId}, #{branchId}, #{totalPrice})
""")
    int insertCart(Cart cart);

    @Insert("""
    INSERT INTO cart_product
    (cart_id, product_id, count, total_price, options)
    VALUES (#{cartId}, #{productId}, #{totalPrice}, #{options})
""")
    int insertCartProduct(CartProduct cartProduct);

    @Select("""
    SELECT *
    FROM cart
    WHERE customer_id = #{customerId}
""")
    Cart selectCartByCustomerId(Integer customerId);

    @Select("""
    SELECT cp.cart_id, cp.product_id, cp.count, cp.total_price, cp.options, ci.file_path
    FROM cart_product cp JOIN product_img pi ON cp.product_id = pi.product_id
    WHERE cp.cart_id = #{cartId}
""")
    List<CartProduct> selectCartProductListByCartId(Integer cartId);
}