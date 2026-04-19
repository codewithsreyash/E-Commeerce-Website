package com.shopping.dto;

import com.shopping.model.Order;
import com.shopping.model.OrderItem;
import java.util.List;

public class CustomerOrderDto extends Order {
    private List<OrderItem> items;

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }
}
